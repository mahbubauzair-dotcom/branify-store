"use client";

import { useCallback, useState } from "react";
import { ArrowDown, ArrowUp, FileUp, Printer, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Img = { id: string; url: string; name: string; size: number };

const uid = () => Math.random().toString(36).slice(2, 9);

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function JpgToPdf() {
  const [images, setImages] = useState<Img[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f.type === "image/jpeg" || f.name.match(/\.(jpg|jpeg)$/i));
      if (arr.length === 0) {
        toast.error("Please upload JPG images only.");
        return;
      }
      const next: Img[] = arr.map((f) => ({
        id: uid(),
        url: URL.createObjectURL(f),
        name: f.name,
        size: f.size,
      }));
      setImages((prev) => [...prev, ...next]);
    },
    [],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const move = (id: string, dir: -1 | 1) => {
    setImages((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const remove = (id: string) => {
    setImages((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((x) => x.id !== id);
    });
  };

  const createPdf = () => {
    if (images.length === 0) {
      toast.error("Add at least one JPG image.");
      return;
    }
    const printArea = document.createElement("div");
    printArea.id = "jpg-to-pdf-print";
    printArea.style.cssText =
      "position:fixed;left:0;top:0;width:100%;background:#fff;z-index:9999;padding:0;margin:0;";
    printArea.innerHTML = `
      <style>
        @media print {
          @page { margin: 0; size: A4; }
          html, body { background: #fff !important; }
          body * { visibility: hidden; }
          #jpg-to-pdf-print, #jpg-to-pdf-print * { visibility: visible; }
          #jpg-to-pdf-print { position: absolute; left: 0; top: 0; }
          .pdf-page { page-break-after: always; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; }
          .pdf-page img { max-width: 100%; max-height: 100%; object-fit: contain; }
        }
        .pdf-page { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; }
        .pdf-page img { max-width: 100%; max-height: 100%; object-fit: contain; }
      </style>
    `;
    images.forEach((img) => {
      const page = document.createElement("div");
      page.className = "pdf-page";
      const i = document.createElement("img");
      i.src = img.url;
      page.appendChild(i);
      printArea.appendChild(page);
    });
    document.body.appendChild(printArea);
    toast.success("Opening print dialog — choose 'Save as PDF'");
    setTimeout(() => {
      window.print();
      document.body.removeChild(printArea);
    }, 250);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <FileUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">JPG to PDF</h3>
            <p className="text-xs text-muted-foreground">Combine multiple JPGs into a single PDF — drag to reorder.</p>
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
            <p className="text-sm font-medium text-white">Drop JPG images or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">Add multiple — order them below</p>
          </div>
          <input
            type="file"
            accept="image/jpeg,.jpg,.jpeg"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>

        {images.length > 0 && (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                {images.length} {images.length === 1 ? "image" : "images"}
              </span>
              <Button
                onClick={() => {
                  images.forEach((i) => URL.revokeObjectURL(i.url));
                  setImages([]);
                }}
                variant="ghost"
                size="sm"
                className="h-7 text-white/60 hover:bg-white/5 hover:text-white"
              >
                Clear all
              </Button>
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-background/40 p-2.5"
                >
                  <span className="w-5 text-center text-xs font-mono text-white/40">{idx + 1}</span>
                  <img src={img.url} alt={img.name} className="h-12 w-12 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white/90">{img.name}</p>
                    <Badge variant="secondary" className="mt-0.5 bg-white/5 text-white/50">{formatBytes(img.size)}</Badge>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => move(img.id, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => move(img.id, 1)}
                      disabled={idx === images.length - 1}
                      aria-label="Move down"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => remove(img.id)}
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
              onClick={createPdf}
              className="h-11 w-full rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
            >
              <Printer className="h-4 w-4" /> Create PDF (Print → Save as PDF)
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              A print-friendly page opens — choose “Save as PDF” in your browser&apos;s print dialog.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
