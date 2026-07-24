export type FAQItem = { question: string; answer: string; category: string };

export const faqItems: FAQItem[] = [
  {
    category: "General",
    question: "How long does a typical project take?",
    answer:
      "Timelines vary by scope. A landing page takes 1-2 weeks, a full website 3-6 weeks, and complex web apps 8-16 weeks. We provide a detailed timeline in your proposal and deliver weekly milestones so you always see progress.",
  },
  {
    category: "General",
    question: "Do you work with startups and small businesses?",
    answer:
      "Absolutely. We work with everyone from solo founders to enterprises. Our Starter plan is designed specifically for small businesses, and we offer flexible payment options for early-stage startups.",
  },
  {
    category: "Pricing",
    question: "How does your pricing work?",
    answer:
      "We offer both one-time project pricing and monthly retainers. Project pricing is a fixed fee based on scope. Retainers include maintenance, updates, and ongoing work. Enterprise plans are custom-quoted based on your needs.",
  },
  {
    category: "Pricing",
    question: "Do you require a deposit?",
    answer:
      "Yes, we typically require a 50% deposit to begin work, with the remaining 50% due on delivery. For larger projects, we can split payments into milestones. Enterprise contracts have custom payment terms.",
  },
  {
    category: "Pricing",
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards, bank transfers, and PayPal. For enterprise clients, we also support wire transfers and invoicing with net-30 terms.",
  },
  {
    category: "Process",
    question: "What is your design process?",
    answer:
      "Our process has five phases: Discovery (research & strategy), Design (wireframes & visual design), Develop (build & integrate), Deploy (test & launch), and Deliver (handoff & support). Each phase includes review checkpoints.",
  },
  {
    category: "Process",
    question: "Will I own the design files and code?",
    answer:
      "Yes, 100%. Upon final payment, you own all source files, code, and assets. We transfer all accounts and credentials to you. No lock-in, ever.",
  },
  {
    category: "Process",
    question: "How many revisions are included?",
    answer:
      "Starter includes 2 rounds of revisions. Professional and Premium include unlimited revisions during the design phase. We define 'a round' as consolidated feedback, which keeps things efficient.",
  },
  {
    category: "Technical",
    question: "What technologies do you use?",
    answer:
      "We primarily build with Next.js, React, TypeScript, and Tailwind CSS. For WordPress, we use custom themes with ACF. For AI, we use OpenAI, Anthropic, and open-source models with RAG architectures.",
  },
  {
    category: "Technical",
    question: "Can you work with my existing codebase?",
    answer:
      "Yes. We're comfortable joining existing codebases, doing audits, and incrementally improving them. We'll review your code and propose a plan that fits your situation.",
  },
  {
    category: "Support",
    question: "Do you offer ongoing maintenance?",
    answer:
      "Yes. We offer monthly maintenance plans starting at $199/mo that include updates, backups, monitoring, and a set number of edit hours. Premium plans include priority support and dedicated PMs.",
  },
  {
    category: "Support",
    question: "What if I'm not happy with the work?",
    answer:
      "Your satisfaction is guaranteed. We work in iterative sprints with review checkpoints so issues are caught early. If something isn't right, we'll fix it. See our Refund Policy for full details.",
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "We dig into your goals, audience, and competition to build a strategy that's grounded in reality.",
    icon: "Search",
  },
  {
    number: "02",
    title: "Design",
    description: "Wireframes evolve into polished, interactive designs. You see the experience before a line of code.",
    icon: "Palette",
  },
  {
    number: "03",
    title: "Develop",
    description: "We build with performance, accessibility, and scalability baked in. Clean, documented, production-ready.",
    icon: "Code2",
  },
  {
    number: "04",
    title: "Deploy",
    description: "Rigorous QA, performance tuning, and a smooth launch. We monitor everything for the first 30 days.",
    icon: "Rocket",
  },
  {
    number: "05",
    title: "Deliver",
    description: "Full handoff with training, docs, and ongoing support. We stick around to help you grow.",
    icon: "TrendingUp",
  },
];
