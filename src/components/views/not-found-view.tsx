"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Compass,
  ArrowRight,
  Search as SearchIcon,
  Code2,
  Mail,
  Sparkles,
  Unlink,
  Package,
  Wrench,
  Briefcase,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@/lib/router";
import { siteConfig } from "@/config/site";
import {
  AuroraBackground,
  GradientCover,
} from "@/components/shared/gradient-cover";
import { GradientTextTeal } from "@/components/shared/reveal";

const popularPages: { label: string; icon: LucideIcon; route: Parameters<ReturnType<typeof useNavigate>>[0]; hint: string }[] = [
  { label: "Services", icon: Code2, route: "services", hint: "12 premium offerings" },
  { label: "Digital Products", icon: Package, route: "products", hint: "Templates & kits" },
  { label: "Free Tools", icon: Wrench, route: "tools", hint: "10 generators" },
  { label: "Portfolio", icon: Briefcase, route: "portfolio", hint: "Case studies" },
  { label: "Blog", icon: BookOpen, route: "blog", hint: "Insights & guides" },
  { label: "Contact", icon: Mail, route: "contact", hint: "Start a project" },
];

export function NotFoundView() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("search", searchValue.trim() ? { query: searchValue.trim() } : undefined);
  };

  return (
    <div className="relative flex min-h-[88vh] items-center justify-center overflow-hidden">
      <AuroraBackground />
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Floating decorative orbs */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute left-[10%] top-[20%] hidden h-24 w-24 rounded-full border border-white/5 bg-card/40 backdrop-blur md:block"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="pointer-events-none absolute right-[12%] top-[28%] hidden h-16 w-16 rounded-2xl border border-white/5 bg-card/40 backdrop-blur md:block"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="pointer-events-none absolute bottom-[18%] left-[18%] hidden h-10 w-10 rounded-full border border-primary/20 bg-primary/10 backdrop-blur md:block"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary"
          >
            <Compass className="mr-1 h-3 w-3" /> You&apos;ve wandered off the map
          </Badge>
        </motion.div>

        {/* Big 404 */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-6 font-display text-[8rem] font-bold leading-none tracking-tighter sm:text-[12rem]"
        >
          <GradientTextTeal>404</GradientTextTeal>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Unlink className="h-4 w-4 text-primary" />
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Page not <GradientTextTeal>found</GradientTextTeal>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mx-auto mt-4 max-w-xl text-base text-muted-foreground leading-relaxed"
        >
          The link may be broken, the page may have been renamed, or you may
          have followed an old bookmark. Search for what you need or jump to a
          popular page below.
        </motion.p>

        {/* Search input */}
        <motion.form
          onSubmit={submitSearch}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mx-auto mt-8 flex max-w-md items-center gap-2"
        >
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search BRANIFY…"
              className="h-12 rounded-full border-white/10 bg-card/50 pl-10 text-white placeholder:text-muted-foreground/70 backdrop-blur focus-visible:border-primary/40"
              aria-label="Search BRANIFY"
            />
          </div>
          <Button type="submit" size="icon" className="h-12 w-12 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-hover" aria-label="Search">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.form>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            onClick={() => navigate("home")}
            className="bg-primary text-primary-foreground hover:bg-hover"
          >
            <Home className="mr-1.5 h-4 w-4" /> Back home
          </Button>
          <Button
            onClick={() => navigate("services")}
            variant="outline"
            className="border-white/10 hover:border-primary/30 hover:bg-white/5"
          >
            Browse services <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Popular pages grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.46 }}
          className="mt-12"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Popular pages
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularPages.map((p) => (
              <button
                key={p.route}
                onClick={() => navigate(p.route)}
                className="card-premium group flex items-center gap-3 rounded-2xl border border-white/5 bg-card/40 p-4 text-left backdrop-blur hover:border-primary/30 hover:bg-card/60"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
                  <p.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-primary">
                    {p.label}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.hint}
                  </p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Need help card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.54 }}
          className="mt-8"
        >
          <GradientCover
            variant="gradient-teal"
            pattern="grid"
            className="overflow-hidden rounded-2xl border border-white/10 p-6"
          >
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-display text-base font-semibold text-white">
                  Still can&apos;t find what you need?
                </p>
                <p className="mt-0.5 text-sm text-white/80">
                  Send us a note and we&apos;ll point you in the right direction
                  within 24 hours.
                </p>
              </div>
              <Button
                asChild
                variant="secondary"
                className="bg-white text-slate-900 hover:bg-white/90"
              >
                <a href={`mailto:${siteConfig.email}`}>
                  <Mail className="mr-1.5 h-4 w-4" /> Email us
                </a>
              </Button>
            </div>
          </GradientCover>
        </motion.div>
      </div>
    </div>
  );
}
