import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/categories (PUBLIC)
 *
 * Returns active categories ordered by sortOrder, each with its product count.
 */
export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: { status: "published" },
            },
          },
        },
      },
    });

    // Flatten _count.products into a top-level productCount for convenience.
    const result = categories.map((c) => ({
      ...c,
      productCount: c._count.products,
      _count: undefined,
    }));

    return NextResponse.json({ ok: true, categories: result });
  } catch (err) {
    console.error("[categories] GET error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
