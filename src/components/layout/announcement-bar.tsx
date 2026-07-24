"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useNavigate } from "@/lib/router";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 overflow-hidden border-b border-white/5 bg-gradient-to-r from-[#02b6bc] via-[#0fe1d2] to-[#2fb8af]"
        >
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-center">
            <Sparkles className="hidden h-4 w-4 shrink-0 text-teal-950 sm:block" />
            <p className="text-sm font-medium text-teal-950">
              <span className="font-semibold">New Year Sale</span> — Get 40% off all digital products &amp; 15% off services.
              {" "}
              <button
                onClick={() => navigate("pricing")}
                className="font-semibold underline underline-offset-2 hover:text-teal-900 transition-colors"
              >
                Explore plans →
              </button>
            </p>
            <button
              onClick={() => setVisible(false)}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-teal-950/70 transition-colors hover:bg-teal-950/10 hover:text-teal-950"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
