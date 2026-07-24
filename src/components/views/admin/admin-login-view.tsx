"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { AuroraBackground } from "@/components/shared/gradient-cover";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@/lib/router";
import { toast } from "sonner";

/**
 * AdminLoginView — centered login card over an AuroraBackground.
 *
 * On mount, checks for an existing session via GET /api/admin/auth/check; if
 * already authenticated, redirects to the dashboard. On submit, POSTs
 * credentials to /api/admin/auth/login and navigates to the dashboard on
 * success.
 *
 * NOTE: No demo credentials are shown on the page — the admin keeps their
 * email/password secret. Placeholders use neutral hints, not real values.
 */
export function AdminLoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/auth/check", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (data?.ok) {
          navigate("admin-dashboard");
        } else {
          setChecking(false);
        }
      } catch {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        // Login takes ~2s due to scrypt hashing — give it room.
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        const msg = data?.error || "Invalid email or password.";
        toast.error(msg);
        return;
      }
      toast.success("Welcome back");
      navigate("admin-dashboard");
    } catch (err) {
      // Distinguish timeout/network errors from server errors.
      if (err instanceof DOMException && err.name === "TimeoutError") {
        toast.error("The server took too long to respond. Please try again.");
      } else if (err instanceof TypeError) {
        toast.error("Cannot reach the server. Please check your connection and try again.");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 sm:py-12">
      <AuroraBackground />
      <div className="absolute inset-0 bg-grid opacity-[0.07]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
          <Logo size="sm" />
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary sm:mt-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Console
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:mt-4 sm:text-3xl">
            Sign in to BRANIFY
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage products, categories and your storefront.
          </p>
        </div>

        <Card className="border-white/5 bg-card/40 p-5 backdrop-blur-xl sm:p-8">
          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-9"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-9"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-11 w-full bg-primary text-primary-foreground hover:bg-hover"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-5 flex justify-center sm:mt-6">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </button>
        </div>
      </motion.div>
    </div>
  );
}
