import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Resolve the DATABASE_URL directly from the `.env` file.
 *
 * Why: the auto-managed dev server is started with a stale DATABASE_URL
 * in its shell environment (the old SQLite path:
 * `file:/home/z/my-project/db/custom.db`). Next.js loads `.env` but does
 * NOT override existing `process.env` values, so Prisma would pick up the
 * wrong SQLite URL. Reading the file directly guarantees the correct
 * PostgreSQL value.
 *
 * This MUST run before any PrismaClient is instantiated.
 */
function loadDatabaseUrl(): string {
  // 1. If process.env already has a postgres URL, use it.
  const env = process.env.DATABASE_URL;
  if (env && env.startsWith("postgres")) return env;

  // 2. Otherwise read it from the .env file at the project root.
  try {
    const envPath = resolve(process.cwd(), ".env");
    const content = readFileSync(envPath, "utf-8");
    const match = content.match(/^DATABASE_URL=(.+)$/m);
    if (match) {
      const url = match[1].trim().replace(/^["']|["']$/g, "");
      if (url.startsWith("postgres")) return url;
    }
  } catch {
    /* ignore */
  }

  // 3. Last resort — return whatever's in process.env (may be wrong).
  return env ?? "";
}

const databaseUrl = loadDatabaseUrl();

// CRITICAL: set process.env.DATABASE_URL so Prisma's internal connection
// logic also uses the correct URL (not just the datasources override).
process.env.DATABASE_URL = databaseUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  __branifyDbUrl?: string;
};

/**
 * Invalidate the cached PrismaClient if the DATABASE_URL has changed
 * (e.g. after a server restart with a different .env). Without this,
 * a stale client from a previous run (with the old SQLite URL and the
 * old schema that lacked AdminUser/Product/Category models) would be
 * reused, causing "Cannot read properties of undefined (reading
 * 'findUnique')" errors.
 */
if (globalForPrisma.prisma && globalForPrisma.__branifyDbUrl !== databaseUrl) {
  try {
    globalForPrisma.prisma.$disconnect();
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
