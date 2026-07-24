"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  HelpCircle,
  MessageSquare,
  Mail,
  Sparkles,
  X,
  Clock,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "@/lib/router";
import { siteConfig } from "@/config/site";
import { faqItems, processSteps } from "@/data/faq";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Reveal,
  Stagger,
  StaggerItem,
  GradientTextTeal,
} from "@/components/shared/reveal";
import { AuroraBackground } from "@/components/shared/gradient-cover";

export function FaqView() {
  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "FAQ" }]}
        title={
          <>
            Frequently asked <GradientTextTeal>questions</GradientTextTeal>
          </>
        }
        description="Twelve real questions, twelve honest answers. Search by keyword or browse by category — and if you can't find what you're looking for, our team is one message away."
      />
      <FaqExplorer />
      <ProcessSection />
      <ContactCta />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ EXPLORER (search + categories + accordion)                      */
/* ------------------------------------------------------------------ */
function FaqExplorer() {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    faqItems.forEach((f) => seen.add(f.category));
    return ["All", ...Array.from(seen)];
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqItems.filter((f) => {
      const matchesCategory =
        activeCategory === "All" || f.category === activeCategory;
      const matchesQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: faqItems.length };
    faqItems.forEach((f) => {
      counts[f.category] = (counts[f.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Sidebar / pills */}
          <Reveal className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                  {categories.map((c) => {
                    const isActive = c === activeCategory;
                    return (
                      <button
                        key={c}
                        onClick={() => setActiveCategory(c)}
                        className={
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors " +
                          (isActive
                            ? "bg-primary/15 text-primary"
                            : "text-muted-foreground hover:bg-white/5 hover:text-white")
                        }
                      >
                        <span>{c}</span>
                        <span
                          className={
                            "rounded-full px-1.5 py-0.5 text-[10px] font-medium " +
                            (isActive
                              ? "bg-primary/20 text-primary"
                              : "bg-white/5 text-muted-foreground")
                          }
                        >
                          {categoryCounts[c] ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur">
                <HelpCircle className="h-6 w-6 text-primary" />
                <p className="mt-2 text-sm font-medium text-white">
                  Can&apos;t find an answer?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Send us a message and we&apos;ll reply within 24 hours.
                </p>
                <Button
                  size="sm"
                  className="mt-3 w-full bg-primary text-primary-foreground hover:bg-hover"
                  onClick={() => {
                    const el = document.getElementById("faq-contact-cta");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Ask us <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Main column */}
          <Reveal delay={0.1} className="lg:col-span-3">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions, answers, or categories…"
                className="h-12 rounded-xl border-white/10 bg-card/40 pl-11 pr-11 text-base text-white placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-primary/30"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Pills (mobile) */}
            <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
              {categories.map((c) => {
                const isActive = c === activeCategory;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                      (isActive
                        ? "border-primary/30 bg-primary/15 text-primary"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:text-white")
                    }
                  >
                    {c} · {categoryCounts[c] ?? 0}
                  </button>
                );
              })}
            </div>

            {/* Meta */}
            <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing{" "}
                <span className="font-semibold text-white">
                  {filtered.length}
                </span>{" "}
                of {faqItems.length} questions
                {activeCategory !== "All" && (
                  <>
                    {" "}
                    in{" "}
                    <span className="text-primary">{activeCategory}</span>
                  </>
                )}
              </span>
              {(activeCategory !== "All" || query) && (
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setQuery("");
                  }}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <X className="h-3 w-3" /> Clear filters
                </button>
              )}
            </div>

            {/* Results */}
            <div className="mt-4">
              {filtered.length === 0 ? (
                <EmptyState query={query} />
              ) : (
                <Card className="rounded-2xl border-white/5 bg-card/40 p-2 backdrop-blur sm:p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {filtered.map((f, i) => (
                      <AccordionItem
                        key={`${f.question}-${i}`}
                        value={`item-${i}`}
                        className="border-white/5 px-3 sm:px-4"
                      >
                        <AccordionTrigger className="text-left text-base font-medium text-white hover:text-primary hover:no-underline">
                          <span className="flex flex-1 items-start gap-3">
                            <span className="mt-0.5">{f.question}</span>
                            <Badge
                              variant="outline"
                              className="ml-auto shrink-0 border-white/10 bg-white/5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                            >
                              {f.category}
                            </Badge>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                          {f.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-card/20 p-12 text-center backdrop-blur">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="mt-4 font-medium text-white">
        {query
          ? `No questions match “${query}”`
          : "No questions in this category yet"}
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Try a different keyword or browse another category — or reach out and
        we&apos;ll answer it directly.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PROCESS SECTION                                                     */
/* ------------------------------------------------------------------ */
function ProcessSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              The five-step <GradientTextTeal>BRANIFY process</GradientTextTeal>
            </>
          }
          description="A clear, milestone-driven path from first call to final handoff — built so you always know what's happening next."
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((s, i) => (
            <StaggerItem key={s.number}>
              <Card className="group relative h-full overflow-hidden rounded-2xl border-white/5 bg-card/40 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-card/60">
                <div className="absolute right-4 top-4 font-display text-5xl font-bold text-white/5 transition-colors group-hover:text-primary/15">
                  {s.number}
                </div>
                <div className="relative">
                  <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
                    Step {i + 1}
                  </p>
                  <p className="mt-2 font-display text-lg font-semibold text-white">
                    {s.title}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
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
/* CONTACT CTA                                                         */
/* ------------------------------------------------------------------ */
function ContactCta() {
  const navigate = useNavigate();

  const channels = [
    {
      icon: MessageSquare,
      label: "Start a project",
      hint: "Tell us what you're building",
      action: () => navigate("contact"),
      cta: "Open form",
    },
    {
      icon: Mail,
      label: siteConfig.email,
      hint: "Briefs, proposals, hello",
      href: `mailto:${siteConfig.email}`,
      cta: "Send email",
    },
    {
      icon: Phone,
      label: siteConfig.phone,
      hint: "Mon–Fri, 9am–6pm PT",
      href: `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`,
      cta: "Call us",
    },
  ];

  return (
    <section id="faq-contact-cta" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-8 backdrop-blur sm:p-12">
            <AuroraBackground />
            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-primary"
                >
                  <Sparkles className="mr-1 h-3 w-3" /> Still have questions?
                </Badge>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  We&apos;d love to <GradientTextTeal>hear from you</GradientTextTeal>
                </h2>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                  If none of the above covered it, that&apos;s a good sign — it
                  means your project is unique. Reach out and we&apos;ll put
                  together a thoughtful, no-pressure response within one
                  business day.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" /> 24-hour reply
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Private
                    &amp; secure
                  </span>
                </div>
              </div>

              <Stagger className="grid gap-3">
                {channels.map((c) => {
                  const Inner = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {c.label}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {c.hint}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </>
                  );
                  return (
                    <StaggerItem key={c.label}>
                      {c.href ? (
                        <a
                          href={c.href}
                          className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-background/40 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30"
                        >
                          {Inner}
                        </a>
                      ) : (
                        <button
                          onClick={c.action}
                          className="group flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-background/40 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30"
                        >
                          {Inner}
                        </button>
                      )}
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
