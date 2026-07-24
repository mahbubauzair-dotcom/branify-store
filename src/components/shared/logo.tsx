"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo — renders the official BRANIFY brand logo (uploaded PNG).
 *
 * The logo is a stacked lockup: cyan-gradient "B" icon + "BRANIFY" wordmark
 * (white) + "BUILD. BRAND. GROW." tagline (cyan), with a transparent
 * background (black chroma-keyed out so it blends with the dark theme).
 *
 * Props:
 *   - `className`: extra wrapper classes
 *   - `size`: "sm" (navbar, h-9), "md" (default, h-12), "lg" (footer, h-16)
 *   - `showWordmark`: kept for API backward-compat; the uploaded logo always
 *     includes the wordmark, so this is a no-op now.
 */
export function Logo({
  className,
  showWordmark = true,
  size = "sm",
}: {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const heights = {
    sm: "h-12",  // navbar (was h-9 — too small)
    md: "h-14",  // default
    lg: "h-20",  // footer / hero
  } as const;
  const px = {
    sm: 156, // 13 * 12 (was 108)
    md: 182, // ~14 * 13
    lg: 240, // 20 * 12
  } as const;

  return (
    <div className={cn("relative flex items-center", heights[size], className)}>
      <Image
        src="/branify-logo.png"
        alt="BRANIFY — Build. Brand. Grow."
        width={px[size]}
        height={px[size]}
        priority
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
