"use client";

import { useMemo, useState } from "react";
import { Calculator, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type ProjectType = "Landing page" | "Business site" | "E-commerce" | "Web app" | "Custom";
type DesignLevel = "Template" | "Custom" | "Premium";

const baseByType: Record<ProjectType, number> = {
  "Landing page": 1800,
  "Business site": 3500,
  "E-commerce": 6000,
  "Web app": 12000,
  "Custom": 18000,
};

const pageFactor: Record<ProjectType, number> = {
  "Landing page": 120,
  "Business site": 220,
  "E-commerce": 350,
  "Web app": 500,
  "Custom": 650,
};

const features: { id: string; label: string; cost: number }[] = [
  { id: "cms", label: "CMS integration", cost: 1200 },
  { id: "ecom", label: "E-commerce", cost: 2500 },
  { id: "blog", label: "Blog", cost: 600 },
  { id: "booking", label: "Booking system", cost: 1800 },
  { id: "multi", label: "Multilingual", cost: 1400 },
  { id: "ai", label: "AI features", cost: 3500 },
  { id: "anim", label: "Custom animations", cost: 900 },
  { id: "seo", label: "SEO optimization", cost: 700 },
];

const designMultiplier: Record<DesignLevel, number> = {
  Template: 1,
  Custom: 1.35,
  Premium: 1.7,
};

export function WebsiteCostCalculator() {
  const [projectType, setProjectType] = useState<ProjectType>("Business site");
  const [pages, setPages] = useState(5);
  const [featureIds, setFeatureIds] = useState<Set<string>>(new Set(["blog", "seo"]));
  const [designLevel, setDesignLevel] = useState<DesignLevel>("Custom");
  const [maintenance, setMaintenance] = useState(true);

  const toggleFeature = (id: string) => {
    setFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { total, base, pagesCost, featuresCost, designCost, monthly, low, high } = useMemo(() => {
    const b = baseByType[projectType];
    const p = pages * pageFactor[projectType];
    const f = features.reduce((sum, feat) => sum + (featureIds.has(feat.id) ? feat.cost : 0), 0);
    const sub = b + p + f;
    const d = Math.round(sub * (designMultiplier[designLevel] - 1));
    const t = sub + d;
    const m = maintenance ? Math.round(t * 0.04) : 0;
    return {
      total: t,
      base: b,
      pagesCost: p,
      featuresCost: f,
      designCost: d,
      monthly: m,
      low: Math.round(t * 0.85),
      high: Math.round(t * 1.15),
    };
  }, [projectType, pages, featureIds, designLevel, maintenance]);

  const copyBreakdown = () => {
    const lines = [
      `Website cost estimate`,
      `Project type: ${projectType}`,
      `Pages: ${pages}`,
      `Design level: ${designLevel}`,
      `Base: $${base.toLocaleString()}`,
      `Pages (${pages}x): $${pagesCost.toLocaleString()}`,
      `Features: $${featuresCost.toLocaleString()}`,
      `Design uplift (${designLevel}): $${designCost.toLocaleString()}`,
      `Estimated total: $${total.toLocaleString()}`,
      `Range: $${low.toLocaleString()} – $${high.toLocaleString()}`,
      maintenance ? `Maintenance (monthly): $${monthly.toLocaleString()}` : `Maintenance: —`,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => toast.success("Copied!"));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Website Cost Calculator</h3>
            <p className="text-xs text-muted-foreground">Ballpark estimate based on scope, features & polish.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white/80">Project type</Label>
            <Select value={projectType} onValueChange={(v) => setProjectType(v as ProjectType)}>
              <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                {(Object.keys(baseByType) as ProjectType[]).map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Design level</Label>
            <Select value={designLevel} onValueChange={(v) => setDesignLevel(v as DesignLevel)}>
              <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                {(Object.keys(designMultiplier) as DesignLevel[]).map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-white/80">Number of pages</Label>
            <Badge variant="secondary" className="bg-primary/15 text-primary">{pages}</Badge>
          </div>
          <Slider value={[pages]} min={1} max={30} step={1} onValueChange={(v) => setPages(v[0])} />
        </div>

        <div className="mt-5 space-y-3">
          <Label className="text-white/80">Features</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {features.map((f) => {
              const checked = featureIds.has(f.id);
              return (
                <label
                  key={f.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-background/50 px-3 py-2.5 transition-colors hover:border-primary/30"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={checked} onCheckedChange={() => toggleFeature(f.id)} />
                    <span className="text-sm text-white/90">{f.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">+${f.cost.toLocaleString()}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-background/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">Monthly maintenance</p>
            <p className="text-xs text-muted-foreground">Hosting, backups, updates & support.</p>
          </div>
          <Switch checked={maintenance} onCheckedChange={setMaintenance} />
        </div>

        <Separator className="my-6 bg-white/5" />

        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/40 to-card/20 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Estimated total</p>
          <p className="mt-1 font-display text-4xl font-bold text-white">${total.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Range: <span className="text-white/80">${low.toLocaleString()}</span> – <span className="text-white/80">${high.toLocaleString()}</span>
            {maintenance && monthly > 0 && <> · plus <span className="text-white/80">${monthly.toLocaleString()}/mo</span> maintenance</>}
          </p>

          <div className="mt-4 space-y-1.5 text-sm">
            <Row label={`Base (${projectType})`} value={`$${base.toLocaleString()}`} />
            <Row label={`Pages × ${pages}`} value={`$${pagesCost.toLocaleString()}`} />
            <Row label="Features" value={`$${featuresCost.toLocaleString()}`} />
            <Row label={`Design uplift (${designLevel})`} value={`$${designCost.toLocaleString()}`} />
          </div>

          <Button
            onClick={copyBreakdown}
            variant="outline"
            className="mt-5 h-9 w-full rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            <Copy className="h-4 w-4" /> Copy breakdown
          </Button>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/80">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
          Estimates are ballpark figures. Final pricing depends on scope, integrations, content, and timeline. Book a free call for a fixed quote.
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-white/90">{value}</span>
    </div>
  );
}
