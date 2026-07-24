"use client";

import { cn } from "@/lib/utils";

/**
 * Price — premium price typography with tabular-nums, a smaller currency
 * symbol aligned to the top, and an optional strikethrough original price.
 *
 *   <Price value={29} />
 *   <Price value={29} original={79} suffix="/mo" />
 */
export function Price({
  value,
  original,
  suffix,
  className,
  size = "md",
}: {
  value: number;
  original?: number;
  suffix?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: { num: "text-lg", sym: "text-[0.7em]", suffix: "text-[0.6em]" },
    md: { num: "text-2xl", sym: "text-[0.65em]", suffix: "text-[0.55em]" },
    lg: { num: "text-4xl", sym: "text-[0.6em]", suffix: "text-[0.5em]" },
    xl: { num: "text-5xl", sym: "text-[0.55em]", suffix: "text-[0.45em]" },
  }[size];

  return (
    <span className={cn("inline-flex items-baseline gap-1 tabular-nums", className)}>
      <span className={cn("font-display font-extrabold text-white", sizes.num)}>
        <span className={cn("font-medium text-muted-foreground", sizes.sym)}>$</span>
        {value}
      </span>
      {original && (
        <span className="tabular-nums text-sm font-medium text-muted-foreground/60 line-through">
          ${original}
        </span>
      )}
      {suffix && (
        <span className={cn("font-medium uppercase tracking-wider text-muted-foreground/70", sizes.suffix)}>
          {suffix}
        </span>
      )}
    </span>
  );
}
