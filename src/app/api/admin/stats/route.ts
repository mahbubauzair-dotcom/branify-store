import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * GET /api/admin/stats
 *
 * Returns a dashboard summary for the admin panel.
 */
export async function GET(request: Request) {
  try {
    await requireAdmin(request);

    const [
      totalProducts,
      publishedProducts,
      draftProducts,
      totalCategories,
      newsletterSubscribers,
      newContactMessages,
      productsForSales,
    ] = await Promise.all([
      db.product.count(),
      db.product.count({ where: { status: "published" } }),
      db.product.count({ where: { status: "draft" } }),
      db.category.count(),
      db.newsletterSubscriber.count({ where: { active: true } }),
      db.contactMessage.count({ where: { status: "new" } }),
      db.product.findMany({ where: { status: "published" }, select: { sales: true, price: true } }),
    ]);

    // Total sales value = sum(sales * price) across published products.
    const salesValue = productsForSales.reduce(
      (sum, p) => sum + p.sales * p.price,
      0,
    );

    return NextResponse.json({
      ok: true,
      stats: {
        totalProducts,
        publishedProducts,
        draftProducts,
        totalCategories,
        newsletterSubscribers,
        newContactMessages,
        salesValue,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[admin/stats] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
