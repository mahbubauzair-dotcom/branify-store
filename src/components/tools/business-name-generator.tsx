"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, Heart, RefreshCw, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type StyleKey = "Modern" | "Playful" | "Professional" | "Tech" | "Luxury";

const wordBanks: Record<StyleKey, { prefixes: string[]; roots: string[]; suffixes: string[] }> = {
  Modern: {
    prefixes: ["Nova", "Lumen", "Vivid", "Orbit", "Echo", "Pulse", "Velo", "Halo"],
    roots: ["wave", "form", "shift", "lab", "flux", "loop", "deck", "grid"],
    suffixes: ["Studio", "Labs", "Co.", "Works", "Hub", "Collective", "Agency", "House"],
  },
  Playful: {
    prefixes: ["Happy", "Sunny", "Bouncy", "Pop", "Zappy", "Giggly", "Bubbly", "Snappy"],
    roots: ["bean", "pop", "berry", "fox", "panda", "cloud", "spark", "mango"],
    suffixes: ["Buddies", "Pals", "Friends", "Club", "Party", "Tribe", "Crew", "Land"],
  },
  Professional: {
    prefixes: ["Apex", "Summit", "Sterling", "Pinnacle", "Prime", "Keystone", "Cardinal", "Meridian"],
    roots: ["group", "partners", "advisors", "consult", "capital", "trust", "alliance", "venture"],
    suffixes: ["Group", "Partners", "& Co.", "Advisors", "Consulting", "Capital", "Holdings", "LLC"],
  },
  Tech: {
    prefixes: ["Quantum", "Cyber", "Neural", "Hyper", "Binary", "Nex", "Synth", "Byte"],
    roots: ["sync", "stack", "node", "mesh", "core", "flow", "grid", "logic"],
    suffixes: ["Tech", "Systems", "Soft", "AI", "Labs", "Stack", "Cloud", "OS"],
  },
  Luxury: {
    prefixes: ["Maison", "Atelier", "Luxe", "Noir", "Or", "Bel", "Regal", "Crown"],
    roots: ["gold", "silk", "ivory", "manor", "estate", " pearl", "royale", "elite"],
    suffixes: ["& Cie", "Maison", "Atelier", "Couture", "Collection", "Heritage", "Royal", "Estate"],
  },
};

const lengthMap: Record<number, "short" | "medium" | "long"> = {
  0: "short",
  1: "medium",
  2: "long",
};

const lengthLabels = ["Short", "Medium", "Long"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateName(keyword: string, style: StyleKey, length: "short" | "medium" | "long"): string {
  const bank = wordBanks[style];
  const key = keyword.trim();
  const keyCap = key ? capitalize(key) : "";
  const keyLower = key ? key.toLowerCase() : "";

  if (length === "short") {
    const variants = [
      `${keyCap || pick(bank.prefixes)}${pick(bank.roots)}`,
      `${pick(bank.prefixes)}${keyCap || pick(bank.roots)}`,
      `${keyCap || pick(bank.prefixes)}${pick(bank.suffixes)}`,
    ];
    return pick(variants);
  }
  if (length === "medium") {
    const variants = [
      `${keyCap || pick(bank.prefixes)} ${pick(bank.suffixes)}`,
      `${pick(bank.prefixes)} ${keyCap || pick(bank.roots)}`,
      `${pick(bank.prefixes)}${keyCap || capitalize(pick(bank.roots))}`,
      `${keyCap || pick(bank.prefixes)}${pick(bank.roots)}${pick(bank.suffixes)}`.replace(keyCap, keyCap || pick(bank.prefixes)),
    ];
    return pick(variants);
  }
  // long
  const variants = [
    `${pick(bank.prefixes)} ${keyCap || capitalize(pick(bank.roots))} ${pick(bank.suffixes)}`,
    `${keyCap || pick(bank.prefixes)} ${capitalize(pick(bank.roots))} ${pick(bank.suffixes)}`,
    `${pick(bank.prefixes)} ${keyCap} ${pick(bank.suffixes)}`.replace(/\s+/g, " ").trim() || `${pick(bank.prefixes)} ${capitalize(pick(bank.roots))} ${pick(bank.suffixes)}`,
  ];
  return pick(variants).replace(/\s+/g, " ").trim();
}

function generateNames(keyword: string, style: StyleKey, length: "short" | "medium" | "long", count = 12): string[] {
  const set = new Set<string>();
  let safety = 0;
  while (set.size < count && safety < count * 8) {
    const name = generateName(keyword, style, length);
    if (name && !set.has(name)) set.add(name);
    safety++;
  }
  return Array.from(set);
}

export function BusinessNameGenerator() {
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState<StyleKey>("Modern");
  const [lengthIdx, setLengthIdx] = useState(1);
  const [names, setNames] = useState<string[]>(() => generateNames("", "Modern", "medium", 12));
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const length = lengthMap[lengthIdx] ?? "medium";

  const run = useCallback(() => {
    setNames(generateNames(keyword, style, length, 12));
  }, [keyword, style, length]);

  const toggleSave = (name: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const copy = (name: string) => {
    navigator.clipboard.writeText(name).then(() => toast.success("Copied!"));
  };

  const lengthLabel = useMemo(() => lengthLabels[lengthIdx], [lengthIdx]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Business Name Generator</h3>
            <p className="text-xs text-muted-foreground">12 brandable names per round.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bn-keyword" className="text-white/80">Keyword / Industry</Label>
            <Input
              id="bn-keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. coffee, fintech, gym"
              className="h-10 border-white/10 bg-background/60 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Style</Label>
            <Select value={style} onValueChange={(v) => setStyle(v as StyleKey)}>
              <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                {(Object.keys(wordBanks) as StyleKey[]).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-white/80">Length</Label>
            <Badge variant="secondary" className="bg-primary/15 text-primary">{lengthLabel}</Badge>
          </div>
          <Slider
            value={[lengthIdx]}
            min={0}
            max={2}
            step={1}
            onValueChange={(v) => setLengthIdx(v[0])}
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            {lengthLabels.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>

        <Button
          onClick={run}
          className="mt-6 h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-hover"
        >
          <RefreshCw className="h-4 w-4" /> Regenerate
        </Button>

        {names.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-background/40 px-6 py-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-primary/60" />
            <p className="mt-3 text-sm text-muted-foreground">Pick a style and hit regenerate to see name ideas.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {names.map((n) => {
              const isSaved = saved.has(n);
              return (
                <div
                  key={n}
                  className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-background/50 px-3 py-2.5 transition-colors hover:border-primary/30"
                >
                  <span className="truncate font-display text-sm font-medium text-white">{n}</span>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => toggleSave(n)}
                      aria-label="Save"
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
                    >
                      <Heart className={isSaved ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
                    </button>
                    <button
                      onClick={() => copy(n)}
                      aria-label="Copy"
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {saved.size > 0 && (
          <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-medium text-primary">
              {saved.size} saved {saved.size === 1 ? "name" : "names"} ·{" "}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(Array.from(saved).join("\n")).then(() => toast.success("Copied all saved names!"));
                }}
                className="underline hover:no-underline"
              >
                Copy all
              </button>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
