/**
 * CRITICAL: Fix the stale DATABASE_URL BEFORE anything else.
 *
 * This module is imported as a side-effect import at the top of db.ts.
 * It reads the correct PostgreSQL URL from the .env file and overwrites
 * the stale shell DATABASE_URL (file:/.../custom.db) in process.env
 * BEFORE @prisma/client is imported.
 */
import { readFileSync } from "fs";
import { resolve } from "path";

function loadDatabaseUrl(): string {
  const env = process.env.DATABASE_URL;
  if (env && env.startsWith("postgres")) return env;
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
  return env ?? "";
}

// Overwrite the stale shell DATABASE_URL with the correct postgres URL.
// This runs before @prisma/client is imported (because this module is
// imported first via a side-effect import).
process.env.DATABASE_URL = loadDatabaseUrl();

export const databaseUrl = process.env.DATABASE_URL;
