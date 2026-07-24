"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle2,
  FileEdit,
  FolderTree,
  Mail,
  MessageSquare,
  DollarSign,
  Plus,
  PanelsTopLeft,
  ArrowRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { AdminLayout } from "@/components/views/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "@/lib/router";
import { toast } from "sonner";

type Stats = {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalCategories: number;
  newsletterSubscribers: number;
  newContactMessages: number;
  salesValue: number;
};

type StatDef = {
  key: keyof Stats | "salesValue";
  label: string;
  icon: LucideIcon;
  hint: string;
  accent: string;
};

const STAT_DEFS: StatDef[] = [
  { key: "totalProducts", label: "Total Products", icon: Package, hint: "All time", accent: "text-primary" },
  { key: "publishedProducts", label: "Published", icon: CheckCircle2, hint: "Live in store", accent: "text-emerald-400" },
  { key: "draftProducts", label: "Drafts", icon: FileEdit, hint: "Not published", accent: "text-amber-400" },
  { key: "totalCategories", label: "Categories", icon: FolderTree, hint: "Organizing products", accent: "text-violet-400" },
  { key: "newsletterSubscribers", label: "Newsletter Subs", icon: Mail, hint: "Active subscribers", accent: "text-sky-400" },
  { key: "newContactMessages", label: "New Messages", icon: MessageSquare, hint: "Awaiting reply", accent: "text-rose-400" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

/**
 * AdminDashboardView — overview of store metrics + quick actions.
 */
export function AdminDashboardView() {
  return (
    <AdminLayout active="dashboard">
      <DashboardContent />
    </AdminLayout>
  );
}

function DashboardContent() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (data?.ok && data?.stats) {
          setStats(data.stats as Stats);
        } else {
          toast.error("Failed to load stats.");
        }
      } catch {
        if (!cancelled) toast.error("Network error loading stats.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of your store today.
        </p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border border-white/5 bg-card/30 shimmer"
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {STAT_DEFS.map((def) => {
            const Icon = def.icon;
            const value = stats ? stats[def.key] : 0;
            return (
              <motion.div
                key={def.key}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
              >
                <Card className="group h-full border-white/5 bg-card/40 p-5 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {def.label}
                      </p>
                      <p className="font-display text-3xl font-bold text-white">
                        {typeof value === "number" ? value.toLocaleString() : value}
                      </p>
                      <p className="text-xs text-muted-foreground">{def.hint}</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                      <Icon className={`h-5 w-5 ${def.accent}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {/* Total sales value — highlighted accent card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card/40 to-card/20 p-6 backdrop-blur">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Total Sales Value
                    </p>
                    <p className="font-display text-4xl font-bold text-white">
                      {formatCurrency(stats?.salesValue ?? 0)}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
                      <TrendingUp className="h-3 w-3" />
                      Lifetime revenue across published products
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("admin-products")}
                  className="bg-primary text-primary-foreground hover:bg-hover"
                >
                  Manage products
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <QuickAction
          icon={Plus}
          title="Add Product"
          description="Create a new digital product with full SEO."
          cta="New product"
          onClick={() => navigate("admin-product-edit", { slug: "new" })}
        />
        <QuickAction
          icon={FolderTree}
          title="Add Category"
          description="Organize your catalog into browsable groups."
          cta="Manage categories"
          onClick={() => navigate("admin-categories")}
        />
        <QuickAction
          icon={PanelsTopLeft}
          title="Edit Website"
          description="Tune hero, colors, announcement bar and footer."
          cta="Open builder"
          onClick={() => navigate("admin-builder")}
        />
      </div>

      {/* Messages placeholder */}
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Contact messages</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You have{" "}
                <span className="font-semibold text-foreground">
                  {stats?.newContactMessages ?? 0}
                </span>{" "}
                new message{stats?.newContactMessages === 1 ? "" : "s"} awaiting a reply.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            disabled
            className="border-white/10 bg-transparent text-muted-foreground"
          >
            View messages (coming soon)
          </Button>
        </div>
      </Card>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  cta,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <Card className="group flex flex-col gap-3 border-white/5 bg-card/40 p-5 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="flex-1 text-sm text-muted-foreground">{description}</p>
      <Button
        variant="ghost"
        onClick={onClick}
        className="w-fit justify-start px-0 text-primary hover:bg-transparent hover:text-hover"
      >
        {cta}
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </Card>
  );
}
