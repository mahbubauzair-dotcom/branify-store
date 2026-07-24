"use client";

import { useEffect, lazy, Suspense } from "react";
import { useRouterStore } from "@/lib/router";

/**
 * /adminpanel — deep-link entry point to the admin panel.
 *
 * The app is a single-route SPA (/), so this page boots the same root
 * component but initializes the Zustand router to "admin-login" before
 * rendering. The AdminLoginView auto-redirects to the dashboard if the
 * user is already authenticated.
 *
 * Accessible at: branify.store/adminpanel
 */

// Reuse the root SPA component (same as /).
const Home = lazy(() => import("@/app/page").then((m) => ({ default: m.default })));

export default function AdminPanelPage() {
  const initRoute = useRouterStore((s) => s.initRoute);

  useEffect(() => {
    initRoute("admin-login");
  }, [initRoute]);

  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  );
}
