import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductPurchaseSection } from "@/components/ProductPurchaseSection";
import { ProductCard } from "@/components/ProductCard";
import { copy } from "@/config/copy.id";
import { getSiteConfig } from "@/config/site.config";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: copy.product.notFound };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categoryId,
    3
  );

  const config = getSiteConfig();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0]?.url
      ? [`https://${config.store.domain}${product.images[0].url}`]
      : [],
    category: product.category.name,
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      price: v.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      name: v.label,
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-inkMuted">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {copy.nav.home}
            </Link>
          </li>
          <li aria-hidden="true">&rsaquo;</li>
          <li>
            <Link href="/shop" className="hover:text-primary transition-colors">
              {copy.nav.shop}
            </Link>
          </li>
          <li aria-hidden="true">&rsaquo;</li>
          <li>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">&rsaquo;</li>
          <li className="font-semibold text-ink line-clamp-1" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Showcase and Purchasing Details */}
      <ProductPurchaseSection product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-ink">
              {copy.product.relatedTitle}
            </h2>
            <Link
              href="/shop"
              className="text-xs font-semibold text-primary hover:underline"
            >
              {copy.featured.viewAll} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                isSample={p.isSample}
                category={p.category}
                images={p.images}
                variants={p.variants}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
