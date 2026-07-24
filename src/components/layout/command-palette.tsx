"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CornerDownLeft, ArrowUp, ArrowDown, Home, Code2, Package,
  Wrench, Briefcase, CreditCard, BookOpen, Info, Mail, FileText,
  ShieldCheck, RotateCcw, HelpCircle, Search as SearchIcon, type LucideIcon,
} from "lucide-react";
import { useRouterStore, type RouteName } from "@/lib/router";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { tools } from "@/data/tools";
import { blogPosts } from "@/data/blog";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: LucideIcon;
  keywords?: string;
  action: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useRouterStore((s) => s.navigate);

  const go = useCallback(
    (route: RouteName, opts?: { slug?: string; query?: string }) => {
      navigate(route, opts);
      setOpen(false);
      setQuery("");
      setActive(0);
    },
    [navigate],
  );

  // Global Cmd/Ctrl+K to toggle, Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  // Build the command list
  const commands = useMemo<CommandItem[]>(() => {
    const nav: CommandItem[] = [
      { id: "nav-home", label: "Home", hint: "Homepage", group: "Navigation", icon: Home, action: () => go("home") },
      { id: "nav-services", label: "Services", hint: "What we do", group: "Navigation", icon: Code2, action: () => go("services") },
      { id: "nav-products", label: "Digital Products", hint: "Templates & kits", group: "Navigation", icon: Package, action: () => go("products") },
      { id: "nav-tools", label: "Free Tools", hint: "Generators", group: "Navigation", icon: Wrench, action: () => go("tools") },
      { id: "nav-portfolio", label: "Portfolio", hint: "Case studies", group: "Navigation", icon: Briefcase, action: () => go("portfolio") },
      { id: "nav-pricing", label: "Pricing", hint: "Plans & comparison", group: "Navigation", icon: CreditCard, action: () => go("pricing") },
      { id: "nav-blog", label: "Blog", hint: "Insights", group: "Navigation", icon: BookOpen, action: () => go("blog") },
      { id: "nav-about", label: "About", hint: "Our story", group: "Navigation", icon: Info, action: () => go("about") },
      { id: "nav-contact", label: "Contact", hint: "Start a project", group: "Navigation", icon: Mail, action: () => go("contact") },
      { id: "nav-faq", label: "FAQ", hint: "Questions", group: "Navigation", icon: HelpCircle, action: () => go("faq") },
      { id: "nav-search", label: "Search", hint: "Universal search", group: "Navigation", icon: SearchIcon, action: () => go("search") },
    ];

    const svc: CommandItem[] = services.slice(0, 6).map((s) => ({
      id: `svc-${s.slug}`,
      label: s.title,
      hint: `From $${s.startingPrice}`,
      group: "Services",
      icon: s.icon,
      keywords: s.tagline,
      action: () => go("services"),
    }));

    const prod: CommandItem[] = products.slice(0, 6).map((p) => ({
      id: `prod-${p.slug}`,
      label: p.name,
      hint: `$${p.price}`,
      group: "Products",
      icon: p.icon,
      keywords: p.tagline,
      action: () => go("product-detail", { slug: p.slug }),
    }));

    const tool: CommandItem[] = tools.slice(0, 6).map((t) => ({
      id: `tool-${t.slug}`,
      label: t.name,
      hint: "Free",
      group: "Free Tools",
      icon: t.icon,
      keywords: t.description,
      action: () => go("tools"),
    }));

    const blog: CommandItem[] = blogPosts.slice(0, 6).map((b) => ({
      id: `blog-${b.slug}`,
      label: b.title,
      hint: `${b.readingTime} min read`,
      group: "Blog",
      icon: BookOpen,
      keywords: b.excerpt,
      action: () => go("blog-post", { slug: b.slug }),
    }));

    const proj: CommandItem[] = projects.slice(0, 6).map((p) => ({
      id: `proj-${p.slug}`,
      label: p.title,
      hint: p.category,
      group: "Portfolio",
      icon: Briefcase,
      keywords: p.summary,
      action: () => go("portfolio"),
    }));

    const legal: CommandItem[] = [
      { id: "legal-privacy", label: "Privacy Policy", group: "Legal", icon: ShieldCheck, action: () => go("privacy") },
      { id: "legal-terms", label: "Terms of Service", group: "Legal", icon: FileText, action: () => go("terms") },
      { id: "legal-refund", label: "Refund Policy", group: "Legal", icon: RotateCcw, action: () => go("refund") },
    ];

    return [...nav, ...svc, ...prod, ...tool, ...blog, ...proj, ...legal];
  }, [go]);

  // Filter by query
  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) =>
      c.label.toLowerCase().includes(q) ||
      c.group.toLowerCase().includes(q) ||
      (c.hint?.toLowerCase().includes(q)) ||
      (c.keywords?.toLowerCase().includes(q)),
    );
  }, [query, commands]);

  // Reset active when filtered list changes
  useEffect(() => setActive(0), [query]);

  // Group the filtered items
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((c) => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Flat index for keyboard nav
  const flatIndex = grouped.flatMap(([, items]) => items);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flatIndex.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flatIndex[active]?.action();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let runningIdx = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh] sm:pt-[15vh]"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-card/95 shadow-premium-lg backdrop-blur-2xl"
            role="dialog"
            aria-label="Command palette"
          >
            {/* search input */}
            <div className="flex items-center gap-3 border-b border-white/5 px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search or jump to…"
                className="h-14 flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
                ESC
              </kbd>
            </div>

            {/* results */}
            <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
              {flatIndex.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Search className="mx-auto h-6 w-6 text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                grouped.map(([group, items]) => (
                  <div key={group} className="mb-1">
                    <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {group}
                    </p>
                    {items.map((item) => {
                      runningIdx++;
                      const idx = runningIdx;
                      const isActive = idx === active;
                      return (
                        <button
                          key={item.id}
                          data-idx={idx}
                          onMouseEnter={() => setActive(idx)}
                          onClick={item.action}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                            isActive ? "bg-primary/15 text-white" : "text-muted-foreground hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                          <span className="flex-1 truncate text-sm font-medium">{item.label}</span>
                          {item.hint && (
                            <span className="shrink-0 text-xs text-muted-foreground/70">{item.hint}</span>
                          )}
                          {isActive && (
                            <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5"><ArrowUp className="inline h-2.5 w-2.5" /></kbd>
                  <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5"><ArrowDown className="inline h-2.5 w-2.5" /></kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↵</kbd>
                  to select
                </span>
              </div>
              <span className="font-medium text-primary">BRANIFY</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
