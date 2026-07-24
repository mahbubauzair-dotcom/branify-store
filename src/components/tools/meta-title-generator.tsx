"use client";

import { useMemo, useState } from "react";
import { Copy, Search, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Tone = "Direct" | "Catchy" | "Question" | "How-to" | "Listicle";

const templates: Record<Tone, (kw: string, brand: string) => string> = {
  Direct: (k, b) => `${capitalize(k)}: The Complete Guide${b ? ` | ${b}` : ""}`,
  Catchy: (k, b) => `${capitalize(k)} Made Simple${b ? ` — ${b}` : ""}`,
  Question: (k) => `Looking for ${k}? Here's What You Need to Know`,
  "How-to": (k, b) => `How to Master ${capitalize(k)} in 2025${b ? ` | ${b}` : ""}`,
  Listicle: (k, b) => `10 ${capitalize(k)} Tips That Actually Work${b ? ` | ${b}` : ""}`,
};

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function makeTitles(keyword: string, brand: string, tone: Tone): string[] {
  const k = keyword.trim() || "your topic";
  const variants = new Set<string>();
  Object.keys(templates).forEach((t) => {
    variants.add((templates[t as Tone] || templates[tone])(k, brand));
  });
  // tone-first ordering, dedupe, cap at 6
  const ordered = [templates[tone](k, brand), ...Array.from(variants)];
  const seen = new Set<string>();
  return ordered.filter((s) => (seen.has(s) ? false : (seen.add(s), true))).slice(0, 6);
}

export function MetaTitleGenerator() {
  const [keyword, setKeyword] = useState("brand design");
  const [brand, setBrand] = useState("BRANIFY");
  const [tone, setTone] = useState<Tone>("Direct");
  const titles = useMemo(() => makeTitles(keyword, brand, tone), [keyword, brand, tone]);

  const first = titles[0] ?? "";

  const copy = (t: string) => {
    navigator.clipboard.writeText(t).then(() => toast.success("Copied!"));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Type className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Meta Title Generator</h3>
            <p className="text-xs text-muted-foreground">SEO-optimized titles under 60 characters.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white/80">Keyword</Label>
            <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. brand design" className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Brand name</Label>
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. BRANIFY" className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label className="text-white/80">Tone</Label>
          <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
            <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
              {(Object.keys(templates) as Tone[]).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 space-y-2">
          {titles.map((t, i) => {
            const over = t.length > 60;
            return (
              <div key={`${t}-${i}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-background/50 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{t}</p>
                  <p className={`mt-0.5 text-xs ${over ? "text-rose-400" : "text-muted-foreground"}`}>
                    {t.length} chars {over ? "· too long" : "· good"}
                  </p>
                </div>
                <Button
                  onClick={() => copy(t)}
                  size="sm"
                  variant="ghost"
                  className="h-8 shrink-0 rounded-md text-muted-foreground hover:bg-white/5 hover:text-primary"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Search className="h-3.5 w-3.5" /> Google preview
          </p>
          <div className="rounded-xl border border-white/10 bg-white p-4">
            <p className="truncate text-xs text-emerald-700">{brand ? `${brand.toLowerCase().replace(/\s+/g, "")}.com` : "example.com"} › blog › guide</p>
            <p className="mt-0.5 truncate text-lg font-medium text-[#1a0dab]">{first || "Your title appears here"}</p>
            <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">
              Discover everything you need to know about {keyword || "your topic"}. Expert tips, actionable advice, and real examples — all in one place.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
