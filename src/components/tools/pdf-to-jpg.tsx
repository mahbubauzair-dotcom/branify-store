"use client";

import { useCallback, useRef, useState } from "react";
import { FileDown, FileText, RefreshCw, UploadCloud } from "lucide-react";
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

type Quality = "low" | "medium" | "high";

const QUALITY: { value: Quality; label: string; dpi: number }[] = [
  { value: "low", label: "Low (72 DPI)", dpi: 72 },
  { value: "medium", label: "Medium (150 DPI)", dpi: 150 },
  { value: "high", label: "High (300 DPI)", dpi: 300 },
];

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<Quality>("high");
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

  const onConvert = () => {
    toast.info("PDF processing will be available soon");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <FileDown className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">PDF to JPG</h3>
            <p className="text-xs text-muted-foreground">Upload your PDF to convert each page to a high-quality JPG image.</p>
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
              <p className="mt-1 text-xs text-muted-foreground">PDF files up to ~50 MB</p>
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
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)} · PDF</p>
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
              <Label className="text-white/80">Output quality</Label>
              <Select value={quality} onValueChange={(v) => setQuality(v as Quality)}>
                <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                  {QUALITY.map((q) => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-xs text-amber-200/90">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Conversion happens server-side to preserve perfect fidelity. Your file is processed securely and never stored.
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={onConvert}
                className="h-11 flex-1 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
              >
                <FileDown className="h-4 w-4" /> Convert to JPG
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                className="h-11 rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" /> Reset
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-muted-foreground">
              <Badge variant="secondary" className="bg-white/5 text-white/50">{quality === "low" ? "Fast" : quality === "medium" ? "Balanced" : "Highest"}</Badge>
              <span>·</span>
              <span>1 page = 1 JPG</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
