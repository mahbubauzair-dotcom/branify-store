"use client";

import { useMemo, useState } from "react";
import { Copy, Printer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Country = "US" | "EU" | "UK" | "CA";

const dataOptions: { id: string; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "payment", label: "Payment information" },
  { id: "cookies", label: "Cookies & local storage" },
  { id: "analytics", label: "Usage analytics" },
];

const lawByCountry: Record<Country, string> = {
  US: "the California Consumer Privacy Act (CCPA) and applicable U.S. state privacy laws",
  EU: "the General Data Protection Regulation (GDPR)",
  UK: "the UK Data Protection Act 2018 and the UK GDPR",
  CA: "the Personal Information Protection and Electronic Documents Act (PIPEDA)",
};

export function PrivacyPolicyGenerator() {
  const [company, setCompany] = useState("BRANIFY Studio");
  const [website, setWebsite] = useState("branify.store");
  const [email, setEmail] = useState("privacy@branify.store");
  const [collected, setCollected] = useState<Set<string>>(new Set(["name", "email", "cookies", "analytics"]));
  const [thirdParty, setThirdParty] = useState("Google Analytics, Stripe, Mailchimp");
  const [country, setCountry] = useState<Country>("US");

  const toggle = (id: string) => {
    setCollected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const collectedList = dataOptions
    .filter((d) => collected.has(d.id))
    .map((d) => d.label.toLowerCase());

  const dataSentence = collectedList.length > 0
    ? collectedList.slice(0, -1).join(", ") + (collectedList.length > 1 ? " and " : "") + collectedList[collectedList.length - 1]
    : "no personal information";

  const updated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const policy = useMemo(() => {
    const lines: string[] = [];
    lines.push(`Privacy Policy`);
    lines.push(``);
    lines.push(`Last updated: ${updated}`);
    lines.push(``);
    lines.push(`This Privacy Policy describes how ${company || "the Company"} ("we", "us", or "our") collects, uses, and discloses your information when you visit ${website || "our website"} (the "Service"). We are committed to protecting your privacy and complying with ${lawByCountry[country]}.`);
    lines.push(``);
    lines.push(`1. Information We Collect`);
    lines.push(``);
    lines.push(`We may collect ${dataSentence}. The specific data depends on how you interact with the Service — for example, when you create an account, complete a form, or make a purchase. We only collect information that is necessary to provide and improve the Service.`);
    lines.push(``);
    lines.push(`2. How We Use Your Information`);
    lines.push(``);
    lines.push(`We use the information we collect to: (a) provide, operate, and maintain the Service; (b) process transactions and send related information; (c) respond to your comments, questions, and customer service requests; (d) send technical notices, updates, and administrative messages; (e) analyze usage trends and improve the Service; and (f) detect, prevent, and address technical issues, fraud, or other prohibited activity.`);
    lines.push(``);
    lines.push(`3. Third-Party Services`);
    lines.push(``);
    lines.push(`We may use third-party services to operate the Service. These may include: ${thirdParty || "analytics, payments, and email delivery providers"}. These providers may collect information governed by their own privacy policies. We encourage you to review their policies.`);
    lines.push(``);
    lines.push(`4. Cookies`);
    lines.push(``);
    lines.push(`We use cookies and similar tracking technologies to track activity on the Service and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some portions of the Service may not function properly.`);
    lines.push(``);
    lines.push(`5. Data Retention`);
    lines.push(``);
    lines.push(`We retain personal information only for as long as is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required by law.`);
    lines.push(``);
    lines.push(`6. Your Rights`);
    lines.push(``);
    lines.push(`Depending on your location, you may have the right to: access, correct, delete, or port your personal information; object to or restrict its processing; and withdraw consent at any time. To exercise these rights, contact us at ${email || "the email below"}.`);
    lines.push(``);
    lines.push(`7. Security`);
    lines.push(``);
    lines.push(`We use reasonable administrative, technical, and physical safeguards designed to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`);
    lines.push(``);
    lines.push(`8. Changes to This Policy`);
    lines.push(``);
    lines.push(`We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this policy periodically.`);
    lines.push(``);
    lines.push(`9. Contact Us`);
    lines.push(``);
    lines.push(`If you have questions about this Privacy Policy, contact us at:`);
    lines.push(`${company || "Company"}`);
    lines.push(`Email: ${email || "privacy@example.com"}`);
    lines.push(`Website: ${website || "example.com"}`);
    return lines.join("\n");
  }, [company, website, email, country, thirdParty, dataSentence, updated]);

  const copy = () => {
    navigator.clipboard.writeText(policy).then(() => toast.success("Copied!"));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Privacy Policy Generator</h3>
            <p className="text-xs text-muted-foreground">GDPR/CCPA-ready privacy copy in seconds.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white/80">Company name</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Website</Label>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Contact email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Jurisdiction</Label>
            <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
              <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                <SelectItem value="US">United States (CCPA)</SelectItem>
                <SelectItem value="EU">European Union (GDPR)</SelectItem>
                <SelectItem value="UK">United Kingdom (UK GDPR)</SelectItem>
                <SelectItem value="CA">Canada (PIPEDA)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label className="text-white/80">Data collected</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {dataOptions.map((d) => {
              const checked = collected.has(d.id);
              return (
                <label
                  key={d.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-background/50 px-3 py-2 text-sm text-white/90 transition-colors hover:border-primary/30"
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggle(d.id)} />
                  {d.label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Label className="text-white/80">Third-party services</Label>
          <Input value={thirdParty} onChange={(e) => setThirdParty(e.target.value)} className="h-10 border-white/10 bg-background/60 text-white" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button onClick={copy} className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-hover">
            <Copy className="h-4 w-4" /> Copy policy
          </Button>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="h-11 rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>

        <div className="mt-6 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-background/60 p-5">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/80">{policy}</pre>
        </div>

        <p className="mt-4 text-xs text-amber-200/70">
          This is a starting template, not legal advice. Have a qualified attorney review your privacy policy before publishing.
        </p>
      </Card>
    </div>
  );
}
