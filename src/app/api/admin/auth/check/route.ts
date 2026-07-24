import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";

/**
 * GET /api/admin/auth/check
 *
 * Returns the current admin session if authenticated.
 * Always responds 200 — this is a check endpoint, not a guarded resource.
 */
export async function GET(request: Request) {
  try {
    const session = await getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ ok: false });
    }
    return NextResponse.json({ ok: true, admin: session });
  } catch (err) {
    console.error("[admin/auth/check] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
