"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Sparkles, Star, Check, Zap, Shield, Clock, Award,
  TrendingUp, Layers, Cpu, Globe, Code2, Palette, BrainCircuit,
  Quote, Play, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "@/lib/router";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { tools } from "@/data/tools";
import { projects } from "@/data/portfolio";
import { testimonials, stats, trustedBrands } from "@/data/testimonials";
import { faqItems, processSteps } from "@/data/faq";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, Stagger, StaggerItem, GradientTextTeal } from "@/components/shared/reveal";
import { GradientCover, AuroraBackground } from "@/components/shared/gradient-cover";
import { CursorSpotlight } from "@/components/shared/cursor-spotlight";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { SectionDivider, SectionGlow } from "@/components/shared/section-divider";
import { AnimatedGradientBg } from "@/components/shared/animated-gradient-bg";
import { useCountUp, useInViewOnce } from "@/hooks/use-count-up";
import { useParallax } from "@/hooks/use-parallax";
import { useCurrency } from "@/lib/currency";
import { track } from "@/lib/analytics";

const whyFeatures = [
  { icon: Award, title: "World-class craft", description: "Every pixel, animation and line of code held to the standard of Stripe, Linear and Vercel." },
  { icon: Zap, title: "Performance obsessed", description: "95+ Lighthouse scores out of the box. Sub-second loads. Edge-optimized by default." },
  { icon: Shield, title: "Accessible & secure", description: "WCAG-compliant, keyboard-navigable, and hardened against the modern threat landscape." },
  { icon: Clock, title: "On-time, every time", description: "Weekly milestones, transparent timelines, and delivery dates we actually hit." },
  { icon: Cpu, title: "AI-native", description: "We ship real AI features — copilots, RAG, automation — not just demos." },
  { icon: Globe, title: "Scale-ready", description: "Architecture that grows from 1 to 1M users without rewrites." },
];

export function HomeView() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <AnimatedGradientBg />
      <Hero />
      <TrustedBrands />
      <StatsSection />
      <SectionDivider />
      <ServicesPreview />
      <WhyBranify />
      <SectionDivider />
      <ProductsPreview />
      <ToolsPreview />
      <SectionDivider />
      <PortfolioPreview />
      <ProcessSection />
      <TestimonialsSection />
      <FaqPreview />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 mask-radial" />

      <CursorSpotlight className="relative">
        <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Premium digital agency · {new Date().getFullYear()}
            <span className="mx-1 h-3 w-px bg-primary/30" />
            <span className="text-primary/80">Trusted by 320+ brands</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Brands that feel like a{" "}
            <GradientTextTeal>million dollars</GradientTextTeal>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            BRANIFY is a premium digital agency crafting world-class websites, brand identities,
            AI solutions and digital products. We design, build and grow brands that win.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <MagneticButton strength={0.4} radius={50}>
              <Button
                onClick={() => {
                  track("cta_click", { label: "Start a project", location: "hero" });
                  navigate("contact");
                }}
                size="lg"
                className="group h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
              >
                Start a project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.3} radius={40}>
              <Button
                onClick={() => navigate("portfolio")}
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-white backdrop-blur hover:bg-white/10"
              >
                <Play className="mr-2 h-4 w-4" />
                View our work
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {["No long-term contracts", "98% client satisfaction", "7-day delivery on Starter"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        <HeroDashboard />
      </motion.div>
      </CursorSpotlight>
    </section>
  );
}

function HeroDashboard() {
  const { ref, y } = useParallax(60);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto mt-16 max-w-5xl"
      style={{ perspective: 1200, y }}
    >
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 shadow-premium-lg backdrop-blur-xl">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            branify.store
          </div>
        </div>
        {/* dashboard body */}
        <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance overview</p>
                <p className="font-display text-2xl font-bold text-white">+148% conversion</p>
              </div>
              <Badge className="bg-primary/15 text-primary hover:bg-primary/20">▲ 32.4%</Badge>
            </div>
            {/* fake chart */}
            <div className="relative h-32 overflow-hidden rounded-xl border border-white/5 bg-background/50 p-3">
              <svg viewBox="0 0 300 100" className="h-full w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="hero-chart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0fe1d2" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0fe1d2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 C40,70 60,40 100,45 C140,50 160,20 200,25 C240,30 260,10 300,15 L300,100 L0,100 Z" fill="url(#hero-chart)" />
                <path d="M0,80 C40,70 60,40 100,45 C140,50 160,20 200,25 C240,30 260,10 300,15" fill="none" stroke="#0fe1d2" strokeWidth="2" />
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Lighthouse", value: "98" },
                { label: "Load time", value: "0.8s" },
                { label: "Bounce", value: "−32%" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-white/5 bg-background/50 p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-display text-lg font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-white/5 bg-background/50 p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium text-white">AI Copilot</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Auto-resolving 70% of support tickets in real-time.</p>
              <div className="mt-3 h-1.5 rounded-full bg-white/5">
                <div className="h-full w-[70%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="rounded-xl border border-white/5 bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Active projects</p>
              <div className="mt-2 space-y-2">
                {["Lumen Finance", "Pulse AI", "Vertex SaaS"].map((p, i) => (
                  <div key={p} className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${["bg-primary", "bg-amber-400", "bg-violet-400"][i]}`} />
                    <span className="text-xs text-white">{p}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{[92, 64, 38][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* floating cards */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-4 top-1/3 hidden rounded-xl border border-white/10 bg-card/90 p-3 shadow-premium backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-sm font-bold text-white">+$240k</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-4 bottom-1/4 hidden rounded-xl border border-white/10 bg-card/90 p-3 shadow-premium backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Star className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Client rating</p>
            <p className="text-sm font-bold text-white">4.9 / 5.0</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* TRUSTED BRANDS                                                      */
/* ------------------------------------------------------------------ */
function TrustedBrands() {
  const list = [...trustedBrands, ...trustedBrands];
  return (
    <section className="relative border-y border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by fast-growing teams worldwide
        </p>
        <div className="relative mt-8 overflow-hidden mask-fade-b" style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}>
          <div className="flex w-max animate-marquee items-center gap-12">
            {list.map((brand, i) => (
              <div key={i} className="flex items-center gap-2 text-2xl font-display font-bold text-white/50 transition-colors hover:text-white">
                <div className="h-7 w-7 rounded-lg bg-white/10" />
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* STATS                                                               */
/* ------------------------------------------------------------------ */
function StatsSection() {
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
/* SERVICES PREVIEW                                                    */
/* ------------------------------------------------------------------ */
function ServicesPreview() {
  const navigate = useNavigate();
  const { currency, convert } = useCurrency();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we do"
          title={<>Services that <GradientTextTeal>compound</GradientTextTeal></>}
          description="From a single logo to a full AI-powered platform — we cover the entire digital journey under one roof."
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <StaggerItem key={s.slug}>
              <Card
                className="card-premium group relative h-full overflow-hidden border-white/5 bg-card/40 p-6 backdrop-blur hover:border-primary/30 hover:bg-card/60 cursor-pointer"
                onClick={() => navigate("service-detail", { slug: s.slug })}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <s.icon className="h-6 w-6" />
                    </div>
                    {s.popular && (
                      <Badge className="bg-primary/15 text-primary hover:bg-primary/20">Popular</Badge>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">From <span className="font-semibold text-white">{currency.symbol}{convert(s.startingPrice).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span></span>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 flex justify-center">
          <Button onClick={() => navigate("services")} variant="outline" className="rounded-full border-white/15 bg-white/5 hover:bg-white/10">
            View all 12 services <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* WHY BRANIFY                                                         */
/* ------------------------------------------------------------------ */
function WhyBranify() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why BRANIFY"
          title={<>Premium isn't a price. It's a <GradientTextTeal>standard</GradientTextTeal>.</>}
          description="We hold every decision — from typography to deployment — to the standard of the world's best technology companies."
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyFeatures.map((f) => (
            <StaggerItem key={f.title}>
              <div className="card-premium group h-full rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur hover:border-primary/30 hover:bg-card/60">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PRODUCTS PREVIEW                                                    */
/* ------------------------------------------------------------------ */
function ProductsPreview() {
  const navigate = useNavigate();
  const { currency, convert } = useCurrency();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Digital Products"
            title={<>Launch faster with <GradientTextTeal>ready-to-use</GradientTextTeal> assets</>}
            description="Templates, kits and bundles crafted with the same care as our client work. Instant download."
          />
          <Button onClick={() => navigate("products")} variant="outline" className="shrink-0 rounded-full border-white/15 bg-white/5 hover:bg-white/10">
            Browse all <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <StaggerItem key={p.slug}>
              <Card
                className="card-premium group flex h-full flex-col overflow-hidden border-white/5 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60 cursor-pointer"
                onClick={() => navigate("product-detail", { slug: p.slug })}
              >
                <GradientCover variant={p.preview} className="h-40">
                  <div className="flex h-full items-center justify-center">
                    <p.icon className="h-10 w-10 text-white/80" />
                  </div>
                  {(p.popular || p.new) && (
                    <div className="absolute left-3 top-3">
                      <Badge className={p.new ? "bg-emerald-500/20 text-emerald-300" : "bg-primary/20 text-primary"}>
                        {p.new ? "New" : "Popular"}
                      </Badge>
                    </div>
                  )}
                </GradientCover>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <h3 className="mt-1 font-display font-semibold text-white group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.tagline}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-lg font-bold text-white">{currency.symbol}{convert(p.price).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                      {p.originalPrice && <span className="text-xs text-muted-foreground line-through">{currency.symbol}{convert(p.originalPrice).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {p.rating}
                    </div>
                  </div>
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
/* TOOLS PREVIEW                                                       */
/* ------------------------------------------------------------------ */
function ToolsPreview() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Free Tools"
          title={<>Free, fast & <GradientTextTeal>beautiful</GradientTextTeal> tools</>}
          description="Generators and calculators for modern teams. No signup. No ads. Just press a button and copy."
        />
        <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.slice(0, 6).map((t) => (
            <StaggerItem key={t.slug}>
              <button
                onClick={() => navigate("tools")}
                className="group flex w-full items-center gap-4 rounded-xl border border-white/5 bg-card/40 p-4 text-left backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white group-hover:text-primary transition-colors">{t.name}</h3>
                    {t.badge && (
                      <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">{t.badge}</Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{t.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </button>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 flex justify-center">
          <Button onClick={() => navigate("tools")} variant="outline" className="rounded-full border-white/15 bg-white/5 hover:bg-white/10">
            Explore all 10 tools <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PORTFOLIO PREVIEW                                                   */
/* ------------------------------------------------------------------ */
function PortfolioPreview() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Portfolio"
            title={<>Work that <GradientTextTeal>moves metrics</GradientTextTeal></>}
            description="Real case studies with real results. We measure success in your growth, not just pretty pixels."
          />
          <Button onClick={() => navigate("portfolio")} variant="outline" className="shrink-0 rounded-full border-white/15 bg-white/5 hover:bg-white/10">
            View all work <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {projects.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Card
                className="group cursor-pointer overflow-hidden border-white/5 bg-card/40 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60"
                onClick={() => navigate("portfolio")}
              >
                <div className="grid sm:grid-cols-2">
                  <GradientCover variant={p.cover} className="min-h-[200px] p-6">
                    <div className="flex h-full flex-col justify-between">
                      <Badge className="w-fit bg-white/10 text-white hover:bg-white/15">{p.category}</Badge>
                      <div>
                        <p className="font-display text-2xl font-bold text-white">{p.client}</p>
                        <p className="text-sm text-white/60">{p.year}</p>
                      </div>
                    </div>
                  </GradientCover>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold text-white group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {p.results.slice(0, 2).map((r) => (
                        <div key={r.label} className="rounded-lg bg-background/50 p-2.5">
                          <p className="font-display text-xl font-bold text-primary">{r.value}</p>
                          <p className="text-xs text-muted-foreground">{r.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tech.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PROCESS                                                             */
/* ------------------------------------------------------------------ */
function ProcessSection() {
  const icons: Record<string, React.ElementType> = { Search, Palette, Code2, Rocket: TrendingUp, TrendingUp };
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Process"
          title={<>A process built for <GradientTextTeal>outcomes</GradientTextTeal></>}
          description="Five phases, weekly milestones, zero surprises. You always know what's happening and why."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-5">
          {processSteps.map((step, i) => {
            const Icon = icons[step.icon] || Layers;
            return (
              <Reveal key={step.number} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur">
                  <div className="absolute -top-3 left-6 flex h-7 items-center rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
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
/* TESTIMONIALS                                                        */
/* ------------------------------------------------------------------ */
function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title={<>Loved by <GradientTextTeal>founders</GradientTextTeal> &amp; teams</>}
          description="Don't take our word for it. Here's what happens when ambition meets craftsmanship."
        />
        <Stagger className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <Card className="card-premium break-inside-avoid border-white/5 bg-card/40 p-6 backdrop-blur hover:border-primary/30 hover:bg-card/60">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {t.metric && (
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/20">{t.metric}</Badge>
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
                    <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                  </div>
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
/* FAQ PREVIEW                                                         */
/* ------------------------------------------------------------------ */
function FaqPreview() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <SectionGlow side="top" color="rgba(20, 184, 166, 0.07)" size={560} />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Questions, <GradientTextTeal>answered</GradientTextTeal></>}
          description="Everything you need to know about working with BRANIFY."
        />
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqItems.slice(0, 6).map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-white/5 bg-card/40 px-5 backdrop-blur">
              <AccordionTrigger className="text-left text-white hover:no-underline">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 text-center">
          <Button onClick={() => navigate("faq")} variant="outline" className="rounded-full border-white/15 bg-white/5 hover:bg-white/10">
            See all FAQs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
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
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/60 to-card/40 p-10 backdrop-blur-xl sm:p-16">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-primary/20 text-primary hover:bg-primary/25">
              <Sparkles className="mr-1.5 h-3 w-3" /> Let's build something premium
            </Badge>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to make your brand feel{" "}
              <GradientTextTeal>unforgettable?</GradientTextTeal>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Book a free 30-minute strategy call. We'll map out exactly how to take your brand to the next level — no pressure, no jargon.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MagneticButton strength={0.4} radius={50}>
                <Button onClick={() => navigate("contact")} size="lg" className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover">
                  Book a free call <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </MagneticButton>
              <MagneticButton strength={0.3} radius={40}>
                <Button onClick={() => navigate("pricing")} size="lg" variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10">
                  View pricing
                </Button>
              </MagneticButton>
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
