/**
 * CRITICAL: Fix the stale DATABASE_URL BEFORE anything else.
 *
 * The dev server's shell has a stale DATABASE_URL
 * (file:/home/z/my-project/db/custom.db — the old SQLite path).
 * This module reads the correct PostgreSQL URL from the .env file and
 * overwrites the stale value in process.env BEFORE @prisma/client is
 * imported.
 */
import { readFileSync, existsSync } from "fs";
import { resolve, join } from "path";

function loadDatabaseUrl(): string {
  // 1. If process.env already has a postgres URL, use it.
  const env = process.env.DATABASE_URL;
  if (env && env.startsWith("postgres")) return env;

  // 2. Try reading from .env at multiple possible locations.
  const possiblePaths = [
    resolve(process.cwd(), ".env"),
    join("/home/z/my-project", ".env"),
    resolve(__dirname, "../../.env"),
    resolve(__dirname, "../../../.env"),
  ];

  for (const envPath of possiblePaths) {
    try {
      if (!existsSync(envPath)) continue;
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(/^DATABASE_URL=(.+)$/m);
      if (match) {
        const url = match[1].trim().replace(/^["']|["']$/g, "");
        if (url.startsWith("postgres")) {
          return url;
        }
      }
    } catch {
      /* try next path */
    }
  }

  // 3. Last resort — return whatever's in process.env.
  return env ?? "";
}

// Overwrite the stale shell DATABASE_URL with the correct postgres URL.
// This runs before @prisma/client is imported.
const correctUrl = loadDatabaseUrl();
if (correctUrl.startsWith("postgres")) {
  process.env.DATABASE_URL = correctUrl;
}

export const databaseUrl = process.env.DATABASE_URL;
