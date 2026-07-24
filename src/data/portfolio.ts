export type Project = {
  slug: string;
  title: string;
  client: string;
  category: "Web Development" | "Branding" | "UI/UX" | "AI" | "WordPress";
  year: number;
  cover: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  tech: string[];
  duration: string;
  before: string;
  after: string;
};

export const projectCategories = [
  "All",
  "Web Development",
  "Branding",
  "UI/UX",
  "AI",
  "WordPress",
] as const;

export const projects: Project[] = [
  {
    slug: "lumen-finance",
    title: "Lumen Finance Platform",
    client: "Lumen",
    category: "Web Development",
    year: 2024,
    cover: "gradient-teal",
    summary: "A fintech dashboard & marketing site for a next-gen banking platform.",
    challenge: "Lumen needed a trust-building marketing site and a complex dashboard that felt simple.",
    solution: "We built a Next.js marketing site with a React dashboard, dark UI, and real-time data viz.",
    results: [
      { label: "Conversion", value: "+148%" },
      { label: "Page Speed", value: "98" },
      { label: "Bounce", value: "-32%" },
      { label: "Signups", value: "+210%" },
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "Postgres", "Stripe"],
    duration: "12 weeks",
    before: "Cluttered legacy site with poor mobile UX and 2.8s load time.",
    after: "Premium dark UI, 98 Lighthouse, sub-1s loads, +148% conversion lift.",
  },
  {
    slug: "nova-brand",
    title: "Nova Identity System",
    client: "Nova Studio",
    category: "Branding",
    year: 2024,
    cover: "gradient-violet",
    summary: "A complete brand identity for a creative production studio.",
    challenge: "Nova needed a flexible identity that worked across film, events & digital.",
    solution: "We crafted a dynamic logo system, custom type, and a bold color story.",
    results: [
      { label: "Brand recall", value: "+86%" },
      { label: "Inquiries", value: "+190%" },
      { label: "Press", value: "12" },
      { label: "Awards", value: "3" },
    ],
    tech: ["Figma", "Illustrator", "After Effects", "Custom Type"],
    duration: "8 weeks",
    before: "Generic logo, no system, inconsistent across touchpoints.",
    after: "Cohesive identity, +190% inbound inquiries, 3 design awards.",
  },
  {
    slug: "pulse-ai",
    title: "Pulse AI Assistant",
    client: "Pulse",
    category: "AI",
    year: 2025,
    cover: "gradient-cyan",
    summary: "An AI support copilot with RAG over 10k docs.",
    challenge: "Pulse support team was drowning in repetitive tickets.",
    solution: "We built a RAG-powered AI copilot that resolves 70% of tickets instantly.",
    results: [
      { label: "Auto-resolved", value: "70%" },
      { label: "Response time", value: "-89%" },
      { label: "CSAT", value: "4.8" },
      { label: "Cost saved", value: "$240k" },
    ],
    tech: ["Next.js", "OpenAI", "Pinecone", "LangChain", "Vercel"],
    duration: "10 weeks",
    before: "12h avg response, scaling support costs, low CSAT.",
    after: "70% auto-resolution, sub-minute responses, 4.8 CSAT.",
  },
  {
    slug: "atlas-commerce",
    title: "Atlas Commerce Store",
    client: "Atlas",
    category: "Web Development",
    year: 2024,
    cover: "gradient-amber",
    summary: "A headless WooCommerce storefront with 2x conversion.",
    challenge: "Atlas had a slow Magento store killing conversions.",
    solution: "We rebuilt headless on Next.js + WooCommerce API with instant search.",
    results: [
      { label: "Conversion", value: "+102%" },
      { label: "Load time", value: "-73%" },
      { label: "AOV", value: "+34%" },
      { label: "Revenue", value: "+180%" },
    ],
    tech: ["Next.js", "WooCommerce", "Algolia", "Stripe", "Vercel"],
    duration: "14 weeks",
    before: "4.2s load, 1.2% conversion, poor mobile experience.",
    after: "1.1s load, 2.4% conversion, +180% revenue in 6 months.",
  },
  {
    slug: "vertex-saas",
    title: "Vertex SaaS UI",
    client: "Vertex",
    category: "UI/UX",
    year: 2025,
    cover: "gradient-rose",
    summary: "Product design for a B2B analytics SaaS.",
    challenge: "Vertex had powerful data but a confusing, dated interface.",
    solution: "We redesigned the entire product with a clean design system & data viz.",
    results: [
      { label: "Activation", value: "+64%" },
      { label: "Churn", value: "-28%" },
      { label: "NPS", value: "+41" },
      { label: "Usage", value: "+112%" },
    ],
    tech: ["Figma", "React", "Recharts", "Tailwind", "Storybook"],
    duration: "16 weeks",
    before: "Dense tables, low activation, high churn.",
    after: "Clean dashboards, +64% activation, -28% churn.",
  },
  {
    slug: "bloom-wp",
    title: "Bloom Magazine",
    client: "Bloom",
    category: "WordPress",
    year: 2024,
    cover: "gradient-emerald",
    summary: "A high-performance WordPress magazine with custom blocks.",
    challenge: "Bloom needed a fast, editorial WordPress with rich layouts.",
    solution: "We built a custom Gutenberg block system with ACF & headless option.",
    results: [
      { label: "Load time", value: "-68%" },
      { label: "Traffic", value: "+145%" },
      { label: "Ad revenue", value: "+92%" },
      { label: "SEO score", value: "100" },
    ],
    tech: ["WordPress", "ACF", "Gutenberg", "PHP", "Redis"],
    duration: "9 weeks",
    before: "Slow, plugin-heavy theme, declining traffic.",
    after: "Custom blocks, 100 SEO score, +145% organic traffic.",
  },
];
