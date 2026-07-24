"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin, Twitter, Instagram, Linkedin, Dribbble, Github, Send, Check, Keyboard, ArrowUp, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, type RouteName } from "@/lib/router";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { tools } from "@/data/tools";
import { toast } from "sonner";

const footerNav: { title: string; links: { label: string; route: RouteName; slug?: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About us", route: "about" },
      { label: "Portfolio", route: "portfolio" },
      { label: "Blog", route: "blog" },
      { label: "Contact", route: "contact" },
      { label: "FAQ", route: "faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", route: "privacy" },
      { label: "Terms of Service", route: "terms" },
      { label: "Refund Policy", route: "refund" },
    ],
  },
];

export function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Subscription failed. Please try again.");
        return;
      }
      setSubscribed(true);
      toast.success(
        data.isNew
          ? "You're on the list! Check your inbox for a welcome email."
          : "Welcome back — you're subscribed again!",
      );
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/5 bg-card/30">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description} We help ambitious brands look, feel and perform like a million dollars.
            </p>

            <form onSubmit={subscribe} className="mt-6 max-w-sm">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Join the newsletter
              </label>
              <div className="mt-2 flex gap-2">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="bg-background/50 border-white/10"
                />
                <Button type="submit" size="icon" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-hover shrink-0">
                  {subscribed ? <Check className="h-4 w-4" /> : submitting ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground/70">
                Weekly insights on branding, design &amp; growth. No spam.
              </p>
            </form>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <button
                    onClick={() => navigate("services")}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Free Tools</h3>
            <ul className="mt-4 space-y-2.5">
              {tools.slice(0, 6).map((t) => (
                <li key={t.slug}>
                  <button
                    onClick={() => navigate("tools")}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Legal */}
          <div className="lg:col-span-2">
            {footerNav.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => navigate(link.route)}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact row */}
        <div className="mt-12 grid gap-4 border-t border-white/5 pt-8 sm:grid-cols-3">
          <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary">
            <Mail className="h-4 w-4 text-primary" />
            {siteConfig.email}
          </a>
          <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary">
            <Phone className="h-4 w-4 text-primary" />
            {siteConfig.phone}
          </a>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {siteConfig.address}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <p className="text-xs text-muted-foreground/70">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. · {siteConfig.domain}
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event("branify:open-shortcuts"))}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
              title="Keyboard shortcuts"
            >
              <Keyboard className="h-3 w-3" />
              Shortcuts
              <kbd className="rounded bg-white/5 px-1 text-[9px]">?</kbd>
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-primary"
              title="Back to top"
            >
              <ArrowUp className="h-3 w-3" />
              Top
            </button>
          </div>
          <div className="flex items-center gap-1">
            {[
              { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
              { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
              { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
              { icon: Dribbble, href: siteConfig.social.dribbble, label: "Dribbble" },
              { icon: Github, href: siteConfig.social.github, label: "GitHub" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
