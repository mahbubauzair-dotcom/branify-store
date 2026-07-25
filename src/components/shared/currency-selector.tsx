"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

/**
 * CurrencySelector — a pill-shaped dropdown that lets the user switch
 * the active currency. Auto-detects the user's region on first visit
 * (via timezone) and remembers the choice in localStorage.
 *
 *   <CurrencySelector />
 */
export function CurrencySelector({ className }: { className?: string }) {
  const { currency, setCurrency, currencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-white/20 hover:bg-white/10"
        aria-label="Select currency"
      >
        <span className="text-base leading-none">{currency.flag}</span>
        <span className="font-semibold">{currency.code}</span>
        <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#0B1022]/95 p-1.5 shadow-premium-lg backdrop-blur-2xl"
          >
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Select Currency
            </p>
            <div className="max-h-72 overflow-y-auto">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    c.code === currency.code
                      ? "bg-primary/10 text-white"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span className="text-lg leading-none">{c.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium">{c.code}</p>
                    <p className="text-[11px] text-muted-foreground/70">{c.name}</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{c.symbol}</span>
                  {c.code === currency.code && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
            <div className="mt-1 border-t border-white/5 px-3 py-2">
              <p className="text-[10px] text-muted-foreground/60">
                Auto-detected from your region. Prices update instantly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
