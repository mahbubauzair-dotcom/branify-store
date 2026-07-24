"use client";

import {
  ArrowRight,
  Sparkles,
  Star,
  Quote,
  Target,
  Eye,
  Heart,
  Search,
  Palette,
  Code2,
  Rocket,
  TrendingUp,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "@/lib/router";
import { siteConfig } from "@/config/site";
import { processSteps } from "@/data/faq";
import { testimonials, stats } from "@/data/testimonials";
import { SectionHeading } from "@/components/shared/section-heading";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal, Stagger, StaggerItem, GradientTextTeal } from "@/components/shared/reveal";
import { GradientCover, AuroraBackground } from "@/components/shared/gradient-cover";
import { useCountUp, useInViewOnce } from "@/hooks/use-count-up";

const processIconMap: Record<string, LucideIcon> = {
  Search,
  Palette,
  Code2,
  Rocket: TrendingUp,
  TrendingUp,
};

const values = [
  {
    icon: Target,
    title: "Mission",
    description:
      "To make premium digital craft accessible to ambitious teams — pairing strategy, design and engineering under one roof to ship work that compounds.",
  },
  {
    icon: Eye,
    title: "Vision",
    description:
      "A world where every brand — from solo founders to enterprises — feels as polished as the technology giants, without compromising on speed or budget.",
  },
  {
    icon: Heart,
    title: "Values",
    description:
      "Craft over shortcuts. Outcomes over output. Honesty over hype. We sweat the details others skip and we tell you the truth, even when it's hard.",
  },
];

const milestones = [
  {
    year: "2019",
    title: "BRANIFY founded",
    description:
      "Two designers, one mission: bring premium agency craft to startups and ambitious founders. First office: a San Francisco apartment.",
  },
  {
    year: "2020",
    title: "First 100 clients",
    description:
      "Hit our first hundred engagements. Went fully remote and built the asynchronous workflow that still powers the team today.",
  },
  {
    year: "2021",
    title: "Design system practice",
    description:
      "Launched our design system discipline. Team grew to 12. Shipped our first internal component library used across every project.",
  },
  {
    year: "2022",
    title: "AI division launched",
    description:
      "Spun up a dedicated AI team. First copilots and RAG pipelines went into production for enterprise clients, with measurable ROI in week one.",
  },
  {
    year: "2023",
    title: "320+ projects delivered",
    description:
      "Crossed 320 delivered projects across 28 countries. Lighthouse averages hit 97+ across the portfolio. Reputations get harder to keep than to earn.",
  },
  {
    year: "2024",
    title: "Branify.store goes live",
    description:
      "Launched our digital products marketplace — templates, kits and bundles crafted with the same care as our client work. Thousands of downloads since.",
  },
  {
    year: "2025",
    title: "Premium recognition",
    description:
      "Named a top premium digital agency. Expanded the team to 24 across four continents — still small, still senior, still obsessed.",
  },
];

const team = [
  { name: "Elena Vasquez", role: "Creative Director", initials: "EV", accent: "gradient-teal" },
  { name: "Daniel Cho", role: "Head of Engineering", initials: "DC", accent: "gradient-cyan" },
  { name: "Maya Patel", role: "Brand Strategist", initials: "MP", accent: "gradient-rose" },
  { name: "Tom Bradley", role: "AI Lead", initials: "TB", accent: "gradient-violet" },
  { name: "Sofia Reyes", role: "Product Designer", initials: "SR", accent: "gradient-amber" },
  { name: "Kenji Tanaka", role: "Frontend Lead", initials: "KT", accent: "gradient-emerald" },
];

export function AboutView() {
  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "About" }]}
        title={
          <>
            We craft brands that <GradientTextTeal>feel premium</GradientTextTeal>
          </>
        }
        description="BRANIFY is a tight-knit team of designers, engineers and strategists on a mission to bring world-class digital craft to ambitious teams everywhere."
      />
      <OurStory />
      <MissionVisionValues />
      <Timeline />
      <ProcessSection />
      <StatsBand />
      <TestimonialsPreview />
      <TeamSection />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* OUR STORY                                                           */
/* ------------------------------------------------------------------ */
function OurStory() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Our story
              </div>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Founded in {siteConfig.foundedYear}, built on{" "}
                <GradientTextTeal>obsession</GradientTextTeal>.
              </h2>
              <div className="mt-6 space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  BRANIFY started in {siteConfig.foundedYear} with a simple frustration: most
                  agencies either shipped beautiful work that didn&apos;t perform, or performed well
                  but looked forgettable. We believed you shouldn&apos;t have to choose.
                </p>
                <p>
                  What began as two designers working out of a San Francisco apartment has grown
                  into a 24-person team distributed across four continents — but the standard
                  hasn&apos;t moved an inch. Every project still ships with the same obsession we
                  had on day one.
                </p>
                <p>
                  We&apos;ve kept our team deliberately small. No layers of account managers, no
                  offshore handoffs, no juniors learning on your dollar. You work directly with the
                  people doing the work — and they&apos;re the best at what they do.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("contact")}
                  className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-hover"
                >
                  Work with us <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("portfolio")}
                  variant="outline"
                  className="h-11 rounded-full border-white/15 bg-white/5 px-6 hover:bg-white/10"
                >
                  See our work
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <GradientCover variant="gradient-teal" className="min-h-[480px] rounded-3xl p-8">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <Badge className="bg-white/10 text-white hover:bg-white/15">
                    Since {siteConfig.foundedYear}
                  </Badge>
                  <p className="mt-6 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                    &ldquo;Premium isn&apos;t a price.
                    <br />
                    It&apos;s a standard.&rdquo;
                  </p>
                  <p className="mt-4 text-sm text-white/70">
                    The principle that has guided every project since day one — and the reason our
                    clients stick around.
                  </p>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                      {siteConfig.foundedYear}
                    </p>
                    <p className="mt-1 text-xs text-white/70">Founded</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="font-display text-2xl font-bold text-white sm:text-3xl">24</p>
                    <p className="mt-1 text-xs text-white/70">Team size</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="font-display text-2xl font-bold text-white sm:text-3xl">320+</p>
                    <p className="mt-1 text-xs text-white/70">Projects</p>
                  </div>
                </div>
              </div>
            </GradientCover>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MISSION / VISION / VALUES                                           */
/* ------------------------------------------------------------------ */
function MissionVisionValues() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What drives us"
          title={
            <>
              Mission, vision &amp; <GradientTextTeal>values</GradientTextTeal>
            </>
          }
          description="The principles behind every decision we make — from who we hire to which projects we take on."
        />
        <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {values.map((v) => (
            <StaggerItem key={v.title}>
              <div className="card-premium group h-full rounded-2xl border border-white/5 bg-card/40 p-7 backdrop-blur hover:border-primary/30 hover:bg-card/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-white">{v.title}</h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {v.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* TIMELINE                                                            */
/* ------------------------------------------------------------------ */
function Timeline() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Milestones"
          title={
            <>
              The road so <GradientTextTeal>far</GradientTextTeal>
            </>
          }
          description="Six years, 320+ projects and one stubborn standard. Here's how we got here."
        />
        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="absolute bottom-2 left-4 top-2 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent sm:left-5" />
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.05}>
                <div className="relative pl-14 sm:pl-20">
                  <div className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/40 bg-background sm:h-11 sm:w-11">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                        {m.year}
                      </Badge>
                      <h3 className="font-display text-lg font-semibold text-white sm:text-xl">
                        {m.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PROCESS                                                             */
/* ------------------------------------------------------------------ */
function ProcessSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Process"
          title={
            <>
              A process built for <GradientTextTeal>outcomes</GradientTextTeal>
            </>
          }
          description="Five phases, weekly milestones, zero surprises. You always know what's happening and why."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, i) => {
            const Icon = processIconMap[step.icon] ?? Layers;
            return (
              <Reveal key={step.number} delay={i * 0.08}>
                <div className="relative h-full rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur">
                  <div className="absolute -top-3 left-6 flex h-7 items-center rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  {i < processSteps.length - 1 && (
                    <ArrowRight className="absolute -right-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary/30 lg:block" />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* STATS BAND                                                          */
/* ------------------------------------------------------------------ */
function StatsBand() {
  const { ref, inView } = useInViewOnce();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
/* TESTIMONIALS PREVIEW                                                */
/* ------------------------------------------------------------------ */
function TestimonialsPreview() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              Loved by <GradientTextTeal>founders</GradientTextTeal> &amp; teams
            </>
          }
          description="Don't take our word for it. Here's what happens when ambition meets craftsmanship."
        />
        <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <StaggerItem key={t.name}>
              <Card className="h-full border-white/5 bg-card/40 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {t.metric && (
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                      {t.metric}
                    </Badge>
                  )}
                </div>
                <Quote className="mt-4 h-6 w-6 text-primary/30" />
                <p className="mt-3 text-sm text-white/90 leading-relaxed">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/5 font-display text-sm font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 flex justify-center">
          <Button
            onClick={() => navigate("contact")}
            variant="outline"
            className="rounded-full border-white/15 bg-white/5 hover:bg-white/10"
          >
            Become a client <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* TEAM                                                                */
/* ------------------------------------------------------------------ */
function TeamSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The team"
          title={
            <>
              The people behind <GradientTextTeal>the craft</GradientTextTeal>
            </>
          }
          description="A small, senior team. No juniors learning on your dollar. No layers of account managers. Just the people doing the work."
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <StaggerItem key={member.name}>
              <Card className="card-premium group overflow-hidden rounded-2xl border-white/5 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60">
                <GradientCover variant={member.accent} className="h-32">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/10 bg-background/60 font-display text-2xl font-bold text-white backdrop-blur transition-transform duration-300 group-hover:scale-110">
                      {member.initials}
                    </div>
                  </div>
                </GradientCover>
                <div className="px-6 pb-6 pt-4">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-white">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
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
                <Sparkles className="mr-1.5 h-3 w-3" /> Let&apos;s build something premium
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Want to work with a team that{" "}
                <GradientTextTeal>actually cares?</GradientTextTeal>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                We take on a limited number of engagements each quarter so every project gets
                senior attention. Book a call before our next slot fills up.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("contact")}
                  size="lg"
                  className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                >
                  Book a free call <ArrowRight className="ml-2 h-4 w-4" />
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
