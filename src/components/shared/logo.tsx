"use client";

import { cn } from "@/lib/utils";

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300"
        >
          <defs>
            <linearGradient id="branify-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2DD4BF" />
              <stop offset="1" stopColor="#0D9488" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="9" fill="url(#branify-logo-grad)" />
          <path
            d="M10 8h7.2c2.6 0 4.5 1.6 4.5 4 0 1.7-.9 2.9-2.3 3.5 1.7.5 2.8 1.9 2.8 3.8 0 2.6-2 4.4-4.9 4.4H10V8Zm3 6.4h3.7c1.2 0 2-.6 2-1.7s-.8-1.7-2-1.7H13v3.4Zm0 6.4h4c1.3 0 2.1-.7 2.1-1.8 0-1.2-.8-1.8-2.1-1.8h-4v3.6Z"
            fill="#04121A"
          />
        </svg>
      </div>
      {showWordmark && (
        <span className="font-display text-xl font-bold tracking-tight text-white">
          BRANIFY
        </span>
      )}
    </div>
  );
}
