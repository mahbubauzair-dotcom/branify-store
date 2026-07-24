"use client";

import { useEffect } from "react";

/**
 * JsonLd — injects a JSON-LD structured-data script into the document HEAD
 * for SEO rich results. Because this is rendered from a client component,
 * we use a useEffect to append the script to `document.head` after mount
 * (React doesn't reliably insert `<script>` with dangerouslySetInnerHTML
 * during client hydration).
 *
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", ... }} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    // Use a data attribute so we can dedupe on re-renders.
    const hash = `${data["@type"] ?? "jsonld"}-${data["name"] ?? data["headline"] ?? ""}`;
    script.setAttribute("data-branify-ld", hash);
    // Remove any existing script with the same hash to avoid duplicates.
    document.head
      .querySelector(`script[data-branify-ld="${hash}"]`)
      ?.remove();
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [data]);

  return null;
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
