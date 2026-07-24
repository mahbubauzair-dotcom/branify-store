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
 * Ensure a slug is unique (excluding the current product) by appending -2, -3, etc.
 */
async function ensureUniqueSlug(slug: string, excludeId: string): Promise<string> {
  const base = slug || "product";
  let candidate = base;
  let n = 1;
  let existing = await db.product.findUnique({
    where: { slug: candidate },
    select: { id: true },
  });
  while (existing && existing.id !== excludeId) {
    n += 1;
    candidate = `${base}-${n}`;
    existing = await db.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
  }
  return candidate;
}

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/products/[id]
 */
export async function GET(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Product not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, product });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/products/[id]] GET error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/products/[id]
 */
export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Product not found." },
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

    // Build a clean update payload from provided fields only.
    const data: Record<string, unknown> = {};

    if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();

    if (typeof body.slug === "string" && body.slug.trim()) {
      const desired = slugify(body.slug);
      if (desired !== existing.slug) {
        data.slug = await ensureUniqueSlug(desired, id);
      }
    } else if (typeof body.name === "string" && body.name.trim() && body.name !== existing.name) {
      // If name changed but slug wasn't supplied, regenerate slug from the new name.
      const desired = slugify(body.name);
      if (desired !== existing.slug) {
        data.slug = await ensureUniqueSlug(desired, id);
      }
    }

    if (body.categoryId !== undefined) {
      data.categoryId =
        typeof body.categoryId === "string" && body.categoryId ? body.categoryId : null;
    }
    if (body.price !== undefined) {
      const price = typeof body.price === "number" ? body.price : Number(body.price);
      if (!Number.isNaN(price)) data.price = price;
    }
    if (body.originalPrice !== undefined) {
      const op = typeof body.originalPrice === "number" ? body.originalPrice : Number(body.originalPrice);
      data.originalPrice = Number.isNaN(op) ? null : op;
    }
    if (body.shortDescription !== undefined) {
      data.shortDescription =
        typeof body.shortDescription === "string" ? body.shortDescription : null;
    }
    if (typeof body.description === "string") data.description = body.description;
    if (body.image !== undefined) {
      data.image = typeof body.image === "string" && body.image ? body.image : null;
    }
    if (Array.isArray(body.gallery)) {
      data.gallery = body.gallery.filter((x): x is string => typeof x === "string");
    }
    if (Array.isArray(body.features)) {
      data.features = body.features.filter((x): x is string => typeof x === "string");
    }
    if (Array.isArray(body.format)) {
      data.format = body.format.filter((x): x is string => typeof x === "string");
    }
    if (body.rating !== undefined) {
      const r = typeof body.rating === "number" ? body.rating : Number(body.rating);
      if (!Number.isNaN(r)) data.rating = r;
    }
    if (body.reviews !== undefined) {
      const r = typeof body.reviews === "number" ? body.reviews : Number(body.reviews);
      if (!Number.isNaN(r)) data.reviews = r;
    }
    if (body.sales !== undefined) {
      const s = typeof body.sales === "number" ? body.sales : Number(body.sales);
      if (!Number.isNaN(s)) data.sales = s;
    }
    if (body.popular !== undefined) data.popular = Boolean(body.popular);
    if (body.isNew !== undefined) data.isNew = Boolean(body.isNew);
    if (typeof body.status === "string") data.status = body.status;
    if (body.seoTitle !== undefined) {
      data.seoTitle = typeof body.seoTitle === "string" && body.seoTitle ? body.seoTitle : null;
    }
    if (body.seoDescription !== undefined) {
      data.seoDescription =
        typeof body.seoDescription === "string" && body.seoDescription ? body.seoDescription : null;
    }
    if (body.seoKeywords !== undefined) {
      data.seoKeywords =
        typeof body.seoKeywords === "string" && body.seoKeywords ? body.seoKeywords : null;
    }

    const product = await db.product.update({
      where: { id },
      data,
      include: { category: true },
    });
    return NextResponse.json({ ok: true, product });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/products/[id]] PUT error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/products/[id]
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Product not found." },
        { status: 404 },
      );
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/products/[id]] DELETE error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
