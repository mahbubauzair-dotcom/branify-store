"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "@/lib/router";

/**
 * AnnouncementBar — a premium gradient promotional strip pinned above the
 * navbar. Purple → cyan → green gradient, dismissible, with a dark CTA pill
 * that routes to pricing.
 */
export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative z-50 overflow-hidden bg-gradient-to-r from-[#7B61FF] via-[#00E5FF] to-[#18F2B2]"
        >
          {/* subtle shimmer sheen */}
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
          </div>

          <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            {/* Left: sparkles + message */}
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-950/20">
                <Sparkles className="h-3.5 w-3.5 text-teal-950" />
              </span>
              <p className="truncate text-xs font-semibold text-teal-950 sm:text-sm">
                Summer Launch Offer
                <span className="mx-1.5 hidden text-teal-950/50 sm:inline">—</span>
                <span className="sm:inline">Get 30% OFF on Websites &amp; Branding</span>
              </p>
            </div>

            {/* Right: claim offer + dismiss */}
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => navigate("pricing")}
                className="group inline-flex items-center gap-1.5 rounded-full bg-teal-950 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-teal-900 hover:shadow-md sm:px-4 sm:py-2 sm:text-sm"
              >
                Claim Offer
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => setVisible(false)}
                aria-label="Dismiss announcement"
                className="flex h-7 w-7 items-center justify-center rounded-full text-teal-950/70 transition-colors hover:bg-teal-950/10 hover:text-teal-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
