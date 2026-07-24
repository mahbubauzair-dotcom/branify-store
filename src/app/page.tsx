"use client";

import { lazy, Suspense, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { CommandPalette } from "@/components/layout/command-palette";
import { BackToTop } from "@/components/layout/back-to-top";
import { useRouterStore } from "@/lib/router";
import { useNavigationTracking } from "@/lib/analytics";
import { HomeView } from "@/components/views/home-view";

// Code-split non-home views so the initial bundle only ships the homepage.
// Each view loads on demand when the user navigates to it.
const ServicesView = lazy(() =>
  import("@/components/views/services-view").then((m) => ({ default: m.ServicesView })),
);
const ProductsView = lazy(() =>
  import("@/components/views/products-view").then((m) => ({ default: m.ProductsView })),
);
const ProductDetailView = lazy(() =>
  import("@/components/views/product-detail-view").then((m) => ({ default: m.ProductDetailView })),
);
const ToolsView = lazy(() =>
  import("@/components/views/tools-view").then((m) => ({ default: m.ToolsView })),
);
const PortfolioView = lazy(() =>
  import("@/components/views/portfolio-view").then((m) => ({ default: m.PortfolioView })),
);
const PricingView = lazy(() =>
  import("@/components/views/pricing-view").then((m) => ({ default: m.PricingView })),
);
const BlogView = lazy(() =>
  import("@/components/views/blog-view").then((m) => ({ default: m.BlogView })),
);
const BlogPostView = lazy(() =>
  import("@/components/views/blog-post-view").then((m) => ({ default: m.BlogPostView })),
);
const AboutView = lazy(() =>
  import("@/components/views/about-view").then((m) => ({ default: m.AboutView })),
);
const ContactView = lazy(() =>
  import("@/components/views/contact-view").then((m) => ({ default: m.ContactView })),
);
const FaqView = lazy(() =>
  import("@/components/views/faq-view").then((m) => ({ default: m.FaqView })),
);
const SearchView = lazy(() =>
  import("@/components/views/search-view").then((m) => ({ default: m.SearchView })),
);
const NotFoundView = lazy(() =>
  import("@/components/views/not-found-view").then((m) => ({ default: m.NotFoundView })),
);
const PrivacyView = lazy(() =>
  import("@/components/views/legal-views").then((m) => ({ default: m.PrivacyView })),
);
const TermsView = lazy(() =>
  import("@/components/views/legal-views").then((m) => ({ default: m.TermsView })),
);
const RefundView = lazy(() =>
  import("@/components/views/legal-views").then((m) => ({ default: m.RefundView })),
);

/** A premium loading skeleton shown while a lazy view chunk loads. */
function ViewSkeleton() {
  return (
    <div className="relative min-h-[60vh]">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="mx-auto h-4 w-24 rounded-full bg-white/5 shimmer" />
          <div className="mx-auto h-10 w-3/4 rounded-xl bg-white/5 shimmer" />
          <div className="mx-auto h-5 w-1/2 rounded-lg bg-white/[0.03] shimmer" />
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl border border-white/5 bg-card/30 shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const route = useRouterStore((s) => s.route);
  const slug = useRouterStore((s) => s.slug);

  // Auto-track every navigation as an analytics event.
  useNavigationTracking();

  const view = useMemo(() => {
    switch (route) {
      case "home": return <HomeView />;
      case "services": return <ServicesView />;
      case "products": return <ProductsView />;
      case "product-detail": return <ProductDetailView />;
      case "tools": return <ToolsView />;
      case "portfolio": return <PortfolioView />;
      case "pricing": return <PricingView />;
      case "blog": return <BlogView />;
      case "blog-post": return <BlogPostView />;
      case "about": return <AboutView />;
      case "contact": return <ContactView />;
      case "faq": return <FaqView />;
      case "search": return <SearchView />;
      case "privacy": return <PrivacyView />;
      case "terms": return <TermsView />;
      case "refund": return <RefundView />;
      default: return <NotFoundView />;
    }
  }, [route, slug]);

  // Home is eager (most common); all other views are lazy-loaded with a
  // premium skeleton fallback.
  const isHome = route === "home";

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <CommandPalette />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route + (slug ?? "")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {isHome ? (
              view
            ) : (
              <Suspense fallback={<ViewSkeleton />}>{view}</Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
