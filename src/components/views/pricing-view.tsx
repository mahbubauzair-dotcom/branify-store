"use client";

import { useMemo } from "react";
import {
  ArrowRight,
  Check,
  Sparkles,
  Clock,
  Mail,
  Star,
  PenTool,
  Palette,
  Rocket,
  LayoutTemplate,
  ShoppingBag,
  Code2,
  Layers,
  Search,
  BrainCircuit,
  Wrench,
  Share2,
  Presentation,
  Lightbulb,
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
import { useNavigate } from "@/lib/router";
import { useCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  servicePackages,
  branifyPromise,
  type ServiceTier,
  type ServicePackage,
} from "@/data/service-packages";
import { faqItems } from "@/data/faq";
import { PageHeader } from "@/components/shared/page-header";
import {
  Reveal,
  Stagger,
  StaggerItem,
  GradientTextTeal,
} from "@/components/shared/reveal";
import { AnimatedGradientBg } from "@/components/shared/animated-gradient-bg";

/** Map service icon string → lucide component. */
const iconMap: Record<string, LucideIcon> = {
  PenTool,
  Sparkles,
  Palette,
  Rocket,
  LayoutTemplate,
  ShoppingBag,
  Code2,
  Layers,
  Search,
  BrainCircuit,
  Wrench,
  Share2,
  Presentation,
  Lightbulb,
};

export function PricingView() {
  return (
    <div className="relative">
      <AnimatedGradientBg />
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "Pricing" }]}
        title={
          <>
            Pricing that <GradientTextTeal>scales with you</GradientTextTeal>
          </>
        }
        description="Pick a one-time project or a monthly retainer — every BRANIFY engagement ships with the same premium craft, transparent pricing, and the Branify Promise. Switch tiers any time. No lock-in, no surprises."
      />
      <ServiceSections />
      <BranifyPromiseSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CURRENCY-AWARE PRICE FORMATTER                                      */
/* ------------------------------------------------------------------ */

/**
 * Returns a formatter that converts a price string like "$49", "$9.99",
 * "$99/month" into the user's selected currency. Prices like "Custom Quote"
 * or "Get Quote" pass through untouched.
 */
function useFormattedPrice() {
  const { currency, convert } = useCurrency();
  return (price: string): string => {
    if (!price.startsWith("$")) return price;
    const match = price.match(/^\$([\d.]+)(.*)$/);
    if (!match) return price;
    const usd = parseFloat(match[1]);
    if (Number.isNaN(usd)) return price;
    const suffix = match[2] ?? "";
    const converted = convert(usd);
    const formatted = converted.toLocaleString("en-US", {
      maximumFractionDigits: converted < 100 ? 2 : 0,
    });
    return `${currency.symbol}${formatted}${suffix}`;
  };
}

/* ------------------------------------------------------------------ */
/* SERVICE SECTIONS — one per package                                  */
/* ------------------------------------------------------------------ */

function ServiceSections() {
  return (
    <>
      {servicePackages.map((pkg, i) => (
        <ServiceSection key={pkg.id} pkg={pkg} index={i} />
      ))}
    </>
  );
}

function ServiceSection({ pkg, index }: { pkg: ServicePackage; index: number }) {
  const Icon = iconMap[pkg.icon] ?? Sparkles;
  const tierCount = pkg.tiers.length;
  const isAlt = index % 2 === 1;

  return (
    <section
      id={pkg.id}
      className={cn(
        "relative py-20 sm:py-24",
        isAlt && "border-y border-white/5 bg-white/[0.015]",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {pkg.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {pkg.tagline}
              </p>
            </div>
          </div>
        </Reveal>

        <Stagger
          className={cn(
            "mt-10 grid items-stretch gap-5",
            tierCount === 1
              ? "mx-auto max-w-3xl grid-cols-1"
              : tierCount === 2
                ? "sm:grid-cols-2"
                : "lg:grid-cols-3",
          )}
        >
          {pkg.tiers.map((tier) => (
            <StaggerItem key={tier.name} className="h-full">
              <TierCard tier={tier} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function TierCard({ tier }: { tier: ServiceTier }) {
  const navigate = useNavigate();
  const formatPrice = useFormattedPrice();
  const highlighted = !!tier.highlight;

  return (
    <Card
      className={cn(
        "card-premium relative flex h-full flex-col overflow-hidden rounded-2xl p-6 backdrop-blur-xl",
        highlighted
          ? "border-primary/30 bg-white/[0.05] shadow-glow lg:scale-[1.02]"
          : "border-white/[0.08] bg-white/[0.03] hover:border-primary/30",
      )}
    >
      {highlighted && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            <Badge className="rounded-b-md rounded-t-none bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#04121a]">
              <Sparkles className="mr-1 h-3 w-3" /> Most Popular
            </Badge>
          </div>
        </>
      )}

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            {tier.badge}
          </span>
          <h3 className="font-display text-xl font-bold text-white">{tier.name}</h3>
        </div>

        {/* Price */}
        <div className="mt-5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-4xl font-bold text-white tabular-nums">
              {formatPrice(tier.price)}
            </span>
          </div>
          {tier.priceNote && (
            <p className="mt-1.5 text-xs text-muted-foreground">{tier.priceNote}</p>
          )}
        </div>

        {tier.perfectFor && (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-white/80">Perfect for: </span>
            {tier.perfectFor}
          </p>
        )}

        {tier.delivery && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
            <Clock className="h-3 w-3 text-primary" />
            Delivery in {tier.delivery}
          </div>
        )}

        {/* Includes */}
        <div className="mt-5 border-t border-white/5 pt-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            What&apos;s included
          </p>
          <ul className="space-y-2">
            {tier.includes.map((f, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-white/85">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  strokeWidth={3}
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-auto pt-6">
        <Button
          onClick={() => navigate("contact")}
          className={cn(
            "w-full rounded-full",
            highlighted
              ? "bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
              : "bg-white/5 text-white hover:bg-primary hover:text-primary-foreground",
          )}
        >
          {tier.cta ?? "Get Started"}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* BRANIFY PROMISE                                                     */
/* ------------------------------------------------------------------ */

function BranifyPromiseSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.04]" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/10 blur-[100px]" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  🌟
                </span>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Branify Promise
                </h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Every project includes:
              </p>

              <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
                {branifyPromise.map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-accent/30 hover:bg-white/[0.04]">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15">
                        <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
                      </span>
                      <span className="text-sm font-medium text-white/90">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
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
    <section className="relative border-t border-white/5 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Pricing FAQ
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Common <GradientTextTeal>pricing questions</GradientTextTeal>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            Everything you need to know about how we charge, what&apos;s included,
            and what happens after you sign.
          </p>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
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
/* FINAL CTA                                                           */
/* ------------------------------------------------------------------ */

function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-white/[0.05] to-white/[0.03] p-10 backdrop-blur-xl sm:p-16">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/15 blur-[120px]" />
            <div className="relative mx-auto max-w-3xl text-center">
              <Badge className="mb-6 bg-primary/20 text-primary hover:bg-primary/25">
                <Star className="mr-1.5 h-3 w-3" /> Let&apos;s build something premium
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Ready to get started? <GradientTextTeal>Let&apos;s build.</GradientTextTeal>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                Pick a plan, request a custom quote, or book a free 30-minute
                strategy call. We&apos;ll map out exactly how to take your brand
                to the next level — no pressure, no jargon.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("contact")}
                  size="lg"
                  className="h-12 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] px-7 text-[#04121a] hover:opacity-90"
                >
                  Start a project <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("services")}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10"
                >
                  Explore services
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
