import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/admin-auth";

/**
 * POST /api/admin/auth/logout
 *
 * Clears the admin session cookie.
 */
export async function POST() {
  try {
    const res = NextResponse.json({ ok: true });
    clearSessionCookie(res);
    return res;
  } catch (err) {
    console.error("[admin/auth/logout] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
