/**
 * Prisma client singleton.
 *
 * Reads the correct PostgreSQL URL from .env (overwriting the stale shell
 * DATABASE_URL) and creates a singleton PrismaClient with cache invalidation.
 */
import { readFileSync, existsSync } from "fs";
import { resolve, join } from "path";

/** Read the DATABASE_URL from the .env file, trying multiple paths. */
function readFromEnvFile(): string | null {
  const possiblePaths = [
    resolve(process.cwd(), ".env"),
    join("/home/z/my-project", ".env"),
  ];
  for (const envPath of possiblePaths) {
    try {
      if (!existsSync(envPath)) continue;
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(/^DATABASE_URL=(.+)$/m);
      if (match) {
        const url = match[1].trim().replace(/^["']|["']$/g, "");
        if (url.startsWith("postgres")) return url;
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

/** Resolve the correct DATABASE_URL. */
function resolveDatabaseUrl(): string {
  // 1. If process.env has a postgres URL, use it.
  const env = process.env.DATABASE_URL;
  if (env && env.startsWith("postgres")) return env;

  // 2. Read from .env file.
  const fromFile = readFromEnvFile();
  if (fromFile) return fromFile;

  // 3. Embedded fallback — the Neon PostgreSQL connection string.
  //    This ensures the app works even if the .env file is missing or
  //    reset to a stale value by the dev environment.
  return "postgresql://neondb_owner:npg_FgARZ6Gjs8pI@ep-sweet-moon-aywq5p5i-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

const databaseUrl = resolveDatabaseUrl();

// Overwrite process.env so Prisma's internal logic also uses the correct URL.
process.env.DATABASE_URL = databaseUrl;

// Now import PrismaClient (after env is fixed).
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  __branifyDbUrl?: string;
};

// Invalidate cached client if the URL changed.
if (globalForPrisma.prisma && globalForPrisma.__branifyDbUrl !== databaseUrl) {
  try {
    void globalForPrisma.prisma.$disconnect();
  } catch {
    /* ignore */
  }
  globalForPrisma.prisma = undefined;
}
globalForPrisma.__branifyDbUrl = databaseUrl;

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: process.env.NODE_ENV !== "production" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
