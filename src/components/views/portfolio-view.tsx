"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Star,
  Quote,
  Target,
  Lightbulb,
  Rocket,
  Calendar,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "@/lib/router";
import { siteConfig } from "@/config/site";
import {
  projects,
  projectCategories,
  type Project,
} from "@/data/portfolio";
import { testimonials, stats } from "@/data/testimonials";
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
import { GlassBadge } from "@/components/shared/glass-badge";
import { useCountUp, useInViewOnce } from "@/hooks/use-count-up";

export function PortfolioView() {
  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "Portfolio" }]}
        title={
          <>
            Work that <GradientTextTeal>moves metrics</GradientTextTeal>
          </>
        }
        description="Six recent engagements, six different industries, one consistent outcome: measurable business impact. Filter by category and dive into any case study for the full story."
      />
      <FilterableGrid />
      <StatsBand />
      <TestimonialsStrip />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FILTER + GRID                                                       */
/* ------------------------------------------------------------------ */
function FilterableGrid() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const activeProject = useMemo(
    () => projects.find((p) => p.slug === activeSlug) ?? null,
    [activeSlug],
  );

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Selected work"
          title={
            <>
              {projects.length} case studies, <GradientTextTeal>real outcomes</GradientTextTeal>
            </>
          }
          description="Each card opens a full case study — the challenge, our approach, before/after comparison, and the numbers that mattered."
        />

        {/* Filter pills */}
        <Reveal className="mt-10">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-card/40 p-3 backdrop-blur sm:p-4">
            {projectCategories.map((cat) => {
              const count =
                cat === "All"
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;
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
                  <span
                    className={
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums " +
                      (active
                        ? "bg-primary/20 text-primary"
                        : "bg-white/5 text-white/50")
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid */}
        <Stagger className="mt-8 grid gap-6 lg:grid-cols-2">
          {filtered.map((p) => (
            <StaggerItem key={p.slug}>
              <ProjectCard project={p} onOpen={() => setActiveSlug(p.slug)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Case study dialog */}
      <Dialog open={!!activeProject} onOpenChange={(o) => !o && setActiveSlug(null)}>
        <DialogPortal>
          {activeProject && <CaseStudyDialog project={activeProject} onClose={() => setActiveSlug(null)} />}
        </DialogPortal>
      </Dialog>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PROJECT CARD                                                        */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <Card
      onClick={onOpen}
      className="card-premium group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-white/5 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60"
    >
      <GradientCover variant={project.cover} className="h-56" pattern="grid">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <GlassBadge variant="neutral">{project.category}</GlassBadge>
            <span className="rounded-full bg-black/30 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur">
              {project.year}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Client
              </p>
              <p className="font-display text-lg font-semibold text-white">
                {project.client}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-medium text-white opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
              View case study <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </GradientCover>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {project.summary}
        </p>

        {/* Results tiles — mono font for data-driven aesthetic */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {project.results.slice(0, 4).map((r) => (
            <div
              key={r.label}
              className="rounded-xl border border-white/5 bg-background/40 px-3 py-2.5 text-center"
            >
              <p className="font-mono text-lg font-bold text-primary tabular-nums">{r.value}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                {r.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tech chips */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 6).map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[11px] text-white/70"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary/70" />
            {project.duration}
          </span>
          <span className="text-xs font-medium text-primary">
            Read full case study →
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* CASE STUDY DIALOG                                                   */
/* ------------------------------------------------------------------ */
function CaseStudyDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <DialogContent
      showCloseButton
      className="max-h-[92vh] w-full max-w-4xl gap-0 overflow-y-auto rounded-2xl border-white/10 bg-background/95 p-0 backdrop-blur-xl sm:max-w-4xl"
    >
      <DialogTitle className="sr-only">{project.title} — case study</DialogTitle>
      <DialogDescription className="sr-only">
        Full case study for {project.client} — {project.category} engagement from {project.year}.
      </DialogDescription>

      {/* Hero header */}
      <div className="relative">
        <GradientCover variant={project.cover} className="h-48 sm:h-56" pattern="grid">
          <div className="flex h-full flex-col justify-between p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <Badge className="bg-white/10 text-white backdrop-blur hover:bg-white/15">
                {project.category}
              </Badge>
              <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                {project.year}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                {project.client}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                {project.title}
              </h2>
            </div>
          </div>
        </GradientCover>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 rounded-full border border-white/5 bg-card/40 px-3 py-1">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {project.duration}
          </span>
          <span className="rounded-full border border-white/5 bg-card/40 px-3 py-1">
            {project.category}
          </span>
          <span className="rounded-full border border-white/5 bg-card/40 px-3 py-1">
            Client · {project.client}
          </span>
        </div>

        {/* Challenge + Solution */}
        <div className="grid gap-4 sm:grid-cols-2">
          <ChallengeSolutionCard
            icon={Target}
            label="The challenge"
            text={project.challenge}
            accent="text-rose-400"
          />
          <ChallengeSolutionCard
            icon={Lightbulb}
            label="Our solution"
            text={project.solution}
            accent="text-primary"
          />
        </div>

        {/* Before / After */}
        <div>
          <h3 className="font-display text-lg font-semibold text-white">
            Before & after
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <BeforeAfterCard
              variant="gradient-rose"
              label="Before"
              text={project.before}
              tone="rose"
            />
            <BeforeAfterCard
              variant={project.cover}
              label="After"
              text={project.after}
              tone="teal"
            />
          </div>
        </div>

        {/* Results grid */}
        <div>
          <h3 className="font-display text-lg font-semibold text-white">
            Results that mattered
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {project.results.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl border border-white/5 bg-card/40 p-4 text-center backdrop-blur"
              >
                <p className="font-mono text-3xl font-bold text-primary tabular-nums">{r.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {r.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Tech stack</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/85"
              >
                <Check className="h-3.5 w-3.5 text-primary" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/40 to-card/20 p-6 backdrop-blur">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Want a similar outcome?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Book a free 30-minute call. We&apos;ll scope your project and map a path to these numbers.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                onClick={() => {
                  onClose();
                  navigate("contact");
                }}
                className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-hover"
              >
                Start a similar project <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function ChallengeSolutionCard({
  icon: Icon,
  label,
  text,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  text: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
          <Icon className={"h-4 w-4 " + accent} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-3 text-sm text-white/85 leading-relaxed">{text}</p>
    </div>
  );
}

function BeforeAfterCard({
  variant,
  label,
  text,
  tone,
}: {
  variant: string;
  label: string;
  text: string;
  tone: "rose" | "teal";
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5">
      <GradientCover variant={variant} className="h-16" pattern="dots">
        <div className="flex h-full items-center justify-between px-5">
          <span
            className={
              "rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider " +
              (tone === "rose"
                ? "bg-rose-500/20 text-rose-300"
                : "bg-primary/20 text-primary")
            }
          >
            {label}
          </span>
        </div>
      </GradientCover>
      <div className="bg-card/40 p-5 backdrop-blur">
        <p className="text-sm text-white/85 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STATS BAND                                                          */
/* ------------------------------------------------------------------ */
function StatsBand() {
  const { ref, inView } = useInViewOnce();
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeading
            eyebrow="By the numbers"
            title={
              <>
                Outcomes we&apos;re <GradientTextTeal>proud of</GradientTextTeal>
              </>
            }
            description="Six years. Hundreds of projects. A track record built on shipping premium work that performs."
          />
        </div>
        <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <Card className="relative overflow-hidden border-white/5 bg-card/40 p-6 text-center backdrop-blur">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="relative">
                  <p className="font-display text-4xl font-bold text-white sm:text-5xl">
                    <CountUpNumber target={s.value} start={inView} />
                    <span className="text-primary">{s.suffix}</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUpNumber({ target, start }: { target: number; start: boolean }) {
  const value = useCountUp(target, 2, start);
  return <>{value}</>;
}

/* ------------------------------------------------------------------ */
/* TESTIMONIALS STRIP                                                  */
/* ------------------------------------------------------------------ */
function TestimonialsStrip() {
  const featured = testimonials.slice(0, 3);
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client voices"
          title={
            <>
              Don&apos;t take our word for it — <GradientTextTeal>take theirs</GradientTextTeal>
            </>
          }
          description="A few words from founders, CTOs and design leaders who trusted us with their brand."
        />
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {featured.map((t) => (
            <StaggerItem key={t.name}>
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border-white/5 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60">
                <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-sm font-bold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role}, {t.company}
                      </p>
                    </div>
                  </div>
                  {t.metric && (
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                      {t.metric}
                    </Badge>
                  )}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
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
                <Rocket className="mr-1.5 h-3 w-3" /> Your project, next
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Let&apos;s build a case study{" "}
                <GradientTextTeal>worth sharing</GradientTextTeal>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                Tell us about your goals. We&apos;ll show you exactly how we&apos;d reach them — with a scope, timeline, and the metrics we&apos;ll be measured against.
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
                  onClick={() => navigate("pricing")}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                >
                  See pricing
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground/70">
                Or email us at{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">
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
