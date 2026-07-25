"use client";

import { useCallback, useRef, useState } from "react";
import { Download, ImageDown, RefreshCw, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Compressed = {
  url: string;
  blob: Blob;
  size: number;
  name: string;
};

const ACCEPTED = "image/jpeg,image/png,image/webp";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function ImageCompressor() {
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [quality, setQuality] = useState(70);
  const [result, setResult] = useState<Compressed | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(ACCEPTED)) {
      toast.error("Please upload a JPG, PNG or WebP image.");
      return;
    }
    if (original?.url) URL.revokeObjectURL(original.url);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setOriginal({ url: URL.createObjectURL(file), size: file.size, name: file.name });
  }, [original, result]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const compress = useCallback(async () => {
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
      ctx.drawImage(img, 0, 0);
      const mime = original.name.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, mime, quality / 100),
      );
      if (!blob) throw new Error("Compression failed");
      if (result?.url) URL.revokeObjectURL(result.url);
      const url = URL.createObjectURL(blob);
      const baseName = original.name.replace(/\.[^.]+$/, "");
      const ext = mime === "image/png" ? "png" : "jpg";
      setResult({ url, blob, size: blob.size, name: `${baseName}-compressed.${ext}` });
      toast.success("Image compressed!");
    } catch {
      toast.error("Could not compress this image.");
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

  const savings = original && result ? Math.max(0, (1 - result.size / original.size) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ImageDown className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Image Compressor</h3>
            <p className="text-xs text-muted-foreground">Shrink JPG, PNG & WebP files in your browser — no upload.</p>
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
              <p className="text-sm font-medium text-white">Drop an image or click to browse</p>
              <p className="mt-1 text-xs text-muted-foreground">JPG · PNG · WebP — up to ~25 MB</p>
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
                  <span className="text-xs font-medium text-white/80">Compressed</span>
                  {result ? (
                    <Badge className="bg-emerald-500/15 text-emerald-300">{formatBytes(result.size)}</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-white/5 text-white/40">—</Badge>
                  )}
                </div>
                <div className="flex h-40 items-center justify-center p-2">
                  {result ? (
                    <img src={result.url} alt="Compressed" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Press compress to preview</span>
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

            {result && savings > 0 && (
              <div className="flex items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-2 text-sm text-emerald-300">
                Saved {savings.toFixed(1)}% — {formatBytes(original.size)} → {formatBytes(result.size)}
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={compress}
                disabled={busy}
                className="h-11 flex-1 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
              >
                <ImageDown className="h-4 w-4" /> {busy ? "Compressing…" : "Compress"}
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
