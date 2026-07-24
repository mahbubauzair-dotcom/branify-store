"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BackToTop — a floating action button that appears after the user scrolls
 * down ~600px and smoothly scrolls back to the top on click. Includes a
 * circular progress ring showing scroll depth. Premium micro-interaction.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={toTop}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full",
            "border border-white/10 bg-card/80 backdrop-blur-xl shadow-premium-lg",
            "transition-colors hover:border-primary/40 hover:bg-card",
          )}
        >
          {/* circular scroll progress ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" fill="none">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              stroke="#00E5FF"
              strokeWidth="2"
              fill="none"
              style={{ pathLength }}
              strokeLinecap="round"
            />
          </svg>
          <ArrowUp className="h-4 w-4 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
