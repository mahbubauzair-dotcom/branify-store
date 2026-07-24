import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/newsletter
 * Body: { email: string, source?: string }
 *
 * Subscribes an email to the newsletter. Idempotent — if the email already
 * exists, it reactivates the subscriber (sets active=true) and updates the
 * source. Returns 201 on new, 200 on existing/reactivated.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body?.source === "string" ? body.source : "footer";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "A valid email is required." },
        { status: 400 },
      );
    }

    // upsert: create or reactivate
    const subscriber = await db.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true, source },
      create: { email, source, active: true },
    });

    const isNew = subscriber.createdAt.getTime() === subscriber.updatedAt.getTime();
    return NextResponse.json(
      { ok: true, email: subscriber.email, isNew },
      { status: isNew ? 201 : 200 },
    );
  } catch (err) {
    console.error("[newsletter] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
