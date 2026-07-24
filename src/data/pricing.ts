export type PricingPlan = {
  name: string;
  tagline: string;
  monthly: number | null;
  oneTime: number | null;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  highlight?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    tagline: "For solopreneurs getting online",
    monthly: 199,
    oneTime: 899,
    description: "Everything to launch a professional single presence fast.",
    features: [
      "1-page website or landing",
      "Mobile responsive design",
      "Basic SEO setup",
      "Contact form",
      "2 rounds of revisions",
      "7-day delivery",
      "Email support",
    ],
    cta: "Start with Starter",
  },
  {
    name: "Professional",
    tagline: "For growing businesses",
    monthly: 499,
    oneTime: 2499,
    description: "A complete website with branding, content & optimization.",
    features: [
      "Up to 8 pages",
      "Custom brand design",
      "Blog & CMS setup",
      "Advanced SEO + schema",
      "Analytics & heatmap",
      "Unlimited revisions",
      "14-day delivery",
      "Priority support",
      "1 month maintenance",
    ],
    cta: "Choose Professional",
    popular: true,
    highlight: true,
  },
  {
    name: "Premium",
    tagline: "For ambitious brands",
    monthly: 999,
    oneTime: 4999,
    description: "Full-stack web app, AI features & growth strategy.",
    features: [
      "Custom web app / SaaS",
      "AI integration included",
      "E-commerce / bookings",
      "Full brand identity",
      "CRO & A/B testing",
      "Performance engineering",
      "Dedicated PM",
      "30-day delivery",
      "3 months maintenance",
      "Quarterly strategy calls",
    ],
    cta: "Go Premium",
  },
  {
    name: "Enterprise",
    tagline: "For teams at scale",
    monthly: null,
    oneTime: null,
    description: "Tailored solutions, SLAs & dedicated teams.",
    features: [
      "Unlimited scope",
      "Dedicated team",
      "Custom SLAs",
      "On-prem / cloud options",
      "Security & compliance",
      "24/7 support",
      "Quarterly roadmaps",
      "White-label option",
      "Dedicated Slack channel",
      "Custom contracts",
    ],
    cta: "Talk to Sales",
  },
];

export const pricingComparison = [
  { feature: "Pages included", starter: "1", professional: "8", premium: "Unlimited", enterprise: "Unlimited" },
  { feature: "Custom design", starter: false, professional: true, premium: true, enterprise: true },
  { feature: "Brand identity", starter: false, professional: "Basic", premium: "Full", enterprise: "Full" },
  { feature: "CMS / Blog", starter: false, professional: true, premium: true, enterprise: true },
  { feature: "E-commerce", starter: false, professional: false, premium: true, enterprise: true },
  { feature: "AI integration", starter: false, professional: false, premium: true, enterprise: true },
  { feature: "SEO + schema", starter: "Basic", professional: "Advanced", premium: "Advanced", enterprise: "Advanced" },
  { feature: "Analytics setup", starter: false, professional: true, premium: true, enterprise: true },
  { feature: "Maintenance", starter: false, professional: "1 month", premium: "3 months", enterprise: "Custom" },
  { feature: "Support", starter: "Email", professional: "Priority", premium: "Dedicated PM", enterprise: "24/7" },
  { feature: "Delivery time", starter: "7 days", professional: "14 days", premium: "30 days", enterprise: "Custom" },
  { feature: "Revisions", starter: "2 rounds", professional: "Unlimited", premium: "Unlimited", enterprise: "Unlimited" },
];
