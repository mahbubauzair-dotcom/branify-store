import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/products (PUBLIC)
 *
 * Query params:
 *   - category: category slug to filter by
 *   - search:   free-text search on product name + short description
 *   - status:   always forced to "published" — public API never returns drafts
 *
 * Returns published products (with their category) as `{ ok: true, products }`.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category")?.trim() || "";
    const search = url.searchParams.get("search")?.trim() || "";

    // Build where clause — always restrict to published for the public API.
    const where: {
      status: string;
      category?: { slug: string };
      OR?: Array<Record<string, unknown>>;
    } = { status: "published" };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await db.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, products });
  } catch (err) {
    console.error("[products] GET error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
