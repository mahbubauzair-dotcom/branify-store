"use client";

import {
  Layers,
  Tag,
  Users,
  ShoppingCart,
  RefreshCw,
  Ticket,
  Star,
  FileText,
  FileCode,
  Image as ImageIcon,
  Menu,
  ClipboardList,
  MessageSquare,
  Mail,
  BarChart3,
  Megaphone,
  Search,
  Zap,
  Plug,
  Palette,
  UserCog,
  Settings,
  Activity,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { AdminLayout } from "@/components/views/admin/admin-layout";
import { AdminStubView } from "@/components/views/admin/admin-stub-view";
import type { RouteName } from "@/lib/router";

type StubConfig = {
  active: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
};

const STUBS: Record<string, StubConfig> = {
  collections: {
    active: "collections",
    title: "Collections",
    description:
      "Curate seasonal & thematic product groupings to drive merchandising campaigns. Schedule visibility, reorder items, and feature collections across your storefront.",
    icon: Layers,
    features: [
      "Create collections with cover images and SEO metadata",
      "Schedule collection visibility & auto-publish dates",
      "Drag-and-drop product ordering within collections",
      "Featured collection placement on homepage & storefront",
      "Analytics per collection (CTR, revenue, conversion)",
      "Bulk product assignment with category filters",
    ],
  },
  brands: {
    active: "brands",
    title: "Brands",
    description:
      "Manage manufacturer & designer brand profiles. Upload logos, build showcase pages, and analyze sales performance by brand.",
    icon: Tag,
    features: [
      "Manage manufacturer & designer brand profiles",
      "Upload brand logos, color palettes & visual assets",
      "Auto-generate brand showcase pages with stories",
      "Map products to brands with bulk assignment tools",
      "Filter sales & inventory reports by brand",
      "Featured brand rotation on storefront",
    ],
  },
  customers: {
    active: "customers",
    title: "Customers",
    description:
      "A 360° view of every customer: order history, lifetime value, segments, and notes. Empower your team with the context they need to delight shoppers.",
    icon: Users,
    features: [
      "360° customer profiles with order history & LTV",
      "Segmentation by behavior, spend & geography",
      "Customer groups with tiered pricing & perks",
      "Account notes, tags & internal ratings",
      "Address book with shipping defaults",
      "GDPR-friendly data export & deletion tools",
    ],
  },
  orders: {
    active: "orders",
    title: "Orders",
    description:
      "A unified inbox for every order lifecycle stage. Process refunds, print labels, manage fraud review, and execute bulk actions in seconds.",
    icon: ShoppingCart,
    features: [
      "Unified inbox for new, processing & shipped orders",
      "Inline refunds, partial captures & order edits",
      "Custom order statuses with workflow automation",
      "Packing slips, invoices & shipping labels (PDF)",
      "Fraud risk scoring & manual review queue",
      "Bulk order actions and CSV export",
    ],
  },
  subscriptions: {
    active: "subscriptions",
    title: "Subscriptions",
    description:
      "Recurring billing plans with full lifecycle control. Manage dunning, surface churn risk, and grow MRR with usage-based add-ons.",
    icon: RefreshCw,
    features: [
      "Manage recurring billing plans & lifecycles",
      "Pause, skip, swap or cancel subscriber memberships",
      "Dunning management with smart retry schedules",
      "MRR, churn & retention cohort analytics",
      "Tiered pricing with usage-based add-ons",
      "Self-service customer portal embedding",
    ],
  },
  coupons: {
    active: "coupons",
    title: "Coupons",
    description:
      "Flexible discount engine: percentage, fixed, free-shipping and bundle coupons with scheduling, usage caps, and per-customer limits.",
    icon: Ticket,
    features: [
      "Percentage, fixed & free-shipping coupon types",
      "Auto-generated codes & bulk import tools",
      "Schedule validity windows and usage caps",
      "Per-customer limits & first-order restrictions",
      "Bundle coupons with product & category rules",
      "Real-time redemption analytics & ROI reports",
    ],
  },
  reviews: {
    active: "reviews",
    title: "Reviews",
    description:
      "Centralized moderation for all product reviews. Approve, respond, and turn customer feedback into social proof.",
    icon: Star,
    features: [
      "Centralized moderation queue for product reviews",
      "Approve, reject, or flag for follow-up",
      "Auto-detect spam & profanity filters",
      "Respond publicly as the brand",
      "Aggregate star ratings & sentiment trends",
      "Incentivize reviews with post-purchase emails",
    ],
  },
  blog: {
    active: "blog",
    title: "Blog",
    description:
      "A full content studio for editorial growth. Draft, schedule, optimize for SEO, and analyze readership — all in one place.",
    icon: FileText,
    features: [
      "Rich markdown / WYSIWYG post editor",
      "SEO meta, social cards & canonical URLs",
      "Tag, category & author management",
      "Scheduled publishing with timezone support",
      "Draft collaboration & revision history",
      "Built-in analytics: views, reads, shares",
    ],
  },
  pages: {
    active: "pages",
    title: "Pages",
    description:
      "Visually compose landing and policy pages with reusable blocks. Per-page SEO, custom slugs, and scheduled publishing.",
    icon: FileCode,
    features: [
      "Build custom landing & policy pages visually",
      "Block-based editor (hero, features, CTA, FAQ)",
      "Per-page SEO, OG images & structured data",
      "Custom slugs & navigation menu wiring",
      "Page templates for reuse across campaigns",
      "Schedule publish, unpublish & redirects",
    ],
  },
  media: {
    active: "media",
    title: "Media Library",
    description:
      "A DAM (Digital Asset Manager) for all your product, blog, and page imagery. Auto-optimization, smart search, and CDN delivery.",
    icon: ImageIcon,
    features: [
      "Drag-and-drop multi-file uploads",
      "Folder organization & smart tagging",
      "Automatic WebP/AVIF conversion & resizing",
      "CDN URLs with on-the-fly transformations",
      "Search by name, alt text & color palette",
      "Usage tracking across products & pages",
    ],
  },
  navigation: {
    active: "navigation",
    title: "Navigation",
    description:
      "Craft multi-level header & footer menus with mega-menu support, mobile variants, and seasonal rotations.",
    icon: Menu,
    features: [
      "Build multi-level header & footer menus",
      "Drag-and-drop reordering with nesting",
      "Link to pages, products, categories or URLs",
      "Mega-menu configuration with imagery",
      "Mobile menu variants & visibility rules",
      "Schedule seasonal menu rotations",
    ],
  },
  forms: {
    active: "forms",
    title: "Forms",
    description:
      "Build any form — contact, lead-gen, surveys — with conditional logic, multi-step flows, and submission analytics.",
    icon: ClipboardList,
    features: [
      "Drag-and-drop form builder with 20+ field types",
      "Conditional logic & multi-step flows",
      "Email & webhook notifications on submission",
      "Spam protection with hCaptcha",
      "Submission inbox with search & export",
      "Conversion analytics per form",
    ],
  },
  messages: {
    active: "messages",
    title: "Messages",
    description:
      "A shared inbox for contact-form messages & live chat. Assign threads, use saved replies, and track SLAs.",
    icon: MessageSquare,
    features: [
      "Unified inbox for contact & chat messages",
      "Assign threads to team members",
      "Saved replies & template library",
      "Internal notes & customer timeline",
      "Auto-responses & business-hours routing",
      "SLA tracking & response-time reports",
    ],
  },
  newsletter: {
    active: "newsletter",
    title: "Newsletter",
    description:
      "Design, schedule, and analyze email campaigns. Segment subscribers, A/B test content, and stay CAN-SPAM compliant.",
    icon: Mail,
    features: [
      "Visual drag-and-drop email composer",
      "Subscriber segmentation & dynamic content",
      "Schedule campaigns with timezone intelligence",
      "A/B test subject lines & content blocks",
      "Open, click & conversion analytics",
      "CAN-SPAM compliant unsubscribe handling",
    ],
  },
  analytics: {
    active: "analytics",
    title: "Analytics",
    description:
      "Deep-dive into traffic, funnels, cohorts, and attribution. Build custom reports and export anywhere.",
    icon: BarChart3,
    features: [
      "Realtime traffic & revenue dashboards",
      "Funnel analysis from visit to purchase",
      "Cohort retention & LTV modeling",
      "Custom report builder with saved views",
      "Attribution modeling (first, last, multi-touch)",
      "Export to BigQuery, CSV & Google Sheets",
    ],
  },
  marketing: {
    active: "marketing",
    title: "Marketing",
    description:
      "Plan, launch, and measure multi-channel campaigns. Email, SMS, social, and push — orchestrated in one calendar.",
    icon: Megaphone,
    features: [
      "Campaign calendar across channels",
      "Audience targeting with behavioral filters",
      "Multi-channel: email, SMS, social, push",
      "Budget tracking & ROI attribution",
      "Discount code & landing page orchestration",
      "Performance benchmarks vs industry",
    ],
  },
  seo: {
    active: "seo",
    title: "SEO",
    description:
      "Audit, optimize, and monitor your site's search presence. Schema markup, sitemaps, and rank tracking built in.",
    icon: Search,
    features: [
      "Site-wide SEO health audit",
      "Meta title & description templates",
      "Schema.org structured data manager",
      "XML sitemap & robots.txt controls",
      "Internal linking suggestions",
      "Keyword rank tracking & SERP preview",
    ],
  },
  automation: {
    active: "automation",
    title: "Automation",
    description:
      "Visual workflow builder connecting every tool in your stack. Trigger → condition → action, with audit trails.",
    icon: Zap,
    features: [
      "Visual workflow builder (trigger → action)",
      "50+ pre-built automation recipes",
      "Conditional branches & delays",
      "Webhook & API integrations",
      "Audit log of every automation run",
      "Test mode & dry-run before going live",
    ],
  },
  integrations: {
    active: "integrations",
    title: "Integrations",
    description:
      "Connect BRANIFY to your favorite tools. OAuth flows, sync health, and a webhook log viewer.",
    icon: Plug,
    features: [
      "Browse & install integration marketplace",
      "OAuth & API key credential management",
      "Per-integration sync health monitoring",
      "Webhook configuration & log viewer",
      "Custom integration via REST/Webhooks",
      "Usage & rate-limit dashboards",
    ],
  },
  emails: {
    active: "emails",
    title: "Emails",
    description:
      "Transactional email templates & automations. Brand-consistent themes, deliverability insights, and DNS health checks.",
    icon: Mail,
    features: [
      "Transactional email template editor",
      "Order, shipping & welcome automations",
      "Brand-consistent MJML themes",
      "Preview across 40+ email clients",
      "Delivery & bounce analytics",
      "SPF/DKIM/DMARC health checks",
    ],
  },
  users: {
    active: "users",
    title: "Users & Roles",
    description:
      "Team management with granular permissions, 2FA enforcement, and SSO. Invite, audit, and revoke access with confidence.",
    icon: UserCog,
    features: [
      "Team member invitations & seat management",
      "Role-based permissions (admin, editor, viewer)",
      "Granular module-level access control",
      "Two-factor authentication enforcement",
      "Login history & session management",
      "SSO configuration (Google, Okta, SAML)",
    ],
  },
  appearance: {
    active: "appearance",
    title: "Appearance",
    description:
      "Live theme customizer. Tweak color tokens, typography, and spacing — preview changes instantly before publishing.",
    icon: Palette,
    features: [
      "Live theme customizer with preview",
      "Color tokens, typography & spacing",
      "Light/dark/auto mode switching",
      "Custom CSS & per-page overrides",
      "Brand asset library (logos, favicons)",
      "Theme versioning & rollback",
    ],
  },
  settings: {
    active: "settings",
    title: "Settings",
    description:
      "Store-wide configuration: profile, currency, taxes, payments, shipping, webhooks, and disaster recovery.",
    icon: Settings,
    features: [
      "Store profile, currency & timezone",
      "Tax & checkout configuration",
      "Payment gateway credentials",
      "Shipping zones & rate tables",
      "Webhooks & API key management",
      "Backup, export & disaster recovery",
    ],
  },
  activity: {
    active: "activity",
    title: "Activity Logs",
    description:
      "Immutable audit log of every admin action. Filter, search, and export for compliance and incident response.",
    icon: Activity,
    features: [
      "Realtime audit log of every admin action",
      "Filter by user, module & severity",
      "Diff view for content changes",
      "Searchable archive (1-year retention)",
      "Export to SIEM via webhook",
      "Compliance-ready immutable storage",
    ],
  },
  developer: {
    active: "developer",
    title: "Developer",
    description:
      "API keys, webhooks, an interactive playground, and SDK downloads. Everything your engineers need to extend BRANIFY.",
    icon: Code2,
    features: [
      "API key generation with scopes",
      "Interactive REST & GraphQL playground",
      "Webhook tester with retry simulator",
      "Event subscription manager",
      "Rate-limit usage & quota dashboards",
      "SDK downloads & code samples",
    ],
  },
};

/** Render a stub view from a config entry. */
function renderStub(cfg: StubConfig) {
  const Icon = cfg.icon;
  return (
    <AdminLayout active={cfg.active}>
      <AdminStubView title={cfg.title} description={cfg.description} icon={Icon} features={cfg.features} />
    </AdminLayout>
  );
}

export function AdminCollectionsView() {
  return renderStub(STUBS.collections);
}

export function AdminBrandsView() {
  return renderStub(STUBS.brands);
}

export function AdminCustomersView() {
  return renderStub(STUBS.customers);
}

export function AdminOrdersView() {
  return renderStub(STUBS.orders);
}

export function AdminSubscriptionsView() {
  return renderStub(STUBS.subscriptions);
}

export function AdminCouponsView() {
  return renderStub(STUBS.coupons);
}

export function AdminReviewsView() {
  return renderStub(STUBS.reviews);
}

export function AdminBlogView() {
  return renderStub(STUBS.blog);
}

export function AdminPagesView() {
  return renderStub(STUBS.pages);
}

export function AdminMediaView() {
  return renderStub(STUBS.media);
}

export function AdminNavigationView() {
  return renderStub(STUBS.navigation);
}

export function AdminFormsView() {
  return renderStub(STUBS.forms);
}

export function AdminMessagesView() {
  return renderStub(STUBS.messages);
}

export function AdminNewsletterView() {
  return renderStub(STUBS.newsletter);
}

export function AdminAnalyticsView() {
  return renderStub(STUBS.analytics);
}

export function AdminMarketingView() {
  return renderStub(STUBS.marketing);
}

export function AdminSeoView() {
  return renderStub(STUBS.seo);
}

export function AdminAutomationView() {
  return renderStub(STUBS.automation);
}

export function AdminIntegrationsView() {
  return renderStub(STUBS.integrations);
}

export function AdminEmailsView() {
  return renderStub(STUBS.emails);
}

export function AdminUsersView() {
  return renderStub(STUBS.users);
}

export function AdminAppearanceView() {
  return renderStub(STUBS.appearance);
}

export function AdminSettingsView() {
  return renderStub(STUBS.settings);
}

export function AdminActivityView() {
  return renderStub(STUBS.activity);
}

export function AdminDeveloperView() {
  return renderStub(STUBS.developer);
}

/**
 * AdminStubDispatcher — route → stub view resolver. Lets the SPA router render
 * any of the 25 new admin stub views from a single lazy chunk. Falls back to
 * the dashboard for unknown routes.
 */
export function AdminStubDispatcher({ route }: { route: RouteName }) {
  // Strip "admin-" prefix to get the stub key.
  const key = route.startsWith("admin-") ? route.slice("admin-".length) : route;
  const cfg = STUBS[key];
  if (!cfg) return null;
  return renderStub(cfg);
}
