import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { getProducts } from "@/lib/data/products";
import { deleteProductAction, toggleProductActiveAction } from "@/app/actions/admin";

export const metadata = {
  title: "Kelola Produk - Admin",
};

export default async function AdminProductsPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect("/admin/login");
  }

  // Fetch all products (including inactive)
  const products = await getProducts({ activeOnly: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            Kelola Produk
          </h1>
          <p className="text-xs text-inkMuted mt-1">
            Tambah buket baru, sesuaikan varian ukuran &amp; harga, atau perbarui status tampil.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-onPrimary font-semibold text-xs rounded-theme hover:bg-primaryHover transition-colors min-h-[44px] shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </Link>
      </div>

      <div className="border border-border rounded-theme bg-bg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface border-b border-border text-inkMuted font-semibold">
            <tr>
              <th className="py-3 px-4">Foto &amp; Nama Produk</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Varian &amp; Harga</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => {
              const mainImage = product.images[0];
              const priceRange =
                product.variants.length > 0
                  ? `Rp ${Math.min(...product.variants.map((v) => v.price)).toLocaleString("id-ID")}`
                  : "-";

              return (
                <tr key={product.id} className="hover:bg-surface/30 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded bg-surface border border-border overflow-hidden shrink-0">
                      {mainImage && (
                        <Image
                          src={mainImage.url}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink text-sm">
                          {product.name}
                        </span>
                        {product.isSample && (
                          <span className="px-1.5 py-0.5 bg-surfaceStrong border border-border text-[10px] font-bold text-ink rounded">
                            Sample
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-accentSoft/30 border border-primary/20 text-[10px] font-bold text-primary rounded">
                            Pilihan
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-inkMuted font-mono">
                        /{product.slug}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-ink">
                    {product.category?.name}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-ink block">
                      {priceRange}
                    </span>
                    <span className="text-[11px] text-inkMuted">
                      {product.variants.length} varian
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <form
                      action={async () => {
                        "use server";
                        await toggleProductActiveAction(product.id, !product.isActive);
                      }}
                    >
                      <button
                        type="submit"
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          product.isActive
                            ? "bg-surfaceStrong border border-primary/30 text-primary"
                            : "bg-surface border border-border text-inkMuted"
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </form>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-border rounded-theme font-semibold text-ink hover:bg-surface transition-colors min-h-[34px]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Ubah</span>
                    </Link>

                    <form
                      action={async () => {
                        "use server";
                        await deleteProductAction(product.id);
                      }}
                      className="inline-block"
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center p-1.5 text-inkMuted hover:text-primary transition-colors min-w-[34px] min-h-[34px] justify-center rounded-theme"
                        title="Hapus produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
