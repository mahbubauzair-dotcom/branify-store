export type Testimonial = {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  metric?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "CEO",
    company: "Lumen Labs",
    avatar: "SC",
    quote:
      "BRANIFY rebuilt our entire platform in 8 weeks. We went from a clunky MVP to a product investors couldn't stop complimenting. The attention to detail is unreal.",
    rating: 5,
    metric: "+148% conversion",
  },
  {
    name: "Marcus Webb",
    role: "Marketing Director",
    company: "Northwind",
    avatar: "MW",
    quote:
      "They don't just design pretty things — they think like operators. Every decision was tied to a business outcome. Our launch crushed projections by 3x.",
    rating: 5,
    metric: "3x launch revenue",
  },
  {
    name: "Aisha Rahman",
    role: "Founder",
    company: "Bloom Studio",
    avatar: "AR",
    quote:
      "Working with BRANIFY felt like having an in-house design team that actually cared. The brand system they built still serves us two years later.",
    rating: 5,
    metric: "2-year partnership",
  },
  {
    name: "David Park",
    role: "CTO",
    company: "Vertex AI",
    avatar: "DP",
    quote:
      "The AI copilot they shipped resolved 70% of our support tickets automatically. The ROI was visible in week one. Genuinely world-class engineering.",
    rating: 5,
    metric: "70% auto-resolution",
  },
  {
    name: "Priya Nair",
    role: "Head of Growth",
    company: "Atlas Commerce",
    avatar: "PN",
    quote:
      "Our old site took 4 seconds to load. BRANIFY got it to under a second and conversions doubled. I didn't think performance could move the needle this much.",
    rating: 5,
    metric: "2x conversion",
  },
  {
    name: "James Wilson",
    role: "Co-founder",
    company: "Pulse",
    avatar: "JW",
    quote:
      "We've worked with five agencies. BRANIFY is the only one that delivered on time, on budget, and beyond scope. They're now our default partner.",
    rating: 5,
    metric: "On-time delivery",
  },
  {
    name: "Elena Vasquez",
    role: "VP Design",
    company: "Nova",
    avatar: "EV",
    quote:
      "As a design leader, I'm picky. BRANIFY's craft is genuinely premium — the kind of work you'd expect from a 200-person studio, delivered by a tight team.",
    rating: 5,
    metric: "3 design awards",
  },
  {
    name: "Tom Bradley",
    role: "Founder",
    company: "Glide",
    avatar: "TB",
    quote:
      "From brand strategy to the final deployment, every step was thoughtful. Our investors specifically called out the polish. Worth every penny.",
    rating: 5,
    metric: "Series A closed",
  },
];

export const stats = [
  { label: "Projects delivered", value: 320, suffix: "+" },
  { label: "Client satisfaction", value: 98, suffix: "%" },
  { label: "Avg. Lighthouse score", value: 97, suffix: "" },
  { label: "Countries served", value: 28, suffix: "" },
];

export const trustedBrands = [
  "Lumen",
  "Northwind",
  "Vertex",
  "Atlas",
  "Pulse",
  "Nova",
  "Glide",
  "Bloom",
  "Quartz",
  "Helix",
  "Orbit",
  "Cedar",
];
