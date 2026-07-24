"use client";

import { cn } from "@/lib/utils";

/**
 * GlassBadge — a frosted, low-opacity, backdrop-blurred badge for precise
 * UI tags (over images or on cards). Uses the `.glass-badge` utility.
 */
export function GlassBadge({
  children,
  className,
  variant = "teal",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "teal" | "neutral" | "emerald" | "amber" | "rose" | "violet";
}) {
  const variants: Record<string, string> = {
    teal: "bg-[#0fe1d2]/10 text-[#0fe1d2] border-[#0fe1d2]/20",
    neutral: "bg-white/10 text-white border-white/15",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-400/20",
    rose: "bg-rose-500/10 text-rose-300 border-rose-400/20",
    violet: "bg-violet-500/10 text-violet-300 border-violet-400/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide backdrop-blur",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
