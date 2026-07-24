"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ReadingProgress — a thin gradient progress bar fixed to the top of the
 * viewport that fills as the user reads through an article. Premium content
 * touch (Medium, Linear, Stripe Docs all use this). Distinct from the global
 * ScrollProgress bar — this one is scoped to an article's scroll container
 * and is slightly taller + more prominent.
 *
 * Pass a `targetRef` pointing to the article body element so the progress
 * is measured against the article, not the whole page.
 */
export function ReadingProgress({
  targetRef,
  className,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
}) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className={cn(
        "fixed inset-x-0 top-0 z-[55] h-1 origin-left bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400",
        className,
      )}
    />
  );
}
