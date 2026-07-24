import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/contact
 * Body: { name, email, company?, projectType?, budget?, message }
 *
 * Persists a contact-form submission to the ContactMessage table.
 * Returns 201 on success.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const company = typeof body?.company === "string" && body.company.trim() ? body.company.trim() : null;
    const projectType = typeof body?.projectType === "string" && body.projectType.trim() ? body.projectType.trim() : null;
    const budget = typeof body?.budget === "string" && body.budget.trim() ? body.budget.trim() : null;

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and message are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "A valid email is required." },
        { status: 400 },
      );
    }
    if (message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Message is too long (max 5000 characters)." },
        { status: 400 },
      );
    }

    const record = await db.contactMessage.create({
      data: { name, email, company, projectType, budget, message, status: "new" },
    });

    return NextResponse.json(
      { ok: true, id: record.id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[contact] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
