import {
  Code2,
  LayoutTemplate,
  Rocket,
  Palette,
  PenTool,
  Sparkles,
  Share2,
  Presentation,
  Search,
  BrainCircuit,
  Wrench,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  deliverables: string[];
  startingPrice: number;
  popular?: boolean;
  accent: string;
};

export const services: Service[] = [
  {
    slug: "website-development",
    title: "Website Development",
    tagline: "Pixel-perfect, blazing-fast websites.",
    description:
      "Custom-coded, performance-obsessed websites built with Next.js, React & modern tooling. 95+ Lighthouse scores out of the box.",
    icon: Code2,
    features: ["Next.js / React", "Server Components", "Edge-optimized", "WCAG accessible", "CMS integration"],
    deliverables: ["Production codebase", "Design system", "Deployment setup", "30-day support"],
    startingPrice: 2499,
    popular: true,
    accent: "from-teal-400/20 to-teal-600/5",
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    tagline: "Flexible, content-driven sites.",
    description:
      "Bespoke WordPress & Elementor builds with custom blocks, ACF, WooCommerce & headless options.",
    icon: LayoutTemplate,
    features: ["Custom themes", "ACF blocks", "WooCommerce", "Headless WP", "Performance tuning"],
    deliverables: ["Custom theme", "Admin training", "Backup system", "Security hardening"],
    startingPrice: 1899,
    accent: "from-sky-400/20 to-sky-600/5",
  },
  {
    slug: "landing-pages",
    title: "Landing Pages",
    tagline: "High-converting, launch-ready pages.",
    description:
      "Conversion-optimized landing pages designed to turn visitors into customers. CRO best practices baked in.",
    icon: Rocket,
    features: ["CRO framework", "A/B test ready", "Analytics setup", "Lead capture", "Fast delivery"],
    deliverables: ["3 landing pages", "Conversion copy", "Heatmap setup", "Analytics dashboard"],
    startingPrice: 899,
    accent: "from-amber-400/20 to-amber-600/5",
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    tagline: "Interfaces people love to use.",
    description:
      "Research-driven product design — from user flows to high-fidelity prototypes and design systems.",
    icon: Palette,
    features: ["User research", "Wireframing", "Prototyping", "Design systems", "Usability testing"],
    deliverables: ["Figma file", "Prototype", "Design tokens", "Handoff docs"],
    startingPrice: 1499,
    accent: "from-violet-400/20 to-violet-600/5",
  },
  {
    slug: "logo-design",
    title: "Logo Design",
    tagline: "Marks that mean something.",
    description:
      "Distinctive, timeless logos crafted with meaning. Multiple concepts, full ownership, every file format.",
    icon: PenTool,
    features: ["3 concepts", "Unlimited revisions", "Vector files", "Color variants", "Usage guide"],
    deliverables: ["Source files", "SVG / PNG / PDF", "Brand guidelines", "Social kit"],
    startingPrice: 349,
    popular: true,
    accent: "from-rose-400/20 to-rose-600/5",
  },
  {
    slug: "brand-identity",
    title: "Brand Identity",
    tagline: "Cohesive brands, end to end.",
    description:
      "Complete identity systems — logo, color, typography, voice, guidelines & brand assets.",
    icon: Sparkles,
    features: ["Logo suite", "Color system", "Typography", "Brand voice", "Guidelines"],
    deliverables: ["Brand book", "Asset library", "Templates", "Social pack"],
    startingPrice: 1299,
    accent: "from-teal-400/20 to-emerald-600/5",
  },
  {
    slug: "social-media-design",
    title: "Social Media Design",
    tagline: "Scroll-stopping social content.",
    description:
      "Template systems & content kits that keep your feed consistent and on-brand.",
    icon: Share2,
    features: ["Post templates", "Story templates", "Carousel kits", "Brand stickers", "Content calendar"],
    deliverables: ["30 templates", "Editable files", "Style guide", "Content plan"],
    startingPrice: 499,
    accent: "from-fuchsia-400/20 to-fuchsia-600/5",
  },
  {
    slug: "business-presentation",
    title: "Business Presentation",
    tagline: "Pitch decks that win rooms.",
    description:
      "Investor decks & sales presentations that tell your story with clarity and confidence.",
    icon: Presentation,
    features: ["Custom layout", "Data viz", "Speaker notes", "Edit-ready", "Brand aligned"],
    deliverables: ["15-20 slides", "Source file", "PDF export", "Notes doc"],
    startingPrice: 799,
    accent: "from-orange-400/20 to-orange-600/5",
  },
  {
    slug: "seo",
    title: "SEO",
    tagline: "Rank higher, grow faster.",
    description:
      "Technical + content SEO that compounds. Audits, on-page, schema, and content strategy.",
    icon: Search,
    features: ["Technical audit", "On-page SEO", "Schema markup", "Content strategy", "Rank tracking"],
    deliverables: ["Audit report", "Keyword map", "Schema impl.", "Monthly report"],
    startingPrice: 599,
    accent: "from-emerald-400/20 to-teal-600/5",
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    tagline: "Ship AI features that matter.",
    description:
      "Custom AI integrations — chatbots, RAG pipelines, automation & copilots tailored to your business.",
    icon: BrainCircuit,
    features: ["LLM integration", "RAG pipelines", "AI chatbots", "Workflow automation", "Custom copilots"],
    deliverables: ["Working prototype", "API integration", "Prompt library", "Docs & training"],
    startingPrice: 1999,
    popular: true,
    accent: "from-cyan-400/20 to-blue-600/5",
  },
  {
    slug: "website-maintenance",
    title: "Website Maintenance",
    tagline: "We keep everything running.",
    description:
      "Ongoing care plans — updates, backups, monitoring, security & small tweaks included.",
    icon: Wrench,
    features: ["Updates & patches", "Daily backups", "Uptime monitoring", "Security scans", "Edits included"],
    deliverables: ["Monthly report", "Priority support", "SLA guarantee", "Edit hours"],
    startingPrice: 199,
    accent: "from-slate-400/20 to-slate-600/5",
  },
  {
    slug: "business-consultation",
    title: "Business Consultation",
    tagline: "Strategy for digital growth.",
    description:
      "1:1 strategy sessions to align your brand, product & marketing for measurable growth.",
    icon: Lightbulb,
    features: ["Brand audit", "Growth roadmap", "Funnel review", "Tech stack advice", "Action plan"],
    deliverables: ["Strategy doc", "Roadmap", "90-day plan", "Follow-up call"],
    startingPrice: 299,
    accent: "from-yellow-400/20 to-amber-600/5",
  },
];
