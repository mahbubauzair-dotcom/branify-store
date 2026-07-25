"use client";

import { useCallback, useRef, useState } from "react";
import { Download, Globe, RefreshCw, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const SIZES = [
  { size: 16, label: "16×16", hint: "Browser tab" },
  { size: 32, label: "32×32", hint: "Taskbar" },
  { size: 48, label: "48×48", hint: "Windows" },
  { size: 180, label: "180×180", hint: "Apple touch" },
  { size: 512, label: "512×512", hint: "PWA / Android" },
] as const;

type Generated = { url: string; blob: Blob; size: number };

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function FaviconGenerator() {
  const [source, setSource] = useState<{ url: string; name: string } | null>(null);
  const [results, setResults] = useState<Record<number, Generated>>({});
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a PNG or JPG image.");
      return;
    }
    setSource({ url: URL.createObjectURL(file), name: file.name });
    setResults({});
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const generateAll = useCallback(async () => {
    if (!source) return;
    setBusy(true);
    try {
      const img = new Image();
      img.src = source.url;
      await img.decode();
      const next: Record<number, Generated> = {};
      for (const s of SIZES) {
        const canvas = document.createElement("canvas");
        canvas.width = s.size;
        canvas.height = s.size;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.clearRect(0, 0, s.size, s.size);
        ctx.drawImage(img, 0, 0, s.size, s.size);
        const blob: Blob | null = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png"),
        );
        if (blob) {
          next[s.size] = {
            url: URL.createObjectURL(blob),
            blob,
            size: blob.size,
          };
        }
      }
      setResults(next);
      toast.success(`Generated ${Object.keys(next).length} favicons!`);
    } catch {
      toast.error("Could not generate favicons from this image.");
    } finally {
      setBusy(false);
    }
  }, [source]);

  const reset = () => {
    if (source?.url) URL.revokeObjectURL(source.url);
    Object.values(results).forEach((r) => URL.revokeObjectURL(r.url));
    setSource(null);
    setResults({});
  };

  const download = (size: number) => {
    const r = results[size];
    if (!r) return;
    const a = document.createElement("a");
    a.href = r.url;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Favicon Generator</h3>
            <p className="text-xs text-muted-foreground">Generate favicons at 16, 32, 48, 180 & 512px from one image.</p>
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
              <p className="mt-1 text-xs text-muted-foreground">PNG or JPG · square images work best</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
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
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-background/40 px-4 py-2.5 text-xs">
              <span className="truncate font-medium text-white/90">{source.name}</span>
              <Button
                onClick={reset}
                variant="ghost"
                size="sm"
                className="h-7 text-white/70 hover:bg-white/5 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Change
              </Button>
            </div>

            <Button
              onClick={generateAll}
              disabled={busy}
              className="h-11 w-full rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
            >
              <Globe className="h-4 w-4" /> {busy ? "Generating…" : "Generate all favicons"}
            </Button>

            <div className="grid gap-3 sm:grid-cols-2">
              {SIZES.map((s) => {
                const r = results[s.size];
                return (
                  <div
                    key={s.size}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-background/40 p-3"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/[0.03]">
                      {r ? (
                        <img src={r.url} alt={`Favicon ${s.label}`} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-white/30">{s.size}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">{s.label}</p>
                        {r && (
                          <Badge variant="secondary" className="bg-white/5 text-white/60">{formatBytes(r.size)}</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{s.hint}</p>
                    </div>
                    <Button
                      onClick={() => download(s.size)}
                      disabled={!r}
                      variant="outline"
                      size="sm"
                      className="h-8 shrink-0 rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
