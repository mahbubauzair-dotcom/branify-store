"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Search, ChevronRight } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navItems, siteConfig } from "@/config/site";
import { useRouterStore, useNavigate, type RouteName } from "@/lib/router";
import { services } from "@/data/services";
import { products, productCategories } from "@/data/products";
import { tools } from "@/data/tools";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const route = useRouterStore((s) => s.route);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (r: RouteName) => {
    navigate(r);
    setMobileOpen(false);
    setActiveMega(null);
  };

  const go = (r: RouteName) => {
    navigate(r);
    setActiveMega(null);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button onClick={() => go("home")} className="shrink-0 transition-opacity hover:opacity-90">
          <Logo />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setActiveMega(null)}>
          {navItems.map((item) => {
            const active =
              route === item.route ||
              (item.route === "products" && (route === "product-detail")) ||
              (item.route === "blog" && route === "blog-post") ||
              (item.route === "tools" && route === "tool-detail");
            return (
              <div
                key={item.route}
                className="relative"
                onMouseEnter={() => setActiveMega(item.mega ? item.route : null)}
              >
                <button
                  onClick={() => handleNav(item.route)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-muted-foreground hover:text-white",
                  )}
                >
                  {item.label}
                  {item.mega && (
                    <ChevronRight className="h-3.5 w-3.5 rotate-90 opacity-50" />
                  )}
                </button>
                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-px left-3 right-3 h-px bg-primary"
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => go("search")}
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white sm:flex"
          >
            <Search className="h-4 w-4" />
          </button>
          <Button
            onClick={() => go("contact")}
            variant="ghost"
            className="hidden text-sm text-muted-foreground hover:text-white md:inline-flex"
          >
            Sign in
          </Button>
          <Button
            onClick={() => go("contact")}
            size="sm"
            className="hidden bg-primary text-primary-foreground hover:bg-hover sm:inline-flex"
          >
            Start a project
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/5 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mega menu */}
      <AnimatePresence>
        {activeMega && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full hidden lg:block"
            onMouseEnter={() => setActiveMega(activeMega)}
            onMouseLeave={() => setActiveMega(null)}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/95 shadow-premium-lg backdrop-blur-xl">
                {activeMega === "services" && <MegaServices onGo={go} />}
                {activeMega === "products" && <MegaProducts onGo={go} />}
                {activeMega === "tools" && <MegaTools onGo={go} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="max-h-[80vh] overflow-y-auto px-4 py-4">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.route}
                    onClick={() => handleNav(item.route)}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 opacity-40" />
                  </button>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
                <Button onClick={() => handleNav("search")} variant="outline" className="justify-start">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
                <Button onClick={() => handleNav("contact")} className="bg-primary text-primary-foreground hover:bg-hover">
                  Start a project <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground/60">
                {siteConfig.email} · {siteConfig.phone}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MegaServices({ onGo }: { onGo: (r: RouteName) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      <div className="col-span-1 rounded-xl bg-gradient-to-br from-primary/15 to-transparent p-5">
        <p className="font-display text-lg font-semibold text-white">What we do</p>
        <p className="mt-2 text-sm text-muted-foreground">
          End-to-end design, development &amp; growth services for ambitious brands.
        </p>
        <button
          onClick={() => onGo("services")}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
        >
          View all services <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-1">
        {services.slice(0, 8).map((s) => (
          <button
            key={s.slug}
            onClick={() => onGo("services")}
            className="group flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{s.title}</p>
              <p className="truncate text-xs text-muted-foreground">{s.tagline}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MegaProducts({ onGo }: { onGo: (r: RouteName) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      <div className="col-span-1 rounded-xl bg-gradient-to-br from-primary/15 to-transparent p-5">
        <p className="font-display text-lg font-semibold text-white">Ready-to-use assets</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Templates, kits &amp; bundles to launch faster. Instant download.
        </p>
        <button
          onClick={() => onGo("products")}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
        >
          Browse marketplace <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="col-span-2">
        <div className="mb-2 flex flex-wrap gap-1.5 px-3">
          {productCategories.slice(1).map((c) => (
            <span key={c} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted-foreground">
              {c}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {products.slice(0, 6).map((p) => (
            <button
              key={p.slug}
              onClick={() => onGo("products")}
              className="group flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <p.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white group-hover:text-primary transition-colors">{p.name}</p>
                <p className="text-xs text-muted-foreground">${p.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MegaTools({ onGo }: { onGo: (r: RouteName) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      <div className="col-span-1 rounded-xl bg-gradient-to-br from-primary/15 to-transparent p-5">
        <p className="font-display text-lg font-semibold text-white">Free forever</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Generators &amp; calculators for modern teams. No signup required.
        </p>
        <button
          onClick={() => onGo("tools")}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
        >
          Open all tools <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-1">
        {tools.slice(0, 8).map((t) => (
          <button
            key={t.slug}
            onClick={() => onGo("tools")}
            className="group flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <t.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white group-hover:text-primary transition-colors">{t.name}</p>
              <p className="truncate text-xs text-muted-foreground">{t.category}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
