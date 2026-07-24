"use client";

import {
  ArrowRight,
  Check,
  Award,
  Zap,
  Shield,
  Clock,
  Sparkles,
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
import { services } from "@/data/services";
import { processSteps } from "@/data/faq";
import { stats } from "@/data/testimonials";
import { SectionHeading } from "@/components/shared/section-heading";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal, Stagger, StaggerItem, GradientTextTeal } from "@/components/shared/reveal";
import { AuroraBackground } from "@/components/shared/gradient-cover";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { useCountUp, useInViewOnce } from "@/hooks/use-count-up";

const processIconMap: Record<string, LucideIcon> = {
  Search,
  Palette,
  Code2,
  Rocket: TrendingUp,
  TrendingUp,
};

const whyFeatures = [
  {
    icon: Award,
    title: "World-class craft",
    description:
      "Every pixel, animation and line of code held to the standard of Stripe, Linear and Vercel.",
  },
  {
    icon: Zap,
    title: "Performance obsessed",
    description:
      "95+ Lighthouse scores out of the box. Sub-second loads. Edge-optimized by default.",
  },
  {
    icon: Shield,
    title: "Accessible & secure",
    description:
      "WCAG-compliant, keyboard-navigable, and hardened against the modern threat landscape.",
  },
  {
    icon: Clock,
    title: "On-time, every time",
    description:
      "Weekly milestones, transparent timelines, and delivery dates we actually hit.",
  },
];

export function ServicesView() {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "Services" }]}
        title={
          <>
            Services that <GradientTextTeal>compound</GradientTextTeal>
          </>
        }
        description="From a single logo to a full AI-powered platform — BRANIFY covers the entire digital journey under one roof. Twelve focused services, one premium standard."
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MagneticButton strength={0.4} radius={50}>
            <Button
              onClick={() => navigate("contact")}
              size="lg"
              className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
            >
              Start a project <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </MagneticButton>
          <MagneticButton strength={0.3} radius={40}>
            <Button
              onClick={() => navigate("pricing")}
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
            >
              View pricing
            </Button>
          </MagneticButton>
        </div>
      </PageHeader>

      <ServicesGrid />
      <ProcessSection />
      <WhyChooseUs />
      <StatsBand />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SERVICES GRID                                                       */
/* ------------------------------------------------------------------ */
function ServicesGrid() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Full menu"
          title={
            <>
              Twelve services, <GradientTextTeal>one standard</GradientTextTeal>
            </>
          }
          description="Pick a single service or bundle them end-to-end. Every engagement ships with the same premium craft and 30-day support."
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s.slug}>
              <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-white/5 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60">
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <s.icon className="h-6 w-6" />
                    </div>
                    {s.popular && (
                      <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                        <Sparkles className="mr-1 h-3 w-3" /> Popular
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-primary/90">{s.tagline}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>

                  <div className="mt-5 space-y-2">
                    {s.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm text-white/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-lg border border-white/5 bg-background/40 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Deliverables
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.deliverables.map((d) => (
                        <span
                          key={d}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-white/75"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Starting at
                    </p>
                    <p className="font-display text-2xl font-bold text-white">
                      ${s.startingPrice.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("contact")}
                    size="sm"
                    className="h-9 rounded-full bg-white/5 text-white hover:bg-primary hover:text-primary-foreground"
                  >
                    Explore
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
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
/* PROCESS                                                             */
/* ------------------------------------------------------------------ */
function ProcessSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
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
/* WHY CHOOSE US                                                       */
/* ------------------------------------------------------------------ */
function WhyChooseUs() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why BRANIFY"
          title={
            <>
              Premium isn&apos;t a price. It&apos;s a <GradientTextTeal>standard</GradientTextTeal>.
            </>
          }
          description="We hold every decision — from typography to deployment — to the standard of the world's best technology companies."
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyFeatures.map((f) => (
            <StaggerItem key={f.title}>
              <div className="group h-full rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {f.description}
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
/* STATS BAND                                                          */
/* ------------------------------------------------------------------ */
function StatsBand() {
  const { ref, inView } = useInViewOnce();
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                Ready to make your brand feel{" "}
                <GradientTextTeal>unforgettable?</GradientTextTeal>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                Book a free 30-minute strategy call. We&apos;ll map out exactly how to take your
                brand to the next level — no pressure, no jargon.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <MagneticButton strength={0.4} radius={50}>
                  <Button
                    onClick={() => navigate("contact")}
                    size="lg"
                    className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                  >
                    Book a free call <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </MagneticButton>
                <MagneticButton strength={0.3} radius={40}>
                  <Button
                    onClick={() => navigate("pricing")}
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                  >
                    View pricing
                  </Button>
                </MagneticButton>
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
