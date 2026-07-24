"use client";

import { cn } from "@/lib/utils";

const gradientMap: Record<string, string> = {
  "gradient-teal": "from-[#0fe1d2]/30 via-[#02b6bc]/20 to-slate-900",
  "gradient-violet": "from-violet-500/30 via-violet-700/20 to-slate-900",
  "gradient-cyan": "from-cyan-500/30 via-blue-700/20 to-slate-900",
  "gradient-amber": "from-amber-500/30 via-orange-700/20 to-slate-900",
  "gradient-rose": "from-rose-500/30 via-pink-700/20 to-slate-900",
  "gradient-emerald": "from-emerald-500/30 via-teal-700/20 to-slate-900",
  prompts: "from-teal-500/30 via-cyan-600/20 to-slate-900",
  "prompts-2": "from-emerald-500/30 via-teal-600/20 to-slate-900",
  "prompts-3": "from-cyan-500/30 via-teal-600/20 to-slate-900",
  canva: "from-fuchsia-500/30 via-purple-600/20 to-slate-900",
  "canva-2": "from-pink-500/30 via-fuchsia-600/20 to-slate-900",
  "canva-3": "from-violet-500/30 via-fuchsia-600/20 to-slate-900",
  resume: "from-sky-500/30 via-blue-600/20 to-slate-900",
  "resume-2": "from-cyan-500/30 via-sky-600/20 to-slate-900",
  "resume-3": "from-blue-500/30 via-indigo-600/20 to-slate-900",
  proposal: "from-amber-500/30 via-orange-600/20 to-slate-900",
  "proposal-2": "from-yellow-500/30 via-amber-600/20 to-slate-900",
  "proposal-3": "from-orange-500/30 via-red-600/20 to-slate-900",
  invoice: "from-emerald-500/30 via-green-600/20 to-slate-900",
  "invoice-2": "from-teal-500/30 via-emerald-600/20 to-slate-900",
  "invoice-3": "from-green-500/30 via-teal-600/20 to-slate-900",
  presentation: "from-violet-500/30 via-purple-600/20 to-slate-900",
  "presentation-2": "from-indigo-500/30 via-violet-600/20 to-slate-900",
  "presentation-3": "from-purple-500/30 via-fuchsia-600/20 to-slate-900",
  brandkit: "from-rose-500/30 via-pink-600/20 to-slate-900",
  "brandkit-2": "from-fuchsia-500/30 via-rose-600/20 to-slate-900",
  "brandkit-3": "from-pink-500/30 via-purple-600/20 to-slate-900",
  uikit: "from-teal-500/30 via-emerald-600/20 to-slate-900",
  "uikit-2": "from-cyan-500/30 via-teal-600/20 to-slate-900",
  "uikit-3": "from-emerald-500/30 via-cyan-600/20 to-slate-900",
  website: "from-sky-500/30 via-cyan-600/20 to-slate-900",
  "website-2": "from-blue-500/30 via-sky-600/20 to-slate-900",
  "website-3": "from-cyan-500/30 via-blue-600/20 to-slate-900",
  elementor: "from-orange-500/30 via-amber-600/20 to-slate-900",
  "elementor-2": "from-amber-500/30 via-yellow-600/20 to-slate-900",
  "elementor-3": "from-red-500/30 via-orange-600/20 to-slate-900",
  wp: "from-indigo-500/30 via-blue-600/20 to-slate-900",
  "wp-2": "from-blue-500/30 via-indigo-600/20 to-slate-900",
  "wp-3": "from-violet-500/30 via-blue-600/20 to-slate-900",
  notion: "from-slate-400/30 via-slate-600/20 to-slate-900",
  "notion-2": "from-zinc-400/30 via-slate-600/20 to-slate-900",
  "notion-3": "from-gray-400/30 via-slate-600/20 to-slate-900",
  marketing: "from-fuchsia-500/30 via-pink-600/20 to-slate-900",
  "marketing-2": "from-purple-500/30 via-fuchsia-600/20 to-slate-900",
  "marketing-3": "from-pink-500/30 via-rose-600/20 to-slate-900",
  docs: "from-yellow-500/30 via-amber-600/20 to-slate-900",
  "docs-2": "from-amber-500/30 via-orange-600/20 to-slate-900",
  "docs-3": "from-orange-500/30 via-red-600/20 to-slate-900",
  planner: "from-emerald-500/30 via-teal-600/20 to-slate-900",
  "planner-2": "from-teal-500/30 via-cyan-600/20 to-slate-900",
  "planner-3": "from-green-500/30 via-emerald-600/20 to-slate-900",
};

export function GradientCover({
  variant = "gradient-teal",
  className,
  children,
  pattern = "grid",
}: {
  variant?: string;
  className?: string;
  children?: React.ReactNode;
  pattern?: "grid" | "dots" | "none";
}) {
  const gradient = gradientMap[variant] ?? gradientMap["gradient-teal"];
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      {pattern === "grid" && (
        <div className="absolute inset-0 bg-grid opacity-40" />
      )}
      {pattern === "dots" && (
        <div className="absolute inset-0 bg-dots opacity-50" />
      )}
      <div className="absolute -top-1/2 -right-1/4 w-3/4 h-[150%] bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-1/3 -left-1/4 w-2/3 h-[120%] bg-primary/5 blur-3xl rounded-full" />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

/** Decorative animated orb background for hero/sections */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute top-[-10%] left-[20%] w-[40rem] h-[40rem] rounded-full bg-[#0fe1d2]/15 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-15%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-[#02b6bc]/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[30%] right-[30%] w-[25rem] h-[25rem] rounded-full bg-violet-500/8 blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
    </div>
  );
}
