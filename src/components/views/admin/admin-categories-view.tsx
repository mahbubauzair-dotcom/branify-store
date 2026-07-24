"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  FolderTree,
  Tag,
  Save,
} from "lucide-react";
import { AdminLayout } from "@/components/views/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  active: boolean;
  _count?: { products: number };
};

type CategoryForm = {
  name: string;
  description: string;
  icon: string;
  sortOrder: string;
  active: boolean;
};

const EMPTY_FORM: CategoryForm = {
  name: "",
  description: "",
  icon: "",
  sortOrder: "0",
  active: true,
};

/**
 * AdminCategoriesView — manage product categories.
 */
export function AdminCategoriesView() {
  return (
    <AdminLayout active="categories">
      <CategoriesContent />
    </AdminLayout>
  );
}

function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (data?.ok && Array.isArray(data.categories)) {
        setCategories(data.categories as Category[]);
      } else {
        toast.error("Failed to load categories.");
      }
    } catch {
      toast.error("Network error loading categories.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setForm({
      name: cat.name,
      description: cat.description ?? "",
      icon: cat.icon ?? "",
      sortOrder: String(cat.sortOrder ?? 0),
      active: cat.active,
    });
    setEditingId(cat.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function onSave() {
    if (!form.name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    const sortOrder = Number(form.sortOrder);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      active: form.active,
    };
    setSaving(true);
    try {
      const res = editingId
        ? await fetch(`/api/admin/categories/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        toast.error(data?.error || "Failed to save category.");
        return;
      }
      toast.success(editingId ? "Category updated" : "Category created");
      closeForm();
      await load();
    } catch {
      toast.error("Network error saving category.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(cat: Category, next: boolean) {
    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, active: next } : c)),
    );
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: next }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        // Roll back
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, active: cat.active } : c)),
        );
        toast.error(data?.error || "Failed to update category.");
      }
    } catch {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, active: cat.active } : c)),
      );
      toast.error("Network error.");
    }
  }

  async function onDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        toast.error(data?.error || "Failed to delete category.");
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Network error deleting category.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"} ·{" "}
            {categories.filter((c) => c.active).length} active
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary text-primary-foreground hover:bg-hover"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add category
        </Button>
      </div>

      {/* Inline form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <Card className="space-y-5 border-primary/20 bg-card/40 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-white">
                    {editingId ? "Edit category" : "New category"}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeForm}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-name">Name</Label>
                  <Input
                    id="c-name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Brand Kits"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-icon">Icon (lucide name)</Label>
                  <Input
                    id="c-icon"
                    value={form.icon}
                    onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                    placeholder="sparkles"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    A lucide icon name, e.g. <span className="font-mono">sparkles</span>,{" "}
                    <span className="font-mono">package</span>.
                  </p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="c-desc">Description</Label>
                  <Textarea
                    id="c-desc"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="A short description shown on category listings."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-sort">Sort order</Label>
                  <Input
                    id="c-sort"
                    type="number"
                    min="0"
                    value={form.sortOrder}
                    onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
                </div>
                <div className="flex items-end">
                  <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Active</p>
                      <p className="text-xs text-muted-foreground">Inactive categories are hidden.</p>
                    </div>
                    <Switch
                      checked={form.active}
                      onCheckedChange={(v) => setForm((p) => ({ ...p, active: v }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={closeForm}
                  className="border-white/10 bg-transparent text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="bg-primary text-primary-foreground hover:bg-hover"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="mr-1.5 h-4 w-4" />
                      {editingId ? "Save changes" : "Create category"}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl border border-white/5 bg-card/30 shimmer" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 border-white/5 bg-card/40 p-12 text-center backdrop-blur">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
            <FolderTree className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-white">No categories yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first category to organize products.
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-primary text-primary-foreground hover:bg-hover"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add category
          </Button>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.2) }}
            >
              <Card className="group flex items-center gap-4 border-white/5 bg-card/40 p-4 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/60">
                {/* Icon / initials */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-primary/10 text-sm font-semibold uppercase text-primary">
                  {(cat.name[0] || "?")}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold text-white">{cat.name}</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-transparent text-[10px]",
                        cat.active
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {cat.active ? "active" : "inactive"}
                    </Badge>
                    {cat._count && cat._count.products > 0 && (
                      <Badge variant="outline" className="border-white/10 bg-white/[0.02] text-[10px] text-muted-foreground">
                        {cat._count.products} product{cat._count.products === 1 ? "" : "s"}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-mono">{cat.slug}</span>
                    {cat.icon && (
                      <>
                        <span className="opacity-40">·</span>
                        <span className="font-mono">{cat.icon}</span>
                      </>
                    )}
                    <span className="opacity-40">·</span>
                    <span>sort: {cat.sortOrder}</span>
                  </div>
                  {cat.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  )}
                </div>

                {/* Active toggle */}
                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  <span className="text-xs text-muted-foreground">Active</span>
                  <Switch
                    checked={cat.active}
                    onCheckedChange={(v) => toggleActive(cat, v)}
                  />
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(cat)}
                    className="text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-white/10 bg-card">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this category?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete{" "}
                          <span className="font-medium text-foreground">{cat.name}</span>.
                          {cat._count && cat._count.products > 0
                            ? ` ${cat._count.products} product${cat._count.products === 1 ? "" : "s"} will become uncategorized but won't be deleted.`
                            : ""}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(cat.id)}
                          className="bg-destructive text-white hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
