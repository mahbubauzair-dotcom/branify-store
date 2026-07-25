"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, ChevronRight, Keyboard, Heart, User, ShoppingCart,
  ArrowRight, Store,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { navItems, siteConfig } from "@/config/site";
import { useRouterStore, useNavigate, type RouteName } from "@/lib/router";
import { track } from "@/lib/analytics";
import { CurrencySelector } from "@/components/shared/currency-selector";
import { toast } from "sonner";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  };

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
      {/* ===== TOP ROW: logo | search | currency | signin | wishlist | cart ===== */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button onClick={() => handleNav("home")} className="shrink-0 transition-opacity hover:opacity-90">
          <Logo size="sm" />
        </button>

        {/* Search bar (desktop) */}
        <form onSubmit={handleSearch} className="hidden flex-1 md:block">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, categories…"
              className="h-10 rounded-full border-white/10 bg-white/5 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Currency selector */}
          <CurrencySelector />

          {/* Sign in / Register */}
          <button
            onClick={() => handleNav("contact")}
            aria-label="Sign in"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white sm:hidden"
          >
            <User className="h-4 w-4" />
          </button>
          <Button
            onClick={() => handleNav("contact")}
            variant="ghost"
            className="hidden text-sm text-muted-foreground hover:text-white sm:inline-flex"
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
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[9px] font-bold text-[#04121a]">
                {cartCount}
              </span>
            )}
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

      {/* ===== BOTTOM ROW: all categories / nav links ===== */}
      <nav className="hidden border-t border-white/[0.05] lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
          {navItems.map((item) => {
            const active =
              route === item.route ||
              (item.route === "products" && route === "product-detail") ||
              (item.route === "blog" && route === "blog-post") ||
              (item.route === "storefront" && route === "storefront");
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={cn(
                  "relative flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "text-white" : "text-muted-foreground hover:text-white",
                )}
              >
                {item.label}
                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#18F2B2]"
                  />
                )}
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => handleNav("storefront")}
              className="flex items-center gap-1.5 py-2.5 text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              <Store className="h-4 w-4" />
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
                    onClick={() => handleNav(item.route)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 opacity-40" />
                  </button>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
                <Button onClick={() => handleNav("storefront")} className="bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a]">
                  <Store className="mr-1.5 h-4 w-4" /> Shop All Products
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
