"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  ShoppingCart,
  Package,
  Download,
  Mail,
  Plus,
  FolderTree,
  Eye,
  Send,
  PanelsTopLeft,
  ArrowRight,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { AdminLayout } from "@/components/views/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, type RouteName } from "@/lib/router";
import { cn } from "@/lib/utils";

type Stats = {
  totalProducts?: number;
  publishedProducts?: number;
  draftProducts?: number;
  totalCategories?: number;
  newsletterSubscribers?: number;
  newContactMessages?: number;
  salesValue?: number;
};

type StatCardDef = {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Compute a display value from the loaded stats (or fallback mock). */
  getValue: (s: Stats | null) => number;
  format: (v: number) => string;
  change: number; // % change (mock)
  accent: string; // icon wrapper classes
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

const STAT_CARDS: StatCardDef[] = [
  {
    key: "today-revenue",
    label: "Today's Revenue",
    icon: DollarSign,
    getValue: (s) => Math.round((s?.salesValue ?? 18450) * 0.012),
    format: formatCurrency,
    change: 12.4,
    accent: "from-primary/20 to-primary/5 text-primary border-primary/20",
  },
  {
    key: "monthly-revenue",
    label: "Monthly Revenue",
    icon: TrendingUp,
    getValue: (s) => Math.round((s?.salesValue ?? 184500) * 0.18),
    format: formatCurrency,
    change: 8.7,
    accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
  },
  {
    key: "visitors",
    label: "Visitors",
    icon: Users,
    getValue: () => 12480,
    format: formatNumber,
    change: 5.2,
    accent: "from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/20",
  },
  {
    key: "conversion",
    label: "Conversion Rate",
    icon: Target,
    getValue: () => 3.4,
    format: (v) => `${v.toFixed(1)}%`,
    change: -0.6,
    accent: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
  },
  {
    key: "orders",
    label: "Orders",
    icon: ShoppingCart,
    getValue: () => 384,
    format: formatNumber,
    change: 14.1,
    accent: "from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/20",
  },
  {
    key: "products",
    label: "Products",
    icon: Package,
    getValue: (s) => s?.totalProducts ?? 0,
    format: formatNumber,
    change: 2.3,
    accent: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20",
  },
  {
    key: "downloads",
    label: "Downloads",
    icon: Download,
    getValue: () => 9214,
    format: formatNumber,
    change: 18.9,
    accent: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
  },
  {
    key: "subscribers",
    label: "Subscribers",
    icon: Mail,
    getValue: (s) => s?.newsletterSubscribers ?? 0,
    format: formatNumber,
    change: 6.4,
    accent: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400 border-fuchsia-500/20",
  },
];

/** 12 months of mock revenue data (deterministic — no hydration drift). */
const SALES_DATA = [
  { month: "Jan", revenue: 14200, orders: 124 },
  { month: "Feb", revenue: 16800, orders: 142 },
  { month: "Mar", revenue: 15400, orders: 138 },
  { month: "Apr", revenue: 19200, orders: 168 },
  { month: "May", revenue: 21800, orders: 184 },
  { month: "Jun", revenue: 24600, orders: 198 },
  { month: "Jul", revenue: 28400, orders: 224 },
  { month: "Aug", revenue: 26200, orders: 212 },
  { month: "Sep", revenue: 31800, orders: 248 },
  { month: "Oct", revenue: 35400, orders: 276 },
  { month: "Nov", revenue: 41200, orders: 312 },
  { month: "Dec", revenue: 47600, orders: 358 },
];

const TRAFFIC_SOURCES = [
  { name: "Direct", value: 38, color: "#00E5FF" },
  { name: "Search", value: 32, color: "#7B61FF" },
  { name: "Social", value: 18, color: "#18F2B2" },
  { name: "Referral", value: 12, color: "#fbbf24" },
];

type OrderStatus = "paid" | "pending" | "refunded" | "shipped";

const RECENT_ORDERS: {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: OrderStatus;
}[] = [
  { id: "#BR-10428", customer: "Sarah Chen", email: "sarah@example.com", product: "Brand Identity Suite", amount: 480, status: "paid" },
  { id: "#BR-10427", customer: "Marcus Webb", email: "marcus@example.com", product: "AI Copywriter Pro", amount: 96, status: "shipped" },
  { id: "#BR-10426", customer: "Aisha Patel", email: "aisha@example.com", product: "Logo Mastery Course", amount: 240, status: "pending" },
  { id: "#BR-10425", customer: "Leo Nakamura", email: "leo@example.com", product: "Webflow Templates Pack", amount: 128, status: "paid" },
  { id: "#BR-10424", customer: "Elena Rivera", email: "elena@example.com", product: "SEO Audit Tool", amount: 64, status: "refunded" },
];

const POPULAR_PRODUCTS: { name: string; sales: number; price: number; emoji: string }[] = [
  { name: "Brand Identity Suite", sales: 1284, price: 480, emoji: "🎨" },
  { name: "AI Copywriter Pro", sales: 968, price: 96, emoji: "🤖" },
  { name: "Logo Mastery Course", sales: 742, price: 240, emoji: "🎓" },
  { name: "Webflow Templates Pack", sales: 612, price: 128, emoji: "📐" },
  { name: "SEO Audit Tool", sales: 488, price: 64, emoji: "🔍" },
];

const ACTIVITY_FEED: { id: string; text: string; actor: string; time: string; icon: LucideIcon }[] = [
  { id: "1", text: "placed a new order", actor: "Sarah Chen", time: "2 min ago", icon: ShoppingCart },
  { id: "2", text: "subscribed to the newsletter", actor: "Marcus Webb", time: "14 min ago", icon: Mail },
  { id: "3", text: "left a 5-star review on AI Copywriter Pro", actor: "Aisha Patel", time: "32 min ago", icon: Activity },
  { id: "4", text: "downloaded SEO Audit Tool", actor: "Leo Nakamura", time: "1 hr ago", icon: Download },
  { id: "5", text: "started a subscription", actor: "Elena Rivera", time: "2 hr ago", icon: TrendingUp },
  { id: "6", text: "completed checkout", actor: "James Okoro", time: "3 hr ago", icon: ShoppingCart },
];

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  paid: { label: "Paid", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  pending: { label: "Pending", className: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  refunded: { label: "Refunded", className: "border-rose-500/30 bg-rose-500/10 text-rose-400" },
  shipped: { label: "Shipped", className: "border-sky-500/30 bg-sky-500/10 text-sky-400" },
};

/**
 * AdminDashboardView — enterprise overview: stats, charts, recent activity,
 * quick actions.
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
          // Don't toast on every dashboard load — just fall back to mocks.
          setStats(null);
        }
      } catch {
        if (!cancelled) {
          // Network error — fall back to mock values silently.
          setStats(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-2"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back 👋
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening in your store today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"
            >
              <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              All systems operational
            </Badge>
            <Button
              onClick={() => navigate("admin-product-edit", { slug: "new" })}
              className="bg-gradient-to-r from-[#00E5FF] to-[#00FFD1] text-[#04121a] hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Product</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((def, i) => (
          <StatCard key={def.key} def={def} stats={stats} loading={loading} index={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SalesChart loading={loading} />
        <TrafficSourcesCard loading={loading} />
      </div>

      {/* Lower grid: orders + products */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RecentOrdersCard />
        <PopularProductsCard />
      </div>

      {/* Activity + quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityFeedCard />
        <QuickActionsCard onNavigate={navigate} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */

function StatCard({
  def,
  stats,
  loading,
  index,
}: {
  def: StatCardDef;
  stats: Stats | null;
  loading: boolean;
  index: number;
}) {
  const value = def.getValue(stats);
  const Icon = def.icon;
  const isUp = def.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className="relative overflow-hidden border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:border-white/[0.14]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
              {def.label}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-white/[0.05]" />
            ) : (
              <p className="font-display text-2xl font-bold text-white tabular-nums">
                {def.format(value)}
              </p>
            )}
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-[11px] font-semibold",
                  isUp ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {formatPercent(def.change)}
              </span>
              <span className="text-[11px] text-muted-foreground/60">vs last week</span>
            </div>
          </div>
          <div
            className={cn(
              "shrink-0 rounded-xl border bg-gradient-to-br p-2.5",
              def.accent,
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Sales AreaChart                                                     */
/* ------------------------------------------------------------------ */

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const revenue = payload[0]?.value ?? 0;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#0B1022]/95 px-3 py-2 backdrop-blur-xl">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
        {label} 2025
      </p>
      <p className="mt-0.5 text-sm font-semibold text-white tabular-nums">
        {formatCurrency(revenue as number)}
      </p>
    </div>
  );
}

function SalesChart({ loading }: { loading: boolean }) {
  return (
    <Card className="lg:col-span-2 border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-white">Revenue Overview</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Monthly revenue · last 12 months</p>
        </div>
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
        >
          <TrendingUp className="mr-1 h-3 w-3" />
          +24.8%
        </Badge>
      </div>
      {loading ? (
        <Skeleton className="h-64 w-full bg-white/[0.05]" />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SALES_DATA} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#18F2B2" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fill: "rgba(191,199,213,0.6)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(191,199,213,0.6)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v as number) / 1000}k`}
              />
              <RechartsTooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(0,229,255,0.25)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="url(#revenueStroke)"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                dot={false}
                activeDot={{ r: 4, fill: "#00E5FF", stroke: "#0B1022", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Traffic sources                                                     */
/* ------------------------------------------------------------------ */

function TrafficSourcesCard({ loading }: { loading: boolean }) {
  const total = useMemo(() => TRAFFIC_SOURCES.reduce((s, t) => s + t.value, 0), []);
  return (
    <Card className="border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold text-white">Traffic Sources</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Where your visitors come from</p>
      </div>
      {loading ? (
        <Skeleton className="h-48 w-full bg-white/[0.05]" />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TRAFFIC_SOURCES}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  stroke="none"
                >
                  {TRAFFIC_SOURCES.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }: TooltipProps<number, string>) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0];
                    const pct = ((p.value as number) / total) * 100;
                    return (
                      <div className="rounded-lg border border-white/[0.08] bg-[#0B1022]/95 px-3 py-2 backdrop-blur-xl">
                        <p className="text-xs font-semibold text-white">{p.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {pct.toFixed(1)}% of traffic
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-2xl font-bold text-white tabular-nums">{total}%</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Tracked</p>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            {TRAFFIC_SOURCES.map((src) => (
              <div
                key={src.name}
                className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: src.color }}
                />
                <span className="flex-1 truncate text-xs text-muted-foreground">{src.name}</span>
                <span className="text-xs font-semibold text-white tabular-nums">{src.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Recent orders                                                       */
/* ------------------------------------------------------------------ */

function RecentOrdersCard() {
  return (
    <Card className="lg:col-span-2 border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-white">Recent Orders</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Latest 5 transactions</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/10 hover:text-primary"
        >
          View all
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] uppercase tracking-wider text-muted-foreground/60">
              <th className="px-2 pb-2 font-medium">Order</th>
              <th className="px-2 pb-2 font-medium">Customer</th>
              <th className="hidden px-2 pb-2 font-medium md:table-cell">Product</th>
              <th className="px-2 pb-2 text-right font-medium">Amount</th>
              <th className="px-2 pb-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {RECENT_ORDERS.map((order) => {
              const status = STATUS_STYLES[order.status];
              return (
                <tr key={order.id} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="px-2 py-3 font-mono text-xs text-primary/90">{order.id}</td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={order.customer} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white">{order.customer}</p>
                        <p className="truncate text-[11px] text-muted-foreground/70">{order.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-2 py-3 text-xs text-muted-foreground md:table-cell">
                    {order.product}
                  </td>
                  <td className="px-2 py-3 text-right font-semibold text-white tabular-nums">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-2 py-3 text-right">
                    <Badge
                      variant="outline"
                      className={cn("px-2 py-0.5 text-[10px] font-medium", status.className)}
                    >
                      {status.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-primary/20 to-secondary/20 text-[10px] font-semibold text-primary">
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Popular products                                                    */
/* ------------------------------------------------------------------ */

function PopularProductsCard() {
  return (
    <Card className="border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold text-white">Popular Products</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Top sellers this month</p>
      </div>
      <div className="space-y-2.5">
        {POPULAR_PRODUCTS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-base">
              {p.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">{p.name}</p>
              <p className="text-[11px] text-muted-foreground/70 tabular-nums">
                {formatNumber(p.sales)} sales · {formatCurrency(p.price)}
              </p>
            </div>
            <span className="rounded-md border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              #{i + 1}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Activity feed                                                       */
/* ------------------------------------------------------------------ */

function ActivityFeedCard() {
  return (
    <Card className="lg:col-span-2 border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-white">Realtime Activity</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Live customer events</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          LIVE
        </span>
      </div>
      <div className="relative space-y-1">
        {ACTIVITY_FEED.map((item, i) => {
          const Icon = item.icon;
          const isLast = i === ACTIVITY_FEED.length - 1;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3"
            >
              <div className="relative flex flex-col items-center">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                {!isLast && (
                  <span className="mt-1 w-px flex-1 bg-white/[0.06]" />
                )}
              </div>
              <div className={cn("flex-1 pb-3", isLast && "pb-0")}>
                <p className="text-xs text-white">
                  <span className="font-semibold">{item.actor}</span>{" "}
                  <span className="text-muted-foreground">{item.text}</span>
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground/60">{item.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Quick actions                                                       */
/* ------------------------------------------------------------------ */

function QuickActionsCard({
  onNavigate,
}: {
  onNavigate: (route: RouteName) => void;
}) {
  const actions: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  }[] = [
    {
      icon: Plus,
      label: "Add Product",
      onClick: () => onNavigate("admin-product-edit"),
    },
    {
      icon: FolderTree,
      label: "Add Category",
      onClick: () => onNavigate("admin-categories"),
    },
    {
      icon: Eye,
      label: "View Orders",
      onClick: () => onNavigate("admin-orders"),
    },
    {
      icon: Send,
      label: "Send Newsletter",
      onClick: () => onNavigate("admin-newsletter"),
    },
    {
      icon: PanelsTopLeft,
      label: "Edit Website",
      onClick: () => onNavigate("admin-builder"),
    },
  ];

  return (
    <Card className="border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold text-white">Quick Actions</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Jump to a common task</p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.button
              key={a.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={a.onClick}
              className="group flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/[0.06]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1 text-xs font-medium text-white">{a.label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
}
