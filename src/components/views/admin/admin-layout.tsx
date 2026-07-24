"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  PanelsTopLeft,
  Store,
  LogOut,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useNavigate, type RouteName } from "@/lib/router";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AdminNavKey = "dashboard" | "products" | "categories" | "builder";

const NAV: { key: AdminNavKey; label: string; route: RouteName; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", route: "admin-dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", route: "admin-products", icon: Package },
  { key: "categories", label: "Categories", route: "admin-categories", icon: FolderTree },
  { key: "builder", label: "Website Builder", route: "admin-builder", icon: PanelsTopLeft },
];

/**
 * AdminLayout — shared shell for all authenticated admin views.
 *
 * Renders its own top bar (Logo + "View store" + Logout), a sidebar nav on
 * desktop and a horizontal scrollable nav on mobile, and a main content area
 * for `children`. Performs an auth check on mount via
 * GET /api/admin/auth/check; if unauthenticated, redirects to admin-login.
 */
export function AdminLayout({
  children,
  active,
}: {
  children: ReactNode;
  active: string;
}) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<"loading" | "authed" | "guest">("loading");
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/auth/check", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (data?.ok && data?.admin) {
          setAuthState("authed");
          setAdminName(data.admin.name || data.admin.email || "Admin");
        } else {
          setAuthState("guest");
          navigate("admin-login");
        }
      } catch {
        if (!cancelled) {
          setAuthState("guest");
          navigate("admin-login");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors — we still clear client state and redirect
    }
    toast.success("Signed out");
    navigate("admin-login");
  };

  if (authState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Checking session…</p>
        </div>
      </div>
    );
  }

  if (authState === "guest") {
    // Redirect already triggered in effect; render nothing in the meantime.
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-card/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline-flex">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">
              Signed in as <span className="font-medium text-foreground">{adminName}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("home")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Store className="mr-1.5 h-4 w-4" />
              View store
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/10 bg-transparent text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {NAV.map((item) => {
              const isActive = active === item.key;
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.route)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:border-white/5 hover:bg-card/60 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="admin-nav-active"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile horizontal nav */}
        <div className="lg:hidden">
          <div className="fixed inset-x-0 top-16 z-30 border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <div className="flex gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {NAV.map((item) => {
                const isActive = active === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.route)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="min-w-0 flex-1 pt-14 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="min-h-[60vh]"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
