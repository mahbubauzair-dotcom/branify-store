import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Resolve the DATABASE_URL directly from the `.env` file.
 *
 * Why: the auto-managed dev server may be started with a stale DATABASE_URL
 * in its shell environment (e.g. the old SQLite path). Next.js loads `.env`
 * but does NOT override existing `process.env` values, so Prisma would pick
 * up the wrong URL. Reading the file directly guarantees the correct value.
 */
function loadDatabaseUrl(): string {
  // 1. Prefer an explicit postgres URL already in the environment.
  const env = process.env.DATABASE_URL;
  if (env && env.startsWith("postgres")) return env;

  // 2. Otherwise read it from the .env file at the project root.
  try {
    const envPath = resolve(process.cwd(), ".env");
    const content = readFileSync(envPath, "utf-8");
    const match = content.match(/^DATABASE_URL=(.+)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    /* ignore — fall through to env */
  }

  // 3. Fall back to whatever's in process.env (may be the SQLite path).
  return env ?? "";
}

const databaseUrl = loadDatabaseUrl();
process.env.DATABASE_URL = databaseUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: process.env.NODE_ENV !== "production" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
