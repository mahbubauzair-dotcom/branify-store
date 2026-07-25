"use client";

import { useEffect, useState, type ElementType } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@/lib/router";
import { cn } from "@/lib/utils";

/**
 * AdminStubView — premium "Coming Soon" placeholder for admin modules that
 * don't have full implementations yet.
 *
 * Renders a centered glass hero (large icon, module title, description,
 * "Coming Soon" badge) followed by a grid of planned-feature cards with
 * checkmarks. Shows a brief loading skeleton on mount for a premium feel.
 *
 * Intended to be wrapped by <AdminLayout active="..."> at the call site.
 */
export function AdminStubView({
  title,
  description,
  icon: Icon,
  features,
}: {
  title: string;
  description: string;
  icon: ElementType;
  /** 3–6 planned feature bullets shown in the grid below. */
  features?: string[];
}) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  // Brief premium skeleton on first mount — feels like real data loading.
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 350);
    return () => clearTimeout(t);
  }, []);

  const planned = features?.length ? features.slice(0, 6) : DEFAULT_FEATURES;

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Card className="relative overflow-hidden border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl sm:p-10">
          {/* Ambient gradient backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-0 opacity-60">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
            {/* Icon tile */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 -z-10 animate-pulse-slow rounded-2xl bg-primary/30 blur-2xl" />
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-secondary/15 to-transparent">
                <Icon className="h-9 w-9 text-primary" />
              </div>
            </div>

            {/* Title + description */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {loaded ? title : <Skeleton className="h-8 w-48 bg-white/10" />}
                </h2>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  Coming Soon
                </Badge>
              </div>
              <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0">
                {loaded ? description : <Skeleton className="h-5 w-full max-w-xl bg-white/10" />}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                <Button
                  onClick={() => navigate("admin-dashboard")}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#00FFD1] text-[#04121a] hover:opacity-90"
                >
                  <Sparkles className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
                  onClick={() => navigate("admin-settings")}
                >
                  Configure
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Planned features grid */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Planned Features
          </h3>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {planned.length} modules
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planned.map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 10 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
            >
              <FeatureCard text={feature} index={i} loaded={loaded} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <Card className="border-dashed border-white/[0.08] bg-transparent p-5">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">We&apos;re crafting something premium</p>
              <p className="text-xs text-muted-foreground">
                This module is under active development. Your admin dashboard remains fully functional.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("admin-dashboard")}
            className="text-primary hover:bg-primary/10 hover:text-primary"
          >
            Return to dashboard
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function FeatureCard({
  text,
  index,
  loaded,
}: {
  text: string;
  index: number;
  loaded: boolean;
}) {
  if (!loaded) {
    return (
      <Card className="border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 rounded-md bg-white/10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-full bg-white/10" />
            <Skeleton className="h-3 w-2/3 bg-white/10" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group h-full border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-primary/[0.04]">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10",
            "transition-transform group-hover:scale-110",
          )}
        >
          <Check className="h-3 w-3 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-white">{text}</p>
          <p className="mt-1 text-[11px] text-muted-foreground/60">
            Feature {String(index + 1).padStart(2, "0")}
          </p>
        </div>
      </div>
    </Card>
  );
}

const DEFAULT_FEATURES = [
  "Comprehensive dashboard with real-time metrics",
  "Advanced filtering, search and bulk actions",
  "Inline editing with optimistic updates",
  "Granular role-based access control",
  "Audit log of every change",
  "Export to CSV, JSON and PDF",
];
