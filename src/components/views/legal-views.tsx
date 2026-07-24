"use client";

import { type ReactNode } from "react";
import { Mail, ArrowRight, ShieldCheck, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, type RouteName } from "@/lib/router";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal, GradientTextTeal } from "@/components/shared/reveal";
import { AuroraBackground } from "@/components/shared/gradient-cover";

type Crumb = { label: string; route?: RouteName };

type TocItem = { id: string; label: string };

/* ------------------------------------------------------------------ */
/* SHARED LAYOUT (not exported)                                        */
/* ------------------------------------------------------------------ */
function LegalLayout({
  title,
  description,
  lastUpdated,
  crumbs,
  toc,
  children,
}: {
  title: ReactNode;
  description: string;
  lastUpdated: string;
  crumbs: Crumb[];
  toc: TocItem[];
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <PageHeader crumbs={crumbs} title={title} description={description} />
      <section className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* Sticky TOC sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Last updated
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {lastUpdated}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    On this page
                  </p>
                  <ul className="mt-2 space-y-0.5">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a
                          href={`#${t.id}`}
                          className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
                        >
                          {t.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-white/5 bg-background/40 p-3">
                  <p className="text-xs text-muted-foreground">
                    Questions about this policy?
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full border-white/10 hover:border-primary/30 hover:bg-white/5"
                  >
                    <a href={`mailto:${siteConfig.email}`}>
                      <Mail className="mr-1.5 h-3.5 w-3.5" /> Email us
                    </a>
                  </Button>
                </div>
              </div>
            </aside>

            {/* Reading column */}
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-primary"
                >
                  Legal
                </Badge>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-white">Last updated:</span>{" "}
                  <time>{lastUpdated}</time>
                </p>
              </div>

              {/* Mobile TOC */}
              <div className="mt-6 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur lg:hidden">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  On this page
                </p>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
                      >
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">{children}</div>

              <LegalFooter />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LegalFooter() {
  return (
    <Reveal className="mt-14">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-6 backdrop-blur">
        <AuroraBackground />
        <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-white">
              Still have questions?
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Email{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary hover:underline"
              >
                {siteConfig.email}
              </a>{" "}
              and we&apos;ll reply within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* LAYOUT HELPERS                                                      */
/* ------------------------------------------------------------------ */
function H({ id, n, children }: { id: string; n: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-12 scroll-mt-24 font-display text-2xl font-semibold text-white"
    >
      <span className="mr-2 text-primary">{n}.</span>
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 leading-relaxed text-muted-foreground">{children}</p>;
}

function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-4 space-y-2.5">{children}</ul>;
}

function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 leading-relaxed text-muted-foreground">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <span className="flex-1">{children}</span>
    </li>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="text-lg leading-relaxed text-white/90">{children}</p>
  );
}

/* ================================================================== */
/* PRIVACY POLICY                                                       */
/* ================================================================== */
const privacyToc: TocItem[] = [
  { id: "collect", label: "1. Information we collect" },
  { id: "use", label: "2. How we use your information" },
  { id: "cookies", label: "3. Cookies & tracking" },
  { id: "third-party", label: "4. Third-party services" },
  { id: "security", label: "5. Data security" },
  { id: "rights", label: "6. Your rights (GDPR / CCPA)" },
  { id: "children", label: "7. Children's privacy" },
  { id: "changes", label: "8. Changes to this policy" },
  { id: "contact", label: "9. Contact us" },
];

export function PrivacyView() {
  return (
    <LegalLayout
      title={
        <>
          Privacy <GradientTextTeal>Policy</GradientTextTeal>
        </>
      }
      description={`How ${siteConfig.name} collects, uses, and protects the information you share with us.`}
      lastUpdated="January 15, 2025"
      crumbs={[{ label: "Home", route: "home" }, { label: "Privacy" }]}
      toc={privacyToc}
    >
      <Lead>
        At {siteConfig.name}, your privacy is not a checkbox — it&apos;s a
        default. This policy explains what we collect, why we collect it, who
        gets to see it, and the choices you have. We wrote it in plain language
        on purpose.
      </Lead>

      <H id="collect" n="1">
        Information we collect
      </H>
      <P>
        We only collect information that genuinely helps us serve you. There
        are three categories:
      </P>
      <UL>
        <LI>
          <strong className="text-white">Information you provide.</strong> When
          you fill in a contact form, request a proposal, subscribe to the
          newsletter, or reply to an email, you share your name, email address,
          company, and any details you choose to include in your message.
        </LI>
        <LI>
          <strong className="text-white">Billing information.</strong> When you
          purchase a digital product or pay for a service, our payment
          processor (Stripe) handles the transaction. We never see or store
          your full card number.
        </LI>
        <LI>
          <strong className="text-white">Information collected automatically.</strong>{" "}
          Like most websites, we collect basic technical data — IP address,
          browser type, device, referring URL, and pages visited — through
          cookies and analytics.
        </LI>
      </UL>

      <H id="use" n="2">
        How we use your information
      </H>
      <P>We use the information above to:</P>
      <UL>
        <LI>Respond to your inquiries and provide quotes or proposals.</LI>
        <LI>Deliver the services and digital products you purchased.</LI>
        <LI>Send transactional emails (receipts, updates, support replies).</LI>
        <LI>Send the newsletter — only if you explicitly opted in.</LI>
        <LI>Improve our website, tools, and content through analytics.</LI>
        <LI>Detect, prevent, and address technical issues or fraud.</LI>
        <LI>Comply with our legal and financial obligations.</LI>
      </UL>
      <P>
        We never sell your personal information. We don&apos;t rent it, auction
        it, or trade it. Ever.
      </P>

      <H id="cookies" n="3">
        Cookies and tracking technologies
      </H>
      <P>
        Cookies are small text files stored on your device. We use them for
        three purposes:
      </P>
      <UL>
        <LI>
          <strong className="text-white">Essential cookies</strong> — required
          for the site to function (sessions, cart, security).
        </LI>
        <LI>
          <strong className="text-white">Analytics cookies</strong> — help us
          understand which pages are useful and where visitors get stuck.
        </LI>
        <LI>
          <strong className="text-white">Preference cookies</strong> — remember
          choices like theme or region so you don&apos;t have to set them again.
        </LI>
      </UL>
      <P>
        You can control or delete cookies through your browser settings.
        Disabling them won&apos;t break the site, but some features may behave
        differently.
      </P>

      <H id="third-party" n="4">
        Third-party services
      </H>
      <P>
        We rely on a small set of trusted vendors to operate. Each has its own
        privacy policy and processes data on our behalf as a sub-processor:
      </P>
      <UL>
        <LI>
          <strong className="text-white">Stripe</strong> — payment processing.
        </LI>
        <LI>
          <strong className="text-white">Google Workspace</strong> — email and
          documents.
        </LI>
        <LI>
          <strong className="text-white">Vercel</strong> — hosting and edge
          delivery.
        </LI>
        <LI>
          <strong className="text-white">Plausible / Fathom</strong> —
          privacy-friendly, cookieless analytics.
        </LI>
        <LI>
          <strong className="text-white">GitHub</strong> — source code
          hosting.
        </LI>
      </UL>
      <P>
        We share data with these vendors only to the extent necessary to
        provide the service, and we hold them to standards comparable to our
        own.
      </P>

      <H id="security" n="5">
        Data security
      </H>
      <P>
        We treat your data like it&apos;s our own. Access is restricted to
        team members who need it, all traffic is encrypted in transit (TLS
        1.2+), backups are encrypted at rest, and we run regular security
        reviews. No system is perfectly secure, but we work hard to keep ours
        close.
      </P>
      <P>
        If a breach occurs that&apos;s likely to result in a risk to your
        rights, we&apos;ll notify you and the relevant regulator within 72
        hours — no spin, no delay.
      </P>

      <H id="rights" n="6">
        Your rights (GDPR / CCPA)
      </H>
      <P>
        If you live in the EU, UK, or California, you have specific rights
        over your personal data. In many cases, these rights apply to everyone
        — we extend them globally:
      </P>
      <UL>
        <LI>
          <strong className="text-white">Access</strong> — request a copy of
          the data we hold about you.
        </LI>
        <LI>
          <strong className="text-white">Rectification</strong> — fix anything
          that&apos;s inaccurate or out of date.
        </LI>
        <LI>
          <strong className="text-white">Erasure</strong> — ask us to delete
          your data, subject to legal retention requirements.
        </LI>
        <LI>
          <strong className="text-white">Portability</strong> — receive your
          data in a structured, machine-readable format.
        </LI>
        <LI>
          <strong className="text-white">Objection</strong> — opt out of
          marketing or certain processing activities.
        </LI>
        <LI>
          <strong className="text-white">Withdrawal of consent</strong> —
          unsubscribe at any time via the link in any email.
        </LI>
      </UL>
      <P>
        To exercise any of these rights, email{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="text-primary hover:underline"
        >
          {siteConfig.email}
        </a>
        . We respond to verifiable requests within 30 days.
      </P>

      <H id="children" n="7">
        Children&apos;s privacy
      </H>
      <P>
        Our services are intended for businesses and professionals. We
        don&apos;t knowingly collect personal information from anyone under 13
        (or 16 in the EU). If you believe we&apos;ve collected data from a
        child in error, contact us and we&apos;ll delete it promptly.
      </P>

      <H id="changes" n="8">
        Changes to this policy
      </H>
      <P>
        We may update this policy as our services or the law evolves. When we
        do, we&apos;ll revise the &quot;Last updated&quot; date at the top and,
        for material changes, notify you by email or a prominent notice on the
        site. Continued use after changes take effect means you accept the
        updated policy.
      </P>

      <H id="contact" n="9">
        Contact us
      </H>
      <P>
        Questions or requests about your privacy? Reach out — we mean it.
      </P>
      <UL>
        <LI>
          Email:{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-primary hover:underline"
          >
            {siteConfig.email}
          </a>
        </LI>
        <LI>
          Mail: {siteConfig.name}, {siteConfig.address}
        </LI>
        <LI>
          Domain:{" "}
          <a
            href={siteConfig.url}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {siteConfig.domain}
          </a>
        </LI>
      </UL>
    </LegalLayout>
  );
}

/* ================================================================== */
/* TERMS OF SERVICE                                                     */
/* ================================================================== */
const termsToc: TocItem[] = [
  { id: "acceptance", label: "1. Acceptance of terms" },
  { id: "services", label: "2. Description of services" },
  { id: "accounts", label: "3. Accounts & access" },
  { id: "payments", label: "4. Payments & billing" },
  { id: "ip", label: "5. Intellectual property" },
  { id: "conduct", label: "6. User conduct" },
  { id: "warranties", label: "7. Warranties & disclaimers" },
  { id: "liability", label: "8. Limitation of liability" },
  { id: "termination", label: "9. Termination" },
  { id: "law", label: "10. Governing law" },
  { id: "changes", label: "11. Changes to these terms" },
  { id: "contact", label: "12. Contact us" },
];

export function TermsView() {
  return (
    <LegalLayout
      title={
        <>
          Terms of <GradientTextTeal>Service</GradientTextTeal>
        </>
      }
      description={`The agreement between you and ${siteConfig.name} when you use our website, services, and products.`}
      lastUpdated="January 15, 2025"
      crumbs={[{ label: "Home", route: "home" }, { label: "Terms" }]}
      toc={termsToc}
    >
      <Lead>
        Welcome to {siteConfig.name}. These Terms of Service (&quot;Terms&quot;)
        govern your use of {siteConfig.domain} and any services or digital
        products we provide. By using the site, you agree to these Terms. If
        you don&apos;t, please don&apos;t use the site.
      </Lead>

      <H id="acceptance" n="1">
        Acceptance of terms
      </H>
      <P>
        By accessing or using {siteConfig.name}, you confirm that you&apos;re
        at least 18 years old (or the age of majority in your jurisdiction)
        and that you have the authority to enter into this agreement on behalf
        of any entity you represent. If you&apos;re using the site on behalf
        of a company, you bind that company to these Terms.
      </P>

      <H id="services" n="2">
        Description of services
      </H>
      <P>
        {siteConfig.name} provides design, development, branding, AI, and
        digital-product services. We also sell ready-to-use digital products
        (templates, kits, prompts, documents) through this website. The exact
        scope of any service engagement is defined in a separate proposal,
        statement of work, or product description.
      </P>
      <P>
        In the event of a conflict between these Terms and a signed
        engagement letter, the engagement letter controls for that specific
        project.
      </P>

      <H id="accounts" n="3">
        Accounts and access
      </H>
      <P>
        Some features may require an account. If so, you agree to:
      </P>
      <UL>
        <LI>Provide accurate, current, and complete information.</LI>
        <LI>Keep your credentials confidential and secure.</LI>
        <LI>
          Notify us immediately of any unauthorized access or security breach.
        </LI>
        <LI>
          Accept responsibility for all activity under your account.
        </LI>
      </UL>
      <P>
        We may suspend or terminate accounts that we believe violate these
        Terms or applicable law.
      </P>

      <H id="payments" n="4">
        Payments and billing
      </H>
      <P>
        Pricing for services and products is published on the site or in your
        proposal. By purchasing, you agree to the fees and the billing terms
        in effect at the time of purchase.
      </P>
      <UL>
        <LI>
          Service engagements typically require a 50% deposit to begin, with
          the balance due on delivery. Larger projects may use milestone-based
          billing.
        </LI>
        <LI>
          Digital products are charged in full at the time of purchase and
          delivered instantly.
        </LI>
        <LI>
          Retainers renew automatically until cancelled. You can cancel any
          time; cancellation takes effect at the end of the current billing
          cycle.
        </LI>
        <LI>
          Late invoices may incur interest at 1.5% per month or the maximum
          allowed by law, whichever is lower.
        </LI>
      </UL>
      <P>
        See our Refund Policy for information on eligibility and the refund
        process.
      </P>

      <H id="ip" n="5">
        Intellectual property
      </H>
      <P>
        <strong className="text-white">Our work.</strong> Upon full payment for
        a service engagement, you own the final deliverables — source code,
        design files, and assets — transferred to you. We retain the right to
        display the work in our portfolio and marketing unless you&apos;ve
        signed an NDA explicitly prohibiting it.
      </P>
      <P>
        <strong className="text-white">Digital products.</strong> Digital
        products are licensed, not sold. Each purchase grants you a
        non-exclusive, non-transferable, worldwide license to use the product
        for your own projects and your clients&apos; projects. You may not
        resell, sub-license, redistribute, or include the product in a
        competing product or template marketplace.
      </P>
      <P>
        <strong className="text-white">{siteConfig.name} brand.</strong> The
        {siteConfig.name} name, logo, and all related marks are our property.
        Nothing in these Terms grants you any right to use them without prior
        written consent.
      </P>

      <H id="conduct" n="6">
        User conduct
      </H>
      <P>You agree not to:</P>
      <UL>
        <LI>Use the site for any unlawful, harmful, or fraudulent purpose.</LI>
        <LI>
          Attempt to gain unauthorized access to any part of the site,
          systems, or networks.
        </LI>
        <LI>
          Interfere with the proper functioning of the site, including
          introducing malware, scraping content, or overwhelming our servers.
        </LI>
        <LI>
          Reproduce, duplicate, or resell our content or products without
          permission.
        </LI>
        <LI>
          Misrepresent your affiliation with {siteConfig.name} or another
          party.
        </LI>
      </UL>

      <H id="warranties" n="7">
        Warranties and disclaimers
      </H>
      <P>
        We take pride in our work and warrant that our services will be
        performed in a professional, workmanlike manner consistent with
        industry standards. For digital products, we warrant that the product
        will substantially conform to its description for 30 days from
        purchase.
      </P>
      <P>
        Except as expressly stated, the site and all products and services
        are provided &quot;as is&quot; and &quot;as available&quot;. To the
        fullest extent permitted by law, {siteConfig.name} disclaims all
        implied warranties, including merchantability, fitness for a
        particular purpose, and non-infringement. We don&apos;t warrant that
        the site will be uninterrupted, error-free, or secure.
      </P>

      <H id="liability" n="8">
        Limitation of liability
      </H>
      <P>
        To the maximum extent permitted by law, in no event will{" "}
        {siteConfig.name} be liable for any indirect, incidental, special,
        consequential, or punitive damages — including lost profits, lost
        data, or business interruption — arising from your use of the site,
        services, or products.
      </P>
      <P>
        Our total liability for any claim arising out of or relating to these
        Terms or any service is limited to the greater of (a) the amount you
        paid us in the 12 months preceding the claim, or (b) USD $100. This
        limitation applies even if we&apos;ve been advised of the possibility
        of such damages.
      </P>

      <H id="termination" n="9">
        Termination
      </H>
      <P>
        You may stop using the site at any time. We may suspend or terminate
        your access if you breach these Terms, if we&apos;re required to by
        law, or if we discontinuate the site or a service. Provisions that by
        their nature should survive termination — including intellectual
        property, disclaimers, liability, and governing law — will remain in
        effect.
      </P>

      <H id="law" n="10">
        Governing law
      </H>
      <P>
        These Terms are governed by the laws of the State of California,
        without regard to its conflict-of-laws principles. You and{" "}
        {siteConfig.name} submit to the exclusive jurisdiction of the state
        and federal courts located in San Francisco County, California for any
        dispute arising under these Terms.
      </P>

      <H id="changes" n="11">
        Changes to these terms
      </H>
      <P>
        We may revise these Terms from time to time. The &quot;Last
        updated&quot; date at the top reflects the most recent version.
        Material changes will be communicated by email or a prominent notice
        on the site. Continued use after the effective date constitutes
        acceptance of the revised Terms.
      </P>

      <H id="contact" n="12">
        Contact us
      </H>
      <P>Questions about these Terms? We&apos;re easy to reach.</P>
      <UL>
        <LI>
          Email:{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-primary hover:underline"
          >
            {siteConfig.email}
          </a>
        </LI>
        <LI>
          Mail: {siteConfig.name}, {siteConfig.address}
        </LI>
      </UL>
    </LegalLayout>
  );
}

/* ================================================================== */
/* REFUND POLICY                                                        */
/* ================================================================== */
const refundToc: TocItem[] = [
  { id: "overview", label: "1. Overview" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "process", label: "3. Refund request process" },
  { id: "processing", label: "4. Processing time" },
  { id: "exceptions", label: "5. Exceptions" },
  { id: "contact", label: "6. Contact us" },
];

export function RefundView() {
  const navigate = useNavigate();

  return (
    <LegalLayout
      title={
        <>
          Refund <GradientTextTeal>Policy</GradientTextTeal>
        </>
      }
      description={`Our straightforward approach to refunds for digital products and services.`}
      lastUpdated="January 15, 2025"
      crumbs={[{ label: "Home", route: "home" }, { label: "Refund Policy" }]}
      toc={refundToc}
    >
      <Lead>
        We want you to feel good about paying us. This policy explains when
        refunds are available for digital products and services, how to
        request one, and what to expect along the way.
      </Lead>

      {/* Quick highlights card */}
      <Reveal className="mt-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "30-day guarantee",
              body: "On digital products, no questions asked.",
            },
            {
              icon: RefreshCw,
              title: "Milestone-based",
              body: "Services are refunded by completed milestones.",
            },
            {
              icon: FileText,
              title: "Fast turnaround",
              body: "Requests processed within 5 business days.",
            },
          ].map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur"
            >
              <t.icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-medium text-white">{t.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <H id="overview" n="1">
        Overview
      </H>
      <P>
        {siteConfig.name} offers two kinds of purchases — digital products and
        services — and each has its own refund logic. Digital products are
        instant downloads, so the refund window is short and the rules are
        simple. Services are bespoke engagements built over weeks, so refunds
        are calculated based on work completed.
      </P>
      <P>
        We approach refunds in good faith and ask that you do the same. If
        something isn&apos;t right, tell us — most issues are solved faster
        with a quick fix than a refund.
      </P>

      <H id="eligibility" n="2">
        Eligibility
      </H>
      <P>
        <strong className="text-white">Digital products.</strong> You&apos;re
        eligible for a full refund within 30 days of purchase, provided the
        product has not been downloaded more than once and you haven&apos;t
        used it in a shipped commercial project. Because digital products
        can&apos;t truly be &quot;returned,&quot; we rely on an honor system —
        please don&apos;t abuse it.
      </P>
      <P>
        <strong className="text-white">Services.</strong> Refunds for service
        engagements are calculated based on the work completed up to the
        cancellation date. Any delivered milestones, hours logged, or
        third-party costs incurred on your behalf are non-refundable. The
        remaining balance of any deposit will be returned within 10 business
        days of cancellation.
      </P>
      <P>
        <strong className="text-white">Retainers.</strong> Monthly retainers
        can be cancelled at any time. The cancellation takes effect at the end
        of the current billing cycle. Fees already paid for the current cycle
        are non-refundable, but you continue to receive the agreed services
        until the cycle ends.
      </P>

      <H id="process" n="3">
        Refund request process
      </H>
      <P>To request a refund, follow these steps:</P>
      <UL>
        <LI>
          Email{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-primary hover:underline"
          >
            {siteConfig.email}
          </a>{" "}
          with the subject line &quot;Refund request&quot;.
        </LI>
        <LI>
          Include your order or invoice number, the date of purchase, and a
          short note on why you&apos;d like a refund.
        </LI>
        <LI>
          For service engagements, mention the project name and the last
          milestone you received.
        </LI>
        <LI>
          We&apos;ll reply within 2 business days with a decision and next
          steps.
        </LI>
      </UL>

      <H id="processing" n="4">
        Processing time
      </H>
      <P>
        Approved refunds are processed back to the original payment method
        within 5 business days. Depending on your bank, it can take an
        additional 3–10 days for the credit to appear on your statement. We
        can&apos;t speed that part up — but we&apos;ll forward any receipt you
        need to chase it down.
      </P>

      <H id="exceptions" n="5">
        Exceptions
      </H>
      <P>Refunds are not available in the following cases:</P>
      <UL>
        <LI>
          The digital product has been downloaded more than once or used in a
          shipped commercial project.
        </LI>
        <LI>
          The request is made after the 30-day window for digital products.
        </LI>
        <LI>
          For services: the work has been delivered and accepted at a
          milestone sign-off.
        </LI>
        <LI>
          Custom work, third-party licenses, hosting, or services already
          rendered by sub-contractors on your behalf.
        </LI>
        <LI>
          Bundle purchases where one or more items have been downloaded.
          Partial refunds for bundles are handled case-by-case.
        </LI>
      </UL>
      <P>
        Chargebacks filed without first contacting us void this policy and may
        result in account suspension. We&apos;d much rather fix it directly —
        please reach out.
      </P>

      <H id="contact" n="6">
        Contact us
      </H>
      <P>
        Refund requests, questions, or just want to talk through an issue?
        We&apos;re here.
      </P>
      <UL>
        <LI>
          Email:{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-primary hover:underline"
          >
            {siteConfig.email}
          </a>
        </LI>
        <LI>
          Phone: {siteConfig.phone}
        </LI>
        <LI>
          Mail: {siteConfig.name}, {siteConfig.address}
        </LI>
      </UL>

      <Reveal className="mt-10">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/5 bg-card/40 p-5 backdrop-blur">
          <p className="flex-1 text-sm text-muted-foreground">
            Need to start the conversation?
          </p>
          <Button
            onClick={() => navigate("contact")}
            className="bg-primary text-primary-foreground hover:bg-hover"
          >
            Open a request <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </Reveal>
    </LegalLayout>
  );
}
