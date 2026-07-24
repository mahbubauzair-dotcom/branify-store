"use client";

import { cn } from "@/lib/utils";

/**
 * SectionDivider — a subtle decorative separator between sections to create
 * visual hierarchy on long pages. Renders a thin gradient line with a soft
 * glow. Use between major sections where the background tone is identical.
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto h-px max-w-7xl", className)} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
}

/**
 * SectionGlow — a soft radial glow positioned within a section to add depth
 * and visual interest to "flat" dark sections. Pointer-events disabled.
 */
export function SectionGlow({
  side = "top",
  color = "rgba(20, 184, 166, 0.08)",
  size = 500,
  className,
}: {
  side?: "top" | "bottom" | "left" | "right" | "center";
  color?: string;
  size?: number;
  className?: string;
}) {
  const pos: Record<string, string> = {
    top: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
    bottom: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2",
    left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
    right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
    center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  };
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-[100px]", pos[side], className)}
      style={{ width: size, height: size, background: color }}
    />
  );
}
