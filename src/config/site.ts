export const siteConfig = {
  name: "BRANIFY",
  domain: "branify.store",
  url: "https://branify.store",
  tagline: "Brands that feel like a million dollars.",
  description:
    "BRANIFY is a premium digital agency crafting world-class websites, brand identities, AI solutions, and digital products.",
  email: "admin@branify.store",
  phone: "+92 334 1079333",
  whatsapp: "https://wa.me/923341079333",
  address: "Crown Business Centre, E11/2, Islamabad, Pakistan",
  social: {
    twitter: "https://twitter.com/branify",
    instagram: "https://instagram.com/branify",
    linkedin: "https://linkedin.com/company/branify",
    dribbble: "https://dribbble.com/branify",
    github: "https://github.com/branify",
  },
  foundedYear: 2019,
};

export type NavItem = {
  label: string;
  route:
    | "home"
    | "services"
    | "products"
    | "storefront"
    | "tools"
    | "portfolio"
    | "pricing"
    | "blog"
    | "about"
    | "contact";
  mega?: {
    title: string;
    description: string;
  };
};

export const navItems: NavItem[] = [
  { label: "Home", route: "home" },
  {
    label: "Services",
    route: "services",
    mega: { title: "What we do", description: "End-to-end design, development & growth services." },
  },
  {
    label: "Digital Products",
    route: "products",
    mega: { title: "Ready-to-use assets", description: "Templates, kits & bundles to launch faster." },
  },
  { label: "Store", route: "storefront" },
  {
    label: "Free Tools",
    route: "tools",
    mega: { title: "Free forever", description: "Generators & calculators for modern teams." },
  },
  { label: "Portfolio", route: "portfolio" },
  { label: "Pricing", route: "pricing" },
  { label: "Blog", route: "blog" },
  { label: "About", route: "about" },
  { label: "Contact", route: "contact" },
];
