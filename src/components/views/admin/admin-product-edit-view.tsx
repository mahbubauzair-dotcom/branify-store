"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  Plus,
  ImageOff,
  Sparkles,
  Info,
} from "lucide-react";
import { AdminLayout } from "@/components/views/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouterStore, useNavigate } from "@/lib/router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductForm = {
  name: string;
  slug: string;
  categoryId: string;
  price: string;
  originalPrice: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  features: string[];
  format: string[];
  popular: boolean;
  isNew: boolean;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

const EMPTY_FORM: ProductForm = {
  name: "",
  slug: "",
  categoryId: "",
  price: "",
  originalPrice: "",
  shortDescription: "",
  description: "",
  image: "",
  gallery: [],
  features: [],
  format: [],
  popular: false,
  isNew: true,
  status: "draft",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 160;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * AdminProductEditView — create or edit a product.
 *
 * Reads the slug from the router store. If slug === "new", renders an empty
 * create form; otherwise fetches the existing product and pre-fills the form.
 */
export function AdminProductEditView() {
  return (
    <AdminLayout active="products">
      <ProductEditContent />
    </AdminLayout>
  );
}

function ProductEditContent() {
  const slug = useRouterStore((s) => s.slug);
  const navigate = useNavigate();
  const isNew = !slug || slug === "new";

  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadCategories();
    if (!isNew && slug) {
      void loadProduct(slug);
    }
  }, [slug, isNew]);

  async function loadCategories() {
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (data?.ok && Array.isArray(data.categories)) {
        setCategories(data.categories as Category[]);
      }
    } catch {
      // non-fatal — category select will just be empty
    }
  }

  async function loadProduct(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data?.product) {
        toast.error(data?.error || "Product not found.");
        navigate("admin-products");
        return;
      }
      const p = data.product;
      setForm({
        name: p.name ?? "",
        slug: p.slug ?? "",
        categoryId: p.categoryId ?? "",
        price: p.price != null ? String(p.price) : "",
        originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
        shortDescription: p.shortDescription ?? "",
        description: p.description ?? "",
        image: p.image ?? "",
        gallery: Array.isArray(p.gallery) ? p.gallery : [],
        features: Array.isArray(p.features) ? p.features : [],
        format: Array.isArray(p.format) ? p.format : [],
        popular: Boolean(p.popular),
        isNew: Boolean(p.isNew),
        status: p.status === "published" ? "published" : "draft",
        seoTitle: p.seoTitle ?? "",
        seoDescription: p.seoDescription ?? "",
        seoKeywords: p.seoKeywords ?? "",
      });
    } catch {
      toast.error("Network error loading product.");
      navigate("admin-products");
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      // Auto-generate slug from name unless the user has manually edited it.
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  }

  function onSlugChange(value: string) {
    setSlugTouched(true);
    update("slug", value);
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok || !data?.url) {
      toast.error(data?.error || "Upload failed.");
      return null;
    }
    return data.url as string;
  }

  async function onImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadFile(file);
      if (url) {
        update("image", url);
        toast.success("Image uploaded");
      }
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }

  async function onGalleryChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const url = await uploadFile(file);
        if (url) uploaded.push(url);
      }
      if (uploaded.length > 0) {
        setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...uploaded] }));
        toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} added`);
      }
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  function removeGalleryImage(index: number) {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  }

  function addFeature() {
    setForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
  }

  function updateFeature(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  }

  function removeFeature(index: number) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }

  function addFormat() {
    setForm((prev) => ({ ...prev, format: [...prev.format, ""] }));
  }

  function updateFormat(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      format: prev.format.map((f, i) => (i === index ? value : f)),
    }));
  }

  function removeFormat(index: number) {
    setForm((prev) => ({
      ...prev,
      format: prev.format.filter((_, i) => i !== index),
    }));
  }

  function buildPayload(): Record<string, unknown> | null {
    if (!form.name.trim()) {
      toast.error("Product name is required.");
      return null;
    }
    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) {
      toast.error("Please enter a valid price.");
      return null;
    }
    const originalPrice =
      form.originalPrice.trim() === ""
        ? null
        : Number(form.originalPrice);
    if (originalPrice !== null && (Number.isNaN(originalPrice) || originalPrice < 0)) {
      toast.error("Please enter a valid original price.");
      return null;
    }
    return {
      name: form.name.trim(),
      slug: form.slug.trim() ? slugify(form.slug) : undefined,
      categoryId: form.categoryId || null,
      price,
      originalPrice,
      shortDescription: form.shortDescription || null,
      description: form.description,
      image: form.image || null,
      gallery: form.gallery,
      features: form.features.map((f) => f.trim()).filter(Boolean),
      format: form.format.map((f) => f.trim()).filter(Boolean),
      popular: form.popular,
      isNew: form.isNew,
      status: form.status,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
      seoKeywords: form.seoKeywords || null,
    };
  }

  async function onSave() {
    const payload = buildPayload();
    if (!payload) return;
    setSaving(true);
    try {
      const res = isNew
        ? await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/products/${slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        toast.error(data?.error || "Failed to save product.");
        return;
      }
      toast.success(isNew ? "Product created" : "Product updated");
      navigate("admin-products");
    } catch {
      toast.error("Network error saving product.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Loading product…</p>
        </div>
      </div>
    );
  }

  const seoTitleLen = form.seoTitle.length;
  const seoDescLen = form.seoDescription.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("admin-products")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {isNew ? "New product" : "Edit product"}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {isNew ? "Create a new digital product." : form.name || "Untitled product"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("admin-products")}
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
                {isNew ? "Create product" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="gap-4">
        <TabsList className="w-full justify-start overflow-x-auto bg-card/40 p-1 sm:w-auto">
          <TabsTrigger value="basic">Basic info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* BASIC INFO */}
        <TabsContent value="basic">
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="space-y-5 border-white/5 bg-card/40 p-6 backdrop-blur lg:col-span-2">
              <h2 className="font-display text-lg font-semibold text-white">Basic info</h2>

              <div className="space-y-2">
                <Label htmlFor="p-name">Name</Label>
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Premium Brand Identity Kit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-slug">Slug</Label>
                <Input
                  id="p-slug"
                  value={form.slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="auto-generated-from-name"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  URL: /products/<span className="font-mono text-foreground">{form.slug || "…"}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-short">Short description</Label>
                <Input
                  id="p-short"
                  value={form.shortDescription}
                  onChange={(e) => update("shortDescription", e.target.value)}
                  placeholder="A one-line summary shown on product cards."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-desc">Description</Label>
                <Textarea
                  id="p-desc"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Full product description. Supports plain text — line breaks are preserved."
                  rows={8}
                />
              </div>
            </Card>

            <div className="space-y-5">
              <Card className="space-y-4 border-white/5 bg-card/40 p-6 backdrop-blur">
                <h3 className="font-display text-base font-semibold text-white">Pricing</h3>
                <div className="space-y-2">
                  <Label htmlFor="p-price">Price (USD)</Label>
                  <Input
                    id="p-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="49.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-oprice">Original price (optional)</Label>
                  <Input
                    id="p-oprice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.originalPrice}
                    onChange={(e) => update("originalPrice", e.target.value)}
                    placeholder="79.00"
                  />
                </div>
              </Card>

              <Card className="space-y-4 border-white/5 bg-card/40 p-6 backdrop-blur">
                <h3 className="font-display text-base font-semibold text-white">Organization</h3>
                <div className="space-y-2">
                  <Label htmlFor="p-cat">Category</Label>
                  <Select
                    value={form.categoryId || "__none__"}
                    onValueChange={(v) => update("categoryId", v === "__none__" ? "" : v)}
                  >
                    <SelectTrigger id="p-cat" className="w-full">
                      <SelectValue placeholder="Uncategorized" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Uncategorized</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="p-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => update("status", v as "draft" | "published")}
                  >
                    <SelectTrigger id="p-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              <Card className="space-y-4 border-white/5 bg-card/40 p-6 backdrop-blur">
                <h3 className="font-display text-base font-semibold text-white">Flags</h3>
                <ToggleRow
                  label="Popular"
                  description="Show on featured sections."
                  checked={form.popular}
                  onChange={(v) => update("popular", v)}
                />
                <ToggleRow
                  label="New"
                  description="Display a “New” badge on cards."
                  checked={form.isNew}
                  onChange={(v) => update("isNew", v)}
                />
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* IMAGES */}
        <TabsContent value="images">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="space-y-4 border-white/5 bg-card/40 p-6 backdrop-blur">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">Main image</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Shown on product cards and as the primary detail image.
                </p>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
                {form.image ? (
                  <img src={form.image} alt="Main" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground/50">
                    <ImageOff className="h-8 w-8" />
                    <span className="text-xs">No image yet</span>
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </div>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={onImageChange}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="border-white/10 bg-transparent text-muted-foreground hover:text-foreground"
                >
                  <Upload className="mr-1.5 h-4 w-4" />
                  Upload image
                </Button>
                {form.image && (
                  <Button
                    variant="ghost"
                    onClick={() => update("image", "")}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="mr-1.5 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </Card>

            <Card className="space-y-4 border-white/5 bg-card/40 p-6 backdrop-blur">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">Gallery</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Additional images shown in the product gallery. Upload multiple at once.
                </p>
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                multiple
                onChange={onGalleryChange}
                className="hidden"
              />

              {form.gallery.length === 0 ? (
                <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-muted-foreground/60">
                  <ImageOff className="h-7 w-7" />
                  <span className="text-xs">No gallery images</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {form.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]"
                    >
                      <img src={img} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute right-1 top-1 rounded-md bg-background/80 p-1 text-destructive opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-white"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploadingGallery}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/10 bg-white/[0.02] text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {uploadingGallery ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span className="text-[10px]">Add</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {form.gallery.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={uploadingGallery}
                  className="border-white/10 bg-transparent text-muted-foreground hover:text-foreground"
                >
                  <Upload className="mr-1.5 h-4 w-4" />
                  Add more
                </Button>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* FEATURES */}
        <TabsContent value="features">
          <div className="grid gap-5 lg:grid-cols-2">
            <DynamicList
              title="Features"
              description="Bullet points highlighted in the product detail view."
              items={form.features}
              placeholder="e.g. 50+ fully editable templates"
              onAdd={addFeature}
              onUpdate={updateFeature}
              onRemove={removeFeature}
            />
            <DynamicList
              title="Formats"
              description="Deliverable formats (e.g. Figma, PDF, AI, Sketch)."
              items={form.format}
              placeholder="e.g. Figma"
              onAdd={addFormat}
              onUpdate={updateFormat}
              onRemove={removeFormat}
            />
          </div>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card className="space-y-5 border-white/5 bg-card/40 p-6 backdrop-blur">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold text-white">Search engine optimization</h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="seo-title">SEO title</Label>
                <span
                  className={cn(
                    "text-xs",
                    seoTitleLen > SEO_TITLE_MAX ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {seoTitleLen}/{SEO_TITLE_MAX}
                </span>
              </div>
              <Input
                id="seo-title"
                value={form.seoTitle}
                onChange={(e) => update("seoTitle", e.target.value.slice(0, SEO_TITLE_MAX + 20))}
                placeholder={form.name || "Page title for search engines"}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="seo-desc">SEO description</Label>
                <span
                  className={cn(
                    "text-xs",
                    seoDescLen > SEO_DESC_MAX ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {seoDescLen}/{SEO_DESC_MAX}
                </span>
              </div>
              <Textarea
                id="seo-desc"
                value={form.seoDescription}
                onChange={(e) => update("seoDescription", e.target.value.slice(0, SEO_DESC_MAX + 40))}
                placeholder="A short, compelling description shown in search results."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo-kw">SEO keywords</Label>
              <Input
                id="seo-kw"
                value={form.seoKeywords}
                onChange={(e) => update("seoKeywords", e.target.value)}
                placeholder="brand kit, logo, identity, figma"
              />
              <p className="text-xs text-muted-foreground">Comma-separated.</p>
            </div>

            {/* Live preview */}
            <div className="rounded-xl border border-white/5 bg-background/40 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Search result preview
              </p>
              <p className="text-sm text-primary">
                {form.seoTitle || form.name || "Your page title"}
              </p>
              <p className="text-xs text-emerald-600/80">
                branify.store › products › {form.slug || "your-slug"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {form.seoDescription ||
                  form.shortDescription ||
                  "Your meta description will appear here."}
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p>
                Leave SEO fields blank to fall back to the product name and short description.
                Staying within the character limits improves click-through from search results.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function DynamicList({
  title,
  description,
  items,
  placeholder,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  description: string;
  items: string[];
  placeholder: string;
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Card className="flex flex-col gap-4 border-white/5 bg-card/40 p-6 backdrop-blur">
      <div>
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-3 py-6 text-center text-xs text-muted-foreground/60">
            No {title.toLowerCase()} yet. Add one to get started.
          </p>
        )}
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Input
              value={item}
              onChange={(e) => onUpdate(i, e.target.value)}
              placeholder={placeholder}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(i)}
              className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={onAdd}
        className="w-fit border-white/10 bg-transparent text-muted-foreground hover:text-foreground"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add {title.toLowerCase().replace(/s$/, "")}
      </Button>
    </Card>
  );
}
