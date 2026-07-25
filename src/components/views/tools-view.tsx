"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@/lib/router";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/config/site";
import { tools, type Tool } from "@/data/tools";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Reveal,
  Stagger,
  StaggerItem,
  GradientTextTeal,
} from "@/components/shared/reveal";
import { AuroraBackground } from "@/components/shared/gradient-cover";
import { BusinessNameGenerator } from "@/components/tools/business-name-generator";
import { WebsiteCostCalculator } from "@/components/tools/website-cost-calculator";
import { QrGenerator } from "@/components/tools/qr-generator";
import { InvoiceGenerator } from "@/components/tools/invoice-generator";
import { PasswordGenerator } from "@/components/tools/password-generator";
import { MetaTitleGenerator } from "@/components/tools/meta-title-generator";
import { MetaDescriptionGenerator } from "@/components/tools/meta-description-generator";
import { PrivacyPolicyGenerator } from "@/components/tools/privacy-policy-generator";
import { TermsGenerator } from "@/components/tools/terms-generator";
import { BrandSloganGenerator } from "@/components/tools/brand-slogan-generator";
import { ImageCompressor } from "@/components/tools/image-compressor";
import { ImageResizer } from "@/components/tools/image-resizer";
import { WebpConverter } from "@/components/tools/webp-converter";
import { SvgOptimizer } from "@/components/tools/svg-optimizer";
import { FaviconGenerator } from "@/components/tools/favicon-generator";
import { PdfToJpg } from "@/components/tools/pdf-to-jpg";
import { JpgToPdf } from "@/components/tools/jpg-to-pdf";
import { MergePdf } from "@/components/tools/merge-pdf";
import { SplitPdf } from "@/components/tools/split-pdf";
import { CompressPdf } from "@/components/tools/compress-pdf";

function ToolContent({ slug }: { slug: string }) {
  switch (slug) {
    case "business-name-generator":
      return <BusinessNameGenerator />;
    case "website-cost-calculator":
      return <WebsiteCostCalculator />;
    case "qr-generator":
      return <QrGenerator />;
    case "invoice-generator":
      return <InvoiceGenerator />;
    case "password-generator":
      return <PasswordGenerator />;
    case "meta-title-generator":
      return <MetaTitleGenerator />;
    case "meta-description-generator":
      return <MetaDescriptionGenerator />;
    case "privacy-policy-generator":
      return <PrivacyPolicyGenerator />;
    case "terms-generator":
      return <TermsGenerator />;
    case "brand-slogan-generator":
      return <BrandSloganGenerator />;
    case "image-compressor":
      return <ImageCompressor />;
    case "image-resizer":
      return <ImageResizer />;
    case "webp-converter":
      return <WebpConverter />;
    case "svg-optimizer":
      return <SvgOptimizer />;
    case "favicon-generator":
      return <FaviconGenerator />;
    case "pdf-to-jpg":
      return <PdfToJpg />;
    case "jpg-to-pdf":
      return <JpgToPdf />;
    case "merge-pdf":
      return <MergePdf />;
    case "split-pdf":
      return <SplitPdf />;
    case "compress-pdf":
      return <CompressPdf />;
    default:
      return null;
  }
}

export function ToolsView() {
  return (
    <div className="relative">
      <PageHeader
        crumbs={[{ label: "Home", route: "home" }, { label: "Free Tools" }]}
        title={
          <>
            Free tools that <GradientTextTeal>just work</GradientTextTeal>
          </>
        }
        description="Ten premium generators, calculators and utilities for modern teams — no signup, no watermark, no fluff. Pick one and ship in seconds."
      />
      <ToolsGrid />
      <ProTipBanner />
      <CtaSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TOOLS GRID (filter + cards + dialog)                                */
/* ------------------------------------------------------------------ */
function ToolsGrid() {
  const categories = useMemo(() => {
    const set = new Set<string>();
    tools.forEach((t) => set.add(t.category));
    return ["All", ...Array.from(set)];
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openTool, setOpenTool] = useState<Tool | null>(null);

  const filtered = useMemo(
    () => (activeCategory === "All" ? tools : tools.filter((t) => t.category === activeCategory)),
    [activeCategory],
  );

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="The toolkit"
          title={
            <>
              <GradientTextTeal>{tools.length} free tools</GradientTextTeal> for builders
            </>
          }
          description="Filter by category and click any tool to launch it instantly in a focused workspace."
        />

        {/* Category pills */}
        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all " +
                    (active
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "border border-white/10 bg-white/5 text-white/70 hover:border-primary/30 hover:bg-white/10 hover:text-white")
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid */}
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => (
            <StaggerItem key={tool.slug}>
              <ToolCard tool={tool} onOpen={() => { track("tool_open", { slug: tool.slug, name: tool.name }); setOpenTool(tool); }} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Tool dialog */}
      <Dialog open={!!openTool} onOpenChange={(o) => !o && setOpenTool(null)}>
        <DialogContent className="max-h-[92vh] w-full max-w-4xl overflow-y-auto border-white/10 bg-card/95 p-0 backdrop-blur-xl sm:max-w-4xl">
          {openTool && (
            <>
              <DialogHeader className="border-b border-white/5 px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 pr-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <openTool.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="font-display text-lg font-semibold text-white">
                      {openTool.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      {openTool.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-4 py-6 sm:px-6">
                <ToolContent slug={openTool.slug} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* TOOL CARD                                                           */
/* ------------------------------------------------------------------ */
function ToolCard({ tool, onOpen }: { tool: Tool; onOpen: () => void }) {
  return (
    <Card
      onClick={onOpen}
      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border-white/5 bg-card/40 p-5 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60 hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
          <tool.icon className="h-6 w-6" />
        </div>
        {tool.badge && (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/25">
            {tool.badge === "New" && <Sparkles className="mr-1 h-3 w-3" />}
            {tool.badge}
          </Badge>
        )}
      </div>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-primary/80">
        {tool.category}
      </p>
      <h3 className="mt-1 font-display text-base font-semibold text-white transition-colors group-hover:text-primary">
        {tool.name}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
        {tool.description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
          Open tool <ArrowRight className="h-3.5 w-3.5" />
        </span>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <ExternalLink className="h-3 w-3" /> Free
        </span>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* PRO TIP BANNER                                                      */
/* ------------------------------------------------------------------ */
function ProTipBanner() {
  const tips = [
    "Generators run 100% in your browser — nothing is sent to a server.",
    "Hit 'Copy' on any output to drop it straight into your project.",
    "Invoice & policy tools support Print → Save as PDF for clean exports.",
  ];
  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/50 to-card/30 p-8 backdrop-blur-xl sm:p-10">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/25">
                  <Lightbulb className="mr-1.5 h-3 w-3" /> Pro tips
                </Badge>
                <h3 className="font-display text-2xl font-bold text-white">
                  Get more out of <GradientTextTeal>every tool</GradientTextTeal>
                </h3>
                <ul className="mt-4 space-y-2">
                  {tips.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm text-white/80">
                  <ShieldCheck className="h-4 w-4 text-primary" /> No signup needed
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm text-white/80">
                  <Zap className="h-4 w-4 text-primary" /> Instant results
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
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
                <Sparkles className="mr-1.5 h-3 w-3" /> Need a custom tool?
              </Badge>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Want a tool built <GradientTextTeal>just for you?</GradientTextTeal>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                These free tools cover the basics. If you need something tailored —
                a branded calculator, a custom generator, or an internal dashboard —
                we&apos;ll design and ship it for you.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("contact")}
                  size="lg"
                  className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-hover"
                >
                  Request a custom build <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("services")}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                >
                  Explore services
                </Button>
              </div>
              <p className="mt-8 text-sm text-muted-foreground/70">
                Or email us at{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-primary hover:underline">
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
