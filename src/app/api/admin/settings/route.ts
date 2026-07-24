import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * GET /api/admin/settings
 * Returns all SiteSetting rows as a flat key-value object.
 */
export async function GET(request: Request) {
  try {
    await requireAdmin(request);

    const rows = await db.siteSetting.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) settings[row.key] = row.value;

    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/settings] GET error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/settings
 * Body: { settings: { key: value, ... } }
 * Upserts each provided key/value pair.
 */
export async function PUT(request: Request) {
  try {
    await requireAdmin(request);

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || typeof body.settings !== "object" || !body.settings) {
      return NextResponse.json(
        { ok: false, error: "Expected { settings: { ... } } body." },
        { status: 400 },
      );
    }

    const entries = Object.entries(body.settings as Record<string, unknown>).filter(
      ([key, value]) => typeof key === "string" && key.length > 0 && typeof value === "string",
    ) as [string, string][];

    await db.$transaction(
      entries.map(([key, value]) =>
        db.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/settings] PUT error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
