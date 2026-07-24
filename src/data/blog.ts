export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Branding" | "AI" | "SEO" | "Marketing" | "Business" | "WordPress" | "Technology" | "Freelancing" | "Support";
  author: { name: string; role: string; avatar: string };
  date: string;
  readingTime: number;
  cover: string;
  tags: string[];
  content: { heading?: string; body: string }[];
  featured?: boolean;
};

export const blogCategories = [
  "All",
  "Branding",
  "AI",
  "SEO",
  "Marketing",
  "Business",
  "WordPress",
  "Technology",
  "Freelancing",
] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "build-brand-feels-million-dollars",
    title: "How to Build a Brand That Feels Like a Million Dollars",
    excerpt:
      "The anatomy of premium brands — from typography and color to motion and voice. What separates good brands from unforgettable ones.",
    category: "Branding",
    author: { name: "Elena Vasquez", role: "Creative Director", avatar: "EV" },
    date: "2025-01-12",
    readingTime: 8,
    cover: "gradient-teal",
    tags: ["branding", "design", "identity"],
    featured: true,
    content: [
      { body: "Premium isn't about price. It's about the feeling a brand creates in the first three seconds. The best brands in the world — Stripe, Linear, Vercel — share a DNA that's surprisingly learnable." },
      { heading: "Start with restraint", body: "The biggest mistake growing brands make is adding more. More colors, more fonts, more elements. Premium brands subtract relentlessly. Pick one accent color. Use two type families. Let whitespace do the heavy lifting." },
      { heading: "Typography is your brand voice", body: "Typography accounts for 95% of the visual impression. Invest in a display face with character and a body face built for reading. The contrast between them creates rhythm." },
      { heading: "Motion communicates values", body: "How your interface moves tells people how you think. Smooth, considered transitions signal craftsmanship. Janky animations signal carelessness. Every transition should have intent." },
      { heading: "Consistency compounds", body: "A premium brand isn't built in a launch. It's built through 1000 small, consistent decisions. Document your system. Enforce it. Iterate slowly." },
    ],
  },
  {
    slug: "ai-prompt-engineering-2025",
    title: "Prompt Engineering in 2025: A Practical Guide",
    excerpt: "Beyond tricks and hacks — a durable framework for writing prompts that reliably produce great results.",
    category: "AI",
    author: { name: "Marcus Chen", role: "AI Lead", avatar: "MC" },
    date: "2025-01-08",
    readingTime: 11,
    cover: "gradient-cyan",
    tags: ["ai", "llm", "prompts"],
    featured: true,
    content: [
      { body: "Prompt engineering has matured. The tricks that worked in 2023 — 'act as an expert', 'think step by step' — are table stakes now. The real skill is structuring context." },
      { heading: "Context is king", body: "Models are only as good as the context you give them. Provide examples, constraints, and desired output format. Be explicit about what you don't want." },
      { heading: "Iterate like a scientist", body: "Treat prompts as experiments. Change one variable at a time. Keep a prompt library with versioned results." },
      { heading: "Use structured outputs", body: "Ask for JSON, not prose, when you need to parse results. It makes your pipelines robust and testable." },
    ],
  },
  {
    slug: "technical-seo-checklist",
    title: "The Technical SEO Checklist for 2025",
    excerpt: "Core Web Vitals, schema, crawl budget, and the technical fundamentals that move rankings.",
    category: "SEO",
    author: { name: "Priya Nair", role: "SEO Strategist", avatar: "PN" },
    date: "2025-01-05",
    readingTime: 9,
    cover: "gradient-emerald",
    tags: ["seo", "technical", "performance"],
    content: [
      { body: "Technical SEO is the foundation. Without it, content and links won't reach their potential. Here's the checklist we run on every project." },
      { heading: "Core Web Vitals", body: "LCP under 2.5s, INP under 200ms, CLS under 0.1. These aren't suggestions — they're ranking factors. Optimize images, reduce JS, and use server components." },
      { heading: "Structured data", body: "Implement schema.org for articles, products, FAQs, and breadcrumbs. It unlocks rich results and helps search engines understand your content." },
      { heading: "Crawl efficiency", body: "Audit your sitemap, robots.txt, and internal links. Make sure crawlers spend budget on your most important pages." },
    ],
  },
  {
    slug: "freelance-to-agency",
    title: "From Freelancer to Agency: The Transition Playbook",
    excerpt: "How to scale from solo freelancer to a 7-figure agency without burning out.",
    category: "Freelancing",
    author: { name: "David Park", role: "Founder", avatar: "DP" },
    date: "2024-12-28",
    readingTime: 10,
    cover: "gradient-amber",
    tags: ["business", "freelancing", "agency"],
    content: [
      { body: "Going from freelancer to agency is the hardest jump in this industry. You're not just doing more work — you're building a completely different business." },
      { heading: "Productize first", body: "Before hiring, turn your service into a product with clear scope, pricing, and deliverables. This makes delegation possible." },
      { heading: "Hire slowly", body: "Your first hire defines your culture. Take your time. Hire for judgment, not just skill." },
      { heading: "Build systems, not heroics", body: "Agencies die from founder dependency. Document everything. If it's not written down, it doesn't exist." },
    ],
  },
  {
    slug: "wordpress-vs-headless",
    title: "WordPress vs. Headless: When to Choose What",
    excerpt: "A practical decision framework for choosing between traditional WordPress and headless architectures.",
    category: "WordPress",
    author: { name: "James Wilson", role: "Lead Engineer", avatar: "JW" },
    date: "2024-12-20",
    readingTime: 7,
    cover: "gradient-violet",
    tags: ["wordpress", "development", "architecture"],
    content: [
      { body: "The WordPress vs. headless debate is exhausting because the answer is always 'it depends'. Here's a clearer framework." },
      { heading: "Choose traditional WordPress when", body: "You need editorial workflows, lots of plugins, and a non-technical team managing content. It's still the best CMS for publishers." },
      { heading: "Choose headless when", body: "Performance is critical, you're building an app-like experience, or you need multi-channel content delivery." },
    ],
  },
  {
    slug: "design-systems-that-scale",
    title: "Design Systems That Actually Scale",
    excerpt: "How to build a design system your team will actually use — tokens, components, and governance.",
    category: "Technology",
    author: { name: "Elena Vasquez", role: "Creative Director", avatar: "EV" },
    date: "2024-12-15",
    readingTime: 12,
    cover: "gradient-rose",
    tags: ["design", "design-systems", "figma"],
    content: [
      { body: "Most design systems die in a Figma file nobody opens. The ones that scale share three traits: they're documented, governed, and genuinely useful." },
      { heading: "Start with tokens", body: "Design tokens — colors, spacing, typography — are the atomic units. Get these right and everything else follows." },
      { heading: "Document the why", body: "Components without context get misused. Document not just how to use a component, but when and why." },
    ],
  },
  {
    slug: "content-marketing-ai",
    title: "Content Marketing in the Age of AI",
    excerpt: "How to create content that ranks and resonates when everyone has an AI writer.",
    category: "Marketing",
    author: { name: "Priya Nair", role: "SEO Strategist", avatar: "PN" },
    date: "2024-12-10",
    readingTime: 8,
    cover: "gradient-cyan",
    tags: ["marketing", "ai", "content"],
    content: [
      { body: "AI didn't kill content marketing — it raised the bar. Generic content is now free and infinite. The valuable content is specific, opinionated, and human." },
      { heading: "Bring original data", body: "Surveys, experiments, case studies. Original data can't be generated by AI and it earns links." },
      { heading: "Have a point of view", body: "AI writes in the average of all opinions. Stand out by taking a clear stance, even if it's controversial." },
    ],
  },
  {
    slug: "pricing-your-services",
    title: "How to Price Your Services Without Underselling",
    excerpt: "Value-based pricing, packaging, and the psychology of premium positioning.",
    category: "Business",
    author: { name: "David Park", role: "Founder", avatar: "DP" },
    date: "2024-12-05",
    readingTime: 6,
    cover: "gradient-emerald",
    tags: ["business", "pricing", "freelancing"],
    content: [
      { body: "Most creatives underprice because they price their time, not their value. Here's how to fix that." },
      { heading: "Price outcomes, not hours", body: "If your work generates $100k for a client, charging $5k isn't expensive — it's a bargain. Anchor to value." },
      { heading: "Create packages", body: "Packages reduce decision fatigue and let clients self-select. Three tiers works best." },
    ],
  },
  {
    slug: "nextjs-15-features",
    title: "Next.js 15 Features That Change Everything",
    excerpt: "Server actions, partial prerendering, and the features reshaping how we build.",
    category: "Technology",
    author: { name: "James Wilson", role: "Lead Engineer", avatar: "JW" },
    date: "2024-11-28",
    readingTime: 9,
    cover: "gradient-teal",
    tags: ["nextjs", "react", "development"],
    content: [
      { body: "Next.js 15 isn't just an update — it's a rethink of how React apps are built. Here are the features that matter most." },
      { heading: "Partial Prerendering", body: "PPR lets you ship static shells with dynamic islands. Best of both worlds: speed and personalization." },
      { heading: "Improved caching", body: "The new caching model is more predictable. Fetch is no longer cached by default, which means fewer surprises." },
    ],
  },
  {
    slug: "customer-support-ai",
    title: "Building Customer Support AI That Doesn't Suck",
    excerpt: "RAG, guardrails, and human handoff — a blueprint for support AI people actually like.",
    category: "AI",
    author: { name: "Marcus Chen", role: "AI Lead", avatar: "MC" },
    date: "2024-11-20",
    readingTime: 10,
    cover: "gradient-violet",
    tags: ["ai", "support", "rag"],
    content: [
      { body: "Most support bots are infuriating because they hallucinate or refuse to help. The fix is architecture, not prompts." },
      { heading: "Ground with RAG", body: "Never let the model answer from memory. Ground every response in your documentation using retrieval." },
      { heading: "Always offer human handoff", body: "The bot should make humans more efficient, not replace the option to talk to one." },
    ],
  },
];
