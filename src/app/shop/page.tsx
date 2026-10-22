import { Suspense } from "react";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";
import { copy } from "@/config/copy.id";

export const metadata = {
  title: "Katalog Buket Bunga",
  description: "Jelajahi berbagai pilihan buket bunga segar untuk wisuda, ulang tahun, anniversary, dan hadiah spesial.",
};

interface ShopPageProps {
  searchParams: {
    category?: string;
    occasion?: string;
    sort?: "newest" | "price-asc" | "price-desc";
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const categorySlug = searchParams.category;
  const occasion = searchParams.occasion;
  const sort = searchParams.sort || "newest";

  const [products, categories] = await Promise.all([
    getProducts({
      categorySlug,
      occasion,
      sort,
      activeOnly: true,
    }),
    getCategories(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight">
          {copy.shop.title}
        </h1>
        <p className="text-sm text-inkMuted mt-1.5 max-w-xl">
          {copy.shop.subtitle}
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <Suspense fallback={<div className="h-24 bg-surface rounded-theme animate-pulse" />}>
        <ShopFilters
          categories={categories}
          currentCategory={categorySlug}
          currentOccasion={occasion}
          currentSort={sort}
        />
      </Suspense>

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <div className="py-16 text-center border border-border rounded-theme bg-surface/50 p-8 space-y-4">
          <h2 className="font-display font-semibold text-lg text-ink">
            {copy.shop.emptyTitle}
          </h2>
          <p className="text-sm text-inkMuted max-w-sm mx-auto">
            {copy.shop.emptyDesc}
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-onPrimary font-semibold text-xs rounded-theme hover:bg-primaryHover transition-colors min-h-[44px]"
            >
              {copy.shop.resetFilter}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              isSample={product.isSample}
              category={product.category}
              images={product.images}
              variants={product.variants}
            />
          ))}
        </div>
      )}
    </div>
  );
}
