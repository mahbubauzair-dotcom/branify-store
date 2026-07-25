"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Crop, Download, RefreshCw, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PRESETS = [1920, 1280, 800, 400];
const ACCEPTED = "image/*";

type Source = { url: string; width: number; height: number; name: string; type: string };

export function ImageResizer() {
  const [source, setSource] = useState<Source | null>(null);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [aspect, setAspect] = useState(true);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSource({ url, width: img.naturalWidth, height: img.naturalHeight, name: file.name, type: file.type });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setResult(null);
    };
    img.onerror = () => toast.error("Could not read image.");
    img.src = url;
  }, []);

  useEffect(() => {
    if (!source || !aspect) return;
    const ratio = source.width / source.height;
    setHeight(Math.round(width / ratio));
  }, [width, source, aspect]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const resize = useCallback(async () => {
    if (!source) return;
    if (width < 1 || height < 1) {
      toast.error("Width and height must be at least 1px.");
      return;
    }
    setBusy(true);
    try {
      const img = new Image();
      img.src = source.url;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      const mime = source.type === "image/png" ? "image/png" : "image/jpeg";
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, mime, 0.92),
      );
      if (!blob) throw new Error("Resize failed");
      if (result?.url) URL.revokeObjectURL(result.url);
      const baseName = source.name.replace(/\.[^.]+$/, "");
      const ext = mime === "image/png" ? "png" : "jpg";
      const url = URL.createObjectURL(blob);
      setResult({ url, name: `${baseName}-${width}x${height}.${ext}` });
      toast.success(`Resized to ${width}×${height}`);
    } catch {
      toast.error("Could not resize this image.");
    } finally {
      setBusy(false);
    }
  }, [source, width, height, result]);

  const reset = () => {
    if (source?.url) URL.revokeObjectURL(source.url);
    if (result?.url) URL.revokeObjectURL(result.url);
    setSource(null);
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Crop className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Image Resizer</h3>
            <p className="text-xs text-muted-foreground">Resize to exact dimensions with optional aspect lock.</p>
          </div>
        </div>

        {!source ? (
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
              <p className="mt-1 text-xs text-muted-foreground">PNG · JPG · WebP · GIF</p>
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
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-background/40 px-4 py-2.5 text-xs text-white/70">
              <span className="truncate font-medium text-white/90">{source.name}</span>
              <Badge variant="secondary" className="bg-white/5 text-white/70">
                {source.width}×{source.height}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Width (px)</Label>
                <Input
                  type="number"
                  min={1}
                  value={width}
                  onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))}
                  className="h-10 border-white/10 bg-background/60 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Height (px)</Label>
                <Input
                  type="number"
                  min={1}
                  value={height}
                  onChange={(e) => setHeight(Math.max(1, Number(e.target.value) || 1))}
                  disabled={aspect}
                  className="h-10 border-white/10 bg-background/60 text-white disabled:opacity-60"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
              <Checkbox checked={aspect} onCheckedChange={(v) => setAspect(v === true)} />
              Maintain aspect ratio
            </label>

            <div className="space-y-2">
              <Label className="text-white/80">Presets</Label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setWidth(p)}
                    className={
                      "rounded-full border px-3 py-1 text-xs transition-all " +
                      (width === p
                        ? "border-primary bg-primary/15 text-white"
                        : "border-white/10 bg-background/50 text-muted-foreground hover:border-primary/30 hover:text-white")
                    }
                  >
                    {p}px
                  </button>
                ))}
              </div>
            </div>

            {result && (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-background/40 p-3">
                <img src={result.url} alt="Resized" className="mx-auto max-h-56 object-contain" />
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={resize}
                disabled={busy}
                className="h-11 flex-1 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
              >
                <Crop className="h-4 w-4" /> {busy ? "Resizing…" : "Resize image"}
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
