"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Award,
  Headphones,
  RefreshCw,
  ShieldCheck,
  Truck,
  Globe,
  Star,
  Sparkles,
  Heart,
  Eye,
  ShoppingCart,
  Loader2,
  Quote,
  ChevronLeft,
  ChevronRight,
  Mail,
  Check,
  Wand2,
  LayoutTemplate,
  Package,
  FileText,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@/lib/router";
import { products as staticProducts } from "@/data/products";
import { testimonials, trustedBrands } from "@/data/testimonials";
import { AnimatedGradientBg } from "@/components/shared/animated-gradient-bg";
import {
  Reveal,
  Stagger,
  StaggerItem,
  GradientTextTeal,
} from "@/components/shared/reveal";
import { GlassBadge } from "@/components/shared/glass-badge";
import { Price } from "@/components/shared/price";
import { track } from "@/lib/analytics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ================================================================== */
/* TYPES                                                               */
/* ================================================================== */
type DBCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  productCount?: number;
};

type DBProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  shortDescription: string | null;
  image: string | null;
  rating: number;
  reviews: number;
  sales: number;
  popular: boolean;
  isNew: boolean;
  category?: { name: string } | null;
};

/* ================================================================== */
/* ROOT                                                                */
/* ================================================================== */
export function HomeView() {
  return (
    <div className="relative">
      <AnimatedGradientBg />
      <Hero />
      <ShopByCategory />
      <FeaturedProducts />
      <WhyBranify />
      <Testimonials />
      <BrandsMarquee />
      <Newsletter />
      <FinalCTA />
    </div>
  );
}

/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pb-32 sm:pt-32 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — copy */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-4 py-1.5 text-sm text-[#00E5FF]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered premium digital products
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-display text-5xl font-bold leading-[1.05] tracking-tighter text-white sm:text-6xl lg:text-7xl"
            >
              Build Brands That <GradientTextTeal>Stand Out</GradientTextTeal>{" "}
              In The Digital World.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg text-white/60 sm:text-xl"
            >
              Premium templates, AI prompt bundles, brand kits & digital
              products — crafted to help ambitious teams launch faster and
              grow with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                onClick={() => {
                  track("cta_click", { label: "Explore Products", location: "hero" });
                  navigate("storefront");
                }}
                className="h-12 gap-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] px-6 text-sm font-semibold text-[#04121a] shadow-[0_10px_40px_-10px_rgba(0,229,255,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-10px_rgba(0,229,255,0.75)]"
              >
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  track("cta_click", { label: "Get Started", location: "hero" });
                  navigate("contact");
                }}
                className="h-12 gap-1.5 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
              >
                Get Started
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white/80">
                  4.9/5
                </span>
                <span className="text-sm text-white/40">· 12k+ reviews</span>
              </div>
              <TrustBadge icon={ShieldCheck} label="Secure Payments" />
              <TrustBadge icon={Truck} label="Fast Delivery" />
              <TrustBadge icon={Globe} label="Worldwide Support" />
            </motion.div>
          </div>

          {/* RIGHT — floating glass orb */}
          <HeroOrb />
        </div>
      </div>
    </section>
  );
}

function TrustBadge({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-white/60">
      <Icon className="h-4 w-4 text-[#18F2B2]" />
      {label}
    </div>
  );
}

function HeroOrb() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto aspect-square w-full max-w-lg"
    >
      {/* Outer glass card */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-[2.5rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl"
      >
        {/* Gradient sphere */}
        <div className="absolute inset-8 overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/40 via-[#7B61FF]/25 to-[#18F2B2]/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.35),transparent_55%)]" />
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>

        {/* Core orb */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#00E5FF] via-[#7B61FF] to-[#18F2B2] shadow-[0_0_120px_-20px_rgba(0,229,255,0.8)] blur-[1px]"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.55),transparent_55%)]" />
        </motion.div>

        {/* Floating mini orbs */}
        <FloatingOrb className="left-[12%] top-[18%]" delay={0} color="from-[#00E5FF] to-[#7B61FF]" />
        <FloatingOrb className="right-[14%] top-[28%]" delay={1.2} color="from-[#18F2B2] to-[#00E5FF]" />
        <FloatingOrb className="bottom-[14%] left-[20%]" delay={0.6} color="from-[#7B61FF] to-[#18F2B2]" />
        <FloatingOrb className="bottom-[22%] right-[18%]" delay={1.8} color="from-[#00E5FF] to-[#18F2B2]" />
      </motion.div>

      {/* Glow behind */}
      <div className="absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.25),transparent_70%)] blur-3xl" />
    </motion.div>
  );
}

function FloatingOrb({
  className,
  delay = 0,
  color,
}: {
  className?: string;
  delay?: number;
  color: string;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -14, 0],
        x: [0, 8, 0],
      }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={cn(
        "absolute h-12 w-12 rounded-full bg-gradient-to-br opacity-80 shadow-[0_0_40px_-8px_rgba(0,229,255,0.6)]",
        color,
        className,
      )}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.45),transparent_55%)]" />
    </motion.div>
  );
}

/* ================================================================== */
/* SHOP BY CATEGORY                                                    */
/* ================================================================== */
const FALLBACK_CATEGORIES: { name: string; icon: LucideIcon; count: number }[] =
  [
    { name: "Prompts", icon: Wand2, count: 124 },
    { name: "Templates", icon: LayoutTemplate, count: 320 },
    { name: "Kits", icon: Package, count: 86 },
    { name: "Documents", icon: FileText, count: 210 },
    { name: "Planners", icon: CalendarDays, count: 64 },
  ];

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  prompts: Wand2,
  templates: LayoutTemplate,
  kits: Package,
  documents: FileText,
  planners: CalendarDays,
  default: Package,
};

function ShopByCategory() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasDB = categories.length > 0;
  const items = hasDB
    ? categories
    : FALLBACK_CATEGORIES.map((c) => ({
        id: c.name,
        name: c.name,
        slug: c.name.toLowerCase(),
        icon: null,
        description: null,
        productCount: c.count,
      }));

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-[#00E5FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            Browse
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Shop by Category
          </h2>
          <p className="mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
            Find exactly what you need — from AI prompts to full brand kits.
          </p>
        </Reveal>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-[#00E5FF]" />
          </div>
        ) : (
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((cat) => {
              const Icon = resolveCategoryIcon(cat.icon, cat.name);
              const count = cat.productCount ?? 0;
              return (
                <StaggerItem key={cat.id ?? cat.name}>
                  <button
                    onClick={() => {
                      track("category_click", { name: cat.name });
                      navigate("products");
                    }}
                    className="card-premium group relative flex h-full w-full flex-col items-start gap-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left backdrop-blur-xl hover:border-[#00E5FF]/30"
                  >
                    {/* gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 via-transparent to-[#7B61FF]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#00E5FF]/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#00E5FF] transition-colors group-hover:border-[#00E5FF]/40">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="relative">
                      <h3 className="font-display text-base font-semibold text-white">
                        {cat.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-white/50">
                        {count > 0 ? `${count} products` : "Explore →"}
                      </p>
                    </div>
                  </button>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </div>
    </section>
  );
}

function resolveCategoryIcon(
  icon: string | null,
  name: string,
): LucideIcon {
  if (icon) {
    const key = icon.toLowerCase();
    if (CATEGORY_ICON_MAP[key]) return CATEGORY_ICON_MAP[key];
  }
  const key = name.toLowerCase();
  return CATEGORY_ICON_MAP[key] ?? CATEGORY_ICON_MAP.default;
}

/* ================================================================== */
/* FEATURED PRODUCTS                                                   */
/* ================================================================== */
function FeaturedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products.slice(0, 8));
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fallback to static products if API returns nothing
  const items: DisplayProduct[] =
    products.length > 0
      ? products.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice ?? undefined,
          shortDescription: p.shortDescription ?? "",
          image: p.image ?? null,
          rating: p.rating,
          reviews: p.reviews,
          sales: p.sales,
          popular: p.popular,
          isNew: p.isNew,
          category: p.category?.name ?? null,
        }))
      : staticProducts.slice(0, 8).map((p) => ({
          id: p.slug,
          slug: p.slug,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          shortDescription: p.tagline,
          image: null,
          rating: p.rating,
          reviews: p.reviews,
          sales: p.sales,
          popular: Boolean(p.popular),
          isNew: Boolean(p.new),
          category: p.category,
        }));

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success("Added to wishlist");
  };

  const addToCart = (name: string) => {
    toast.success(`${name} added to cart`);
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-[#7B61FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7B61FF] animate-pulse" />
            Bestsellers
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Featured Products
          </h2>
          <p className="mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
            Hand-picked digital products our customers love. Instant download.
          </p>
        </Reveal>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-[#00E5FF]" />
          </div>
        ) : (
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <StaggerItem key={p.id} className="h-full">
                <ProductCard
                  product={p}
                  isWishlisted={Boolean(wishlist[p.id])}
                  onWishlist={() => toggleWishlist(p.id)}
                  onAddToCart={() => addToCart(p.name)}
                  onView={() => {
                    track("product_click", { slug: p.slug, location: "home_featured" });
                    navigate("product-detail", { slug: p.slug });
                  }}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <Reveal className="mt-12 flex justify-center">
          <Button
            onClick={() => navigate("storefront")}
            className="h-11 gap-1.5 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

type DisplayProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  image: string | null;
  rating: number;
  reviews: number;
  sales: number;
  popular: boolean;
  isNew: boolean;
  category: string | null;
};

function ProductCard({
  product,
  isWishlisted,
  onWishlist,
  onAddToCart,
  onView,
}: {
  product: DisplayProduct;
  isWishlisted: boolean;
  onWishlist: () => void;
  onAddToCart: () => void;
  onView: () => void;
}) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="card-premium group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl hover:border-[#00E5FF]/30">
      {/* Image / cover */}
      <button
        onClick={onView}
        className="relative aspect-[4/3] w-full overflow-hidden text-left"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full items-center justify-center bg-gradient-to-br from-[#00E5FF]/15 via-[#7B61FF]/10 to-[#18F2B2]/15">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <Package className="h-10 w-10 text-white/30" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.popular && (
            <GlassBadge variant="teal">
              <Sparkles className="h-3 w-3" /> Popular
            </GlassBadge>
          )}
          {product.isNew && (
            <GlassBadge variant="emerald">New</GlassBadge>
          )}
        </div>
      </button>

      {/* Wishlist heart (top-right) */}
      <button
        onClick={onWishlist}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-all",
            isWishlisted
              ? "fill-rose-500 text-rose-500"
              : "text-white/80",
          )}
        />
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#00E5FF]/80">
            {product.category}
          </p>
        )}
        <button onClick={onView} className="text-left">
          <h3 className="mt-1 font-display text-base font-semibold text-white transition-colors group-hover:text-[#00E5FF]">
            {product.name}
          </h3>
        </button>
        <p className="mt-1 line-clamp-2 text-sm text-white/50">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-white/80">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-white/40">
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <Price value={product.price} size="sm" />
            {discount > 0 && (
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Hover actions */}
        <div className="mt-3 grid grid-cols-2 gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Button
            onClick={onView}
            className="h-9 gap-1 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-white hover:bg-white/10"
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </Button>
          <Button
            onClick={onAddToCart}
            className="h-9 gap-1 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-xs font-semibold text-[#04121a]"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* WHY BRANIFY                                                          */
/* ================================================================== */
const WHY_FEATURES: { icon: LucideIcon; title: string; description: string }[] =
  [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Every product is reviewed for design polish, performance and craft.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      description:
        "256-bit SSL encryption and trusted payment providers — always.",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description:
        "Instant digital delivery. Download your purchase immediately.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Real humans, anytime. We respond within a few hours, every day.",
    },
    {
      icon: RefreshCw,
      title: "Money Back Guarantee",
      description:
        "Not happy within 14 days? We'll refund you — no questions asked.",
    },
  ];

function WhyBranify() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#18F2B2]/30 bg-[#18F2B2]/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-[#18F2B2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#18F2B2] animate-pulse" />
            Why us
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Why <GradientTextTeal>BRANIFY</GradientTextTeal>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
            We obsess over the details so you can ship with confidence.
          </p>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_FEATURES.map((f) => (
            <StaggerItem key={f.title} className="h-full">
              <div className="card-premium group relative flex h-full flex-col items-start gap-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl hover:border-[#00E5FF]/30">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#00E5FF]/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[#00E5FF]/15 to-[#7B61FF]/15 text-[#00E5FF]">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="relative">
                  <h3 className="font-display text-base font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/55">
                    {f.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ================================================================== */
/* TESTIMONIALS — auto-rotating slider                                 */
/* ================================================================== */
function Testimonials() {
  const featured = testimonials.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex((i + featured.length) % featured.length),
    [featured.length],
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, featured.length]);

  const active = featured[index];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-[#7B61FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7B61FF] animate-pulse" />
            Reviews
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Customer Reviews
          </h2>
          <p className="mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
            Trusted by 12,000+ founders, designers and marketers worldwide.
          </p>
        </Reveal>

        <Reveal className="relative mx-auto max-w-3xl">
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl sm:p-12"
          >
            {/* glow */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-[#00E5FF]/15 blur-3xl" />

            <div className="relative min-h-[260px] sm:min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="flex flex-col items-center text-center"
                >
                  <Quote className="h-9 w-9 text-[#00E5FF]/50" />
                  <div className="mt-4 flex">
                    {Array.from({ length: active.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mt-5 font-display text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
                    “{active.quote}”
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7B61FF] text-sm font-bold text-[#04121a]">
                      {active.avatar}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">
                        {active.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {active.role}, {active.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => goTo(index - 1)}
                aria-label="Previous"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index
                        ? "w-6 bg-gradient-to-r from-[#00E5FF] to-[#18F2B2]"
                        : "w-1.5 bg-white/20 hover:bg-white/40",
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() => goTo(index + 1)}
                aria-label="Next"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* BRANDS — marquee                                                    */
/* ================================================================== */
function BrandsMarquee() {
  const brands = trustedBrands;
  const doubled = [...brands, ...brands];

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-white/40">
            Trusted by teams at
          </p>
        </Reveal>

        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div className="flex w-max animate-marquee items-center gap-12">
            {doubled.map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="font-display text-2xl font-bold tracking-tight text-white/30 transition-colors duration-300 hover:text-white sm:text-3xl"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* NEWSLETTER                                                          */
/* ================================================================== */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "home" }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(data.isNew ? "You're subscribed! 🎉" : "Welcome back — you're on the list.");
        setEmail("");
      } else {
        toast.error(data.error ?? "Something went wrong.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl sm:p-12 lg:p-16">
          {/* glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#00E5FF]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#7B61FF]/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#00E5FF]/15 to-[#7B61FF]/15 text-[#00E5FF]">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stay Updated
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/60">
              Join 25,000+ founders and creators. Get product drops, free
              resources and exclusive offers — no spam, ever.
            </p>

            <form
              onSubmit={onSubmit}
              className="mx-auto mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 flex-1 rounded-xl border-white/10 bg-white/[0.04] text-white placeholder:text-white/40"
                disabled={submitting}
              />
              <Button
                type="submit"
                disabled={submitting}
                className="h-12 gap-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] px-6 text-sm font-semibold text-[#04121a] shadow-[0_10px_30px_-10px_rgba(0,229,255,0.6)] transition-all hover:-translate-y-0.5 disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/40">
              <Check className="h-3.5 w-3.5 text-[#18F2B2]" />
              Unsubscribe anytime · No credit card needed
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* FINAL CTA                                                           */
/* ================================================================== */
function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#00E5FF]/10 via-[#0B1022] to-[#7B61FF]/10 p-8 backdrop-blur-xl sm:p-12 lg:p-16">
          {/* glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#00E5FF]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#7B61FF]/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.04]" />

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tighter text-white sm:text-5xl lg:text-6xl">
              Ready to build your <GradientTextTeal>brand</GradientTextTeal>?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/70 sm:text-lg">
              Join thousands of teams shipping faster with BRANIFY's premium
              digital products. Start exploring the marketplace today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => {
                  track("cta_click", { label: "Start Shopping", location: "home_final" });
                  navigate("storefront");
                }}
                className="h-12 gap-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] px-7 text-sm font-semibold text-[#04121a] shadow-[0_10px_40px_-10px_rgba(0,229,255,0.6)] transition-all hover:-translate-y-0.5"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  track("cta_click", { label: "Talk to us", location: "home_final" });
                  navigate("contact");
                }}
                className="h-12 gap-1.5 rounded-xl border border-white/10 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
              >
                Talk to us
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
