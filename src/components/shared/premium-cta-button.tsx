"use client";

import { forwardRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PremiumCTAButton — the signature BRANIFY call-to-action button.
 *
 * Features:
 * - 3-color gradient: #00E5FF → #2F7BFF → #7B61FF
 * - Glass shine overlay (top-down white gradient)
 * - 2px white/85 border
 * - 999px pill radius, 48px height
 * - Glow: 0 12px 35px rgba(0,229,255,.35) + 0 0 20px rgba(47,123,255,.30)
 * - Hover: translateY(-3px), brighter gradient, brighter glow, arrow slides right 5px
 * - Active: scale(.98)
 * - Font: Poppins 700, 15px, uppercase, 0.4px letter-spacing
 * - Arrow: white, 16px, moves right 5px on hover
 * - Transition: 0.35s ease
 *
 * Usage:
 *   <PremiumCTAButton onClick={...}>Start a Project</PremiumCTAButton>
 *   <PremiumCTAButton href="/contact">Get Started</PremiumCTAButton>
 *   <PremiumCTAButton arrow={false}>Subscribe</PremiumCTAButton>
 */
type PremiumCTAButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
};

export const PremiumCTAButton = forwardRef<HTMLButtonElement, PremiumCTAButtonProps>(
  function PremiumCTAButton(
    { children, onClick, href, className, arrow = true, type = "button", disabled = false },
    ref,
  ) {
    const inner = (
      <>
        {/* Base gradient layer */}
        <span
          className="absolute inset-0 rounded-[999px]"
          style={{
            background: "linear-gradient(90deg, #00E5FF 0%, #2F7BFF 55%, #7B61FF 100%)",
            transition: "background 0.35s ease",
          }}
        />
        {/* Glass shine layer */}
        <span
          className="absolute inset-0 rounded-[999px]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 60%)",
          }}
        />
        {/* Hover gradient layer (hidden by default, shown on hover) */}
        <span
          className="absolute inset-0 rounded-[999px] opacity-0 transition-opacity duration-350 group-hover:opacity-100"
          style={{
            background: "linear-gradient(90deg, #11F7FF 0%, #4287FF 55%, #9062FF 100%)",
          }}
        />
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span
            className="font-display font-bold uppercase"
            style={{
              color: "#FFFFFF",
              fontSize: "15px",
              letterSpacing: "0.4px",
              fontFamily: "var(--font-poppins), sans-serif",
            }}
          >
            {children}
          </span>
          {arrow && (
            <ArrowRight
              className="h-4 w-4 text-white transition-transform duration-350 group-hover:translate-x-[5px]"
              strokeWidth={2.5}
            />
          )}
        </span>
      </>
    );

    const baseClass = cn(
      "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-7 transition-all duration-350 ease-out",
      "border-2 border-white/85",
      "hover:-translate-y-[3px] active:scale-[0.98]",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    );

    const style: React.CSSProperties = {
      boxShadow:
        "0 12px 35px rgba(0,229,255,0.35), 0 0 20px rgba(47,123,255,0.30)",
      transition: "all 0.35s ease",
    };

    const hoverStyle = `
      group-hover:shadow-[0_18px_45px_rgba(0,229,255,0.45),0_0_30px_rgba(47,123,255,0.40)]
      group-hover:border-white
    `;

    if (href) {
      return (
        <a
          href={href}
          className={cn(baseClass, hoverStyle)}
          style={style}
        >
          {inner}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(baseClass, hoverStyle)}
        style={style}
      >
        {inner}
      </button>
    );
  },
);
