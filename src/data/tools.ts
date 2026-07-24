import {
  Building2,
  Calculator,
  QrCode,
  Receipt,
  KeyRound,
  Type,
  AlignLeft,
  ShieldCheck,
  FileSignature,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  badge?: string;
};

export const tools: Tool[] = [
  {
    slug: "business-name-generator",
    name: "Business Name Generator",
    description: "Generate unique, brandable business names instantly with AI-style word combinations.",
    icon: Building2,
    category: "Branding",
    badge: "Popular",
  },
  {
    slug: "website-cost-calculator",
    name: "Website Cost Calculator",
    description: "Estimate the cost of your website project based on features, pages & complexity.",
    icon: Calculator,
    category: "Business",
  },
  {
    slug: "qr-generator",
    name: "QR Generator",
    description: "Create clean, downloadable QR codes for links, text, Wi-Fi & contact info.",
    icon: QrCode,
    category: "Utility",
    badge: "Popular",
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description: "Build professional invoices and export them as PDF in seconds.",
    icon: Receipt,
    category: "Business",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Create strong, secure, random passwords with custom rules & strength meter.",
    icon: KeyRound,
    category: "Security",
  },
  {
    slug: "meta-title-generator",
    name: "Meta Title Generator",
    description: "Craft SEO-optimized meta titles under 60 characters that boost click-through.",
    icon: Type,
    category: "SEO",
  },
  {
    slug: "meta-description-generator",
    name: "Meta Description Generator",
    description: "Write compelling meta descriptions under 160 characters for better rankings.",
    icon: AlignLeft,
    category: "SEO",
  },
  {
    slug: "privacy-policy-generator",
    name: "Privacy Policy Generator",
    description: "Generate a GDPR-ready privacy policy tailored to your business.",
    icon: ShieldCheck,
    category: "Legal",
  },
  {
    slug: "terms-generator",
    name: "Terms Generator",
    description: "Create website terms & conditions customized to your services.",
    icon: FileSignature,
    category: "Legal",
  },
  {
    slug: "brand-slogan-generator",
    name: "Brand Slogan Generator",
    description: "Generate catchy, memorable slogans & taglines for your brand.",
    icon: Sparkles,
    category: "Branding",
    badge: "New",
  },
];
