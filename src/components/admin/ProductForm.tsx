"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import { createProductAction, updateProductAction } from "@/app/actions/admin";

interface Category {
  id: string;
  name: string;
}

interface ProductVariant {
  id?: string;
  label: string;
  price: number;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    categoryId: string;
    occasion: string | null;
    isActive: boolean;
    isFeatured: boolean;
    isSample: boolean;
    imageUrl?: string;
    variants: ProductVariant[];
  };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || ""
  );
  const [occasion, setOccasion] = useState(initialData?.occasion || "");
  const [isActive, setIsActive] = useState(initialData ? initialData.isActive : true);
  const [isFeatured, setIsFeatured] = useState(initialData ? initialData.isFeatured : false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "/images/bouquet-red-rose.svg");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const [variants, setVariants] = useState<ProductVariant[]>(
    initialData?.variants && initialData.variants.length > 0
      ? initialData.variants
      : [
          { label: "Standard", price: 185000 },
          { label: "Besar", price: 320000 },
        ]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!initialData) {
      // Auto-generate slug for new products
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { label: "Ukuran Baru", price: 150000 }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      setError("Produk harus memiliki minimal 1 varian.");
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: "label" | "price",
    value: string | number
  ) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }
    if (!slug.trim()) {
      setError("Slug produk wajib diisi.");
      return;
    }
    if (!description.trim()) {
      setError("Deskripsi produk wajib diisi.");
      return;
    }
    if (variants.length === 0) {
      setError("Sertakan minimal 1 varian produk.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      formData.append("occasion", occasion);
      formData.append("isActive", String(isActive));
      formData.append("isFeatured", String(isFeatured));
      formData.append("variantsJson", JSON.stringify(variants));

      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else {
        formData.append("imageUrl", imageUrl);
      }

      let res;
      if (initialData?.id) {
        formData.append("isSample", String(initialData.isSample));
        res = await updateProductAction(initialData.id, formData);
      } else {
        res = await createProductAction(formData);
      }

      if (res.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(res.error || "Gagal menyimpan produk.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-surfaceStrong border border-primary/30 rounded-theme flex items-start gap-2.5 text-xs text-ink">
          <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Product Info */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-theme p-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-semibold text-ink">
              Nama Produk <span className="text-primary">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="Contoh: Buket Mawar Merah Segar"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="slug" className="block text-xs font-semibold text-ink">
                Slug URL <span className="text-primary">*</span>
              </label>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="buket-mawar-merah-segar"
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="categoryId" className="block text-xs font-semibold text-ink">
                Kategori <span className="text-primary">*</span>
              </label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="occasion" className="block text-xs font-semibold text-ink">
              Momen / Acara (Opsional)
            </label>
            <input
              id="occasion"
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Contoh: birthday, graduation, anniversary, wedding"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-xs font-semibold text-ink">
              Deskripsi Produk <span className="text-primary">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan isi rangkaian bunga, jenis kertas pembungkus, dan warna pita..."
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Variants Manager */}
          <div className="border-t border-border pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-ink">
                  Varian Ukuran &amp; Harga
                </h3>
                <p className="text-xs text-inkMuted">
                  Setiap produk dapat memiliki beberapa pilihan ukuran dengan harga berbeda.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-surfaceStrong border border-border rounded-theme text-xs font-semibold text-ink hover:bg-border transition-colors min-h-[36px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Varian</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-bg border border-border rounded-theme"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Label Ukuran (misal: Small, Medium, 10 Tangkai)"
                      value={variant.label}
                      onChange={(e) =>
                        handleVariantChange(index, "label", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-surface border border-border rounded text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[38px]"
                    />
                  </div>
                  <div className="w-40">
                    <input
                      type="number"
                      placeholder="Harga (Rp)"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "price",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 bg-surface border border-border rounded text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[38px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    aria-label="Hapus varian"
                    className="p-2 text-inkMuted hover:text-primary transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Media & Visibility Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Photo Upload */}
          <div className="bg-surface border border-border rounded-theme p-5 space-y-4">
            <h3 className="font-semibold text-sm text-ink">Foto Produk (4:5)</h3>

            {imagePreview && (
              <div className="relative aspect-[4/5] rounded-theme overflow-hidden border border-border bg-bg">
                <Image
                  src={imagePreview}
                  alt="Preview foto buket"
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-ink">
                Unggah Berkas Foto Baru:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full text-xs text-inkMuted file:mr-3 file:py-2 file:px-3 file:rounded-theme file:border file:border-border file:text-xs file:font-semibold file:bg-bg file:text-ink hover:file:bg-surfaceStrong"
              />
              <p className="text-[11px] text-inkMuted">
                Format: JPG, PNG, WEBP, atau SVG. Rasio ideal 4:5.
              </p>
            </div>
          </div>

          {/* Visibility Options */}
          <div className="bg-surface border border-border rounded-theme p-5 space-y-4">
            <h3 className="font-semibold text-sm text-ink">Pengaturan Tampilan</h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="text-xs font-medium text-ink">
                Tampilkan di Toko (Aktif)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="text-xs font-medium text-ink">
                Jadikan Produk Pilihan di Beranda
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-colors min-h-[44px] shadow-sm disabled:opacity-60"
            >
              {isPending ? "Menyimpan Produk..." : "Simpan Produk"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="w-full py-2.5 border border-border bg-bg text-ink font-semibold text-xs rounded-theme hover:bg-surface transition-colors min-h-[40px]"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
