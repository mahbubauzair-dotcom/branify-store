"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  RefreshCw,
  Lock,
  Download,
  ShoppingCart,
  Minus,
  Plus,
  Quote,
  Home,
  ChevronRight,
  PackageOpen,
  ZoomIn,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate, useRouterStore } from "@/lib/router";
import { siteConfig } from "@/config/site";
import {
  products,
  productReviews,
  type Product,
} from "@/data/products";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Reveal,
  Stagger,
  StaggerItem,
  GradientTextTeal,
} from "@/components/shared/reveal";
import {
  GradientCover,
  AuroraBackground,
} from "@/components/shared/gradient-cover";
import { toast } from "sonner";

const productFaqs = [
  {
    q: "What formats are included?",
    a: "Each product ships in multiple formats — see the format chips on this page. You'll get all formats in one zip with clear folder structure and a quick-start README.",
  },
  {
    q: "Do I get lifetime updates?",
    a: "Yes. Every purchase includes lifetime updates for that product. When we ship new versions, templates, or improvements, you'll get an email with a fresh download link — free, forever.",
  },
  {
    q: "Can I use this for client work?",
    a: "Absolutely. The commercial license lets you use these products on unlimited personal and client projects. You may not resell or redistribute the source files themselves.",
  },
  {
    q: "How fast do I get my files?",
    a: "Instantly. The moment your payment clears you'll receive an email with a secure download link, plus a permanent link inside your BRANIFY account dashboard.",
  },
  {
    q: "What if it's not for me?",
    a: "We offer a 30-day no-questions-asked money-back guarantee. If the product doesn't fit your needs, email hello@branify.store and we'll refund you in full.",
  },
];

export function ProductDetailView() {
  const slug = useRouterStore((s) => s.slug);
  const found = products.find((p) => p.slug === slug);
  const product = found ?? products[0];

  if (!found) {
    return <NotFoundState />;
  }

  return (
    <div className="relative pb-28 lg:pb-0">
      <ProductHero product={product} />
      <ProductTabs product={product} />
      <RelatedProducts product={product} />
      <CtaSection />
      <StickyBuyBar product={product} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NOT FOUND STATE                                                     */
/* ------------------------------------------------------------------ */
function NotFoundState() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden py-32">
      <AuroraBackground />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PackageOpen className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold text-white sm:text-5xl">
          Product <GradientTextTeal>not found</GradientTextTeal>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          We couldn&apos;t find the product you were looking for. It may have
          been retired or the link may be incorrect.
        </p>
        <Button
          onClick={() => navigate("products")}
          className="mt-8 h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
        </Button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* BREADCRUMBS                                                         */
/* ------------------------------------------------------------------ */
function Breadcrumbs({ product }: { product: Product }) {
  const navigate = useNavigate();
  return (
    <nav
      className="flex items-center gap-1.5 text-sm text-muted-foreground"
      aria-label="Breadcrumb"
    >
      <button
        onClick={() => navigate("home")}
        className="hover:text-primary transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </button>
      <ChevronRight className="h-3.5 w-3.5 opacity-40" />
      <button
        onClick={() => navigate("products")}
        className="hover:text-primary transition-colors"
      >
        Products
      </button>
      <ChevronRight className="h-3.5 w-3.5 opacity-40" />
      <span className="max-w-[10rem] truncate text-white sm:max-w-xs">
        {product.name}
      </span>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */
function ProductHero({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const galleryVariants = useMemo(
    () => (product.gallery.length > 0 ? product.gallery : [product.preview]),
    [product],
  );
  const activeVariant = galleryVariants[activeIndex] ?? product.preview;
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <AuroraBackground />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <Reveal>
          <Breadcrumbs product={product} />
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* LEFT: gallery */}
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <div className="group relative">
                <GradientCover
                  variant={activeVariant}
                  className="aspect-[4/3] w-full rounded-3xl border border-white/10"
                >
                  <div className="flex h-full items-center justify-center p-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
                      <product.icon className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute left-4 top-4 flex gap-2">
                    {product.popular && (
                      <Badge className="bg-primary/90 text-primary-foreground">
                        <Sparkles className="mr-1 h-3 w-3" /> Popular
                      </Badge>
                    )}
                    {product.new && (
                      <Badge className="bg-emerald-500/90 text-emerald-50">
                        New
                      </Badge>
                    )}
                  </div>
                </GradientCover>
                {/* Zoom button overlay */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Zoom image"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white opacity-0 backdrop-blur transition-all hover:bg-black/60 group-hover:opacity-100"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {galleryVariants.map((g, i) => (
                  <button
                    key={g + i}
                    onClick={() => setActiveIndex(i)}
                    className={
                      "relative overflow-hidden rounded-xl border transition-all " +
                      (i === activeIndex
                        ? "border-primary ring-2 ring-primary/40"
                        : "border-white/10 hover:border-primary/40")
                    }
                  >
                    <GradientCover variant={g} className="aspect-[4/3]">
                      <div className="flex h-full items-center justify-center">
                        <product.icon className="h-6 w-6 text-white/70" />
                      </div>
                    </GradientCover>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* RIGHT: info */}
          <Reveal delay={0.1}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-primary"
                >
                  {product.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  by {product.author}
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {product.name}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                {product.tagline}
              </p>

              {/* Rating row */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="font-semibold text-white">
                    {product.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <span className="h-4 w-px bg-white/10" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-white/80">
                    {product.sales.toLocaleString()}
                  </span>{" "}
                  sales
                </span>
              </div>

              {/* Price block */}
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-white">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <Badge className="bg-rose-500/90 text-white hover:bg-rose-500">
                    {discount}% OFF
                  </Badge>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  One-time payment · Lifetime access
                </span>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {product.description}
              </p>

              {/* Format chips */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Available formats
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.format.map((f) => (
                    <span
                      key={f}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {product.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-start gap-2 text-sm text-white/85"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Quantity + actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-display font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  size="lg"
                  className="h-12 flex-1 rounded-full bg-primary px-6 text-primary-foreground hover:bg-hover"
                  onClick={() =>
                    toast.success(`${quantity} × ${product.name} added to cart`)
                  }
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-6 hover:bg-white/10"
                  onClick={() =>
                    toast.success(`Processing your purchase of ${product.name}`)
                  }
                >
                  Buy now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Trust row */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { icon: Download, label: "Instant download" },
                  { icon: RefreshCw, label: "Lifetime updates" },
                  { icon: Lock, label: "Secure checkout" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-card/30 px-3 py-2.5 text-sm text-white/80"
                  >
                    <t.icon className="h-4 w-4 text-primary" />
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Lightbox modal — full-screen zoom view of the active gallery image */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[75] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close zoom"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              <GradientCover
                variant={activeVariant}
                className="aspect-[4/3] w-full rounded-3xl border border-white/15 shadow-premium-lg"
              >
                <div className="flex h-full items-center justify-center p-12">
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
                    <product.icon className="h-16 w-16 text-white" />
                  </div>
                </div>
              </GradientCover>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* STAR RATING                                                         */
/* ------------------------------------------------------------------ */
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < Math.ceil(rating);
        return (
          <Star
            key={i}
            className={
              dim +
              (filled
                ? " fill-amber-400 text-amber-400"
                : half
                  ? " fill-amber-400/50 text-amber-400"
                  : " fill-none text-white/20")
            }
          />
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* TABS                                                                */
/* ------------------------------------------------------------------ */
function ProductTabs({ product }: { product: Product }) {
  const reviews = productReviews.default;
  const avg =
    reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-2xl border border-white/5 bg-card/40 p-1.5 backdrop-blur">
            <TabsTrigger
              value="description"
              className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Features
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Description */}
          <TabsContent value="description" className="mt-8">
            <Reveal>
              <div className="rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
                <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                  About this product
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Built and battle-tested by the BRANIFY studio team, {product.name}{" "}
                  is engineered for teams that ship fast without compromising on
                  craft. Every layer is organized, labelled, and ready to drop
                  straight into your workflow — whether you&apos;re a solo
                  founder, an in-house designer, or an agency serving multiple
                  clients.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  You&apos;ll spend zero time untangling messy files and 100% of
                  your time on the work that actually moves the needle: crafting
                  your message, refining the visuals, and launching. The
                  included formats cover every major tool in your stack, and our
                  lifetime updates mean you&apos;ll always have access to the
                  latest version.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-background/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      What&apos;s inside
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-white/85">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-background/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Formats included
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {product.format.map((f) => (
                        <span
                          key={f}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/80"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Author
                    </p>
                    <p className="mt-1 text-sm text-white/85">{product.author}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features" className="mt-8">
            <Stagger className="grid gap-4 sm:grid-cols-2">
              {product.features.map((f, i) => (
                <StaggerItem key={f}>
                  <div className="flex h-full items-start gap-3 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Check className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="font-display font-semibold text-white">
                        {f}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Thoughtfully designed and production-ready — feature{" "}
                        {i + 1} of {product.features.length}.
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="mt-8">
            <Reveal>
              {/* Summary */}
              <div className="mb-8 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-card/40 p-6 text-center backdrop-blur sm:flex-row sm:gap-8 sm:text-left">
                <div className="flex flex-col items-center">
                  <span className="font-display text-5xl font-bold text-white">
                    {avg.toFixed(1)}
                  </span>
                  <StarRating rating={avg} size="lg" />
                  <span className="mt-1 text-xs text-muted-foreground">
                    Based on {reviews.length} reviews
                  </span>
                </div>
                <div className="hidden h-16 w-px bg-white/10 sm:block" />
                <div className="max-w-md text-sm text-muted-foreground">
                  Verified buyers consistently rate {product.name}{" "}
                  <span className="font-semibold text-white">
                    {avg >= 4.8 ? "exceptionally high"
                      : avg >= 4.5 ? "very highly"
                        : "highly"}
                  </span>{" "}
                  for craft, ease of use, and value for money.
                </div>
              </div>

              <Stagger className="grid gap-4 sm:grid-cols-2">
                {reviews.map((r) => (
                  <StaggerItem key={r.name}>
                    <Card className="h-full rounded-2xl border-white/5 bg-card/40 p-5 backdrop-blur">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-cyan-600/30 text-sm font-semibold text-primary">
                            {r.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{r.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.role}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      <Quote className="mt-4 h-5 w-5 text-primary/40" />
                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {r.text}
                      </p>
                    </Card>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="mt-8">
            <Reveal>
              <div className="rounded-2xl border border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
                <Accordion type="single" collapsible defaultValue="faq-0">
                  {productFaqs.map((f, i) => (
                    <AccordionItem
                      key={f.q}
                      value={`faq-${i}`}
                      className="border-white/5"
                    >
                      <AccordionTrigger className="text-left font-display text-base font-semibold text-white hover:no-underline">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Reveal>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* RELATED PRODUCTS                                                    */
/* ------------------------------------------------------------------ */
function RelatedProducts({ product }: { product: Product }) {
  const navigate = useNavigate();
  const related = useMemo(() => {
    const sameCategory = products.filter(
      (p) => p.category === product.category && p.slug !== product.slug,
    );
    const others = products.filter(
      (p) => p.category !== product.category && p.slug !== product.slug,
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [product]);

  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 sm:py-28">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Keep exploring"
          title={
            <>
              Related <GradientTextTeal>products</GradientTextTeal>
            </>
          }
          description="Hand-picked from the same category — and beyond — that customers frequently bundle."
        />
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <StaggerItem key={p.slug}>
              <Card
                onClick={() => navigate("product-detail", { slug: p.slug })}
                className="group h-full cursor-pointer overflow-hidden rounded-2xl border-white/5 bg-card/40 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60"
              >
                <GradientCover variant={p.preview} className="h-36">
                  <div className="flex h-full items-center justify-center">
                    <p.icon className="h-9 w-9 text-white/80" />
                  </div>
                  {(p.popular || p.new) && (
                    <div className="absolute left-3 top-3">
                      <Badge
                        className={
                          p.new
                            ? "bg-emerald-500/90 text-emerald-50"
                            : "bg-primary/90 text-primary-foreground"
                        }
                      >
                        {p.new ? "New" : "Popular"}
                      </Badge>
                    </div>
                  )}
                </GradientCover>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wider text-primary/80">
                    {p.category}
                  </p>
                  <h3 className="mt-1 font-display font-semibold text-white transition-colors group-hover:text-primary">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {p.tagline}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-lg font-bold text-white">
                        ${p.price}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${p.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {p.rating}
                    </span>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* STICKY BUY BAR                                                      */
/* ------------------------------------------------------------------ */
function StickyBuyBar({ product }: { product: Product }) {
  return (
    <div className="fixed bottom-4 inset-x-4 z-30 mx-auto max-w-3xl">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/80 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <product.icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-white">
              {product.name}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-base font-bold text-primary">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          size="lg"
          className="h-11 shrink-0 rounded-full bg-primary px-5 text-primary-foreground hover:bg-hover sm:px-7"
          onClick={() =>
            toast.success(`Processing your purchase of ${product.name}`)
          }
        >
          Buy now <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */
function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/60 to-card/40 p-10 backdrop-blur-xl sm:p-16">
            <AuroraBackground />
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative mx-auto max-w-3xl text-center">
              <Badge className="mb-6 bg-primary/20 text-primary hover:bg-primary/25">
                <Sparkles className="mr-1.5 h-3 w-3" /> Save more, ship faster
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Bundle &amp; save{" "}
                <GradientTextTeal>40% instantly</GradientTextTeal>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                Use code BRANIFY40 at checkout to save 40% on every product in
                your cart. Lifetime updates included on every purchase.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("products")}
                  size="lg"
                  className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                >
                  Browse all products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("contact")}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                >
                  Talk to sales
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {[
                  { icon: Zap, label: "Instant download" },
                  { icon: RefreshCw, label: "Lifetime updates" },
                  { icon: ShieldCheck, label: "30-day refund" },
                  { icon: Clock, label: "24/7 support" },
                ].map((t) => (
                  <span
                    key={t.label}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <t.icon className="h-4 w-4 text-primary" />
                    {t.label}
                  </span>
                ))}
              </div>
              <p className="mt-8 text-sm text-muted-foreground/70">
                Questions? Email{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-primary hover:underline"
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
