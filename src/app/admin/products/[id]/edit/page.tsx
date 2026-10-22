import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { getProductById } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: "Ubah Produk - Admin",
};

export default async function AdminEditProductPage({
  params,
}: EditProductPageProps) {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect("/admin/login");
  }

  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.categoryId,
    occasion: product.occasion,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isSample: product.isSample,
    imageUrl: product.images[0]?.url,
    variants: product.variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: v.price,
    })),
  };

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
          Ubah Produk: {product.name}
        </h1>
        <p className="text-xs text-inkMuted mt-1">
          Perbarui informasi buket bunga, foto, atau sesuaikan varian harga.
        </p>
      </div>

      <ProductForm categories={categories} initialData={initialData} />
    </div>
  );
}
