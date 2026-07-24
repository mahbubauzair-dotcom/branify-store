"use client";

import { useMemo, useState } from "react";
import { Copy, Plus, Printer, Receipt, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type LineItem = { id: string; description: string; qty: number; price: number };

const uid = () => Math.random().toString(36).slice(2, 9);

const todayISO = () => new Date().toISOString().slice(0, 10);
const plusDaysISO = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export function InvoiceGenerator() {
  const [fromName, setFromName] = useState("BRANIFY Studio");
  const [fromEmail, setFromEmail] = useState("hello@branify.store");
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("INV-0001");
  const [date, setDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(plusDaysISO(14));
  const [taxRate, setTaxRate] = useState(10);
  const [items, setItems] = useState<LineItem[]>([
    { id: uid(), description: "Brand identity design", qty: 1, price: 2500 },
    { id: uid(), description: "Website design & build (5 pages)", qty: 1, price: 4500 },
  ]);

  const addItem = () =>
    setItems((prev) => [...prev, { id: uid(), description: "", qty: 1, price: 0 }]);
  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const { subtotal, tax, total } = useMemo(() => {
    const sub = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const t = Math.round((sub * (taxRate / 100)) * 100) / 100;
    return { subtotal: sub, tax: t, total: sub + t };
  }, [items, taxRate]);

  const copyTotals = () => {
    const lines = [
      `Invoice ${invoiceNo}`,
      `Subtotal: $${subtotal.toFixed(2)}`,
      `Tax (${taxRate}%): $${tax.toFixed(2)}`,
      `Total: $${total.toFixed(2)}`,
      `Due: ${dueDate}`,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => toast.success("Copied!"));
  };

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-white/5 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Invoice Generator</h3>
            <p className="text-xs text-muted-foreground">Build a clean invoice, then print or save as PDF.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white/80">From · Name</Label>
            <Input value={fromName} onChange={(e) => setFromName(e.target.value)} className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">From · Email</Label>
            <Input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Bill to · Name</Label>
            <Input value={toName} onChange={(e) => setToName(e.target.value)} placeholder="Client name" className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Bill to · Email</Label>
            <Input value={toEmail} onChange={(e) => setToEmail(e.target.value)} placeholder="client@example.com" className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Invoice #</Label>
            <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="h-10 border-white/10 bg-background/60 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-white/80">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10 border-white/10 bg-background/60 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Due date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-10 border-white/10 bg-background/60 text-white" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <Label className="text-white/80">Line items</Label>
            <Button onClick={addItem} size="sm" variant="outline" className="h-8 rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10">
              <Plus className="h-3.5 w-3.5" /> Add item
            </Button>
          </div>

          <div className="mt-3 space-y-2">
            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-12 gap-2 rounded-lg border border-white/10 bg-background/50 p-2">
                <Input
                  value={it.description}
                  onChange={(e) => updateItem(it.id, { description: e.target.value })}
                  placeholder="Description"
                  className="col-span-12 h-9 border-white/10 bg-background/60 text-white sm:col-span-6"
                />
                <Input
                  type="number"
                  min={1}
                  value={it.qty}
                  onChange={(e) => updateItem(it.id, { qty: Math.max(1, Number(e.target.value) || 0) })}
                  className="col-span-4 h-9 border-white/10 bg-background/60 text-white sm:col-span-2"
                  aria-label="Quantity"
                />
                <Input
                  type="number"
                  min={0}
                  value={it.price}
                  onChange={(e) => updateItem(it.id, { price: Math.max(0, Number(e.target.value) || 0) })}
                  className="col-span-6 h-9 border-white/10 bg-background/60 text-white sm:col-span-3"
                  aria-label="Unit price"
                />
                <button
                  onClick={() => removeItem(it.id)}
                  aria-label="Remove item"
                  className="col-span-2 flex h-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-400 sm:col-span-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Label className="w-28 text-white/80">Tax rate (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={taxRate}
              onChange={(e) => setTaxRate(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
              className="h-9 w-24 border-white/10 bg-background/60 text-white"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            onClick={() => window.print()}
            className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-hover"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </Button>
          <Button
            onClick={copyTotals}
            variant="outline"
            className="h-11 rounded-lg border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            <Copy className="h-4 w-4" /> Copy totals
          </Button>
        </div>

        <Separator className="my-6 bg-white/5" />

        {/* Live preview */}
        <div id="invoice-preview" className="rounded-2xl border border-white/10 bg-white p-6 text-slate-900 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-2xl font-bold">{fromName || "Your Company"}</p>
              <p className="text-xs text-slate-500">{fromEmail || "you@example.com"}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold tracking-tight">INVOICE</p>
              <p className="text-xs text-slate-500">#{invoiceNo}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Bill to</p>
              <p className="mt-1 font-medium text-slate-800">{toName || "Client name"}</p>
              <p className="text-slate-500">{toEmail || "client@example.com"}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date</p>
              <p className="mt-1 text-slate-700">{date}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Due</p>
              <p className="text-slate-700">{dueDate}</p>
            </div>
          </div>

          <table className="mt-6 w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Unit price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-700">{it.description || "—"}</td>
                  <td className="py-2 text-right text-slate-700">{it.qty}</td>
                  <td className="py-2 text-right text-slate-700">{fmt(it.price)}</td>
                  <td className="py-2 text-right font-medium text-slate-900">{fmt(it.qty * it.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 ml-auto w-full max-w-[16rem] space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax ({taxRate}%)</span>
              <span className="font-medium text-slate-900">{fmt(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 text-base">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-bold text-slate-900">{fmt(total)}</span>
            </div>
          </div>

          <p className="mt-6 text-[10px] text-slate-400">
            Payment due by {dueDate}. Thank you for your business — generated with BRANIFY Free Tools.
          </p>
        </div>
      </Card>
    </div>
  );
}
