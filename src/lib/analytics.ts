"use client";

import { useEffect } from "react";

/**
 * Lightweight client-side analytics utility.
 *
 * Tracks events to localStorage (capped at 200 entries, FIFO) so they can be
 * inspected in dev or shipped to a backend later. The API mirrors common
 * analytics SDKs (`track(event, props)`) so swapping in PostHog/Mixpanel/Plausible
 * later is a one-line change.
 *
 * Events tracked automatically by the app:
 *  - `navigate` — view changes (via useNavigationTracking hook in the root)
 *  - `cta_click` — primary CTA clicks
 *  - `tool_open` — free tool dialog opened
 *  - `search` — search queries
 *
 * Usage:
 *   import { track } from "@/lib/analytics";
 *   track("cta_click", { label: "Start a project", location: "hero" });
 *
 * Inspect:
 *   analytics.dump()  // returns all events
 *   analytics.clear() // clears store
 */

export type AnalyticsEvent = {
  id: string;
  event: string;
  props?: Record<string, unknown>;
  ts: number;
  path: string;
};

const STORAGE_KEY = "branify:analytics";
const MAX_EVENTS = 200;

function read(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function write(events: AnalyticsEvent[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    /* quota / private mode — silently ignore */
  }
}

/** Track an analytics event. Safe to call anywhere; no-ops on SSR. */
export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const entry: AnalyticsEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    event,
    props,
    ts: Date.now(),
    path: window.location.pathname,
  };
  const events = read();
  events.push(entry);
  // FIFO cap
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS);
  }
  write(events);

  // Emit a console event in dev for debugging (no-op in production console).
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${event}`, props ?? {});
  }
}

/** Analytics helper namespace for inspection / management. */
export const analytics = {
  /** Return all recorded events (newest last). */
  dump(): AnalyticsEvent[] {
    return read();
  },
  /** Return counts grouped by event name. */
  counts(): Record<string, number> {
    return read().reduce(
      (acc, e) => {
        acc[e.event] = (acc[e.event] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  },
  /** Clear all recorded events. */
  clear() {
    write([]);
  },
};

/**
 * useNavigationTracking — call once in the root component to auto-track every
 * client-side navigation as a `navigate` analytics event. Subscribes to the
 * Zustand router store and logs `{ route, slug }` on each change.
 */
export function useNavigationTracking() {
  useEffect(() => {
    // Lazy-import the router to avoid a circular dependency at module load.
    let unsub: (() => void) | undefined;
    let cancelled = false;
    void import("@/lib/router").then(({ useRouterStore }) => {
      if (cancelled) return;
      unsub = useRouterStore.subscribe((state, prev) => {
        if (state.route !== prev.route) {
          track("navigate", { route: state.route, slug: state.slug ?? undefined });
        }
      });
    });
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);
}
