"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useRouterStore } from "@/lib/router";
import { HomeView } from "@/components/views/home-view";
import { ServicesView } from "@/components/views/services-view";
import { ProductsView } from "@/components/views/products-view";
import { ProductDetailView } from "@/components/views/product-detail-view";
import { ToolsView } from "@/components/views/tools-view";
import { PortfolioView } from "@/components/views/portfolio-view";
import { PricingView } from "@/components/views/pricing-view";
import { BlogView } from "@/components/views/blog-view";
import { BlogPostView } from "@/components/views/blog-post-view";
import { AboutView } from "@/components/views/about-view";
import { ContactView } from "@/components/views/contact-view";
import { FaqView } from "@/components/views/faq-view";
import { SearchView } from "@/components/views/search-view";
import { NotFoundView } from "@/components/views/not-found-view";
import { PrivacyView, TermsView, RefundView } from "@/components/views/legal-views";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { CommandPalette } from "@/components/layout/command-palette";
import { BackToTop } from "@/components/layout/back-to-top";

export default function Home() {
  const route = useRouterStore((s) => s.route);
  const slug = useRouterStore((s) => s.slug);

  const view = (() => {
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
  })();

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
            {view}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
