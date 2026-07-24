"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Search, ArrowUp, ArrowDown, CornerDownLeft, XCircle, X, Home } from "lucide-react";
import { useRouterStore } from "@/lib/router";

type Shortcut = {
  keys: React.ReactNode;
  label: string;
  icon: React.ElementType;
};

const shortcuts: Shortcut[] = [
  { keys: <><Kbd>⌘</Kbd><Kbd>K</Kbd></>, label: "Open command palette", icon: Command },
  { keys: <><Kbd>?</Kbd></>, label: "Show this help", icon: Command },
  { keys: <><Kbd>/</Kbd></>, label: "Focus search", icon: Search },
  { keys: <><Kbd>↑</Kbd><Kbd>↓</Kbd></>, label: "Navigate palette items", icon: ArrowDown },
  { keys: <><Kbd>↵</Kbd></>, label: "Select palette item", icon: CornerDownLeft },
  { keys: <><Kbd>Esc</Kbd></>, label: "Close dialog / palette", icon: XCircle },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 px-1.5 text-[11px] font-semibold text-white/80">
      {children}
    </kbd>
  );
}

/**
 * ShortcutHelp — a modal listing all keyboard shortcuts, opened with the `?`
 * key. Premium SaaS touch (Linear, Notion, Raycast all have this). Also
 * supports pressing `/` to jump to search and `Escape` to close.
 */
export function ShortcutHelp() {
  const [open, setOpen] = useState(false);
  const navigate = useRouterStore((s) => s.navigate);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore if the user is typing in an input/textarea/contenteditable
      // (so `?` and `/` work as normal characters there).
      const target = e.target as HTMLElement;
      const tag = target?.tagName;
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        target?.isContentEditable ||
        target?.getAttribute("role") === "textbox";

      // `?` (shift + /) toggles help — but only when NOT typing.
      if (e.shiftKey && e.key === "?" && !isEditable) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // `/` jumps to search — only when not typing and no meta key.
      if (e.key === "/" && !isEditable && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        navigate("search");
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    // Listen for a custom event so the navbar "?" button can open this modal.
    const onOpenReq = () => setOpen(true);
    window.addEventListener("branify:open-shortcuts", onOpenReq);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("branify:open-shortcuts", onOpenReq);
    };
  }, [open, navigate]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-card/95 shadow-premium-lg backdrop-blur-2xl"
            role="dialog"
            aria-label="Keyboard shortcuts"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Command className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white">Keyboard shortcuts</p>
                  <p className="text-[11px] text-muted-foreground">Move faster across BRANIFY</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* shortcut list */}
            <div className="p-3">
              {shortcuts.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-white/90">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-1">{s.keys}</div>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="border-t border-white/5 px-5 py-3">
              <button
                onClick={() => {
                  navigate("home");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                <Home className="h-3.5 w-3.5" />
                Back to home
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
