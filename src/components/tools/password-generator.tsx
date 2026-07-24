"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?";
const AMBIGUOUS = /[Il1O0o]/g;

function randInt(max: number) {
  const arr = new Uint32Array(1);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function pickFrom(set: string) {
  return set.charAt(randInt(set.length));
}

function shuffle(arr: string[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type Options = {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeAmbiguous: boolean;
};

function generatePassword(opts: Options): string {
  let pool = "";
  const required: string[] = [];
  if (opts.useUpper) {
    let set = UPPER;
    if (opts.excludeAmbiguous) set = set.replace(AMBIGUOUS, "");
    pool += set;
    required.push(pickFrom(set));
  }
  if (opts.useLower) {
    let set = LOWER;
    if (opts.excludeAmbiguous) set = set.replace(AMBIGUOUS, "");
    pool += set;
    required.push(pickFrom(set));
  }
  if (opts.useNumbers) {
    let set = NUMBERS;
    if (opts.excludeAmbiguous) set = set.replace(AMBIGUOUS, "");
    pool += set;
    required.push(pickFrom(set));
  }
  if (opts.useSymbols) {
    pool += SYMBOLS;
    required.push(pickFrom(SYMBOLS));
  }
  if (!pool) return "";
  const chars: string[] = [...required];
  while (chars.length < opts.length) chars.push(pickFrom(pool));
  return shuffle(chars).slice(0, opts.length).join("");
}

type Strength = { label: string; color: string; pct: number };

function evaluate(password: string): Strength {
  if (!password) return { label: "—", color: "bg-muted", pct: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (password.length >= 24) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 3) return { label: "Weak", color: "bg-rose-500", pct: 25 };
  if (score <= 5) return { label: "Fair", color: "bg-amber-500", pct: 50 };
  if (score <= 7) return { label: "Strong", color: "bg-emerald-500", pct: 80 };
  return { label: "Very strong", color: "bg-primary", pct: 100 };
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState<string>(() =>
    generatePassword({
      length: 16,
      useUpper: true,
      useLower: true,
      useNumbers: true,
      useSymbols: true,
      excludeAmbiguous: false,
    }),
  );

  const generate = useCallback(() => {
    setPassword(
      generatePassword({
        length,
        useUpper,
        useLower,
        useNumbers,
        useSymbols,
        excludeAmbiguous,
      }),
    );
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  const strength = useMemo(() => evaluate(password), [password]);

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => toast.success("Copied!"));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Password Generator</h3>
            <p className="text-xs text-muted-foreground">Cryptographically-random, strong & memorable-free.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-background/60 p-4">
          <code className="block break-all font-mono text-lg text-white sm:text-xl">
            {password || "—"}
          </code>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full transition-all ${strength.color}`}
                style={{ width: `${strength.pct}%` }}
              />
            </div>
            <Badge variant="secondary" className="bg-white/5 text-white/80">{strength.label}</Badge>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            onClick={copy}
            className="h-11 flex-1 rounded-lg bg-primary text-primary-foreground hover:bg-hover"
          >
            <Copy className="h-4 w-4" /> Copy password
          </Button>
          <Button
            onClick={generate}
            variant="outline"
            className="h-11 rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" /> Regenerate
          </Button>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-white/80">Length</Label>
            <Badge variant="secondary" className="bg-primary/15 text-primary">{length}</Badge>
          </div>
          <Slider value={[length]} min={8} max={64} step={1} onValueChange={(v) => setLength(v[0])} />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <ToggleRow label="Uppercase (A–Z)" checked={useUpper} onChange={setUseUpper} />
          <ToggleRow label="Lowercase (a–z)" checked={useLower} onChange={setUseLower} />
          <ToggleRow label="Numbers (0–9)" checked={useNumbers} onChange={setUseNumbers} />
          <ToggleRow label="Symbols (!@#$)" checked={useSymbols} onChange={setUseSymbols} />
          <ToggleRow label="Exclude ambiguous (Il1O0)" checked={excludeAmbiguous} onChange={setExcludeAmbiguous} />
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-white/70">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          Generated entirely in your browser. Nothing is sent over the network. Use a password manager to store it safely.
        </div>
      </Card>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-background/50 px-4 py-3">
      <Label className="text-sm text-white/90">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
