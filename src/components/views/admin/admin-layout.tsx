"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Package,
  FolderTree,
  Layers,
  Tag,
  Image as ImageIcon,
  ShoppingCart,
  RefreshCw,
  Ticket,
  Star,
  Users,
  FileText,
  FileCode,
  ClipboardList,
  MessageSquare,
  Mail,
  Megaphone,
  Search,
  Zap,
  Plug,
  PanelsTopLeft,
  Menu,
  Palette,
  UserCog,
  Settings,
  Code2,
  Store,
  LogOut,
  Loader2,
  Bell,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Command,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate, type RouteName } from "@/lib/router";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type NavItem = {
  key: string;
  label: string;
  route: RouteName;
  icon: LucideIcon;
};

type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard", route: "admin-dashboard", icon: LayoutDashboard },
      { key: "analytics", label: "Analytics", route: "admin-analytics", icon: BarChart3 },
      { key: "activity", label: "Activity Logs", route: "admin-activity", icon: Activity },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    items: [
      { key: "products", label: "Products", route: "admin-products", icon: Package },
      { key: "categories", label: "Categories", route: "admin-categories", icon: FolderTree },
      { key: "collections", label: "Collections", route: "admin-collections", icon: Layers },
      { key: "brands", label: "Brands", route: "admin-brands", icon: Tag },
      { key: "media", label: "Media Library", route: "admin-media", icon: ImageIcon },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    items: [
      { key: "orders", label: "Orders", route: "admin-orders", icon: ShoppingCart },
      { key: "subscriptions", label: "Subscriptions", route: "admin-subscriptions", icon: RefreshCw },
      { key: "coupons", label: "Coupons", route: "admin-coupons", icon: Ticket },
      { key: "reviews", label: "Reviews", route: "admin-reviews", icon: Star },
      { key: "customers", label: "Customers", route: "admin-customers", icon: Users },
    ],
  },
  {
    id: "content",
    label: "Content",
    items: [
      { key: "blog", label: "Blog", route: "admin-blog", icon: FileText },
      { key: "pages", label: "Pages", route: "admin-pages", icon: FileCode },
      { key: "forms", label: "Forms", route: "admin-forms", icon: ClipboardList },
      { key: "messages", label: "Messages", route: "admin-messages", icon: MessageSquare },
      { key: "newsletter", label: "Newsletter", route: "admin-newsletter", icon: Mail },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    items: [
      { key: "marketing", label: "Marketing", route: "admin-marketing", icon: Megaphone },
      { key: "seo", label: "SEO", route: "admin-seo", icon: Search },
      { key: "automation", label: "Automation", route: "admin-automation", icon: Zap },
      { key: "integrations", label: "Integrations", route: "admin-integrations", icon: Plug },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { key: "builder", label: "Website Builder", route: "admin-builder", icon: PanelsTopLeft },
      { key: "navigation", label: "Navigation", route: "admin-navigation", icon: Menu },
      { key: "emails", label: "Emails", route: "admin-emails", icon: Mail },
      { key: "appearance", label: "Appearance", route: "admin-appearance", icon: Palette },
      { key: "users", label: "Users & Roles", route: "admin-users", icon: UserCog },
      { key: "settings", label: "Settings", route: "admin-settings", icon: Settings },
      { key: "developer", label: "Developer", route: "admin-developer", icon: Code2 },
    ],
  },
];

/** All nav items flattened — used for page titles & mobile search. */
const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

function findActiveItem(active: string): NavItem | undefined {
  return ALL_NAV_ITEMS.find((i) => i.key === active);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "AD";
}

/** Compute which groups should be open by default — the active item's group. */
function getDefaultCollapsed(active: string): Record<string, boolean> {
  const initial: Record<string, boolean> = {};
  for (const group of NAV_GROUPS) {
    const hasActive = group.items.some((i) => i.key === active);
    // Start expanded if it contains the active item, collapsed otherwise.
    initial[group.id] = hasActive ? false : group.id !== "overview" && group.id !== "catalog";
  }
  return initial;
}

/**
 * AdminLayout — premium enterprise shell for all authenticated admin views.
 *
 * Renders a fixed glass sidebar (collapsible w-64 ↔ w-16 on desktop, slide-in
 * Sheet on mobile), a sticky top bar with global search, notifications, and
 * account actions, and a main content area for `children`.
 *
 * Performs an auth check on mount via GET /api/admin/auth/check; if
 * unauthenticated, redirects to admin-login.
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
  const [adminName, setAdminName] = useState<string>("Admin");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() =>
    getDefaultCollapsed(active),
  );

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

  const activeItem = useMemo(() => findActiveItem(active), [active]);
  const pageTitle = activeItem?.label ?? "Admin";

  const toggleGroup = (id: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
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

  const SidebarBody = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      {/* Brand row */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/[0.06] px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <button
          onClick={() => {
            navigate("admin-dashboard");
            onNavigate?.();
          }}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="BRANIFY admin home"
        >
          <Logo size="sm" className={cn(collapsed && "scale-90")} />
          <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary lg:inline-flex">
            Admin
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
        <div className="space-y-5">
          {NAV_GROUPS.map((group) => {
            const isCollapsed = collapsedGroups[group.id] ?? false;
            const hasActive = group.items.some((i) => i.key === active);
            return (
              <div key={group.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "group flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 transition-colors hover:text-muted-foreground/80",
                    collapsed && "justify-center px-0",
                  )}
                  aria-expanded={!isCollapsed}
                >
                  {!collapsed && <span className="flex-1 text-left">{group.label}</span>}
                  {!collapsed && (
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        isCollapsed && "-rotate-90",
                      )}
                    />
                  )}
                  {collapsed && hasActive && (
                    <span className="h-1 w-1 rounded-full bg-primary" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {(!isCollapsed || collapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={cn("overflow-hidden", isCollapsed && !collapsed && "hidden")}
                    >
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const isActive = active === item.key;
                          const Icon = item.icon;
                          return (
                            <SidebarNavItem
                              key={item.key}
                              item={item}
                              isActive={isActive}
                              collapsed={collapsed}
                              onNavigate={onNavigate}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer — collapse toggle (desktop only) */}
      <div className="hidden shrink-0 border-t border-white/[0.06] p-3 lg:block">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-white/[0.08] bg-[#0B1022]/80 backdrop-blur-xl transition-[width] duration-300 ease-in-out lg:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarBody />
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[280px] border-r border-white/[0.08] bg-[#0B1022]/95 p-0 backdrop-blur-xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="h-full">
            {/* Render sidebar at full width on mobile */}
            <div className="lg:hidden">
              <MobileSidebarBody onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300 ease-in-out",
          collapsed ? "lg:pl-16" : "lg:pl-64",
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#050816]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            {/* Hamburger (mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Page title */}
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate font-display text-base font-semibold tracking-tight text-white sm:text-lg">
                {pageTitle}
              </h1>
              <span className="hidden rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:inline-flex">
                Admin
              </span>
            </div>

            {/* Global search */}
            <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                placeholder="Search admin…"
                className="h-9 border-white/[0.06] bg-white/[0.03] pl-9 pr-12 text-sm text-white placeholder:text-muted-foreground/60 focus-visible:border-primary/40 focus-visible:ring-primary/20"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/70 lg:inline-flex">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative ml-auto text-muted-foreground hover:text-foreground md:ml-0"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            {/* View store */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("home")}
              className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              <Store className="h-4 w-4" />
              <span className="hidden lg:inline">View store</span>
            </Button>

            {/* Logout (desktop) */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden border-white/10 bg-transparent text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive sm:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Logout</span>
            </Button>

            {/* Admin avatar */}
            <div className="flex items-center gap-2 border-l border-white/[0.06] pl-3">
              <Avatar className="h-8 w-8 border border-white/10 bg-gradient-to-br from-primary/30 to-secondary/30">
                <AvatarFallback className="bg-transparent text-xs font-semibold text-primary">
                  {getInitials(adminName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden min-w-0 leading-tight xl:block">
                <p className="truncate text-xs font-semibold text-white">{adminName}</p>
                <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
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

  /**
   * Mobile sidebar body — uses Sheet for slide-in. Renders the same nav as the
   * desktop sidebar but always expanded (no collapse toggle).
   */
  function MobileSidebarBody({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-16 shrink-0 items-center border-b border-white/[0.06] px-4">
          <button
            onClick={() => {
              navigate("admin-dashboard");
              onNavigate?.();
            }}
            className="flex items-center gap-2.5"
          >
            <Logo size="sm" className="scale-90" />
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary"
            >
              Admin
            </Badge>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
          <div className="space-y-5">
            {NAV_GROUPS.map((group) => {
              const isCollapsed = collapsedGroups[group.id] ?? false;
              return (
                <div key={group.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 transition-colors hover:text-muted-foreground/80"
                    aria-expanded={!isCollapsed}
                  >
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        isCollapsed && "-rotate-90",
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5">
                          {group.items.map((item) => {
                            const isActive = active === item.key;
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.key}
                                onClick={() => {
                                  navigate(item.route);
                                  onNavigate?.();
                                }}
                                className={cn(
                                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                  isActive
                                    ? "border-l-2 border-primary bg-primary/10 text-primary"
                                    : "border-l-2 border-transparent text-muted-foreground hover:bg-white/5 hover:text-white",
                                )}
                              >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-left">{item.label}</span>
                                {isActive && (
                                  <ChevronRight className="h-3.5 w-3.5 text-primary/60" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </nav>
        <div className="shrink-0 border-t border-white/[0.06] p-3">
          <Button
            variant="outline"
            onClick={() => {
              handleLogout();
              onNavigate?.();
            }}
            className="w-full justify-start border-white/10 bg-transparent text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    );
  }
}

/** Single sidebar nav item — supports collapsed (icon-only) and expanded modes. */
function SidebarNavItem({
  item,
  isActive,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const Icon = item.icon;

  const content = (
    <button
      onClick={() => {
        navigate(item.route);
        onNavigate?.();
      }}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "border-l-2 border-primary bg-primary/10 text-primary"
          : "border-l-2 border-transparent text-muted-foreground hover:bg-white/5 hover:text-white",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-white",
        )}
      />
      {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
      {!collapsed && isActive && (
        <motion.span
          layoutId={`nav-active-${item.key}`}
          className="h-1.5 w-1.5 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }
  return content;
}
