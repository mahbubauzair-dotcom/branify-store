/**
 * Prisma client singleton.
 *
 * IMPORTANT: The side-effect import "./db-env-fix" MUST come before
 * @prisma/client. It reads the correct PostgreSQL URL from .env and
 * overwrites the stale shell DATABASE_URL (the old SQLite path) in
 * process.env BEFORE PrismaClient is imported.
 *
 * Without this, the dev server's shell env (file:/.../custom.db) leaks
 * into Prisma, causing "Cannot read properties of undefined (reading
 * 'findUnique')" because the old SQLite schema lacks the new models.
 */
import "./db-env-fix";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL!;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  __branifyDbUrl?: string;
};

/**
 * Invalidate the cached PrismaClient if the DATABASE_URL has changed
 * (e.g. after a server restart with a different .env). Without this,
 * a stale client from a previous run (with the old SQLite URL and
 * schema that lacked AdminUser/Product/Category models) would be reused.
 */
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
