"use client";

import { create } from "zustand";

export type RouteName =
  | "home"
  | "services"
  | "service-detail"
  | "products"
  | "product-detail"
  | "tools"
  | "tool-detail"
  | "portfolio"
  | "pricing"
  | "blog"
  | "blog-post"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "refund"
  | "faq"
  | "search"
  | "not-found"
  // Admin panel routes (admin SPA — no public navbar/footer)
  | "admin-login"
  | "admin-dashboard"
  | "admin-products"
  | "admin-product-edit"
  | "admin-categories"
  | "admin-builder"
  | "storefront";

interface RouterState {
  route: RouteName;
  /** Optional param slug for detail pages (product / blog / tool) */
  slug: string | null;
  /** Optional search query for the search view */
  query: string | null;
  navigate: (route: RouteName, opts?: { slug?: string | null; query?: string | null }) => void;
  /** Set the initial route without affecting history (used by deep-link pages). */
  initRoute: (route: RouteName, opts?: { slug?: string | null; query?: string | null }) => void;
  back: () => void;
}

const history: RouteName[] = ["home"];

export const useRouterStore = create<RouterState>((set, get) => ({
  route: "home",
  slug: null,
  query: null,
  navigate: (route, opts) => {
    history.push(get().route);
    set({ route, slug: opts?.slug ?? null, query: opts?.query ?? null });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  },
  initRoute: (route, opts) => {
    set({ route, slug: opts?.slug ?? null, query: opts?.query ?? null });
  },
  back: () => {
    const prev = history.pop();
    if (prev) {
      set({ route: prev });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }
  },
}));

/** Helper hook to navigate imperatively */
export function useNavigate() {
  return useRouterStore((s) => s.navigate);
}

/** Admin panel routes use their own chrome (sidebar + topbar) — no public navbar/footer. */
export const ADMIN_ROUTES: RouteName[] = [
  "admin-login",
  "admin-dashboard",
  "admin-products",
  "admin-product-edit",
  "admin-categories",
  "admin-builder",
];

export function isAdminRoute(route: RouteName): boolean {
  return ADMIN_ROUTES.includes(route);
}
