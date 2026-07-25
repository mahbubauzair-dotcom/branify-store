"use client";

import { useMemo, useState } from "react";
import { Copy, Download, PenTool, UploadCloud, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function optimizeSvg(input: string): string {
  let svg = input;

  // Remove XML declaration & DOCTYPE
  svg = svg.replace(/<\?xml[^>]*\?>/gi, "");
  svg = svg.replace(/<!DOCTYPE[^>]*>/gi, "");

  // Remove comments
  svg = svg.replace(/<!--[\s\S]*?-->/g, "");

  // Remove metadata, sodipodi, inkscape namespaces & tags
  svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
  svg = svg.replace(/<sodipodi[\s\S]*?<\/sodipodi:[^>]+>/gi, "");
  svg = svg.replace(/\s+(sodipodi|inkscape):[a-zA-Z-]+="[^"]*"/gi, "");

  // Remove empty attributes (attr="" or attr=' ')
  svg = svg.replace(/\s+[a-zA-Z:-]+="\s*"/g, "");
  svg = svg.replace(/\s+[a-zA-Z:-]+='\s*'/g, "");

  // Collapse whitespace between tags
  svg = svg.replace(/>\s+</g, "><");

  // Trim leading/trailing whitespace and collapse runs of whitespace
  svg = svg.replace(/\s{2,}/g, " ").trim();

  // Remove leading whitespace inside tag attributes
  svg = svg.replace(/\s+>/g, ">");

  return svg;
}

function formatBytes(str: string) {
  return new Blob([str]).size;
}

export function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string>("");

  const originalSize = useMemo(() => formatBytes(input), [input]);
  const optimizedSize = useMemo(() => (output ? formatBytes(output) : 0), [output]);
  const savings = input && output ? Math.max(0, (1 - optimizedSize / originalSize) * 100) : 0;

  const onFile = (file: File) => {
    if (file.type !== "image/svg+xml" && !file.name.toLowerCase().endsWith(".svg")) {
      toast.error("Please upload an SVG file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result || ""));
      setOutput("");
    };
    reader.onerror = () => toast.error("Could not read SVG file.");
    reader.readAsText(file);
  };

  const optimize = () => {
    if (!input.trim()) {
      toast.error("Paste or upload some SVG first.");
      return;
    }
    try {
      const result = optimizeSvg(input);
      if (!result || !/<svg[\s\S]*<\/svg>/.test(result)) {
        toast.error("No valid <svg>…</svg> block found.");
        return;
      }
      setOutput(result);
      toast.success("SVG optimized!");
    } catch {
      toast.error("Could not optimize this SVG.");
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => toast.success("Copied!"));
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <PenTool className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">SVG Optimizer</h3>
            <p className="text-xs text-muted-foreground">Strip comments, metadata & whitespace from your SVGs.</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="svg-input" className="text-white/80">SVG code or file</Label>
            <label className="cursor-pointer text-xs text-primary hover:underline">
              <span className="inline-flex items-center gap-1">
                <UploadCloud className="h-3.5 w-3.5" /> Upload .svg
              </span>
              <input
                type="file"
                accept=".svg,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <Textarea
            id="svg-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onDrop={onDrop}
            placeholder={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n  <path d="..." />\n</svg>`}
            className="min-h-32 font-mono text-xs border-white/10 bg-background/60 text-white"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            onClick={optimize}
            className="h-10 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#18F2B2] text-[#04121a] hover:opacity-90"
          >
            <Wand2 className="h-4 w-4" /> Optimize SVG
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="bg-white/5 text-white/70">{originalSize} B</Badge>
            <span>→</span>
            {output ? (
              <Badge className="bg-emerald-500/15 text-emerald-300">{optimizedSize} B · −{savings.toFixed(1)}%</Badge>
            ) : (
              <Badge variant="secondary" className="bg-white/5 text-white/40">—</Badge>
            )}
          </div>
        </div>

        {output && (
          <div className="mt-5 space-y-2">
            <Label className="text-white/80">Optimized output</Label>
            <Textarea
              value={output}
              readOnly
              className="min-h-32 font-mono text-xs border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-100"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={copy}
                variant="outline"
                className="h-10 rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button
                onClick={download}
                variant="outline"
                className="h-10 rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>

            <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-white p-3">
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(output)}`}
                alt="Optimized SVG preview"
                className="mx-auto max-h-40"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
