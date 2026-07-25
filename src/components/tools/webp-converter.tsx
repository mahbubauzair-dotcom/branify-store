"use client";

import { useCallback, useRef, useState } from "react";
import { Download, FileImage, RefreshCw, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ACCEPTED = "image/jpeg,image/png";

type Source = { url: string; size: number; name: string };
type Converted = { url: string; blob: Blob; size: number; name: string };

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function WebpConverter() {
  const [original, setOriginal] = useState<Source | null>(null);
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState<Converted | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match(ACCEPTED)) {
        toast.error("Please upload a JPG or PNG image.");
        return;
      }
      if (original?.url) URL.revokeObjectURL(original.url);
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult(null);
      setOriginal({ url: URL.createObjectURL(file), size: file.size, name: file.name });
    },
    [original, result],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const convert = useCallback(async () => {
    if (!original) return;
    setBusy(true);
    try {
      const img = new Image();
      img.src = original.url;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      // White background to handle transparent PNGs gracefully
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/webp", quality / 100),
      );
      if (!blob) throw new Error("WebP conversion failed");
      if (result?.url) URL.revokeObjectURL(result.url);
      const url = URL.createObjectURL(blob);
      const baseName = original.name.replace(/\.[^.]+$/, "");
      setResult({ url, blob, size: blob.size, name: `${baseName}.webp` });
      toast.success("Converted to WebP!");
    } catch {
      toast.error("Could not convert this image to WebP.");
    } finally {
      setBusy(false);
    }
  }, [original, quality, result]);

  const reset = () => {
    if (original?.url) URL.revokeObjectURL(original.url);
    if (result?.url) URL.revokeObjectURL(result.url);
    setOriginal(null);
    setResult(null);
  };

  const savings = original && result ? (1 - result.size / original.size) * 100 : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <FileImage className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">WebP Converter</h3>
            <p className="text-xs text-muted-foreground">Convert JPG & PNG to modern WebP for faster websites.</p>
          </div>
        </div>

        {!original ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={
              "mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center transition-all " +
              (dragOver
                ? "border-primary/60 bg-primary/10"
                : "border-white/[0.08] bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.05]")
            }
          >
            <UploadCloud className="h-8 w-8 text-primary/80" />
            <div>
              <p className="text-sm font-medium text-white">Drop a JPG/PNG or click to browse</p>
              <p className="mt-1 text-xs text-muted-foreground">Batch-friendly — start with one image</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </label>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-background/40">
                <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
                  <span className="text-xs font-medium text-white/80">Original</span>
                  <Badge variant="secondary" className="bg-white/5 text-white/70">{formatBytes(original.size)}</Badge>
                </div>
                <div className="flex h-40 items-center justify-center p-2">
                  <img src={original.url} alt="Original" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-background/40">
                <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
                  <span className="text-xs font-medium text-white/80">WebP</span>
                  {result ? (
                    <Badge className="bg-emerald-500/15 text-emerald-300">{formatBytes(result.size)}</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-white/5 text-white/40">—</Badge>
                  )}
                </div>
                <div className="flex h-40 items-center justify-center p-2">
                  {result ? (
                    <img src={result.url} alt="WebP" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Press convert to preview</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Quality</Label>
                <Badge variant="secondary" className="bg-primary/15 text-primary">{quality}%</Badge>
              </div>
              <Slider value={[quality]} min={10} max={100} step={1} onValueChange={(v) => setQuality(v[0])} />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Smallest (10%)</span>
                <span>Best (100%)</span>
              </div>
            </div>

            {result && (
              <div className="flex items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-2 text-sm text-emerald-300">
                {savings >= 0
                  ? `Saved ${savings.toFixed(1)}% — ${formatBytes(original.size)} → ${formatBytes(result.size)}`
                  : `WebP size: ${formatBytes(result.size)}`}
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={convert}
                disabled={busy}
                className="h-11 flex-1 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
              >
                <FileImage className="h-4 w-4" /> {busy ? "Converting…" : "Convert to WebP"}
              </Button>
              {result && (
                <Button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = result.url;
                    a.download = result.name;
                    a.click();
                  }}
                  variant="outline"
                  className="h-11 rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
              )}
              <Button
                onClick={reset}
                variant="ghost"
                className="h-11 rounded-lg text-white/70 hover:bg-white/5 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
