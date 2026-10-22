import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { getCategories } from "@/lib/data/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = {
  title: "Tambah Produk Baru - Admin",
};

export default async function AdminNewProductPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect("/admin/login");
  }

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkMuted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Daftar Produk</span>
      </Link>

      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
          Tambah Produk Baru
        </h1>
        <p className="text-xs text-inkMuted mt-1">
          Masukkan detail rangkaian bunga, foto, dan varian ukuran.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
