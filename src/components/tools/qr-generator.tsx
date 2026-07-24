"use client";

import { useState } from "react";
import { Copy, Download, QrCode, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const presetColors = [
  { label: "Teal", value: "#14B8A6" },
  { label: "Indigo", value: "#4F46E5" },
  { label: "Rose", value: "#E11D48" },
  { label: "Amber", value: "#D97706" },
  { label: "Emerald", value: "#059669" },
  { label: "Black", value: "#000000" },
];

type EccLevel = "L" | "M" | "Q" | "H";
const eccOptions: { value: EccLevel; label: string }[] = [
  { value: "L", label: "Low (~7%)" },
  { value: "M", label: "Medium (~15%)" },
  { value: "Q", label: "Quartile (~25%)" },
  { value: "H", label: "High (~30%)" },
];

export function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [color, setColor] = useState("#14B8A6");
  const [ecc, setEcc] = useState<EccLevel>("M");

  const colorNoHash = color.replace("#", "").toLowerCase();
  const hasText = text.trim().length > 0;
  const src = hasText
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${colorNoHash}&bgcolor=ffffff&ecc=${ecc}`
    : "";

  const copyText = () => {
    if (!hasText) return;
    navigator.clipboard.writeText(text).then(() => toast.success("Copied!"));
  };

  const download = () => {
    if (!hasText) return;
    window.open(src, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">QR Generator</h3>
            <p className="text-xs text-muted-foreground">Free, instant QR codes for links, text & more.</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Label htmlFor="qr-text" className="text-white/80">Text or URL</Label>
          <Textarea
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://branify.store"
            className="min-h-20 border-white/10 bg-background/60 text-white"
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-white/80">Size</Label>
            <Select value={String(size)} onValueChange={(v) => setSize(Number(v))}>
              <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                <SelectItem value="128">128 × 128</SelectItem>
                <SelectItem value="256">256 × 256</SelectItem>
                <SelectItem value="512">512 × 512</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Error correction</Label>
            <Select value={ecc} onValueChange={(v) => setEcc(v as EccLevel)}>
              <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                {eccOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qr-color" className="text-white/80">Foreground</Label>
            <div className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-background/60 px-2">
              <input
                id="qr-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
                aria-label="Pick custom color"
              />
              <span className="font-mono text-xs text-white/80">{color.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {presetColors.map((c) => {
            const active = c.value.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={
                  "flex h-8 items-center gap-2 rounded-full border px-3 text-xs transition-all " +
                  (active
                    ? "border-primary bg-primary/15 text-white"
                    : "border-white/10 bg-background/50 text-muted-foreground hover:border-primary/30 hover:text-white")
                }
              >
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.value }} />
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {hasText ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/95 p-5">
              <img src={src} alt="Generated QR code" className="h-48 w-48 rounded-lg" />
              <Badge variant="secondary" className="bg-primary/15 text-primary">{size}×{size} · ECC {ecc}</Badge>
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <Button
                  onClick={download}
                  className="h-10 flex-1 rounded-lg bg-primary text-primary-foreground hover:bg-hover"
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button
                  onClick={copyText}
                  variant="outline"
                  className="h-10 flex-1 rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  <Copy className="h-4 w-4" /> Copy text
                </Button>
              </div>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                Open in new tab <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-background/40 px-6 py-12 text-center">
              <QrCode className="mx-auto h-8 w-8 text-primary/60" />
              <p className="mt-3 text-sm text-muted-foreground">Enter text or a URL to generate a QR code.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
