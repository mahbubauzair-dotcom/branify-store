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

/**
 * GET /api/admin/products
 * Returns all products with their category, newest first.
 */
export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const products = await db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, products });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/products] GET error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/products
 * Create a new product. Auto-generates a unique slug from name if not provided.
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
        { ok: false, error: "Product name is required." },
        { status: 400 },
      );
    }

    const providedSlug = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : "";
    const slug = await ensureUniqueSlug(providedSlug ? slugify(providedSlug) : slugify(name));

    const price = typeof body.price === "number" ? body.price : Number(body.price);
    if (Number.isNaN(price)) {
      return NextResponse.json(
        { ok: false, error: "Valid price is required." },
        { status: 400 },
      );
    }

    const toArray = (v: unknown): string[] =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

    const product = await db.product.create({
      data: {
        name,
        slug,
        categoryId: typeof body.categoryId === "string" && body.categoryId ? body.categoryId : null,
        price,
        originalPrice:
          typeof body.originalPrice === "number"
            ? body.originalPrice
            : body.originalPrice
              ? Number(body.originalPrice)
              : null,
        shortDescription:
          typeof body.shortDescription === "string" ? body.shortDescription : null,
        description: typeof body.description === "string" ? body.description : "",
        image: typeof body.image === "string" && body.image ? body.image : null,
        gallery: toArray(body.gallery),
        features: toArray(body.features),
        format: toArray(body.format),
        rating: typeof body.rating === "number" ? body.rating : Number(body.rating) || 5.0,
        reviews: typeof body.reviews === "number" ? body.reviews : Number(body.reviews) || 0,
        sales: typeof body.sales === "number" ? body.sales : Number(body.sales) || 0,
        popular: Boolean(body.popular),
        isNew: body.isNew !== undefined ? Boolean(body.isNew) : true,
        status: typeof body.status === "string" ? body.status : "draft",
        seoTitle: typeof body.seoTitle === "string" && body.seoTitle ? body.seoTitle : null,
        seoDescription:
          typeof body.seoDescription === "string" && body.seoDescription ? body.seoDescription : null,
        seoKeywords:
          typeof body.seoKeywords === "string" && body.seoKeywords ? body.seoKeywords : null,
      },
      include: { category: true },
    });

    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/products] POST error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
