"use client";

import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency";

/**
 * Price — premium price typography that auto-converts to the user's
 * selected currency (USD, INR, AUD, PKR, etc.) using the currency context.
 *
 * The `value` and `original` props are always in USD; the component
 * converts + formats them to the active currency.
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
  const { currency, convert } = useCurrency();

  const sizes = {
    sm: { num: "text-lg", sym: "text-[0.7em]", suffix: "text-[0.6em]" },
    md: { num: "text-2xl", sym: "text-[0.65em]", suffix: "text-[0.55em]" },
    lg: { num: "text-4xl", sym: "text-[0.6em]", suffix: "text-[0.5em]" },
    xl: { num: "text-5xl", sym: "text-[0.55em]", suffix: "text-[0.45em]" },
  }[size];

  const convertedValue = convert(value);
  const convertedOriginal = original ? convert(original) : null;

  return (
    <span className={cn("inline-flex items-baseline gap-1 tabular-nums", className)}>
      <span className={cn("font-display font-extrabold text-white", sizes.num)}>
        <span className={cn("font-medium text-muted-foreground", sizes.sym)}>{currency.symbol}</span>
        {convertedValue.toLocaleString("en-US", { maximumFractionDigits: convertedValue < 100 ? 2 : 0 })}
      </span>
      {convertedOriginal && (
        <span className="tabular-nums text-sm font-medium text-muted-foreground/60 line-through">
          {currency.symbol}{convertedOriginal.toLocaleString("en-US", { maximumFractionDigits: convertedOriginal < 100 ? 2 : 0 })}
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
