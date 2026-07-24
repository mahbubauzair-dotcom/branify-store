"use client";

import { forwardRef, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Home,
  ChevronRight,
  Clock,
  Calendar,
  Twitter,
  Linkedin,
  Link2,
  Check,
  Mail,
  Sparkles,
  BookOpen,
  Quote,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useRouterStore } from "@/lib/router";
import { siteConfig } from "@/config/site";
import { blogPosts, type BlogPost } from "@/data/blog";
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
import { ReadingProgress } from "@/components/shared/reading-progress";
import { TableOfContents, type TocItem } from "@/components/shared/table-of-contents";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Slugify a heading string into a URL-safe id. */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* BLOG POST VIEW                                                      */
/* ------------------------------------------------------------------ */
export function BlogPostView() {
  const slug = useRouterStore((s) => s.slug);
  const found = blogPosts.find((p) => p.slug === slug);
  const post = found ?? blogPosts[0];
  const articleRef = useRef<HTMLElement>(null);

  // Build ToC items from the post's heading blocks.
  const tocItems = useMemo<TocItem[]>(
    () =>
      post.content
        .filter((b) => b.heading)
        .map((b) => ({ id: slugify(b.heading!), label: b.heading! })),
    [post],
  );

  if (!found) {
    return <NotFoundState />;
  }

  return (
    <div className="relative">
      <ReadingProgress targetRef={articleRef} />
      <ArticleHero post={post} />
      <ArticleBody post={post} ref={articleRef} tocItems={tocItems} />
      <AuthorBio post={post} />
      <RelatedArticles post={post} />
      <NewsletterSignup />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NOT FOUND STATE                                                     */
/* ------------------------------------------------------------------ */
function NotFoundState() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden py-32">
      <AuroraBackground />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold text-white sm:text-5xl">
          Story <GradientTextTeal>not found</GradientTextTeal>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          We couldn&apos;t find the article you were looking for. It may have
          been moved or the link may be incorrect.
        </p>
        <Button
          onClick={() => navigate("blog")}
          className="mt-8 h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to the journal
        </Button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* BREADCRUMBS                                                         */
/* ------------------------------------------------------------------ */
function Breadcrumbs({ post }: { post: BlogPost }) {
  const navigate = useNavigate();
  return (
    <nav
      className="flex items-center gap-1.5 text-sm text-muted-foreground"
      aria-label="Breadcrumb"
    >
      <button
        onClick={() => navigate("home")}
        className="hover:text-primary transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </button>
      <ChevronRight className="h-3.5 w-3.5 opacity-40" />
      <button
        onClick={() => navigate("blog")}
        className="hover:text-primary transition-colors"
      >
        Blog
      </button>
      <ChevronRight className="h-3.5 w-3.5 opacity-40" />
      <span className="max-w-[12rem] truncate text-white sm:max-w-sm">
        {post.title}
      </span>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* ARTICLE HERO                                                        */
/* ------------------------------------------------------------------ */
function ArticleHero({ post }: { post: BlogPost }) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <AuroraBackground />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <Breadcrumbs post={post} />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary"
            >
              {post.category}
            </Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min read
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            {post.title}
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {post.excerpt}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-white/5 pt-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-500 font-semibold text-white shadow-glow">
              {post.author.avatar}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {post.author.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {post.author.role}
              </span>
            </div>
            <span className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Written for the BRANIFY journal
            </span>
          </div>
        </Reveal>
      </div>

      {/* Banner */}
      <div className="relative mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <Reveal delay={0.25}>
          <GradientCover
            variant={post.cover}
            className="h-64 w-full overflow-hidden rounded-3xl border border-white/10 sm:h-72 lg:h-80"
          >
            <div className="flex h-full items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
                <Quote className="h-10 w-10 text-white/80" />
              </div>
            </div>
            <div className="absolute left-5 top-5">
              <Badge className="bg-black/40 text-white backdrop-blur-sm hover:bg-black/50">
                {post.category}
              </Badge>
            </div>
          </GradientCover>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* ARTICLE BODY                                                        */
/* ------------------------------------------------------------------ */
const ArticleBody = forwardRef<HTMLElement, { post: BlogPost; tocItems: TocItem[] }>(
  function ArticleBody({ post, tocItems }, ref) {
  return (
    <section ref={ref} className="relative scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
          <div className="mx-auto max-w-3xl lg:mx-0">
            <Reveal>
              <article className="space-y-2">
                {post.content.map((block, i) => {
                  const isFirstBody = i === 0 && !block.heading;
                  if (block.heading) {
                    const id = slugify(block.heading);
                    return (
                      <h2
                        key={i}
                        id={id}
                        className="mt-10 scroll-mt-28 font-display text-2xl font-semibold text-white sm:text-3xl"
                      >
                        {block.heading}
                      </h2>
                    );
                  }
                  return (
                    <p
                      key={i}
                      className={cn(
                        "text-[1.075rem] leading-[1.8] text-slate-300/90",
                        isFirstBody &&
                          "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-primary",
                      )}
                    >
                      {block.body}
                    </p>
                  );
                })}
              </article>
            </Reveal>

            <ShareRow post={post} />
            <TagsChips post={post} />
          </div>
          <aside className="hidden lg:block">
            <TableOfContents items={tocItems} />
          </aside>
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/* SHARE ROW                                                           */
/* ------------------------------------------------------------------ */
function ShareRow({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Couldn't copy the link"));
  }

  function shareTwitter() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const text = encodeURIComponent(post.title);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}&via=branify`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareLinkedin() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <Reveal className="mt-12">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur">
        <span className="text-sm font-semibold text-white">Share</span>
        <span className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <Button
            onClick={shareTwitter}
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
          >
            <Twitter className="h-4 w-4" /> Twitter
          </Button>
          <Button
            onClick={shareLinkedin}
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </Button>
          <Button
            onClick={copyLink}
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-primary" /> Copied
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" /> Copy link
              </>
            )}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* TAGS CHIPS                                                          */
/* ------------------------------------------------------------------ */
function TagsChips({ post }: { post: BlogPost }) {
  const navigate = useNavigate();
  if (!post.tags.length) return null;
  return (
    <Reveal className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Filed under:</span>
        {post.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => navigate("blog")}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
          >
            #{tag}
          </button>
        ))}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* AUTHOR BIO CARD                                                     */
/* ------------------------------------------------------------------ */
const authorBios: Record<string, string> = {
  "Elena Vasquez":
    "Elena leads creative direction at BRANIFY. 12+ years shaping brand identities for startups and Fortune 500s. Previously Design Lead at Stripe.",
  "Marcus Chen":
    "Marcus heads our AI practice. He has shipped LLM-powered products used by millions and writes about prompt engineering, RAG, and applied AI.",
  "Priya Nair":
    "Priya is our SEO & content strategist. She has helped 50+ companies grow organic traffic and writes about technical SEO and AI-driven content.",
  "David Park":
    "David is the founder of BRANIFY. He scaled from solo freelancer to a 7-figure agency in 4 years and now writes about business and pricing.",
  "James Wilson":
    "James is Lead Engineer at BRANIFY. He builds production Next.js apps, design systems, and writes about modern web architecture.",
};

function AuthorBio({ post }: { post: BlogPost }) {
  const bio =
    authorBios[post.author.name] ??
    "A writer and practitioner at BRANIFY sharing lessons from the field.";
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-card/40 p-7 backdrop-blur sm:p-9">
            <div className="absolute -top-1/4 -right-1/4 w-1/2 h-[150%] bg-primary/10 blur-3xl rounded-full" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-500 font-display text-xl font-bold text-white shadow-glow">
                {post.author.avatar}
              </span>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Written by
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-white">
                  {post.author.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {post.author.role} · BRANIFY
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {bio}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    aria-label={`${post.author.name} on Twitter`}
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    aria-label={`${post.author.name} on LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    aria-label={`Email ${post.author.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* RELATED ARTICLES                                                    */
/* ------------------------------------------------------------------ */
function RelatedArticles({ post }: { post: BlogPost }) {
  const navigate = useNavigate();
  const related = useMemo(() => {
    const sameCategory = blogPosts.filter(
      (p) => p.slug !== post.slug && p.category === post.category,
    );
    const others = blogPosts.filter(
      (p) => p.slug !== post.slug && p.category !== post.category,
    );
    return [...sameCategory, ...others].slice(0, 3);
  }, [post.slug, post.category]);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Keep reading"
          title={
            <>
              Related <GradientTextTeal>stories</GradientTextTeal>
            </>
          }
          description="More from the BRANIFY journal on similar topics."
        />

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <StaggerItem key={p.slug}>
              <Card
                onClick={() => navigate("blog-post", { slug: p.slug })}
                className="group h-full cursor-pointer overflow-hidden rounded-2xl border-white/5 bg-card/40 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60 hover:shadow-glow"
              >
                <GradientCover variant={p.cover} className="h-40">
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-5xl font-bold text-white/15 transition-transform duration-300 group-hover:scale-110">
                      {p.category.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-black/40 text-white backdrop-blur-sm hover:bg-black/50">
                      {p.category}
                    </Badge>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </GradientCover>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-semibold leading-snug text-white transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {p.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(p.date)}
                    </span>
                    <span className="h-3 w-px bg-white/10" />
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {p.readingTime}m
                    </span>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-10 flex justify-center">
          <Button
            onClick={() => navigate("blog")}
            variant="outline"
            size="lg"
            className="h-11 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to the journal
          </Button>
        </Reveal>
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
                  Loved this story?{" "}
                  <GradientTextTeal>Get the next one.</GradientTextTeal>
                </h2>
                <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
                  Join 12,000+ founders and builders getting our best essays on
                  branding, AI, SEO and the craft of premium digital work.
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
                  No spam. Unsubscribe anytime. We never share your email.
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
                <Sparkles className="mr-1.5 h-3 w-3" /> Build with BRANIFY
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Turn insights into a{" "}
                <GradientTextTeal>premium brand</GradientTextTeal>
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
                  onClick={() => navigate("portfolio")}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                >
                  See our work
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
