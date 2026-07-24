import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Slugify a name into a URL-safe slug.
 */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Ensure a slug is unique (excluding the current category) by appending -2, -3, etc.
 */
async function ensureUniqueSlug(slug: string, excludeId: string): Promise<string> {
  const base = slug || "category";
  let candidate = base;
  let n = 1;
  let existing = await db.category.findUnique({
    where: { slug: candidate },
    select: { id: true },
  });
  while (existing && existing.id !== excludeId) {
    n += 1;
    candidate = `${base}-${n}`;
    existing = await db.category.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
  }
  return candidate;
}

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/categories/[id]
 */
export async function GET(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const category = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      return NextResponse.json(
        { ok: false, error: "Category not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, category });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/categories/[id]] GET error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/categories/[id]
 */
export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Category not found." },
        { status: 404 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid request body." },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = {};

    if (typeof body.name === "string" && body.name.trim()) {
      data.name = body.name.trim();
      // If the name changed and slug wasn't explicitly supplied, regenerate slug.
      if (body.slug === undefined && body.name !== existing.name) {
        data.slug = await ensureUniqueSlug(slugify(body.name), id);
      }
    }

    if (typeof body.slug === "string" && body.slug.trim()) {
      const desired = slugify(body.slug);
      if (desired !== existing.slug) {
        data.slug = await ensureUniqueSlug(desired, id);
      }
    }

    if (body.description !== undefined) {
      data.description =
        typeof body.description === "string" && body.description ? body.description : null;
    }
    if (body.icon !== undefined) {
      data.icon = typeof body.icon === "string" && body.icon ? body.icon : null;
    }
    if (body.sortOrder !== undefined) {
      const s = typeof body.sortOrder === "number" ? body.sortOrder : Number(body.sortOrder);
      if (!Number.isNaN(s)) data.sortOrder = s;
    }
    if (body.active !== undefined) data.active = Boolean(body.active);

    const category = await db.category.update({
      where: { id },
      data,
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ ok: true, category });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/categories/[id]] PUT error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/categories/[id]
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Category not found." },
        { status: 404 },
      );
    }

    await db.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/categories/[id]] DELETE error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
