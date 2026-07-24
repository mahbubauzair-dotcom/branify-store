"use client";

/**
 * JsonLd — injects a JSON-LD structured-data script into the document head
 * for SEO rich results. Renders a `<script type="application/ld+json">` that
 * Next.js hydrates client-side. Use for BreadcrumbList, Service, Product,
 * Article schemas on detail pages.
 *
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", ... }} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Build a BreadcrumbList schema from an array of { name, url } crumbs. */
export function buildBreadcrumbSchema(
  crumbs: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
