import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
} from "@/lib/admin-auth";

/**
 * POST /api/admin/auth/login
 * Body: { email, password }
 *
 * Validates admin credentials and sets an httpOnly session cookie.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 },
      );
    }

    const admin = await db.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = createSessionToken(admin.id, admin.email);

    const res = NextResponse.json({
      ok: true,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
    setSessionCookie(res, token);
    return res;
  } catch (err) {
    console.error("[admin/auth/login] error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: `Login failed: ${msg}. Please try again.` },
      { status: 500 },
    );
  }
}
