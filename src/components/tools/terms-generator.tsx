"use client";

import { useMemo, useState } from "react";
import { Copy, FileSignature, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type ServiceType = "Website" | "SaaS" | "E-commerce" | "Mobile App" | "Marketplace";
type Jurisdiction = "US" | "EU" | "UK" | "CA" | "AU";

const jurisdictionName: Record<Jurisdiction, string> = {
  US: "the State of California, United States",
  EU: "the European Union",
  UK: "the United Kingdom",
  CA: "the Province of Ontario, Canada",
  AU: "the State of New South Wales, Australia",
};

export function TermsGenerator() {
  const [company, setCompany] = useState("BRANIFY Studio");
  const [website, setWebsite] = useState("branify.store");
  const [email, setEmail] = useState("legal@branify.store");
  const [serviceType, setServiceType] = useState<ServiceType>("SaaS");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("US");

  const updated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const terms = useMemo(() => {
    const lines: string[] = [];
    lines.push(`Terms and Conditions`);
    lines.push(``);
    lines.push(`Last updated: ${updated}`);
    lines.push(``);
    lines.push(`Welcome to ${company || "the Company"}. These Terms and Conditions ("Terms") govern your access to and use of ${website || "our website"} and the related ${serviceType.toLowerCase()} service (the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you may not access or use the Service.`);
    lines.push(``);
    lines.push(`1. Eligibility`);
    lines.push(``);
    lines.push(`You must be at least 18 years of age and legally able to enter into contracts to use the Service. By using the Service, you represent and warrant that you meet these requirements.`);
    lines.push(``);
    lines.push(`2. Accounts`);
    lines.push(``);
    lines.push(`You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at ${email || "the email below"} of any unauthorized use or security breach.`);
    lines.push(``);
    lines.push(`3. Acceptable Use`);
    lines.push(``);
    lines.push(`You agree not to: (a) use the Service for any unlawful purpose; (b) infringe the rights of any third party; (c) distribute malware or harmful code; (d) attempt to disrupt or gain unauthorized access to the Service or its systems; (e) reverse engineer, decompile, or disassemble any part of the Service; or (f) use the Service in any manner that could damage, disable, or impair it.`);
    lines.push(``);
    lines.push(`4. Intellectual Property`);
    lines.push(``);
    lines.push(`The Service, including its content, software, and trademarks, is owned by ${company || "the Company"} and protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable license to access and use the Service for its intended purpose.`);
    lines.push(``);
    lines.push(`5. User Content`);
    lines.push(``);
    lines.push(`If the Service allows you to submit content, you retain ownership but grant us a worldwide, non-exclusive, royalty-free license to use, host, store, and process that content as necessary to operate the Service. You represent that you have all rights needed to submit the content.`);
    lines.push(``);
    lines.push(`6. Payments`);
    lines.push(``);
    lines.push(`Some features of the Service may require payment. Fees are described at the time of purchase. Payments are processed by third-party providers and are subject to their terms. All fees are non-refundable except as required by law or as explicitly stated.`);
    lines.push(``);
    lines.push(`7. Termination`);
    lines.push(``);
    lines.push(`We may suspend or terminate your access to the Service at any time, with or without cause or notice. Upon termination, all licenses granted to you will end. Provisions that by their nature should survive termination will remain in effect.`);
    lines.push(``);
    lines.push(`8. Disclaimer of Warranties`);
    lines.push(``);
    lines.push(`The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied. We do not warrant that the Service will be uninterrupted, error-free, or secure.`);
    lines.push(``);
    lines.push(`9. Limitation of Liability`);
    lines.push(``);
    lines.push(`To the maximum extent permitted by law, ${company || "the Company"} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, arising from your use of the Service.`);
    lines.push(``);
    lines.push(`10. Governing Law`);
    lines.push(``);
    lines.push(`These Terms are governed by the laws of ${jurisdictionName[jurisdiction]}, without regard to conflict-of-law principles. Any disputes will be resolved in the courts located there.`);
    lines.push(``);
    lines.push(`11. Changes to These Terms`);
    lines.push(``);
    lines.push(`We may revise these Terms from time to time. We will post the updated Terms on this page and update the "Last updated" date. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.`);
    lines.push(``);
    lines.push(`12. Contact Us`);
    lines.push(``);
    lines.push(`If you have questions about these Terms, contact us at:`);
    lines.push(`${company || "Company"}`);
    lines.push(`Email: ${email || "legal@example.com"}`);
    lines.push(`Website: ${website || "example.com"}`);
    return lines.join("\n");
  }, [company, website, email, serviceType, jurisdiction, updated]);

  const copy = () => {
    navigator.clipboard.writeText(terms).then(() => toast.success("Copied!"));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <FileSignature className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Terms Generator</h3>
            <p className="text-xs text-muted-foreground">Website terms & conditions, customized to you.</p>
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
            <Label className="text-white/80">Service type</Label>
            <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
              <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                {(["Website", "SaaS", "E-commerce", "Mobile App", "Marketplace"] as ServiceType[]).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-white/80">Jurisdiction</Label>
            <Select value={jurisdiction} onValueChange={(v) => setJurisdiction(v as Jurisdiction)}>
              <SelectTrigger className="h-10 w-full border-white/10 bg-background/60 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-popover/95 backdrop-blur">
                {(["US", "EU", "UK", "CA", "AU"] as Jurisdiction[]).map((j) => (
                  <SelectItem key={j} value={j}>{j}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button onClick={copy} className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-hover">
            <Copy className="h-4 w-4" /> Copy terms
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
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/80">{terms}</pre>
        </div>

        <p className="mt-4 text-xs text-amber-200/70">
          This is a starting template, not legal advice. Have a qualified attorney review your terms before publishing.
        </p>
      </Card>
    </div>
  );
}
