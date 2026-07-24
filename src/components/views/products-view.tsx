"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Search,
  Star,
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  Gift,
  SlidersHorizontal,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@/lib/router";
import { siteConfig } from "@/config/site";
import {
  products,
  productCategories,
  type Product,
} from "@/data/products";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { GlassBadge } from "@/components/shared/glass-badge";
import { Price } from "@/components/shared/price";
import {
  Reveal,
  Stagger,
  StaggerItem,
  GradientTextTeal,
} from "@/components/shared/reveal";
import {
  GradientCover,
  AuroraBackground,
} from "@/components/shared/gradient-cover";
import { toast } from "sonner";

type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
];

export function ProductsView() {
  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "Products" }]}
        title={
          <>
            Digital products that <GradientTextTeal>launch faster</GradientTextTeal>
          </>
        }
        description="Ready-to-use templates, kits and bundles crafted with the same care as our client work. Instant download, lifetime updates, and a 30-day money-back guarantee."
      />
      <BundleBanner />
      <Catalog />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BUNDLE PROMO BANNER                                                 */
/* ------------------------------------------------------------------ */
function BundleBanner() {
  const navigate = useNavigate();
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card/60 to-card/30 p-8 backdrop-blur-xl sm:p-10">
            <AuroraBackground />
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/25">
                  <Gift className="mr-1.5 h-3 w-3" /> Limited time
                </Badge>
                <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  Get <GradientTextTeal>40% off</GradientTextTeal> every product
                </h3>
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  Use code{" "}
                  <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-sm font-semibold text-primary">
                    BRANIFY40
                  </span>{" "}
                  at checkout. Stack across templates, kits and bundles. One
                  purchase, lifetime updates.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                  onClick={() => toast.success("Code BRANIFY40 copied to clipboard")}
                >
                  Claim 40% off <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                  onClick={() => navigate("contact")}
                >
                  Talk to us
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CATALOG (filters + grid)                                            */
/* ------------------------------------------------------------------ */
function Catalog() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        list.sort((a, b) => b.sales - a.sales);
        break;
    }
    return list;
  }, [activeCategory, query, sort]);

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="The catalog"
          title={
            <>
              Browse <GradientTextTeal>{products.length} premium</GradientTextTeal> products
            </>
          }
          description="Filter by category, search by name, and sort to find your perfect launch asset."
        />

        {/* Toolbar */}
        <Reveal className="mt-10">
          <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur sm:p-5">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-2">
              {productCategories.map((cat) => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={
                      "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all " +
                      (active
                        ? "border border-primary/30 bg-primary/10 text-white"
                        : "border border-transparent text-white/60 hover:bg-white/5 hover:text-white")
                    }
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    )}
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search + sort */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products by name or tagline..."
                  className="h-11 rounded-xl border-white/10 bg-background/60 pl-9 text-sm text-white placeholder:text-muted-foreground focus-visible:border-primary/40"
                />
              </div>
              <div className="flex items-center gap-2 sm:w-64">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-white/10 bg-background/60 text-sm text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Results count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-white">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "product" : "products"}
            {activeCategory !== "All" && (
              <>
                {" "}in{" "}
                <span className="font-semibold text-primary">{activeCategory}</span>
              </>
            )}
          </p>
          {(activeCategory !== "All" || query) && (
            <button
              onClick={() => {
                setActiveCategory("All");
                setQuery("");
              }}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid or empty state */}
        {filtered.length > 0 ? (
          <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PRODUCT CARD                                                        */
/* ------------------------------------------------------------------ */
function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  return (
    <Card
      onClick={() => navigate("product-detail", { slug: product.slug })}
      className="card-premium group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-white/5 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60"
    >
      <GradientCover variant={product.preview} className="h-44">
        <div className="flex h-full items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <product.icon className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.popular && (
            <GlassBadge variant="teal">
              <Sparkles className="h-3 w-3" /> Popular
            </GlassBadge>
          )}
          {product.new && (
            <GlassBadge variant="emerald">New</GlassBadge>
          )}
        </div>
        {discount > 0 && (
          <div className="absolute right-3 top-3">
            <GlassBadge variant="rose">-{discount}%</GlassBadge>
          </div>
        )}
      </GradientCover>

      <div className="flex flex-1 flex-col p-5 pb-7">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          {product.category}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-white transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
          {product.tagline}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-white/80">{product.rating}</span>
            <span>({product.reviews})</span>
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span>{product.sales.toLocaleString()} sales</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-5">
          <Price value={product.price} original={product.originalPrice} size="sm" />
          <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
            View <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* EMPTY STATE                                                         */
/* ------------------------------------------------------------------ */
function EmptyState() {
  return (
    <Reveal className="mt-10">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-card/30 px-6 py-20 text-center backdrop-blur">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PackageOpen className="h-8 w-8" />
        </div>
        <h3 className="mt-5 font-display text-xl font-semibold text-white">
          No products match your filters
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Try a different category, clear your search, or browse all{" "}
          {products.length} products in the catalog.
        </p>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* TRUST STRIP                                                         */
/* ------------------------------------------------------------------ */
const trustItems = [
  { icon: Zap, label: "Instant download" },
  { icon: ShieldCheck, label: "30-day money back" },
  { icon: Check, label: "Lifetime updates" },
];

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */
function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/60 to-card/40 p-10 backdrop-blur-xl sm:p-16">
            <AuroraBackground />
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative mx-auto max-w-3xl text-center">
              <Badge className="mb-6 bg-primary/20 text-primary hover:bg-primary/25">
                <Sparkles className="mr-1.5 h-3 w-3" /> Need something custom?
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Can&apos;t find the right fit?{" "}
                <GradientTextTeal>We&apos;ll build it.</GradientTextTeal>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                Every product in this catalog started as a custom client request.
                Tell us what you need and we&apos;ll craft it to spec — then add
                it here for the rest of the community.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("contact")}
                  size="lg"
                  className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                >
                  Request a custom build <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("services")}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                >
                  Explore services
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {trustItems.map((t) => (
                  <span
                    key={t.label}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <t.icon className="h-4 w-4 text-primary" />
                    {t.label}
                  </span>
                ))}
              </div>

              <p className="mt-8 text-sm text-muted-foreground/70">
                Or email us at{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-primary hover:underline"
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
