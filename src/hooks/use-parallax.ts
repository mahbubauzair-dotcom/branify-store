"use client";

import { useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * useParallax — returns a MotionValue that translates an element vertically
 * based on its scroll position within the viewport. Useful for subtle depth
 * on hero visuals, dashboard mockups, and section backgrounds.
 *
 * Pass `distance` in px (e.g. 80 moves the element up to 80px as it scrolls
 * through). Respects `prefers-reduced-motion` (returns a static 0 value).
 *
 *   const { ref, y } = useParallax(80);
 *   <motion.div ref={ref} style={{ y }}>…</motion.div>
 */
export function useParallax(distance = 80): {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll progress (0 → 1) to a vertical translate (distance/2 → -distance/2)
  // so the element drifts upward as the user scrolls down.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [distance / 2, -distance / 2],
  );

  return { ref, y };
}
