"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useRouterStore, useNavigate, type RouteName } from "@/lib/router";
import { track } from "@/lib/analytics";

type NavLink = { label: string; route: RouteName };

const NAV_LINKS: NavLink[] = [
  { label: "Home", route: "home" },
  { label: "Shop", route: "storefront" },
  { label: "Categories", route: "products" },
  { label: "About", route: "about" },
  { label: "Contact", route: "contact" },
];

const ICON_BTN_CLASS =
  "relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/80 backdrop-blur-xl transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const route = useRouterStore((s) => s.route);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (r: RouteName) => {
    navigate(r);
    setMobileOpen(false);
  };

  const isActive = (r: RouteName) =>
    route === r ||
    (r === "storefront" && route === "product-detail") ||
    (r === "products" && route === "product-detail");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.08] bg-[#050816]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => go("home")}
          aria-label="BRANIFY home"
          className="shrink-0 transition-opacity hover:opacity-90"
        >
          <Logo size="sm" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.route);
            return (
              <button
                key={link.route}
                onClick={() => go(link.route)}
                className={cn(
                  "relative flex items-center rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-white"
                    : "text-white/60 hover:text-white",
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-px left-3 right-3 h-px bg-gradient-to-r from-[#00E5FF] to-[#18F2B2]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search trigger (desktop) */}
          <button
            onClick={() => go("search")}
            aria-label="Search"
            className="group hidden h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white/60 backdrop-blur-xl transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white md:flex"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/50 lg:inline">
              ⌘K
            </kbd>
          </button>

          {/* Search icon (mobile) */}
          <button
            onClick={() => go("search")}
            aria-label="Search"
            className={cn(ICON_BTN_CLASS, "md:hidden")}
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Cart */}
          <button
            onClick={() => {
              track("nav_icon_click", { icon: "cart" });
              go("storefront");
            }}
            aria-label="Cart"
            className={cn(ICON_BTN_CLASS, "hidden sm:inline-flex")}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] px-1 text-[10px] font-bold text-[#04121a]">
              0
            </span>
          </button>

          {/* Wishlist */}
          <IconButton
            icon={Heart}
            label="Wishlist"
            onClick={() => {
              track("nav_icon_click", { icon: "wishlist" });
              go("products");
            }}
          />

          {/* Login */}
          <IconButton
            icon={User}
            label="Login"
            onClick={() => {
              track("nav_icon_click", { icon: "login" });
              go("contact");
            }}
          />

          {/* CTA — Start Shopping */}
          <Button
            onClick={() => {
              track("cta_click", { label: "Start Shopping", location: "navbar" });
              go("storefront");
            }}
            className="hidden h-10 gap-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] px-5 text-sm font-semibold text-[#04121a] shadow-[0_8px_30px_-8px_rgba(0,229,255,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(0,229,255,0.65)] sm:inline-flex"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className={cn(ICON_BTN_CLASS, "lg:hidden")}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile sheet menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="w-[88vw] max-w-sm border-l border-white/[0.08] bg-[#050816]/95 p-0 backdrop-blur-xl"
        >
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b border-white/[0.08] px-5 py-4">
            <SheetTitle className="font-display text-base font-bold tracking-tight text-white">
              Menu
            </SheetTitle>
            <SheetClose asChild>
              <button
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </SheetHeader>

          <div className="flex flex-col gap-1 px-3 py-4">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.route);
              return (
                <button
                  key={link.route}
                  onClick={() => go(link.route)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-base font-medium transition-all",
                    active
                      ? "border border-[#00E5FF]/20 bg-[#00E5FF]/[0.06] text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </button>
              );
            })}
          </div>

          <div className="mt-auto flex flex-col gap-2 border-t border-white/[0.08] px-5 py-5">
            <div className="grid grid-cols-3 gap-2">
              <MobileIconTile icon={Search} label="Search" onClick={() => go("search")} />
              <MobileIconTile icon={Heart} label="Wishlist" onClick={() => go("products")} />
              <MobileIconTile icon={User} label="Login" onClick={() => go("contact")} />
            </div>
            <Button
              onClick={() => {
                track("cta_click", { label: "Start Shopping", location: "navbar_mobile" });
                go("storefront");
              }}
              className="mt-2 h-11 gap-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-sm font-semibold text-[#04121a] shadow-[0_8px_30px_-8px_rgba(0,229,255,0.5)]"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */
function IconButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(ICON_BTN_CLASS, "hidden sm:inline-flex")}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function MobileIconTile({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3.5 text-white/80 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
