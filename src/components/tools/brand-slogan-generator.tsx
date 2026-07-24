"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, RefreshCw, Sparkles } from "lucide-react";
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

type Tone = "Bold" | "Playful" | "Elegant" | "Minimal" | "Inspiring";

const templates: Record<Tone, ((b: string, kw: string) => string)[]> = {
  Bold: [
    (b, kw) => `${b}. No limits. Just ${kw}.`,
    (b) => `${b}. Built different.`,
    (b, kw) => `${b} — own the ${kw} game.`,
    (b) => `Go hard. Go ${b}.`,
    (b, kw) => `${b}. Where ${kw} meets ambition.`,
    (b) => `${b}. Defy the ordinary.`,
    (b, kw) => `Unleash ${kw} with ${b}.`,
    (b) => `${b}. Bold by design.`,
  ],
  Playful: [
    (b, kw) => `${b}: serious about ${kw}, silly about everything else.`,
    (b) => `${b} makes it fun.`,
    (b, kw) => `Say hi to ${b} — your new ${kw} bestie.`,
    (b) => `${b}. High-fives guaranteed.`,
    (b, kw) => `${b}: sprinkle some ${kw} magic.`,
    (b) => `Good vibes. Great ${b}.`,
    (b, kw) => `${b} — because ${kw} should be fun.`,
    (b) => `${b}. Bring the confetti.`,
  ],
  Elegant: [
    (b, kw) => `${b}. The art of ${kw}.`,
    (b) => `${b}. Timeless by nature.`,
    (b, kw) => `${b} — where ${kw} becomes craft.`,
    (b) => `${b}. Quietly remarkable.`,
    (b, kw) => `${b}: elegance in every ${kw}.`,
    (b) => `${b}. Refined to perfection.`,
    (b, kw) => `Discover ${kw}, the ${b} way.`,
    (b) => `${b}. Grace in motion.`,
  ],
  Minimal: [
    (b) => `${b}. Less, but better.`,
    (b, kw) => `${b}. Just ${kw}.`,
    (b) => `${b}. Simply done.`,
    (b, kw) => `${b}. ${kw}, distilled.`,
    (b) => `${b}. Nothing extra.`,
    (b, kw) => `${b}. ${kw} made simple.`,
    (b) => `${b}. Pure and clear.`,
    (b, kw) => `${b}. The essentials of ${kw}.`,
  ],
  Inspiring: [
    (b, kw) => `${b} — dream big in ${kw}.`,
    (b) => `${b}. Your story starts here.`,
    (b, kw) => `Believe in ${kw}. Believe in ${b}.`,
    (b) => `${b}. Rise and thrive.`,
    (b, kw) => `${b}: ignite your ${kw} journey.`,
    (b) => `${b}. Inspire every day.`,
    (b, kw) => `${b} — where ${kw} dreams take flight.`,
    (b) => `${b}. Dare to begin.`,
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeSlogans(brand: string, keyword: string, tone: Tone, count = 8): string[] {
  const b = (brand.trim() || "Your Brand").split(" ")[0];
  const k = keyword.trim() || "greatness";
  const bank = templates[tone];
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const tpl = shuffled[i % shuffled.length];
    out.push(tpl(b, k));
  }
  return Array.from(new Set(out)).slice(0, count);
}

export function BrandSloganGenerator() {
  const [brand, setBrand] = useState("BRANIFY");
  const [keyword, setKeyword] = useState("branding");
  const [tone, setTone] = useState<Tone>("Bold");
  const [slogans, setSlogans] = useState<string[]>(() => makeSlogans("BRANIFY", "branding", "Bold", 8));

  const run = useCallback(() => {
    setSlogans(makeSlogans(brand, keyword, tone, 8));
  }, [brand, keyword, tone]);

  const copy = (s: string) => {
    navigator.clipboard.writeText(s).then(() => toast.success("Copied!"));
  };

  const accent = useMemo(() => pick(["from-teal-500/15", "from-violet-500/15", "from-cyan-500/15", "from-emerald-500/15"]), []);

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Brand Slogan Generator</h3>
            <p className="text-xs text-muted-foreground">Catchy taglines tuned to your tone.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white/80">Brand name</Label>
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. BRANIFY" className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Keywords</Label>
            <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. branding, growth" className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2 sm:col-span-2">
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

        <Button
          onClick={run}
          className="mt-5 h-11 w-full rounded-lg bg-primary text-primary-foreground hover:bg-hover"
        >
          <RefreshCw className="h-4 w-4" /> Regenerate slogans
        </Button>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {slogans.map((s, i) => (
            <div
              key={`${s}-${i}`}
              className={`group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${accent} via-card/40 to-card/20 p-4 transition-colors hover:border-primary/30`}
            >
              <p className="font-display text-sm font-medium leading-snug text-white">{s}</p>
              <button
                onClick={() => copy(s)}
                aria-label="Copy slogan"
                className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-white/5 hover:text-primary group-hover:opacity-100"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
