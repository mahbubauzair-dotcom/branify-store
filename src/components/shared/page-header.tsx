"use client";

import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, type RouteName } from "@/lib/router";
import { AuroraBackground } from "./gradient-cover";

type Crumb = { label: string; route?: RouteName };

export function PageHeader({
  title,
  description,
  crumbs,
  children,
  align = "center",
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  align?: "left" | "center";
}) {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <AuroraBackground />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className={cn(
        "relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28",
        align === "center" && "text-center",
      )}>
        {crumbs && crumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "mb-6 flex items-center gap-1.5 text-sm text-muted-foreground",
              align === "center" && "justify-center",
            )}
            aria-label="Breadcrumb"
          >
            <button onClick={() => navigate("home")} className="hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
            </button>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                {c.route ? (
                  <button onClick={() => navigate(c.route!)} className="hover:text-primary transition-colors">
                    {c.label}
                  </button>
                ) : (
                  <span className="text-white">{c.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className={cn(
              "mt-5 text-lg text-muted-foreground leading-relaxed",
              align === "center" && "mx-auto max-w-2xl",
            )}
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
