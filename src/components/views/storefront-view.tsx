"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Search, Star, Sparkles, PackageOpen, Loader2, Tag,
  ShoppingCart, Check, X, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@/lib/router";
import { PageHeader } from "@/components/shared/page-header";
import {
  Reveal, Stagger, StaggerItem, GradientTextTeal,
} from "@/components/shared/reveal";
import { GlassBadge } from "@/components/shared/glass-badge";
import { Price } from "@/components/shared/price";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/* Types — match the DB-backed API response                            */
/* ------------------------------------------------------------------ */
type DBCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  productCount?: number;
};

type DBProduct = {
  id: string;
  name: string;
  slug: string;
  categoryId: string | null;
  category: DBCategory | null;
  price: number;
  originalPrice: number | null;
  shortDescription: string | null;
  description: string;
  image: string | null;
  gallery: string[];
  features: string[];
  format: string[];
  rating: number;
  reviews: number;
  sales: number;
  popular: boolean;
  isNew: boolean;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt?: string;
};

/* ------------------------------------------------------------------ */
/* STOREFRONT VIEW                                                     */
/* ------------------------------------------------------------------ */
export function StorefrontView() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  // Fetch products (debounced search)
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (query.trim()) params.set("search", query.trim());
    let cancelled = false;
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/products?${params}`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.ok) setProducts(data.products);
          setLoading(false);
        })
        .catch(() => { if (!cancelled) setLoading(false); });
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [activeCategory, query]);

  // Sort
  const sorted = useMemo(() => {
    const list = [...products];
    switch (sortBy) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    }
    return list;
  }, [products, sortBy]);

  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "Store" }]}
        title={<>The BRANIFY <GradientTextTeal>storefront</GradientTextTeal></>}
        description="Premium digital products — templates, kits, prompt bundles & more. Instant download. Lifetime updates."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => navigate("contact")} className="bg-primary text-primary-foreground hover:bg-hover">
            Become a seller <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <Button onClick={() => navigate("admin-login")} variant="outline" className="border-white/15 bg-white/5 hover:bg-white/10">
            Admin panel
          </Button>
        </div>
      </PageHeader>

      <section className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <Reveal className="mb-8">
            <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur sm:p-5">
              {/* Category pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    activeCategory === "all"
                      ? "border border-primary/30 bg-primary/10 text-white"
                      : "border border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {activeCategory === "all" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                      activeCategory === cat.slug
                        ? "border border-primary/30 bg-primary/10 text-white"
                        : "border border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {activeCategory === cat.slug && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    {cat.name}
                    {cat.productCount !== undefined && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                        activeCategory === cat.slug ? "bg-primary/20 text-primary" : "bg-white/5 text-white/50"
                      }`}>
                        {cat.productCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search + sort */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="border-white/10 bg-background/50 pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 border-white/10 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Reveal>

          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `Showing ${sorted.length} product${sorted.length !== 1 ? "s" : ""}`}
              {activeCategory !== "all" && ` in ${categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory}`}
            </p>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-card/20 py-20 text-center">
              <PackageOpen className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-white">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {query ? `No products match "${query}".` : "Products will appear here once published."}
              </p>
              <Button onClick={() => navigate("admin-login")} variant="outline" className="mt-6">
                Add products via admin panel <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sorted.map((p) => (
                <StaggerItem key={p.id}>
                  <StorefrontProductCard product={p} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PRODUCT CARD                                                        */
/* ------------------------------------------------------------------ */
function StorefrontProductCard({ product }: { product: DBProduct }) {
  const navigate = useNavigate();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      className="card-premium group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-white/5 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60"
      onClick={() => {
        track("product_click", { slug: product.slug, name: product.name });
        navigate("product-detail", { slug: product.slug });
      }}
    >
      {/* Image / cover */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-card/40 to-slate-900">
            <PackageOpen className="h-10 w-10 text-white/30" />
          </div>
        )}
        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.popular && (
            <GlassBadge variant="teal">
              <Sparkles className="h-3 w-3" /> Popular
            </GlassBadge>
          )}
          {product.isNew && (
            <GlassBadge variant="emerald">New</GlassBadge>
          )}
        </div>
        {discount > 0 && (
          <div className="absolute right-3 top-3">
            <GlassBadge variant="rose">-{discount}%</GlassBadge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 pb-6">
        {product.category && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            {product.category.name}
          </p>
        )}
        <h3 className="mt-1 font-display text-lg font-semibold text-white transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {product.shortDescription || product.description.substring(0, 80) + "…"}
        </p>

        {/* Rating + sales */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-white/80">{product.rating.toFixed(1)}</span>
            {product.reviews > 0 && <span>({product.reviews})</span>}
          </span>
          {product.sales > 0 && (
            <>
              <span className="h-3 w-px bg-white/10" />
              <span>{product.sales.toLocaleString()} sales</span>
            </>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between pt-5">
          <Price value={product.price} original={product.originalPrice ?? undefined} size="sm" />
          <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
            View <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Card>
  );
}
