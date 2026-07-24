"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — a thin gradient progress bar fixed to the very top of the
 * viewport that fills as the user scrolls down the page. Premium SaaS touch
 * (Linear, Vercel, Stripe all use variations of this).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[#00E5FF] via-[#18F2B2] to-[#7B61FF]"
    />
  );
}
