"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Sparkles, Star, Check, Zap, Shield, Clock, Award,
  TrendingUp, Layers, Cpu, Globe, Code2, Palette, BrainCircuit,
  ShoppingBag, Quote, Play, Search, Users, Briefcase,
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
import { testimonials, trustedBrands } from "@/data/testimonials";
import { faqItems, processSteps } from "@/data/faq";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, Stagger, StaggerItem, GradientTextTeal } from "@/components/shared/reveal";
import { GradientCover } from "@/components/shared/gradient-cover";
import { CursorSpotlight } from "@/components/shared/cursor-spotlight";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { SectionDivider } from "@/components/shared/section-divider";
import { AnimatedGradientBg } from "@/components/shared/animated-gradient-bg";
import { PremiumCTAButton } from "@/components/shared/premium-cta-button";
import { useCountUp, useInViewOnce } from "@/hooks/use-count-up";
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

/** Brand list — trustedBrands from data + extra well-known brands for the marquee. */
const heroBrands = [
  ...trustedBrands,
  "Google",
  "Microsoft",
  "Amazon",
  "Airbnb",
  "HubSpot",
  "Shopify",
  "Spotify",
  "Adobe",
];

/** Hero floating glass cards configuration. */
const heroFloatingCards = [
  {
    id: "web",
    icon: Code2,
    title: "Website Design & Development",
    description: "Modern, high-performance and responsive websites",
    accent: "from-[#00E5FF]/30 to-[#00E5FF]/0",
    ring: "ring-[#00E5FF]/20",
    iconBg: "bg-[#00E5FF]/15 text-[#00E5FF]",
    metric: "+120%",
    metricLabel: "growth",
    position: "left-top",
    delay: 0.2,
  },
  {
    id: "brand",
    icon: Palette,
    title: "Brand Identity & Strategy",
    description: "Unique designs that inspire trust and loyalty",
    accent: "from-[#7B61FF]/30 to-[#7B61FF]/0",
    ring: "ring-[#7B61FF]/20",
    iconBg: "bg-[#7B61FF]/15 text-[#7B61FF]",
    metric: "5★",
    metricLabel: "rated",
    position: "right-top",
    delay: 0.5,
  },
  {
    id: "ai",
    icon: BrainCircuit,
    title: "AI Solutions & Automation",
    description: "Intelligent solutions to automate and scale your business",
    accent: "from-[#2F7BFF]/30 to-[#18F2B2]/0",
    ring: "ring-[#2F7BFF]/20",
    iconBg: "bg-[#2F7BFF]/15 text-[#2F7BFF]",
    metric: "70%",
    metricLabel: "auto-resolve",
    position: "left-bottom",
    delay: 0.8,
  },
  {
    id: "products",
    icon: ShoppingBag,
    title: "Digital Products & Tools",
    description: "Premium tools and resources for modern businesses",
    accent: "from-amber-400/30 to-amber-400/0",
    ring: "ring-amber-400/20",
    iconBg: "bg-amber-400/15 text-amber-300",
    metric: "1.2k",
    metricLabel: "downloads",
    position: "right-bottom",
    delay: 1.1,
  },
] as const;

/** Stats bar configuration. */
const heroStats = [
  { icon: Users, value: 320, suffix: "+", label: "Happy Clients" },
  { icon: Briefcase, value: 850, suffix: "+", label: "Projects Completed" },
  { icon: Award, value: 5, suffix: "+", label: "Years Experience" },
  { icon: Globe, value: 25, suffix: "+", label: "Countries Served" },
] as const;

export function HomeView() {
  return (
    <div className="relative">
      <AnimatedGradientBg />
      <Hero />
      <StatsBar />
      <TrustedBrands />
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
/* HERO — split layout (60 / 40)                                       */
/* ------------------------------------------------------------------ */
function Hero() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 mask-radial" />
      {/* glow accents */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#00E5FF]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-[#7B61FF]/15 blur-[120px]" />

      <CursorSpotlight className="relative">
        <motion.div
          style={{ y, opacity }}
          className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-20 pb-16 sm:px-6 lg:grid-cols-5 lg:gap-8 lg:px-8 lg:pt-28 lg:pb-24"
        >
          {/* LEFT (60%) */}
          <div className="lg:col-span-3">
            {/* Trust badge pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-xl sm:text-sm"
            >
              <span className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400" />
                ))}
              </span>
              <span className="font-semibold text-primary">Premium Digital Agency</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground">{new Date().getFullYear()}</span>
              <span className="mx-1 h-3 w-px bg-white/10" />
              <span className="text-muted-foreground">Trusted by 320+ Brands</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Brands that feel like a{" "}
              <span className="bg-gradient-to-r from-[#00E5FF] via-[#18F2B2] to-[#7B61FF] bg-clip-text text-transparent">
                million dollars.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg lg:text-xl"
            >
              BRANIFY creates stunning websites, brand identities, AI solutions and digital
              products that help businesses stand out, grow faster and achieve more.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <MagneticButton strength={0.4} radius={50}>
                <PremiumCTAButton
                  onClick={() => {
                    track("cta_click", { label: "Start a project", location: "hero" });
                    navigate("contact");
                  }}
                >
                  Start a Project
                </PremiumCTAButton>
              </MagneticButton>
              <MagneticButton strength={0.3} radius={40}>
                <Button
                  onClick={() => navigate("portfolio")}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-white backdrop-blur hover:bg-white/10"
                >
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  View Our Work
                </Button>
              </MagneticButton>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              {["No long-term contracts", "98% client satisfaction", "7-day delivery on Starter"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT (40%) — 3D hero visual with floating cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative lg:col-span-2"
          >
            <HeroVisual />
          </motion.div>
        </motion.div>
      </CursorSpotlight>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HERO VISUAL — browser mockup + 4 floating glass cards + circular progress */
/* ------------------------------------------------------------------ */
function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* outer glow */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#00E5FF]/20 via-[#7B61FF]/10 to-[#18F2B2]/20 blur-3xl" />

      {/* Browser mockup */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mx-auto mt-6 w-[88%] overflow-hidden rounded-2xl border border-white/10 bg-[#0B1022]/80 shadow-premium-lg backdrop-blur-xl"
      >
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-1 text-[10px] text-muted-foreground">
            <Globe className="h-3 w-3" />
            branify.store
          </div>
        </div>

        {/* dashboard body */}
        <div className="relative p-6 text-center">
          {/* animated wave background */}
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="hero-wave-1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#7B61FF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="hero-wave-2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7B61FF" stopOpacity="0" />
                  <stop offset="100%" stopColor="#18F2B2" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,140 C50,120 100,160 150,140 C200,120 250,160 300,140 C350,120 400,140 400,140 L400,200 L0,200 Z"
                fill="url(#hero-wave-1)"
                animate={{ d: [
                  "M0,140 C50,120 100,160 150,140 C200,120 250,160 300,140 C350,120 400,140 400,140 L400,200 L0,200 Z",
                  "M0,150 C50,130 100,150 150,130 C200,110 250,150 300,130 C350,110 400,150 400,150 L400,200 L0,200 Z",
                  "M0,140 C50,120 100,160 150,140 C200,120 250,160 300,140 C350,120 400,140 400,140 L400,200 L0,200 Z",
                ] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M0,160 C50,140 100,180 150,160 C200,140 250,180 300,160 C350,140 400,160 400,160 L400,200 L0,200 Z"
                fill="url(#hero-wave-2)"
                animate={{ d: [
                  "M0,160 C50,140 100,180 150,160 C200,140 250,180 300,160 C350,140 400,160 400,160 L400,200 L0,200 Z",
                  "M0,170 C50,150 100,170 150,150 C200,130 250,170 300,150 C350,130 400,170 400,170 L400,200 L0,200 Z",
                  "M0,160 C50,140 100,180 150,160 C200,140 250,180 300,160 C350,140 400,160 400,160 L400,200 L0,200 Z",
                ] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="relative">
            {/* Mini nav bar on screen */}
            <div className="mb-3 flex items-center justify-center gap-2 text-[7px] text-muted-foreground">
              <span>Home</span><span>·</span>
              <span>Services</span><span>·</span>
              <span>Portfolio</span><span>·</span>
              <span>About</span><span>·</span>
              <span>Contact</span>
            </div>
            <Badge className="mb-3 bg-[#00E5FF]/15 text-[#00E5FF] hover:bg-[#00E5FF]/20">
              <Sparkles className="mr-1 h-3 w-3" /> BRANIFY
            </Badge>
            <p className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              Build. <span className="text-[#00E5FF]">Brand.</span>{" "}
              <span className="bg-gradient-to-r from-[#2F7BFF] to-[#7B61FF] bg-clip-text text-transparent">
                Grow.
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              We create digital experiences that deliver real results
            </p>
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00FFD1] px-3 py-1 text-[9px] font-bold text-[#04121a]">
              Get Started
            </div>
          </div>
        </div>
      </motion.div>

      {/* Circular progress — 98% Success Rate */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute -top-2 right-0 z-20 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl sm:h-24 sm:w-24"
        style={{ boxShadow: "0 0 40px -10px rgba(0,229,255,0.4)" }}
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#hero-progress)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * 0.02 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="hero-progress" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#18F2B2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="relative text-center">
            <p className="font-display text-lg font-bold text-white sm:text-xl">98%</p>
            <p className="text-[8px] uppercase tracking-wide text-muted-foreground sm:text-[9px]">Success</p>
          </div>
        </div>
      </motion.div>

      {/* Floating glass cards — 4 around the mockup */}
      {heroFloatingCards.map((c) => (
        <FloatingCard key={c.id} card={c} />
      ))}
    </div>
  );
}

function FloatingCard({
  card,
}: {
  card: (typeof heroFloatingCards)[number];
}) {
  const positions: Record<string, string> = {
    "left-top": "left-[-8%] top-[18%]",
    "right-top": "right-[-8%] top-[28%]",
    "left-bottom": "left-[-4%] bottom-[14%]",
    "right-bottom": "right-[-4%] bottom-[8%]",
  };
  const Icon = card.icon;
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5 + card.delay, repeat: Infinity, ease: "easeInOut", delay: card.delay }}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`absolute z-30 hidden w-[44%] max-w-[200px] rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl ring-1 ${card.ring} ${positions[card.position]} sm:block`}
      style={{ boxShadow: "0 12px 40px -10px rgba(0,0,0,0.5)" }}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.accent} opacity-60`} />
      <div className="relative flex items-start gap-2.5">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold leading-tight text-white sm:text-xs">
            {card.title}
          </p>
          <p className="mt-0.5 text-[8px] leading-tight text-muted-foreground sm:text-[9px]">
            {card.description}
          </p>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="font-display text-base font-bold text-white sm:text-lg">
              {card.metric}
            </span>
            <span className="text-[9px] text-muted-foreground sm:text-[10px]">
              {card.metricLabel}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* STATS BAR — dark rounded card with 5 columns                        */
/* ------------------------------------------------------------------ */
function StatsBar() {
  const { ref, inView } = useInViewOnce();
  return (
    <section className="relative -mt-4 pb-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div
            ref={ref}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B1022]/80 shadow-premium-lg backdrop-blur-xl"
          >
            {/* subtle glow */}
            <div className="pointer-events-none absolute -top-1/2 left-1/2 h-full w-2/3 -translate-x-1/2 rounded-full bg-[#00E5FF]/10 blur-[80px]" />
            <div className="relative grid grid-cols-2 divide-white/5 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
              {heroStats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2 p-5 text-center lg:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                    <CountUpNumber target={s.value} start={inView} />
                    <span className="text-primary">{s.suffix}</span>
                  </p>
                  <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
                </div>
              ))}
              {/* 5th column — rating with stars */}
              <div className="col-span-2 flex flex-col items-center gap-2 p-5 text-center sm:col-span-1 lg:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                  <Star className="h-5 w-5 fill-amber-400" />
                </div>
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                  4.9<span className="text-base text-muted-foreground">/5</span>
                </p>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CountUpNumber({ target, start }: { target: number; start: boolean }) {
  const value = useCountUp(target, 2, start);
  return <>{value}</>;
}

/* ------------------------------------------------------------------ */
/* TRUSTED BRANDS — monochrome marquee with extra brands               */
/* ------------------------------------------------------------------ */
function TrustedBrands() {
  const list = [...heroBrands, ...heroBrands];
  return (
    <section className="relative border-y border-white/5 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
          Trusted by amazing brands worldwide
        </p>
        <div
          className="relative mt-8 overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex w-max animate-marquee items-center gap-12">
            {list.map((brand, i) => (
              <div
                key={`${brand}-${i}`}
                className="flex items-center gap-2 text-xl font-display font-bold text-white/40 transition-colors hover:text-white sm:text-2xl"
              >
                <div className="h-6 w-6 rounded-md bg-white/10" />
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
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-sm text-muted-foreground">From <span className="font-semibold text-white">{currency.symbol}{convert(s.startingPrice).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span></span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                      View Details <ArrowRight className="h-3.5 w-3.5" />
                    </span>
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
                  <div className="mt-3 border-t border-white/5 pt-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-all group-hover:gap-2">
                      View Details <ArrowRight className="h-3 w-3" />
                    </span>
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
                    <div className="mt-4 border-t border-white/5 pt-3">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </span>
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
                <PremiumCTAButton onClick={() => navigate("contact")}>
                  Book a free call
                </PremiumCTAButton>
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
