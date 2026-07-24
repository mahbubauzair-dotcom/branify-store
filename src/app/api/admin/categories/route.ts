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
 * Ensure a slug is unique by appending -2, -3, etc. as needed.
 */
async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
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

/**
 * GET /api/admin/categories
 * Returns all categories ordered by sortOrder.
 */
export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ ok: true, categories });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/categories] GET error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/categories
 * Body: { name, description?, icon?, sortOrder? }
 * Auto-generates a unique slug from the name.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid request body." },
        { status: 400 },
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Category name is required." },
        { status: 400 },
      );
    }

    const slug = await ensureUniqueSlug(slugify(name));

    const sortOrder =
      typeof body.sortOrder === "number"
        ? body.sortOrder
        : Number(body.sortOrder) || 0;

    const category = await db.category.create({
      data: {
        name,
        slug,
        description:
          typeof body.description === "string" && body.description ? body.description : null,
        icon: typeof body.icon === "string" && body.icon ? body.icon : null,
        sortOrder,
        active: body.active !== undefined ? Boolean(body.active) : true,
      },
    });

    return NextResponse.json({ ok: true, category }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/categories] POST error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
