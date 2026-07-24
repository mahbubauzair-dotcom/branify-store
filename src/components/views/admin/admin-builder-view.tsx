"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Sparkles,
  Palette,
  Megaphone,
  PanelBottom,
  Type,
  Info,
  RotateCcw,
} from "lucide-react";
import { AdminLayout } from "@/components/views/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Keys we manage in the Website Builder. Stored as flat string values in the
 * SiteSetting table. The public storefront will read these in a future task.
 */
const KEYS = {
  heroHeadline: "site.hero.headline",
  heroSubheadline: "site.hero.subheadline",
  heroCtaPrimary: "site.hero.ctaPrimary",
  heroCtaSecondary: "site.hero.ctaSecondary",
  colorPrimary: "site.color.primary",
  colorHover: "site.color.hover",
  colorBackground: "site.color.background",
  colorSurface: "site.color.surface",
  announcementText: "site.announcement.text",
  announcementActive: "site.announcement.active",
  footerTagline: "site.footer.tagline",
} as const;

const DEFAULTS: Record<string, string> = {
  [KEYS.heroHeadline]: "Build a brand that's impossible to ignore.",
  [KEYS.heroSubheadline]:
    "BRANIFY is a premium digital agency crafting identity systems, websites, and AI products for founders who refuse to blend in.",
  [KEYS.heroCtaPrimary]: "Start your project",
  [KEYS.heroCtaSecondary]: "Explore work",
  [KEYS.colorPrimary]: "#0fe1d2",
  [KEYS.colorHover]: "#02b6bc",
  [KEYS.colorBackground]: "#0b1120",
  [KEYS.colorSurface]: "#131c31",
  [KEYS.announcementText]: "New Year Sale — Get 40% off all digital products & 15% off services.",
  [KEYS.announcementActive]: "true",
  [KEYS.footerTagline]: "Build. Brand. Grow.",
};

type SettingsMap = Record<string, string>;

/**
 * AdminBuilderView — edit site-wide content & design tokens.
 */
export function AdminBuilderView() {
  return (
    <AdminLayout active="builder">
      <BuilderContent />
    </AdminLayout>
  );
}

function BuilderContent() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [original, setOriginal] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (data?.ok && data.settings) {
        // Merge fetched settings over defaults so the form always has values.
        const merged: SettingsMap = { ...DEFAULTS, ...(data.settings as SettingsMap) };
        setSettings(merged);
        setOriginal(merged);
      } else {
        toast.error("Failed to load settings.");
      }
    } catch {
      toast.error("Network error loading settings.");
    } finally {
      setLoading(false);
    }
  }

  function get(key: string): string {
    return settings[key] ?? DEFAULTS[key] ?? "";
  }

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  const changedKeys = useMemo(() => {
    const changed: string[] = [];
    for (const key of Object.values(KEYS)) {
      const cur = settings[key] ?? DEFAULTS[key] ?? "";
      const orig = original[key] ?? DEFAULTS[key] ?? "";
      if (cur !== orig) changed.push(key);
    }
    return changed;
  }, [settings, original]);

  async function onSave() {
    if (changedKeys.length === 0) {
      toast.info("No changes to save.");
      return;
    }
    const toSave: SettingsMap = {};
    for (const key of changedKeys) toSave[key] = settings[key] ?? DEFAULTS[key] ?? "";
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: toSave }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        toast.error(data?.error || "Failed to save settings.");
        return;
      }
      setOriginal({ ...settings });
      toast.success(`Saved ${changedKeys.length} change${changedKeys.length === 1 ? "" : "s"}`);
    } catch {
      toast.error("Network error saving settings.");
    } finally {
      setSaving(false);
    }
  }

  function onReset() {
    setSettings({ ...original });
    toast.info("Reverted to last saved values.");
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Loading settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Website Builder
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit site-wide content and design. Changes apply on next render.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {changedKeys.length > 0 && (
            <Button
              variant="outline"
              onClick={onReset}
              className="border-white/10 bg-transparent text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Revert
            </Button>
          )}
          <Button
            onClick={onSave}
            disabled={saving || changedKeys.length === 0}
            className="bg-primary text-primary-foreground hover:bg-hover"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                Save{changedKeys.length > 0 ? ` (${changedKeys.length})` : ""}
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="gap-4">
        <TabsList className="w-full justify-start overflow-x-auto bg-card/40 p-1 sm:w-auto">
          <TabsTrigger value="hero">
            <Type className="mr-1.5 h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="colors">
            <Palette className="mr-1.5 h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="announcement">
            <Megaphone className="mr-1.5 h-4 w-4" />
            Announcement
          </TabsTrigger>
          <TabsTrigger value="footer">
            <PanelBottom className="mr-1.5 h-4 w-4" />
            Footer
          </TabsTrigger>
        </TabsList>

        {/* HERO */}
        <TabsContent value="hero">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="space-y-5 border-white/5 bg-card/40 p-6 backdrop-blur">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                <h2 className="font-display text-lg font-semibold text-white">Hero section</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="h-headline">Headline</Label>
                <Textarea
                  id="h-headline"
                  value={get(KEYS.heroHeadline)}
                  onChange={(e) => set(KEYS.heroHeadline, e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="h-sub">Subheadline</Label>
                <Textarea
                  id="h-sub"
                  value={get(KEYS.heroSubheadline)}
                  onChange={(e) => set(KEYS.heroSubheadline, e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="h-cta1">Primary CTA text</Label>
                  <Input
                    id="h-cta1"
                    value={get(KEYS.heroCtaPrimary)}
                    onChange={(e) => set(KEYS.heroCtaPrimary, e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="h-cta2">Secondary CTA text</Label>
                  <Input
                    id="h-cta2"
                    value={get(KEYS.heroCtaSecondary)}
                    onChange={(e) => set(KEYS.heroCtaSecondary, e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Live preview */}
            <Card className="overflow-hidden border-white/5 bg-card/40 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Live preview
                </span>
                <span className="text-[10px] text-muted-foreground/60">Approximate</span>
              </div>
              <div
                className="relative flex min-h-[320px] flex-col items-center justify-center gap-5 p-8 text-center"
                style={{
                  backgroundColor: get(KEYS.colorBackground),
                }}
              >
                <div className="absolute inset-0 bg-grid opacity-[0.07]" />
                <motion.div
                  key={get(KEYS.heroHeadline) + get(KEYS.heroSubheadline)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative max-w-md space-y-3"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Sparkles className="h-3 w-3" />
                    BRANIFY
                  </div>
                  <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {get(KEYS.heroHeadline) || "Your headline appears here"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {get(KEYS.heroSubheadline) || "Your subheadline appears here."}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <span
                      className="rounded-md px-4 py-2 text-sm font-medium"
                      style={{
                        backgroundColor: get(KEYS.colorPrimary),
                        color: "#04121a",
                      }}
                    >
                      {get(KEYS.heroCtaPrimary) || "Primary CTA"}
                    </span>
                    <span
                      className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-white"
                      style={{ backgroundColor: get(KEYS.colorSurface) }}
                    >
                      {get(KEYS.heroCtaSecondary) || "Secondary CTA"}
                    </span>
                  </div>
                </motion.div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* COLORS */}
        <TabsContent value="colors">
          <Card className="space-y-5 border-white/5 bg-card/40 p-6 backdrop-blur">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold text-white">Brand colors</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ColorField
                label="Primary"
                description="Buttons, links, accents"
                value={get(KEYS.colorPrimary)}
                onChange={(v) => set(KEYS.colorPrimary, v)}
              />
              <ColorField
                label="Hover"
                description="Primary button hover"
                value={get(KEYS.colorHover)}
                onChange={(v) => set(KEYS.colorHover, v)}
              />
              <ColorField
                label="Background"
                description="Page background"
                value={get(KEYS.colorBackground)}
                onChange={(v) => set(KEYS.colorBackground, v)}
              />
              <ColorField
                label="Surface"
                description="Cards, panels"
                value={get(KEYS.colorSurface)}
                onChange={(v) => set(KEYS.colorSurface, v)}
              />
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p>
                Color values are stored as site settings and will apply on the next render of the
                public storefront. A future task will wire the public views to read these settings.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* ANNOUNCEMENT BAR */}
        <TabsContent value="announcement">
          <Card className="space-y-5 border-white/5 bg-card/40 p-6 backdrop-blur">
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold text-white">Announcement bar</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="a-text">Announcement text</Label>
              <Textarea
                id="a-text"
                value={get(KEYS.announcementText)}
                onChange={(e) => set(KEYS.announcementText, e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Active</p>
                <p className="text-xs text-muted-foreground">
                  When off, the announcement bar is hidden from visitors.
                </p>
              </div>
              <Switch
                checked={get(KEYS.announcementActive) === "true"}
                onCheckedChange={(v) => set(KEYS.announcementActive, v ? "true" : "false")}
              />
            </div>

            {/* Preview */}
            <div className="overflow-hidden rounded-xl border border-white/5">
              <div className="border-b border-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Preview
              </div>
              <div
                className="flex items-center justify-center gap-2 px-4 py-3 text-center text-sm font-medium"
                style={{
                  background: `linear-gradient(to right, ${get(KEYS.colorHover)}, ${get(KEYS.colorPrimary)}, #2fb8af)`,
                  color: "#04121a",
                }}
              >
                <Sparkles className="h-4 w-4" />
                {get(KEYS.announcementText) || "Your announcement appears here."}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="footer">
          <Card className="space-y-5 border-white/5 bg-card/40 p-6 backdrop-blur">
            <div className="flex items-center gap-2">
              <PanelBottom className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold text-white">Footer</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="f-tag">Footer tagline</Label>
              <Input
                id="f-tag"
                value={get(KEYS.footerTagline)}
                onChange={(e) => set(KEYS.footerTagline, e.target.value)}
                placeholder="Build. Brand. Grow."
              />
              <p className="text-xs text-muted-foreground">
                Shown beneath the logo in the site footer.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/5">
              <div className="border-b border-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Preview
              </div>
              <div
                className="flex flex-col items-center gap-2 px-4 py-6 text-center"
                style={{ backgroundColor: get(KEYS.colorBackground) }}
              >
                <p className="font-display text-lg font-semibold text-primary">
                  {get(KEYS.footerTagline) || "Your tagline appears here."}
                </p>
                <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BRANIFY</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ColorField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const safe = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : "#000000";
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-2">
        <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-white/10">
          <input
            type="color"
            value={safe}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] cursor-pointer border-0 p-0"
            aria-label={`${label} color`}
          />
        </label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-xs"
          placeholder="#0fe1d2"
        />
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div
        className={cn("h-2 w-full rounded-full border border-white/5")}
        style={{ backgroundColor: safe }}
      />
    </div>
  );
}
