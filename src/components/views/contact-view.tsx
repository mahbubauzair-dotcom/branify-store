"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Send,
  Clock,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useNavigate } from "@/lib/router";
import { siteConfig } from "@/config/site";
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
import { MagneticButton } from "@/components/shared/magnetic-button";

const projectTypes = ["Website", "Branding", "AI", "Product", "Other"];
const budgetOptions = ["< $2k", "$2k – $5k", "$5k – $10k", "$10k+", "Custom"];

type ContactForm = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
};

const emptyForm: ContactForm = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  message: "",
};

export function ContactView() {
  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "Contact" }]}
        title={
          <>
            Let&apos;s build something <GradientTextTeal>premium</GradientTextTeal>
          </>
        }
        description="Tell us about your project and we'll reply within 24 hours with a thoughtful next step — no sales pressure, no generic templates. Just clear thinking from a senior team."
      />
      <ContactSection />
      <MapSection />
      <FaqSection />
      <PromiseBanner />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CONTACT SECTION (form + info cards)                                 */
/* ------------------------------------------------------------------ */
function ContactSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <ContactFormCard />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-2">
            <ContactInfoColumn />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactFormCard() {
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ContactForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email, and a short message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("That email doesn't look quite right.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Submission failed. Please try again.");
        return;
      }
      setForm(emptyForm);
      toast.success("Message sent — we'll reply within 24 hours.", {
        description: "Check your inbox (and spam folder, just in case).",
      });
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">
            Start a project
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill this in and we&apos;ll send back a tailored plan within one business day.
          </p>
        </div>
        <Badge
          variant="outline"
          className="gap-1.5 border-primary/30 bg-primary/10 text-primary"
        >
          <Clock className="h-3 w-3" /> 24-hour reply
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" required>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Jane Doe"
              className="bg-input/30 border-white/10 focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </Field>
          <Field label="Work email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="jane@company.com"
              className="bg-input/30 border-white/10 focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </Field>
        </div>

        <Field label="Company (optional)" htmlFor="company">
          <Input
            id="company"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Acme Inc."
            className="bg-input/30 border-white/10 focus-visible:border-primary focus-visible:ring-primary/30"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Project type" htmlFor="projectType">
            <Select
              value={form.projectType}
              onValueChange={(v) => update("projectType", v)}
            >
              <SelectTrigger
                id="projectType"
                className="w-full bg-input/30 border-white/10 focus-visible:border-primary focus-visible:ring-primary/30"
              >
                <SelectValue placeholder="Pick one" />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur">
                {projectTypes.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Budget" htmlFor="budget">
            <Select value={form.budget} onValueChange={(v) => update("budget", v)}>
              <SelectTrigger
                id="budget"
                className="w-full bg-input/30 border-white/10 focus-visible:border-primary focus-visible:ring-primary/30"
              >
                <SelectValue placeholder="Pick a range" />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur">
                {budgetOptions.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Tell us about it" htmlFor="message" required>
          <Textarea
            id="message"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="What are you building, what's the goal, and when do you need it?"
            rows={5}
            className="bg-input/30 border-white/10 focus-visible:border-primary focus-visible:ring-primary/30"
          />
        </Field>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            We reply within 24 hours. Your details stay private.
          </p>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground hover:bg-hover"
          >
            {submitting ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Sending…
              </>
            ) : (
              <>
                Send message <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-white">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </Label>
      {children}
    </div>
  );
}

function ContactInfoColumn() {
  const cards: {
    icon: LucideIcon;
    label: string;
    value: string;
    href: string;
    external?: boolean;
    accent?: boolean;
    hint: string;
  }[] = [
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      hint: "Best for briefs & proposals",
    },
    {
      icon: Phone,
      label: "Phone",
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`,
      hint: "Mon–Fri, 9am–6pm PT",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: siteConfig.phone,
      href: siteConfig.whatsapp,
      external: true,
      accent: true,
      hint: "Fastest for quick questions",
    },
    {
      icon: MapPin,
      label: "Studio",
      value: siteConfig.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        siteConfig.address,
      )}`,
      external: true,
      hint: "By appointment",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Stagger className="flex flex-col gap-4">
        {cards.map((c) => (
          <StaggerItem key={c.label}>
            <a
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/60"
            >
              <span
                className={
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl " +
                  (c.accent
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-primary/15 text-primary")
                }
              >
                <c.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </p>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-1 truncate text-sm font-medium text-white">
                  {c.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.hint}</p>
              </div>
            </a>
          </StaggerItem>
        ))}
      </Stagger>

      <Card className="rounded-2xl border-white/5 bg-card/40 p-5 backdrop-blur">
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
          <span className="ml-1 text-sm font-semibold text-white">4.9 / 5</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Rated by 120+ founders & teams across SaaS, fintech, e-commerce and AI.
        </p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAP SECTION (placeholder)                                           */
/* ------------------------------------------------------------------ */
function MapSection() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.address,
  )}`;
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <GradientCover
            variant="gradient-teal"
            pattern="grid"
            className="relative h-64 overflow-hidden rounded-2xl border border-white/10 sm:h-72"
          >
            {/* Faux map grid */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(20,184,166,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.25) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(20,184,166,0.18), transparent 60%)",
              }}
            />
            {/* Road lines */}
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-primary/30" />
            <div className="absolute bottom-0 left-1/3 top-0 w-px bg-primary/30" />

            {/* Pin */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="relative">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
                  <MapPin className="h-6 w-6" />
                </span>
              </div>
              <p className="mt-3 font-display text-lg font-semibold text-white">
                San Francisco, CA
              </p>
              <p className="mt-1 text-xs text-white/70">{siteConfig.address}</p>
              <Button
                asChild
                size="sm"
                className="mt-4 bg-primary text-primary-foreground hover:bg-hover"
              >
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  Open in Maps <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </GradientCover>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ SECTION (filtered top 6)                                        */
/* ------------------------------------------------------------------ */
function FaqSection() {
  const generalFaqs = useMemo(
    () =>
      faqItems
        .filter((f) => f.category === "General" || f.category === "Process")
        .slice(0, 6),
    [],
  );
  const navigate = useNavigate();

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Before you ask"
          title={
            <>
              Common <GradientTextTeal>contact questions</GradientTextTeal>
            </>
          }
          description="A few quick answers before you hit send. See the full FAQ for everything else."
        />
        <Reveal className="mt-10">
          <div className="rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
            <Accordion type="single" collapsible className="w-full">
              {generalFaqs.map((f, i) => (
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
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => navigate("faq")}
                className="border-white/10 hover:border-primary/30 hover:bg-white/5"
              >
                See all FAQs <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PROMISE BANNER (response time CTA)                                  */
/* ------------------------------------------------------------------ */
function PromiseBanner() {
  const navigate = useNavigate();
  const promises = [
    { icon: Clock, title: "24-hour reply", body: "A real human, not an autoresponder." },
    { icon: Zap, title: "No sales pressure", body: "We tell you if we're not the right fit." },
    { icon: ShieldCheck, title: "Private & secure", body: "Your details never leave our team." },
  ];

  return (
    <section className="relative py-20 sm:py-28">
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
                  <Sparkles className="mr-1 h-3 w-3" /> Our promise
                </Badge>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  A premium reply, <GradientTextTeal>every time</GradientTextTeal>
                </h2>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                  You&apos;re not a lead in a CRM to us. You&apos;re a founder,
                  a marketer, a builder — and your message lands in front of a
                  senior team that actually does the work. We read every word,
                  reply within one business day, and only say yes when we know
                  we can deliver something we&apos;re proud of.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <MagneticButton strength={0.4} radius={45}>
                    <Button
                      onClick={() => navigate("services")}
                      className="bg-primary text-primary-foreground hover:bg-hover"
                    >
                      Explore services <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </MagneticButton>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/10 hover:border-primary/30 hover:bg-white/5"
                  >
                    <a href={`mailto:${siteConfig.email}`}>
                      <Mail className="mr-1.5 h-4 w-4" /> {siteConfig.email}
                    </a>
                  </Button>
                </div>
              </div>
              <Stagger className="grid gap-3 sm:grid-cols-1">
                {promises.map((p) => (
                  <StaggerItem key={p.title}>
                    <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-background/40 p-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <p.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{p.title}</p>
                          <Check className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {p.body}
                        </p>
                      </div>
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
