"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, ChevronRight, Keyboard, Heart, User, ShoppingCart,
  ArrowRight, Store, ShoppingBag, MessageCircle, Rocket,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { navItems, siteConfig } from "@/config/site";
import { useRouterStore, useNavigate, type RouteName } from "@/lib/router";
import { track } from "@/lib/analytics";
import { CurrencySelector } from "@/components/shared/currency-selector";
import { services } from "@/data/services";
import { products, productCategories } from "@/data/products";
import { tools } from "@/data/tools";
import { toast } from "sonner";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const route = useRouterStore((s) => s.route);
  const navigate = useNavigate();

  const go = (r: RouteName) => {
    navigate(r);
    setMobileOpen(false);
    setActiveMega(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("search", { query: searchQuery.trim() });
      setSearchQuery("");
    }
  };

  const cartCount = 0;
  const wishlistCount = 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-[#050816]/90 backdrop-blur-xl border-b border-white/[0.08]"
          : "bg-[#050816]/60 backdrop-blur-md border-b border-white/[0.05]",
      )}
    >
      {/* ===== TOP ROW: logo | search | currency | signin | wishlist | cart | whatsapp | book ===== */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button onClick={() => go("home")} className="shrink-0 transition-opacity hover:opacity-90">
          <Logo size="sm" />
        </button>

        {/* Search bar (desktop) */}
        <form onSubmit={handleSearch} className="hidden flex-1 md:block">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, categories, tools..."
              className="h-10 rounded-full border-white/10 bg-white/5 pl-10 pr-16 text-sm placeholder:text-muted-foreground/60"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Currency selector */}
          <CurrencySelector />

          {/* Sign in / Register */}
          <button
            onClick={() => go("contact")}
            aria-label="Sign in"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white sm:hidden"
          >
            <User className="h-4 w-4" />
          </button>
          <Button
            onClick={() => go("contact")}
            variant="ghost"
            className="hidden h-9 px-3 text-sm text-muted-foreground hover:text-white sm:inline-flex"
          >
            <User className="mr-1.5 h-4 w-4" />
            Sign in
          </Button>

          {/* Wishlist */}
          <button
            onClick={() => { track("wishlist_click"); toast.info("Wishlist coming soon!"); }}
            aria-label="Wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#7B61FF] text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => { track("cart_click"); toast.info("Cart coming soon!"); }}
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00FFD1] text-[9px] font-bold text-[#04121a] ring-2 ring-[#050816]">
              {cartCount}
            </span>
          </button>

          {/* WhatsApp button */}
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="hidden h-9 items-center gap-1.5 rounded-lg bg-[#25D366] px-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1ebe5d] hover:shadow-md sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          {/* Book a Free Consultation — premium CTA */}
          <button
            onClick={() => go("contact")}
            className="group relative hidden h-9 items-center justify-center overflow-hidden rounded-full border-2 border-white/85 px-4 transition-all duration-350 hover:-translate-y-[2px] active:scale-[0.98] lg:inline-flex"
            style={{ boxShadow: "0 8px 25px rgba(0,229,255,0.3), 0 0 15px rgba(47,123,255,0.25)" }}
          >
            <span className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg, #00E5FF 0%, #2F7BFF 55%, #7B61FF 100%)" }} />
            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-350 group-hover:opacity-100" style={{ background: "linear-gradient(90deg, #11F7FF 0%, #4287FF 55%, #9062FF 100%)" }} />
            <span className="absolute inset-0 rounded-full" style={{ backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 60%)" }} />
            <span className="relative z-10 flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-white">
              <Rocket className="h-3.5 w-3.5" />
              Book a Free Consultation
            </span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/5 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ===== BOTTOM ROW: all categories / nav links with mega menu ===== */}
      <nav
        className="hidden border-t border-white/[0.05] lg:block"
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
          {navItems.map((item) => {
            const active =
              route === item.route ||
              (item.route === "products" && route === "product-detail") ||
              (item.route === "blog" && route === "blog-post") ||
              (item.route === "storefront" && route === "storefront");
            const hasMega = item.mega;
            return (
              <div
                key={item.route}
                className="relative"
                onMouseEnter={() => setActiveMega(hasMega ? item.route : null)}
              >
                <button
                  onClick={() => go(item.route)}
                  className={cn(
                    "relative flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-muted-foreground hover:text-white",
                  )}
                >
                  {item.label}
                  {hasMega && <ChevronRight className="h-3 w-3 rotate-90 opacity-40" />}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00FFD1]"
                    />
                  )}
                </button>
              </div>
            );
          })}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => go("storefront")}
              className="group flex items-center gap-1.5 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1.5 text-sm font-semibold text-primary transition-all hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/20 hover:text-accent"
            >
              <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" />
              Shop All
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event("branify:open-shortcuts"))}
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              <Keyboard className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mega menu dropdown */}
        <AnimatePresence>
          {activeMega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full z-50"
              onMouseEnter={() => setActiveMega(activeMega)}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111B35]/95 shadow-premium-lg backdrop-blur-2xl">
                  {activeMega === "services" && <MegaServices onGo={go} />}
                  {activeMega === "products" && <MegaProducts onGo={go} />}
                  {activeMega === "tools" && <MegaTools onGo={go} />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile search (below top row on mobile) */}
      <div className="border-t border-white/[0.05] px-4 py-2 md:hidden">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="h-9 rounded-full border-white/10 bg-white/5 pl-10 pr-4 text-sm"
            />
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5 bg-[#050816]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.route}
                    onClick={() => go(item.route)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 opacity-40" />
                  </button>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
                <Button onClick={() => go("storefront")} className="bg-gradient-to-r from-[#00E5FF] to-[#00FFD1] text-[#04121a]">
                  <Store className="mr-1.5 h-4 w-4" /> Shop All Products
                </Button>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#25D366] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5d]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <Button onClick={() => go("contact")} className="bg-gradient-to-r from-[#00E5FF] to-[#00FFD1] text-[#04121a]">
                  <Rocket className="mr-1.5 h-4 w-4" /> Book a Free Consultation
                </Button>
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Currency</span>
                  <CurrencySelector />
                </div>
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

/* ------------------------------------------------------------------ */
/* MEGA MENU COMPONENTS                                                */
/* ------------------------------------------------------------------ */
function MegaServices({ onGo }: { onGo: (r: RouteName) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      <div className="col-span-1 rounded-xl bg-gradient-to-br from-primary/15 to-transparent p-5">
        <p className="font-display text-lg font-semibold text-white">What we do</p>
        <p className="mt-2 text-sm text-muted-foreground">End-to-end design, development &amp; growth services.</p>
        <button onClick={() => onGo("services")} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          View all services <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-1">
        {services.slice(0, 8).map((s) => (
          <button key={s.slug} onClick={() => onGo("services")} className="group flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5">
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
        <p className="mt-2 text-sm text-muted-foreground">Templates, kits &amp; bundles to launch faster.</p>
        <button onClick={() => onGo("products")} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          Browse marketplace <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="col-span-2">
        <div className="mb-2 flex flex-wrap gap-1.5 px-3">
          {productCategories.slice(1).map((c) => (
            <span key={c} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted-foreground">{c}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {products.slice(0, 6).map((p) => (
            <button key={p.slug} onClick={() => onGo("product-detail")} className="group flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5">
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
        <p className="mt-2 text-sm text-muted-foreground">Generators &amp; calculators for modern teams.</p>
        <button onClick={() => onGo("tools")} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
          Open all tools <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-1">
        {tools.slice(0, 8).map((t) => (
          <button key={t.slug} onClick={() => onGo("tools")} className="group flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/5">
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
