"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Search,
  Clock,
  Calendar,
  Sparkles,
  Mail,
  BookOpen,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@/lib/router";
import { siteConfig } from "@/config/site";
import { blogPosts, blogCategories, type BlogPost } from "@/data/blog";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const POSTS_PER_PAGE = 6;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* AUTHOR AVATAR (initials in gradient circle)                         */
/* ------------------------------------------------------------------ */
function AuthorAvatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-500 font-semibold text-white shadow-glow",
        className,
      )}
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* BLOG VIEW                                                           */
/* ------------------------------------------------------------------ */
export function BlogView() {
  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "Blog" }]}
        title={
          <>
            Insights from the <GradientTextTeal>studio</GradientTextTeal>
          </>
        }
        description="Deep dives on branding, AI, SEO, marketing and the craft of running a modern digital agency. Written by the BRANIFY team, for builders and founders."
      />
      <FeaturedHero />
      <Catalog />
      <AuthorSpotlight />
      <NewsletterSignup />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FEATURED HERO                                                       */
/* ------------------------------------------------------------------ */
function FeaturedHero() {
  const navigate = useNavigate();
  const featured = blogPosts.find((p) => p.featured) ?? blogPosts[0];

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-6 flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/25">
              <Sparkles className="mr-1.5 h-3 w-3" /> Featured story
            </Badge>
            <span className="text-xs text-muted-foreground">
              Editor&apos;s pick of the week
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Card
            onClick={() => navigate("blog-post", { slug: featured.slug })}
            className="group grid cursor-pointer overflow-hidden rounded-3xl border-white/5 bg-card/40 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60 hover:shadow-glow lg:grid-cols-2"
          >
            {/* LEFT — cover */}
            <div className="relative">
              <GradientCover
                variant={featured.cover}
                className="h-64 w-full sm:h-72 lg:h-full"
              >
                <div className="flex h-full items-center justify-center p-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="absolute left-4 top-4">
                  <Badge className="bg-black/40 text-white backdrop-blur-sm hover:bg-black/50">
                    {featured.category}
                  </Badge>
                </div>
                <div className="absolute right-4 top-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </GradientCover>
            </div>

            {/* RIGHT — body */}
            <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-primary"
                >
                  {featured.category}
                </Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(featured.date)}
                </span>
                <span className="h-3 w-px bg-white/10" />
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {featured.readingTime} min read
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-primary sm:text-3xl lg:text-4xl">
                {featured.title}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {featured.excerpt}
              </p>

              <div className="mt-2 flex items-center gap-3">
                <AuthorAvatar
                  initials={featured.author.avatar}
                  className="h-10 w-10 text-sm"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    {featured.author.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {featured.author.role}
                  </span>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CATALOG (filters + grid + pagination)                               */
/* ------------------------------------------------------------------ */
function Catalog() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const featured = blogPosts.find((p) => p.featured) ?? blogPosts[0];

  const filtered = useMemo(() => {
    return blogPosts.filter((p) => {
      if (p.slug === featured.slug) return false;
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, featured.slug]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE,
  );

  // Reset page when filters change
  function resetPage(cb: () => void) {
    cb();
    setPage(1);
  }

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="The journal"
          title={
            <>
              Browse <GradientTextTeal>every story</GradientTextTeal>
            </>
          }
          description={`Filter by topic, search by keyword, and dig into ${blogPosts.length} hand-written essays from the BRANIFY team.`}
        />

        {/* Toolbar */}
        <Reveal className="mt-10">
          <div className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur sm:p-5">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-2">
              {blogCategories.map((cat) => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => resetPage(() => setActiveCategory(cat))}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "border border-white/10 bg-white/5 text-white/70 hover:border-primary/30 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) =>
                    resetPage(() => setQuery(e.target.value))
                  }
                  placeholder="Search by title, excerpt or tag..."
                  className="h-11 rounded-xl border-white/10 bg-background/60 pl-9 text-sm text-white placeholder:text-muted-foreground focus-visible:border-primary/40"
                />
              </div>
              <p className="text-sm text-muted-foreground sm:shrink-0">
                Showing{" "}
                <span className="font-semibold text-white">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "post" : "posts"}
                {activeCategory !== "All" && (
                  <>
                    {" "}in{" "}
                    <span className="font-semibold text-primary">
                      {activeCategory}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Grid or empty state */}
        {paged.length > 0 ? (
          <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((p) => (
              <StaggerItem key={p.slug}>
                <BlogCard post={p} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Reveal className="mt-10">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={safePage === 1}
                onClick={() => setPage(safePage - 1)}
                className="h-9 rounded-full border-white/10 bg-white/5 px-4 text-white hover:bg-white/10 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    "h-9 w-9 rounded-full text-sm font-medium transition-all",
                    n === safePage
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "border border-white/10 bg-white/5 text-white/70 hover:border-primary/30 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {n}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={safePage === totalPages}
                onClick={() => setPage(safePage + 1)}
                className="h-9 rounded-full border-white/10 bg-white/5 px-4 text-white hover:bg-white/10 disabled:opacity-40"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* BLOG CARD                                                           */
/* ------------------------------------------------------------------ */
function BlogCard({ post }: { post: BlogPost }) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate("blog-post", { slug: post.slug })}
      className="card-premium group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-white/5 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60"
    >
      <GradientCover variant={post.cover} className="h-44">
        <div className="flex h-full items-center justify-center">
          <span className="font-display text-5xl font-bold text-white/15 transition-transform duration-300 group-hover:scale-110">
            {post.category.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="absolute left-3 top-3">
          <Badge className="bg-black/40 text-white backdrop-blur-sm hover:bg-black/50">
            {post.category}
          </Badge>
        </div>
        <div className="absolute right-3 top-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </GradientCover>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
          <AuthorAvatar
            initials={post.author.avatar}
            className="h-7 w-8 text-[10px]"
          />
          <span className="text-xs font-medium text-white/80">
            {post.author.name}
          </span>
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.date)}
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime}m
            </span>
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
          <Search className="h-8 w-8" />
        </div>
        <h3 className="mt-5 font-display text-xl font-semibold text-white">
          No stories match your filters
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Try a different category or clear your search to browse all{" "}
          {blogPosts.length} essays from the journal.
        </p>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* AUTHOR SPOTLIGHT                                                    */
/* ------------------------------------------------------------------ */
function AuthorSpotlight() {
  const authors = useMemo(() => {
    const map = new Map<
      string,
      { name: string; role: string; avatar: string; posts: number }
    >();
    for (const p of blogPosts) {
      const existing = map.get(p.author.name);
      if (existing) existing.posts += 1;
      else map.set(p.author.name, { ...p.author, posts: 1 });
    }
    return Array.from(map.values())
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 3);
  }, []);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="The voices"
          title={
            <>
              Writers behind the <GradientTextTeal>journal</GradientTextTeal>
            </>
          }
          description="The practitioners and leaders at BRANIFY who turn weekly learnings into essays worth your inbox."
        />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-3">
          {authors.map((a) => (
            <StaggerItem key={a.name}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/5 bg-card/40 p-6 text-center backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-500 font-display text-2xl font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-105">
                  {a.avatar}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">
                  {a.name}
                </h3>
                <p className="text-sm text-muted-foreground">{a.role}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <PenTool className="h-3 w-3" />
                  {a.posts} {a.posts === 1 ? "post" : "posts"} published
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* NEWSLETTER SIGNUP                                                   */
/* ------------------------------------------------------------------ */
function NewsletterSignup() {
  const [email, setEmail] = useState("");
  function subscribe() {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Subscribed! Watch your inbox for the next essay.");
    setEmail("");
  }
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-card/40 p-8 backdrop-blur sm:p-12">
            <AuroraBackground />
            <div className="absolute inset-0 bg-grid opacity-15" />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/25">
                  <Mail className="mr-1.5 h-3 w-3" /> The BRANIFY dispatch
                </Badge>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  One essay.{" "}
                  <GradientTextTeal>Every Tuesday.</GradientTextTeal>
                </h2>
                <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
                  Join 12,000+ founders, designers and builders getting our
                  best thinking on branding, AI, and the craft of building
                  premium digital products. No spam, unsubscribe anytime.
                </p>
              </div>
              <div className="lg:justify-self-end lg:w-full lg:max-w-md">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") subscribe();
                    }}
                    placeholder="you@company.com"
                    className="h-12 flex-1 rounded-full border-white/10 bg-background/60 px-5 text-sm text-white placeholder:text-muted-foreground focus-visible:border-primary/40"
                  />
                  <Button
                    onClick={subscribe}
                    className="h-12 shrink-0 rounded-full bg-primary px-6 text-primary-foreground hover:bg-hover"
                  >
                    Subscribe <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Trusted by teams at Stripe, Linear, Vercel and 9,000+ more.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

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
                <Sparkles className="mr-1.5 h-3 w-3" /> Ready to build?
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Put these insights to{" "}
                <GradientTextTeal>work for you</GradientTextTeal>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                Reading is the warmup. If you&apos;re ready to ship a premium
                brand, site, or AI product — we&apos;d love to help.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("contact")}
                  size="lg"
                  className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                >
                  Start a project <ArrowRight className="ml-2 h-4 w-4" />
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
