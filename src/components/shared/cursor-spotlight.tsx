"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * CursorSpotlight — a soft radial glow that follows the pointer over a
 * section, creating a premium "spotlight" effect (Linear / Vercel style).
 * Pointer-events disabled so it never blocks interaction. Disabled on
 * touch devices and when prefers-reduced-motion is set.
 *
 * Wrap a section: <CursorSpotlight><section>...</section></CursorSpotlight>
 */
export function CursorSpotlight({
  children,
  className,
  color = "rgba(20, 184, 166, 0.12)",
  size = 480,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return; // skip touch

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty("--spot-x", `${x}px`);
        el.style.setProperty("--spot-y", `${y}px`);
        el.style.setProperty("--spot-opacity", "1");
      });
    };
    const onLeave = () => el.style.setProperty("--spot-opacity", "0");

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "50%",
          "--spot-opacity": "0",
          "--spot-size": `${size}px`,
          "--spot-color": color,
        } as React.CSSProperties
      }
    >
      {/* spotlight layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity)",
          background:
            "radial-gradient(var(--spot-size) circle at var(--spot-x) var(--spot-y), var(--spot-color), transparent 70%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
