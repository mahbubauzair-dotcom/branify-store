"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search as SearchIcon,
  ArrowRight,
  ArrowUpRight,
  X,
  Code2,
  Package,
  BookOpen,
  Wrench,
  Briefcase,
  Sparkles,
  Clock,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useRouterStore, type RouteName } from "@/lib/router";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { blogPosts } from "@/data/blog";
import { tools } from "@/data/tools";
import { projects } from "@/data/portfolio";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Reveal,
  Stagger,
  StaggerItem,
  GradientTextTeal,
} from "@/components/shared/reveal";
import { AuroraBackground } from "@/components/shared/gradient-cover";

type ResultType = "service" | "product" | "blog" | "tool" | "project";

type Result = {
  type: ResultType;
  title: string;
  description: string;
  meta: string;
  slug?: string;
};

const typeMeta: Record<
  ResultType,
  { label: string; icon: LucideIcon; route: RouteName; accent: string }
> = {
  service: {
    label: "Services",
    icon: Code2,
    route: "services",
    accent: "bg-teal-500/15 text-teal-300",
  },
  product: {
    label: "Products",
    icon: Package,
    route: "product-detail",
    accent: "bg-violet-500/15 text-violet-300",
  },
  blog: {
    label: "Blog",
    icon: BookOpen,
    route: "blog-post",
    accent: "bg-cyan-500/15 text-cyan-300",
  },
  tool: {
    label: "Tools",
    icon: Wrench,
    route: "tools",
    accent: "bg-amber-500/15 text-amber-300",
  },
  project: {
    label: "Portfolio",
    icon: Briefcase,
    route: "portfolio",
    accent: "bg-rose-500/15 text-rose-300",
  },
};

const popularSearches = ["branding", "AI", "website", "pricing", "Next.js", "logo"];

const quickLinks: { label: string; route: RouteName; hint: string }[] = [
  { label: "Services", route: "services", hint: "12 premium services" },
  { label: "Products", route: "products", hint: "15 ready-to-ship assets" },
  { label: "Free Tools", route: "tools", hint: "10 instant generators" },
  { label: "Portfolio", route: "portfolio", hint: "Recent case studies" },
  { label: "Pricing", route: "pricing", hint: "Plans for every stage" },
  { label: "Blog", route: "blog", hint: "Insights & essays" },
  { label: "About", route: "about", hint: "Our story & team" },
  { label: "Contact", route: "contact", hint: "Start a project" },
];

export function SearchView() {
  const initialQuery = useRouterStore((s) => s.query) ?? "";
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Autofocus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches: Result[] = [];

    services.forEach((s) => {
      const haystack = `${s.title} ${s.tagline} ${s.description} ${s.features.join(" ")} ${s.slug}`.toLowerCase();
      if (haystack.includes(q)) {
        matches.push({
          type: "service",
          title: s.title,
          description: s.tagline,
          meta: `Service · From $${s.startingPrice.toLocaleString()}`,
          slug: s.slug,
        });
      }
    });

    products.forEach((p) => {
      const haystack = `${p.name} ${p.tagline} ${p.description} ${p.category} ${p.features.join(" ")}`.toLowerCase();
      if (haystack.includes(q)) {
        matches.push({
          type: "product",
          title: p.name,
          description: p.tagline,
          meta: `${p.category} · $${p.price}`,
          slug: p.slug,
        });
      }
    });

    blogPosts.forEach((p) => {
      const haystack = `${p.title} ${p.excerpt} ${p.category} ${p.tags.join(" ")}`.toLowerCase();
      if (haystack.includes(q)) {
        matches.push({
          type: "blog",
          title: p.title,
          description: p.excerpt,
          meta: `Blog · ${p.category} · ${p.readingTime} min read`,
          slug: p.slug,
        });
      }
    });

    tools.forEach((t) => {
      const haystack = `${t.name} ${t.description} ${t.category} ${t.slug}`.toLowerCase();
      if (haystack.includes(q)) {
        matches.push({
          type: "tool",
          title: t.name,
          description: t.description,
          meta: `Free tool · ${t.category}`,
          slug: t.slug,
        });
      }
    });

    projects.forEach((p) => {
      const haystack = `${p.title} ${p.summary} ${p.category} ${p.client} ${p.tech.join(" ")}`.toLowerCase();
      if (haystack.includes(q)) {
        matches.push({
          type: "project",
          title: p.title,
          description: p.summary,
          meta: `Portfolio · ${p.category} · ${p.year}`,
          slug: p.slug,
        });
      }
    });

    return matches;
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<ResultType, Result[]>();
    results.forEach((r) => {
      const arr = map.get(r.type) ?? [];
      arr.push(r);
      map.set(r.type, arr);
    });
    return map;
  }, [results]);

  const totalCount = results.length;
  const hasQuery = query.trim().length > 0;

  function go(r: Result) {
    const meta = typeMeta[r.type];
    navigate(meta.route, { slug: r.slug ?? null });
  }

  return (
    <div className="relative min-h-[80vh]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        <AuroraBackground />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary"
            >
              <Sparkles className="mr-1 h-3 w-3" /> Universal search
            </Badge>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find anything across <GradientTextTeal>BRANIFY</GradientTextTeal>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Search across services, digital products, free tools, blog posts
              and portfolio case studies — all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-8 max-w-2xl"
          >
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services, products, blog, tools…"
                className="h-14 rounded-2xl border-white/10 bg-card/40 pl-12 pr-12 text-base text-white shadow-premium backdrop-blur placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-primary/30"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Popular:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-white"
                >
                  <Hash className="h-3 w-3" />
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {!hasQuery ? (
            <EmptyQuery navigate={navigate} />
          ) : totalCount === 0 ? (
            <NoResults query={query} setQuery={setQuery} />
          ) : (
            <div className="space-y-10">
              <Reveal>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-white">
                      {totalCount}
                    </span>{" "}
                    result{totalCount === 1 ? "" : "s"} for{" "}
                    <span className="text-primary">“{query}”</span>
                  </p>
                  <button
                    onClick={() => setQuery("")}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-white"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                </div>
              </Reveal>

              {Array.from(grouped.entries()).map(([type, items]) => {
                const meta = typeMeta[type];
                return (
                  <Reveal key={type}>
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className={
                            "flex h-7 w-7 items-center justify-center rounded-lg " +
                            meta.accent
                          }
                        >
                          <meta.icon className="h-4 w-4" />
                        </span>
                        <h2 className="font-display text-lg font-semibold text-white">
                          {meta.label}
                        </h2>
                        <Badge
                          variant="outline"
                          className="border-white/10 bg-white/5 text-xs text-muted-foreground"
                        >
                          {items.length}
                        </Badge>
                      </div>
                      <Stagger className="grid gap-2">
                        {items.map((r, i) => (
                          <StaggerItem key={`${type}-${i}`}>
                            <button
                              onClick={() => go(r)}
                              className="group flex w-full items-start gap-4 rounded-2xl border border-white/5 bg-card/40 p-4 text-left backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/60"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-white group-hover:text-primary">
                                  {r.title}
                                </p>
                                <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                                  {r.description}
                                </p>
                                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                                  {r.meta}
                                </p>
                              </div>
                              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                            </button>
                          </StaggerItem>
                        ))}
                      </Stagger>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EMPTY QUERY (quick links + tips)                                    */
/* ------------------------------------------------------------------ */
function EmptyQuery({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="space-y-12">
      <Reveal>
        <div className="rounded-2xl border border-dashed border-white/10 bg-card/20 p-10 text-center backdrop-blur">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
            <SearchIcon className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-white">
            Start typing to search…
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Try a service like “branding”, a product like “prompt pack”, or a
            topic like “AI”.
          </p>
        </div>
      </Reveal>

      <div>
        <SectionHeading
          align="left"
          eyebrow="Jump back in"
          title={
            <>
              Quick <GradientTextTeal>links</GradientTextTeal>
            </>
          }
          description="Or skip search and head straight to where you want to be."
        />
        <Stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((q) => (
            <StaggerItem key={q.route}>
              <button
                onClick={() => navigate(q.route)}
                className="group flex h-full w-full flex-col items-start rounded-2xl border border-white/5 bg-card/40 p-5 text-left backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/60"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-display text-base font-semibold text-white group-hover:text-primary">
                    {q.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{q.hint}</p>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Reveal>
        <Card className="rounded-2xl border-white/5 bg-card/40 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Results update as you
              type
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Searches{" "}
              <span className="text-white">
                {services.length + products.length + blogPosts.length + tools.length + projects.length}
              </span>{" "}
              items
            </span>
          </div>
        </Card>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NO RESULTS                                                          */
/* ------------------------------------------------------------------ */
function NoResults({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  const navigate = useNavigate();
  return (
    <Reveal>
      <div className="rounded-2xl border border-dashed border-white/10 bg-card/20 p-12 text-center backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
          <SearchIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold text-white">
          No results for “{query}”
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          We searched every service, product, post, tool and case study —
          nothing matched. Try a different keyword, or reach out and we&apos;ll
          point you in the right direction.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => setQuery("")}
            className="border-white/10 hover:border-primary/30 hover:bg-white/5"
          >
            <X className="mr-1.5 h-4 w-4" /> Clear search
          </Button>
          <Button
            onClick={() => navigate("contact")}
            className="bg-primary text-primary-foreground hover:bg-hover"
          >
            Ask us directly <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-white"
            >
              <Hash className="h-3 w-3" />
              {term}
            </button>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
