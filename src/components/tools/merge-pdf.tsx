"use client";

import { useCallback, useState } from "react";
import { ArrowDown, ArrowUp, Combine, FileText, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Doc = { id: string; name: string; size: number };

const uid = () => Math.random().toString(36).slice(2, 9);

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function MergePdf() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (arr.length === 0) {
      toast.error("Please upload PDF files only.");
      return;
    }
    setDocs((prev) => [...prev, ...arr.map((f) => ({ id: uid(), name: f.name, size: f.size }))]);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const move = (id: string, dir: -1 | 1) => {
    setDocs((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const remove = (id: string) => setDocs((prev) => prev.filter((x) => x.id !== id));

  const merge = () => {
    if (docs.length < 2) {
      toast.error("Add at least two PDFs to merge.");
      return;
    }
    toast.info("PDF merging will be available soon");
  };

  const totalSize = docs.reduce((sum, d) => sum + d.size, 0);

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Combine className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Merge PDF</h3>
            <p className="text-xs text-muted-foreground">Combine multiple PDFs into one document in your chosen order.</p>
          </div>
        </div>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={
            "mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center transition-all " +
            (dragOver
              ? "border-primary/60 bg-primary/10"
              : "border-white/[0.08] bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.05]")
          }
        >
          <UploadCloud className="h-7 w-7 text-primary/80" />
          <div>
            <p className="text-sm font-medium text-white">Drop PDF files or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">Add 2 or more PDFs to merge</p>
          </div>
          <input
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>

        {docs.length > 0 && (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                {docs.length} files · {formatBytes(totalSize)}
              </span>
              <Button
                onClick={() => setDocs([])}
                variant="ghost"
                size="sm"
                className="h-7 text-white/60 hover:bg-white/5 hover:text-white"
              >
                Clear all
              </Button>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {docs.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-background/40 p-3"
                >
                  <span className="w-5 text-center text-xs font-mono text-white/40">{idx + 1}</span>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-rose-500/15 text-rose-300">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white/90">{doc.name}</p>
                    <Badge variant="secondary" className="mt-0.5 bg-white/5 text-white/50">{formatBytes(doc.size)}</Badge>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => move(doc.id, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => move(doc.id, 1)}
                      disabled={idx === docs.length - 1}
                      aria-label="Move down"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => remove(doc.id)}
                      aria-label="Remove"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={merge}
              className="h-11 w-full rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
            >
              <Combine className="h-4 w-4" /> Merge {docs.length} PDFs
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
