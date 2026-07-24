"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Zap,
  Clock,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "@/lib/router";
import { siteConfig } from "@/config/site";
import {
  pricingPlans,
  pricingComparison,
  type PricingPlan,
} from "@/data/pricing";
import { faqItems } from "@/data/faq";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Reveal,
  Stagger,
  StaggerItem,
  GradientTextTeal,
} from "@/components/shared/reveal";
import {
  AuroraBackground,
  GradientCover,
} from "@/components/shared/gradient-cover";

export function PricingView() {
  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "Pricing" }]}
        title={
          <>
            Pricing that <GradientTextTeal>scales with you</GradientTextTeal>
          </>
        }
        description="Pick a one-time project or a monthly retainer — both ship with the same premium craft. Switch any time. Cancel any time. No surprises."
      />
      <PricingPlans />
      <ComparisonSection />
      <FaqSection />
      <GuaranteeBanner />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PRICING PLANS                                                       */
/* ------------------------------------------------------------------ */
function PricingPlans() {
  const [isMonthly, setIsMonthly] = useState(true);
  const navigate = useNavigate();

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plans & pricing"
          title={
            <>
              Four plans, <GradientTextTeal>zero lock-in</GradientTextTeal>
            </>
          }
          description="From a single landing page to a fully managed platform — there's a BRANIFY plan for every stage of growth."
        />

        {/* Toggle */}
        <Reveal className="mt-10">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-4 rounded-full border border-white/10 bg-card/40 p-1.5 backdrop-blur">
              <span
                className={
                  "cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all " +
                  (isMonthly ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white")
                }
                onClick={() => setIsMonthly(true)}
              >
                Monthly retainer
              </span>
              <Switch checked={!isMonthly} onCheckedChange={(v) => setIsMonthly(!v)} aria-label="Toggle billing cycle" />
              <span
                className={
                  "cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all " +
                  (!isMonthly ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white")
                }
                onClick={() => setIsMonthly(false)}
              >
                One-time project
              </span>
            </div>
          </div>
        </Reveal>

        {/* Plan grid */}
        <Stagger className="mt-12 grid items-stretch gap-5 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <StaggerItem key={plan.name} className="h-full">
              <PlanCard
                plan={plan}
                isMonthly={isMonthly}
                onCta={() => navigate("contact")}
              />
            </StaggerItem>
          ))}
        </Stagger>

        {/* Trust strip */}
        <Reveal className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> 50% deposit to start
            </span>
            <span className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" /> Cancel retainer any time
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Net-30 invoicing (Enterprise)
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  isMonthly,
  onCta,
}: {
  plan: PricingPlan;
  isMonthly: boolean;
  onCta: () => void;
}) {
  const isEnterprise = plan.name === "Enterprise";
  const highlighted = plan.highlight;

  const priceLabel = useMemo(() => {
    if (isEnterprise) return "Custom";
    const value = isMonthly ? plan.monthly : plan.oneTime;
    if (value == null) return "Custom";
    return `$${value.toLocaleString()}`;
  }, [isEnterprise, isMonthly, plan.monthly, plan.oneTime]);

  const cycleLabel = isEnterprise
    ? "tailored to scope"
    : isMonthly
      ? "/mo"
      : "one-time";

  return (
    <Card
      className={
        "relative flex h-full flex-col overflow-hidden rounded-2xl p-6 backdrop-blur transition-all " +
        (highlighted
          ? "border-primary bg-card/60 shadow-glow lg:-translate-y-3 lg:scale-[1.03]"
          : "border-white/5 bg-card/40 hover:border-primary/30 hover:bg-card/60")
      }
    >
      {highlighted && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            <Badge className="rounded-b-md rounded-t-none bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
              <Sparkles className="mr-1 h-3 w-3" /> Most popular
            </Badge>
          </div>
        </>
      )}

      <div className="relative">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
          {plan.popular && !highlighted && (
            <Badge className="bg-primary/15 text-primary hover:bg-primary/20">Popular</Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

        {/* Price */}
        <div className="mt-6">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-4xl font-bold text-white tabular-nums">
              {priceLabel}
            </span>
            <span className="text-sm text-muted-foreground">{cycleLabel}</span>
          </div>
          {isEnterprise && (
            <p className="mt-1 text-xs text-primary/80">
              Talk to sales for a custom quote
            </p>
          )}
        </div>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {plan.description}
        </p>

        {/* CTA */}
        <Button
          onClick={onCta}
          className={
            "mt-6 w-full rounded-full " +
            (highlighted
              ? "bg-primary text-primary-foreground hover:bg-hover"
              : isEnterprise
                ? "bg-white/5 text-white hover:bg-primary hover:text-primary-foreground"
                : "bg-white/5 text-white hover:bg-primary hover:text-primary-foreground")
          }
        >
          {plan.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>

        {/* Features */}
        <div className="mt-6 border-t border-white/5 pt-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            What&apos;s included
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/85">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* COMPARISON TABLE                                                    */
/* ------------------------------------------------------------------ */
function ComparisonSection() {
  const planColumns = [
    { key: "starter", label: "Starter" },
    { key: "professional", label: "Professional" },
    { key: "premium", label: "Premium" },
    { key: "enterprise", label: "Enterprise" },
  ] as const;

  type RowKey = (typeof planColumns)[number]["key"];

  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Compare plans"
          title={
            <>
              Every feature, <GradientTextTeal>side by side</GradientTextTeal>
            </>
          }
          description="A detailed breakdown so you can pick with confidence. Still unsure? Book a free call and we'll recommend the right fit."
        />

        <Reveal className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="bg-primary/15 text-sm font-semibold uppercase tracking-wider text-primary">
                    Feature
                  </TableHead>
                  {planColumns.map((c) => (
                    <TableHead
                      key={c.key}
                      className={
                        "bg-primary/15 text-center text-sm font-semibold uppercase tracking-wider " +
                        (c.key === "professional" ? "text-primary" : "text-white/80")
                      }
                    >
                      {c.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingComparison.map((row, i) => (
                  <TableRow
                    key={row.feature}
                    className={
                      "border-white/5 transition-colors hover:bg-primary/5 " +
                      (i % 2 === 1 ? "bg-white/[0.02]" : "")
                    }
                  >
                    <TableCell className="py-3 text-sm font-medium text-white">
                      {row.feature}
                    </TableCell>
                    {planColumns.map((c) => (
                      <TableCell key={c.key} className="py-3 text-center">
                        <ComparisonValue value={row[c.key as RowKey]} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <p className="text-center text-xs text-muted-foreground">
            All plans include a 30-day money-back guarantee · You own 100% of the source files · No hidden fees
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ComparisonValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
        <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
      </span>
    ) : (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.03] ring-1 ring-white/5">
        <X className="h-3 w-3 text-muted-foreground/40" strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span className="text-sm font-medium text-white/85 tabular-nums">{value}</span>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */
function FaqSection() {
  const pricingFaqs = useMemo(
    () => faqItems.filter((f) => f.category === "Pricing"),
    [],
  );
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing FAQ"
          title={
            <>
              Common <GradientTextTeal>pricing questions</GradientTextTeal>
            </>
          }
          description="Everything you need to know about how we charge, what's included, and what happens after you sign."
        />
        <Reveal className="mt-10">
          <div className="rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
            <Accordion type="single" collapsible className="w-full">
              {pricingFaqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-white/5"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-white hover:text-primary hover:no-underline">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MONEY-BACK GUARANTEE                                                */
/* ------------------------------------------------------------------ */
function GuaranteeBanner() {
  const navigate = useNavigate();
  const items: { icon: LucideIcon; title: string; text: string }[] = [
    {
      icon: ShieldCheck,
      title: "30-day money-back",
      text: "Not happy with the work? Get a full refund within 30 days — no questions, no friction.",
    },
    {
      icon: RefreshCw,
      title: "Cancel any time",
      text: "Monthly retainers can be paused or cancelled with 14 days notice. No lock-in contracts.",
    },
    {
      icon: Clock,
      title: "On-time delivery",
      text: "We commit to milestones in writing. Miss a deadline and we'll credit you back — guaranteed.",
    },
  ];
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/50 to-card/30 p-8 backdrop-blur-xl sm:p-12">
            <AuroraBackground />
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/25">
                    <ShieldCheck className="mr-1.5 h-3 w-3" /> Risk-free guarantee
                  </Badge>
                  <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                    Premium work, <GradientTextTeal>zero risk</GradientTextTeal>
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    We stand behind every engagement with a 30-day money-back guarantee. If we miss the mark, you don&apos;t pay.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("contact")}
                  size="lg"
                  className="h-12 shrink-0 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                >
                  Start risk-free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {items.map((it) => (
                  <div
                    key={it.title}
                    className="rounded-2xl border border-white/5 bg-background/40 p-5 backdrop-blur"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <it.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-display text-base font-semibold text-white">
                      {it.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {it.text}
                    </p>
                  </div>
                ))}
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
                <Sparkles className="mr-1.5 h-3 w-3" /> Not sure which plan?
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Book a free call — <GradientTextTeal>we&apos;ll help you choose</GradientTextTeal>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                30 minutes, zero pressure. We&apos;ll learn your goals, review your current setup, and recommend the plan (or custom scope) that fits best.
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
                  onClick={() => navigate("portfolio")}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                >
                  See our work
                </Button>
              </div>

              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
