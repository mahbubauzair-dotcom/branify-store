"use client";

import { create } from "zustand";

export type RouteName =
  | "home"
  | "services"
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
  | "not-found";

interface RouterState {
  route: RouteName;
  /** Optional param slug for detail pages (product / blog / tool) */
  slug: string | null;
  /** Optional search query for the search view */
  query: string | null;
  navigate: (route: RouteName, opts?: { slug?: string | null; query?: string | null }) => void;
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
