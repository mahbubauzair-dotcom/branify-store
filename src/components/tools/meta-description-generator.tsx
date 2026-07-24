"use client";

import { useMemo, useState } from "react";
import { AlignLeft, Copy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Tone = "Informative" | "Persuasive" | "Question" | "Action-driven";

const templates: Record<Tone, (kw: string, brand: string, topic: string) => string> = {
  Informative: (k, b, t) =>
    `Learn everything about ${k} with ${b || "our team"}. This ${t || "guide"} breaks down what matters, common pitfalls, and how to get results fast — without the fluff.`,
  Persuasive: (k, b, t) =>
    `Looking for the best ${k}? ${b || "We"} crafted this ${t || "guide"} to help you choose with confidence. Save time, avoid mistakes, and get it right the first time.`,
  Question: (k, b, t) =>
    `What makes great ${k}? In this ${t || "guide"}, ${b || "our team"} shares proven strategies, real examples, and practical tips you can apply today.`,
  "Action-driven": (k, b, t) =>
    `Master ${k} today. ${b || "Our"} ${t || "guide"} walks you through every step — from setup to results — so you can take action with confidence.`,
};

function makeDescriptions(keyword: string, brand: string, topic: string, tone: Tone): string[] {
  const k = keyword.trim() || "your topic";
  const t = topic.trim() || "guide";
  const out = new Set<string>();
  out.add(templates[tone](k, brand, t));
  Object.keys(templates).forEach((key) => out.add(templates[key as Tone](k, brand, t)));
  return Array.from(out).slice(0, 5);
}

export function MetaDescriptionGenerator() {
  const [keyword, setKeyword] = useState("brand design");
  const [brand, setBrand] = useState("BRANIFY");
  const [topic, setTopic] = useState("complete guide");
  const [tone, setTone] = useState<Tone>("Informative");
  const descriptions = useMemo(
    () => makeDescriptions(keyword, brand, topic, tone),
    [keyword, brand, topic, tone],
  );

  const first = descriptions[0] ?? "";

  const copy = (d: string) => {
    navigator.clipboard.writeText(d).then(() => toast.success("Copied!"));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <AlignLeft className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Meta Description Generator</h3>
            <p className="text-xs text-muted-foreground">Compelling descriptions under 160 characters.</p>
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
          <div className="space-y-2">
            <Label className="text-white/80">Page topic</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. complete guide" className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
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
        </div>

        <div className="mt-6 space-y-2">
          {descriptions.map((d, i) => {
            const over = d.length > 160;
            return (
              <div key={`${d}-${i}`} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-background/50 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-white">{d}</p>
                  <p className={`mt-1 text-xs ${over ? "text-rose-400" : "text-muted-foreground"}`}>
                    {d.length} chars {over ? "· too long" : "· good"}
                  </p>
                </div>
                <Button
                  onClick={() => copy(d)}
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
            <p className="mt-0.5 truncate text-lg font-medium text-[#1a0dab]">
              {keyword ? `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Guide` : "Your page title"}
            </p>
            <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">
              {first || "Your meta description appears here. Keep it under 160 characters."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
