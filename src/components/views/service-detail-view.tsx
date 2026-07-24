"use client";

import { useMemo } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  Star,
  Quote,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate, useRouterStore } from "@/lib/router";
import { siteConfig } from "@/config/site";
import { services, type Service } from "@/data/services";
import { projects } from "@/data/portfolio";
import { testimonials } from "@/data/testimonials";
import { processSteps } from "@/data/faq";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { GlassBadge } from "@/components/shared/glass-badge";
import { MagneticButton } from "@/components/shared/magnetic-button";
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
import { JsonLd, buildBreadcrumbSchema } from "@/components/shared/json-ld";
import { track } from "@/lib/analytics";

const processIconMap: Record<string, LucideIcon> = {
  Search: TrendingUp,
  TrendingUp: TrendingUp,
  Palette: Sparkles,
  Code2: Zap,
  Rocket: ArrowRight,
};

/* ------------------------------------------------------------------ */
/* SERVICE DETAIL VIEW                                                 */
/* ------------------------------------------------------------------ */
export function ServiceDetailView() {
  const slug = useRouterStore((s) => s.slug);
  const navigate = useNavigate();
  const found = services.find((s) => s.slug === slug);
  const service = found ?? services[0];

  const relatedServices = useMemo(
    () =>
      services
        .filter((s) => s.slug !== service.slug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3),
    [service.slug],
  );

  if (!found) {
    return (
      <section className="relative overflow-hidden py-32">
        <AuroraBackground />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Service <GradientTextTeal>not found</GradientTextTeal>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            We couldn&apos;t find that service. Browse all services to find what
            you need.
          </p>
          <Button
            onClick={() => navigate("services")}
            className="mt-8 h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> All services
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="relative">
      <ServiceHero service={service} />
      <ServiceOverview service={service} />
      <ServiceDeliverables service={service} />
      <ServiceProcess />
      <ServiceResults service={service} />
      <ServiceFaq service={service} />
      <RelatedServices services={relatedServices} />
      <ServiceCta service={service} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */
function ServiceHero({ service }: { service: Service }) {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <AuroraBackground />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Services", url: `${siteConfig.url}/#services` },
          { name: service.title, url: `${siteConfig.url}/#services/${service.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.description,
          serviceType: service.title,
          provider: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          areaServed: "Worldwide",
          offers: {
            "@type": "Offer",
            price: service.startingPrice,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <button onClick={() => navigate("home")} className="hover:text-primary transition-colors">
            Home
          </button>
          <ChevronRight className="h-3.5 w-3.5 opacity-40" />
          <button onClick={() => navigate("services")} className="hover:text-primary transition-colors">
            Services
          </button>
          <ChevronRight className="h-3.5 w-3.5 opacity-40" />
          <span className="text-white">{service.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.accent} ring-1 ring-white/10`}>
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                {service.popular && (
                  <GlassBadge variant="teal">
                    <Sparkles className="h-3 w-3" /> Popular service
                  </GlassBadge>
                )}
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {service.title}
              </h1>
              <p className="mt-3 text-xl text-primary/90 font-medium">{service.tagline}</p>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="rounded-2xl border border-white/5 bg-card/40 px-5 py-3 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Starting at</p>
                  <p className="font-display text-3xl font-bold text-white tabular-nums">
                    ${service.startingPrice.toLocaleString()}
                  </p>
                </div>
                <MagneticButton strength={0.4} radius={50}>
                  <Button
                    onClick={() => {
                      track("cta_click", { label: service.title, location: "service-detail-hero" });
                      navigate("contact");
                    }}
                    size="lg"
                    className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                  >
                    Start this service <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </MagneticButton>
                <Button
                  onClick={() => navigate("pricing")}
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                >
                  View pricing
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <GradientCover variant="gradient-teal" className="aspect-[4/3] rounded-3xl border border-white/10" pattern="grid">
              <div className="flex h-full flex-col items-center justify-center p-10">
                <div className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${service.accent} ring-1 ring-white/10`}>
                  <service.icon className="h-12 w-12 text-primary" />
                </div>
                <p className="mt-6 font-display text-2xl font-bold text-white">{service.title}</p>
                <p className="mt-1 text-sm text-white/60">{service.features.length} key capabilities</p>
              </div>
            </GradientCover>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* OVERVIEW / FEATURES                                                 */
/* ------------------------------------------------------------------ */
function ServiceOverview({ service }: { service: Service }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="What's included"
          title={<>Key <GradientTextTeal>capabilities</GradientTextTeal></>}
          description="Everything this service covers, end to end."
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((f, i) => (
            <StaggerItem key={f}>
              <div className="card-premium group flex h-full items-start gap-4 rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur hover:border-primary/30 hover:bg-card/60">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-white">{f}</p>
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
/* DELIVERABLES                                                        */
/* ------------------------------------------------------------------ */
function ServiceDeliverables({ service }: { service: Service }) {
  const trustPoints = [
    { icon: Clock, label: "7-30 day delivery", desc: "Depending on scope" },
    { icon: ShieldCheck, label: "Full ownership", desc: "You own all files" },
    { icon: Zap, label: "Premium craft", desc: "Linear/Vercel standard" },
  ];
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Deliverables"
                title={<>What you&apos;ll <GradientTextTeal>receive</GradientTextTeal></>}
                description="Tangible outputs, clearly defined. No surprises."
              />
              <div className="mt-8 space-y-3">
                {service.deliverables.map((d) => (
                  <div key={d} className="flex items-center gap-3 rounded-xl border border-white/5 bg-card/40 px-4 py-3 backdrop-blur">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                    <span className="text-white/90">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-4">
              {trustPoints.map((t) => (
                <div key={t.label} className="card-premium flex items-center gap-4 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur hover:border-primary/30 hover:bg-card/60">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <t.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-white">{t.label}</p>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PROCESS                                                             */
/* ------------------------------------------------------------------ */
function ServiceProcess() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={<>A process built for <GradientTextTeal>outcomes</GradientTextTeal></>}
          description="Five phases, weekly milestones, zero surprises."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-5">
          {processSteps.map((step, i) => {
            const Icon = processIconMap[step.icon] ?? Sparkles;
            return (
              <Reveal key={step.number} delay={i * 0.08}>
                <div className="relative h-full rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur">
                  <div className="absolute -top-3 left-6 flex h-7 items-center rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
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
/* RESULTS / PROOF                                                     */
/* ------------------------------------------------------------------ */
function ServiceResults({ service }: { service: Service }) {
  // Pick 2 testimonials + 1 related project (by category keyword match).
  const picks = testimonials.slice(0, 2);
  const relatedProject = projects.find((p) =>
    service.title.toLowerCase().includes(p.category.toLowerCase().split(" ")[0]),
  ) ?? projects[0];

  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Proof of work"
          title={<>Results we&apos;ve <GradientTextTeal>shipped</GradientTextTeal></>}
          description="Real case studies and client outcomes from similar engagements."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Related project */}
          <Reveal>
            <Card className="card-premium group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-white/5 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60" onClick={() => {}}>
              <GradientCover variant={relatedProject.cover} className="h-48" pattern="grid">
                <div className="flex h-full flex-col justify-between p-5">
                  <GlassBadge variant="neutral">{relatedProject.category}</GlassBadge>
                  <div>
                    <p className="font-display text-2xl font-bold text-white">{relatedProject.client}</p>
                    <p className="text-sm text-white/60">{relatedProject.year}</p>
                  </div>
                </div>
              </GradientCover>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold text-white">{relatedProject.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{relatedProject.summary}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {relatedProject.results.slice(0, 2).map((r) => (
                    <div key={r.label} className="rounded-lg border border-white/5 bg-background/40 px-3 py-2.5 text-center">
                      <p className="font-mono text-lg font-bold text-primary tabular-nums">{r.value}</p>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{r.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
          {/* Testimonials */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-4">
              {picks.map((t) => (
                <Card key={t.name} className="card-premium rounded-2xl border-white/5 bg-card/40 p-6 backdrop-blur hover:border-primary/30 hover:bg-card/60">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {t.metric && (
                      <GlassBadge variant="teal">{t.metric}</GlassBadge>
                    )}
                  </div>
                  <Quote className="mt-3 h-5 w-5 text-primary/30" />
                  <p className="mt-2 text-sm text-white/90 leading-relaxed">{t.quote}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/5 font-display text-xs font-bold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SERVICE FAQ                                                         */
/* ------------------------------------------------------------------ */
function ServiceFaq({ service }: { service: Service }) {
  // Service-specific FAQ — generated from the service's properties so every
  // service page gets relevant, contextual Q&As without manual data entry.
  const faqs = [
    {
      q: `How much does ${service.title} cost?`,
      a: `Our ${service.title} service starts at $${service.startingPrice.toLocaleString()}. The final price depends on scope, complexity, and timeline. Book a free call and we'll give you a clear, fixed quote within 24 hours — no surprises.`,
    },
    {
      q: "How long does it take?",
      a: `Timelines vary by scope. Most ${service.title} engagements take 1–4 weeks. We ship weekly milestones so you always see progress, and we hit the delivery dates we quote.`,
    },
    {
      q: "How many revisions are included?",
      a: "Starter includes 2 rounds of revisions. Professional and Premium plans include unlimited revisions during the design phase. A 'round' is consolidated feedback, which keeps things efficient for both sides.",
    },
    {
      q: "Will I own the final files and code?",
      a: "Yes, 100%. Upon final payment, you own all source files, code, and assets. We transfer all accounts and credentials to you. No lock-in, ever.",
    },
    {
      q: "Do you offer ongoing support after launch?",
      a: "Yes. We offer monthly maintenance plans starting at $199/mo that include updates, backups, monitoring, and a set number of edit hours. Premium plans include priority support and a dedicated PM.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={`About ${service.title}`}
          title={<>Common <GradientTextTeal>questions</GradientTextTeal></>}
          description={`Everything you need to know about working with BRANIFY on ${service.title.toLowerCase()}.`}
        />
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-white/5 bg-card/40 px-5 backdrop-blur">
              <AccordionTrigger className="text-left text-white hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* RELATED SERVICES                                                    */
/* ------------------------------------------------------------------ */
function RelatedServices({ services: list }: { services: Service[] }) {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Related services"
          title={<>Explore <GradientTextTeal>more</GradientTextTeal></>}
          description="Other services that pair well with this one."
        />
        <Stagger className="mt-12 grid gap-4 lg:grid-cols-3">
          {list.map((s) => (
            <StaggerItem key={s.slug}>
              <button
                onClick={() => navigate("service-detail", { slug: s.slug })}
                className="card-premium group flex w-full items-start gap-4 rounded-2xl border border-white/5 bg-card/40 p-6 text-left backdrop-blur hover:border-primary/30 hover:bg-card/60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-white group-hover:text-primary transition-colors">{s.title}</h3>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.tagline}</p>
                  <p className="mt-3 text-sm text-white/70">
                    From <span className="font-semibold text-white tabular-nums">${s.startingPrice.toLocaleString()}</span>
                  </p>
                </div>
              </button>
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
function ServiceCta({ service }: { service: Service }) {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/60 to-card/40 p-10 backdrop-blur-xl sm:p-16">
          <AuroraBackground />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-primary/20 text-primary hover:bg-primary/25">
              <Sparkles className="mr-1.5 h-3 w-3" /> Ready when you are
            </Badge>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Start your <GradientTextTeal>{service.title}</GradientTextTeal> project
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Book a free 30-minute strategy call. We&apos;ll scope your project, align on timeline, and give you a clear quote — no pressure.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MagneticButton strength={0.4} radius={50}>
                <Button
                  onClick={() => {
                    track("cta_click", { label: service.title, location: "service-detail-cta" });
                    navigate("contact");
                  }}
                  size="lg"
                  className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                >
                  Book a free call <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </MagneticButton>
              <Button
                onClick={() => navigate("portfolio")}
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
              >
                See our work
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground/70">
              Or email us at{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">{siteConfig.email}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
