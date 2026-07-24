"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({ children, className, delay = 0, y = 24, once = true }: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Stagger({ children, className, delay = 0 }: StaggerProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  variant?: Variants;
};

export function StaggerItem({ children, className, variant = fadeUp }: StaggerItemProps) {
  return (
    <motion.div variants={variant} className={className}>
      {children}
    </motion.div>
  );
}

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("text-gradient", className)}>{children}</span>;
}

export function GradientTextTeal({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("text-gradient-teal", className)}>{children}</span>;
}
