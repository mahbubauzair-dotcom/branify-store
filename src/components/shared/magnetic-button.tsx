"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * MagneticButton — wraps any trigger (button / a) and makes it subtly
 * "magnetic": it translates toward the pointer on hover and snaps back on
 * leave. Premium micro-interaction found on Linear, Vercel, Stripe marketing
 * pages. Respects `prefers-reduced-motion`.
 *
 * Usage:
 *   <MagneticButton strength={0.4}>
 *     <Button onClick={...}>Start a project</Button>
 *   </MagneticButton>
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  radius = 60,
}: {
  children: ReactNode;
  className?: string;
  /** 0–1, how strongly the element follows the pointer */
  strength?: number;
  /** max displacement in px */
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.6 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    // clamp displacement so it never moves more than `radius` px
    const mag = Math.hypot(relX, relY) || 1;
    const clamp = Math.min(1, radius / mag);
    x.set(relX * strength * clamp);
    y.set(relY * strength * clamp);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reduce) {
    return <div className={cn("inline-flex", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}
