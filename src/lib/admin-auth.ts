import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Admin authentication utilities.
 *
 * Simple session-token based auth:
 *  - POST /api/admin/auth/login validates credentials, sets an httpOnly cookie
 *    with a signed session token.
 *  - Admin API routes call `getAdminSession()` to verify the cookie.
 *
 * Passwords are hashed with scrypt (Node built-in, no extra deps).
 */

const SESSION_COOKIE = "branify_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "branify-admin-secret-dev-change-in-prod";

/** Hash a password using scrypt + random salt. Returns "salt:hash" string. */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

/** Verify a password against a "salt:hash" string. */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString("hex") === key);
    });
  });
}

/** Create a signed session token. */
function createSessionToken(adminId: string, email: string): string {
  const payload = `${adminId}:${email}:${Date.now()}`;
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64");
}

/** Verify a session token and return the admin id + email, or null. */
function verifySessionToken(token: string): { id: string; email: string } | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 4) return null;
    const adminId = parts[0];
    const email = parts[1];
    const ts = parts[2];
    const sig = parts.slice(3).join(":");
    const payload = `${adminId}:${email}:${ts}`;
    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    if (sig !== expectedSig) return null;
    // Session valid for 7 days
    const age = Date.now() - parseInt(ts, 10);
    if (age > 7 * 24 * 60 * 60 * 1000) return null;
    return { id: adminId, email };
  } catch {
    return null;
  }
}

/** Set the session cookie on a Response (server-side). */
export function setSessionCookie(res: Response, token: string) {
  res.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; Secure`,
  );
}

/** Clear the session cookie. */
export function clearSessionCookie(res: Response) {
  res.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`,
  );
}

/**
 * Verify the admin session from the request cookies.
 * Returns the admin { id, email } if valid, or null.
 *
 * NOTE: In Next.js App Router, `cookies()` from `next/headers` is available
 * in Server Components and Route Handlers. For Route Handlers, use the
 * `request` object's cookie header instead.
 */
export async function getAdminSessionFromRequest(request: Request): Promise<{ id: string; email: string } | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [k, ...v] = c.split("=");
      return [k, v.join("=")];
    }),
  );
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  return verifySessionToken(token);
}

/** Ensure the request is from an authenticated admin. Throws 401 if not. */
export async function requireAdmin(request: Request): Promise<{ id: string; email: string }> {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    throw new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return session;
}

export { createSessionToken, SESSION_COOKIE };
