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
    sm: "h-9",   // navbar
    md: "h-12",  // default
    lg: "h-16",  // footer / hero
  } as const;
  const px = {
    sm: 108, // 9 * 12
    md: 144, // 12 * 12
    lg: 192, // 16 * 12
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
