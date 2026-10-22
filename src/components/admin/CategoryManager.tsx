"use client";

import { useState, useTransition } from "react";
import { Plus, Edit3, Trash2, AlertCircle } from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/admin";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  _count?: {
    products: number;
  };
}

interface CategoryManagerProps {
  initialCategories: CategoryRecord[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State for create / edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleStartEdit = (cat: CategoryRecord) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setSortOrder(cat.sortOrder);
    setError(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setSortOrder(0);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama kategori wajib diisi.");
      return;
    }
    if (!slug.trim()) {
      setError("Slug kategori wajib diisi.");
      return;
    }

    startTransition(async () => {
      const payload = { name, slug, sortOrder: Number(sortOrder) || 0 };

      if (editingId) {
        const res = await updateCategoryAction(editingId, payload);
        if (res.success) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c))
          );
          handleCancel();
        } else {
          setError(res.error || "Gagal memperbarui kategori.");
        }
      } else {
        const res = await createCategoryAction(payload);
        if (res.success) {
          window.location.reload();
        } else {
          setError(res.error || "Gagal membuat kategori.");
        }
      }
    });
  };

  const handleDelete = (id: string, productCount = 0) => {
    if (productCount > 0) {
      setError(
        "Kategori ini masih memiliki produk. Pindahkan atau hapus produk terlebih dahulu."
      );
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        setError(res.error || "Gagal menghapus kategori.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Category List: 7 cols */}
      <div className="lg:col-span-7 space-y-4">
        <h2 className="font-display font-semibold text-lg text-ink">
          Daftar Kategori
        </h2>

        <div className="border border-border rounded-theme bg-bg overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border text-inkMuted font-semibold">
              <tr>
                <th className="py-3 px-4">Urutan</th>
                <th className="py-3 px-4">Nama &amp; Slug</th>
                <th className="py-3 px-4">Jumlah Produk</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-ink">
                    {cat.sortOrder}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-ink block">{cat.name}</span>
                    <span className="text-[11px] text-inkMuted font-mono">
                      /{cat.slug}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-inkMuted">
                    {cat._count?.products || 0} produk
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 text-inkMuted hover:text-ink transition-colors rounded-theme"
                      title="Ubah kategori"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(cat.id, cat._count?.products || 0)
                      }
                      className="p-1.5 text-inkMuted hover:text-primary transition-colors rounded-theme"
                      title="Hapus kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Form: 5 cols */}
      <div className="lg:col-span-5 bg-surface border border-border rounded-theme p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-ink">
          {editingId ? "Ubah Kategori" : "Tambah Kategori Baru"}
        </h2>

        {error && (
          <div className="p-3 bg-surfaceStrong border border-primary/30 rounded-theme flex items-start gap-2 text-xs text-ink">
            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="catName" className="block text-xs font-semibold text-ink">
              Nama Kategori <span className="text-primary">*</span>
            </label>
            <input
              id="catName"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Buket Bunga Meja"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="catSlug" className="block text-xs font-semibold text-ink">
              Slug URL <span className="text-primary">*</span>
            </label>
            <input
              id="catSlug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="buket-bunga-meja"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="catOrder" className="block text-xs font-semibold text-ink">
              Urutan Tampilan
            </label>
            <input
              id="catOrder"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
            <p className="text-[11px] text-inkMuted">
              Angka lebih kecil tampil lebih dulu di katalog.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-primary text-onPrimary font-semibold text-xs rounded-theme hover:bg-primaryHover transition-colors min-h-[42px] disabled:opacity-60 shadow-sm"
            >
              {isPending
                ? "Menyimpan..."
                : editingId
                ? "Perbarui Kategori"
                : "Tambah Kategori"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 border border-border bg-bg text-ink font-semibold text-xs rounded-theme hover:bg-surface min-h-[42px]"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
