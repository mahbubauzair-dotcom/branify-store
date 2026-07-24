"use client";

import { cn } from "@/lib/utils";

/**
 * AnimatedGradientBg — the signature BRANIFY background.
 *
 * Multiple radial gradients that drift very slowly:
 *  - Top-left: cyan glow (#00E5FF)
 *  - Bottom-right: purple glow (#7B61FF)
 *  - Center: dark navy gradient
 *
 * Use as a fixed full-page background behind all content.
 * Animation is intentionally subtle (20-30s) to feel premium, not distracting.
 */
export function AnimatedGradientBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Base dark navy gradient */}
      <div className="absolute inset-0 bg-[#050816]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1022] via-[#050816] to-[#0B1022]" />

      {/* Top-left cyan glow — slow drift */}
      <div
        className="absolute -left-[10%] -top-[10%] h-[60vh] w-[60vh] rounded-full opacity-30 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #00E5FF 0%, transparent 70%)",
          animation: "drift-cyan 25s ease-in-out infinite",
        }}
      />

      {/* Bottom-right purple glow — slow drift */}
      <div
        className="absolute -bottom-[15%] -right-[10%] h-[70vh] w-[70vh] rounded-full opacity-25 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #7B61FF 0%, transparent 70%)",
          animation: "drift-purple 30s ease-in-out infinite",
        }}
      />

      {/* Center accent green glow — subtle */}
      <div
        className="absolute left-1/2 top-1/2 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[150px]"
        style={{
          background: "radial-gradient(circle, #18F2B2 0%, transparent 70%)",
          animation: "drift-green 35s ease-in-out infinite",
        }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />

      <style jsx>{`
        @keyframes drift-cyan {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 8%) scale(1.1); }
          66% { transform: translate(-3%, 4%) scale(0.95); }
        }
        @keyframes drift-purple {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-6%, -4%) scale(1.05); }
          66% { transform: translate(4%, -8%) scale(1.1); }
        }
        @keyframes drift-green {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-45%, -55%) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
