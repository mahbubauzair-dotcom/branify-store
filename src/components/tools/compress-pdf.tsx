"use client";

import { useCallback, useRef, useState } from "react";
import { FileArchive, FileText, RefreshCw, UploadCloud, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

type Level = "low" | "medium" | "high";

const LEVELS: { value: Level; label: string; hint: string; pct: string }[] = [
  { value: "low", label: "Low compression", hint: "Best quality, smallest reduction", pct: "~20%" },
  { value: "medium", label: "Medium compression", hint: "Balanced quality & size", pct: "~45%" },
  { value: "high", label: "High compression", hint: "Smallest size, lower quality", pct: "~70%" },
];

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("medium");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file.");
      return;
    }
    setFile(f);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const reset = () => setFile(null);

  const compress = () => {
    if (!file) {
      toast.error("Upload a PDF first.");
      return;
    }
    toast.info("PDF compression will be available soon");
  };

  const selected = LEVELS.find((l) => l.value === level)!;
  const estimated = file ? Math.round(file.size * (1 - parseInt(selected.pct) / 100)) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <FileArchive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Compress PDF</h3>
            <p className="text-xs text-muted-foreground">Reduce PDF file size while keeping it readable.</p>
          </div>
        </div>

        {!file ? (
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
              <p className="text-sm font-medium text-white">Drop a PDF or click to browse</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF up to ~100 MB</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
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
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-background/40 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-300">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-muted-foreground">Original · {formatBytes(file.size)}</p>
              </div>
              <Button
                onClick={reset}
                variant="ghost"
                size="sm"
                className="h-8 text-white/70 hover:bg-white/5 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Compression level</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as Level)}>
                <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                  {LEVELS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label} · {l.pct}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">{selected.hint}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                <p className="text-[11px] uppercase tracking-wider text-white/50">Original</p>
                <p className="mt-1 font-display text-lg font-semibold text-white">{formatBytes(file.size)}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
                <p className="text-[11px] uppercase tracking-wider text-emerald-300/70">Estimated</p>
                <p className="mt-1 font-display text-lg font-semibold text-emerald-300">~{formatBytes(estimated)}</p>
              </div>
            </div>

            <Button
              onClick={compress}
              className="h-11 w-full rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
            >
              <Zap className="h-4 w-4" /> Compress PDF
            </Button>

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-muted-foreground">
              <Badge variant="secondary" className="bg-white/5 text-white/50">{selected.pct} smaller</Badge>
              <span>·</span>
              <span>Estimate only — actual result varies</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
