import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { copy } from "@/config/copy.id";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let categories: any[] = [];

  try {
    const [featured, cats] = await Promise.all([
      getFeaturedProducts(4),
      getCategories(),
    ]);
    featuredProducts = featured;
    categories = cats;
  } catch (err) {
    console.warn("HomePage: unable to query database, rendering fallback.");
  }

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* 1. Hero Section with Real Bouquet Photo Slot */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surfaceStrong border border-border rounded-full text-xs font-semibold text-ink">
              <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
              <span>{copy.hero.badge}</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight leading-[1.15]">
              {copy.hero.headline}
            </h1>

            <p className="text-base sm:text-lg text-inkMuted leading-relaxed max-w-xl">
              {copy.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-colors min-h-[44px] shadow-sm"
              >
                <span>{copy.hero.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#cara-pesan"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-border bg-surface text-ink font-semibold text-sm rounded-theme hover:bg-surfaceStrong transition-colors min-h-[44px]"
              >
                {copy.hero.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Hero Bouquet Photo Slot */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-theme overflow-hidden border border-border bg-surface shadow-md">
              <Image
                src="/images/bouquet-red-rose.svg"
                alt="Rangkaian buket bunga segar mawar merah"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-bg rounded-theme border border-border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ink">Buket Mawar Merah</p>
                  <p className="text-[11px] text-inkMuted">Dirangkai segar setiap pagi</p>
                </div>
                <Link
                  href="/shop/buket-mawar-merah-klasik"
                  className="text-xs font-semibold text-primary hover:underline px-2 py-1"
                >
                  Lihat Detail &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Bouquets Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink">
              {copy.featured.title}
            </h2>
            <p className="text-sm text-inkMuted mt-1">
              {copy.featured.subtitle}
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primaryHover transition-colors"
          >
            <span>{copy.featured.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
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
      </section>

      {/* 3. Category Quick Links */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-surface border border-border rounded-theme p-6 sm:p-8">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ink mb-6">
            {copy.categories.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="p-5 bg-bg border border-border rounded-theme hover:border-primary/50 transition-colors group flex flex-col justify-between min-h-[100px]"
              >
                <div>
                  <h3 className="font-display font-semibold text-base text-ink group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-inkMuted mt-1">
                    {cat._count.products} variasi buket
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary mt-3 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  Lihat kategori &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Cara Pesan (How to Order - 3 Honest Steps) */}
      <section id="cara-pesan" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            {copy.howToOrder.title}
          </h2>
          <p className="text-sm text-inkMuted mt-2">
            {copy.howToOrder.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface border border-border rounded-theme space-y-3">
            <div className="w-10 h-10 rounded-full bg-surfaceStrong border border-border flex items-center justify-center font-display font-bold text-ink">
              1
            </div>
            <h3 className="font-display font-semibold text-lg text-ink">
              {copy.howToOrder.step1Title}
            </h3>
            <p className="text-sm text-inkMuted leading-relaxed">
              {copy.howToOrder.step1Desc}
            </p>
          </div>

          <div className="p-6 bg-surface border border-border rounded-theme space-y-3">
            <div className="w-10 h-10 rounded-full bg-surfaceStrong border border-border flex items-center justify-center font-display font-bold text-ink">
              2
            </div>
            <h3 className="font-display font-semibold text-lg text-ink">
              {copy.howToOrder.step2Title}
            </h3>
            <p className="text-sm text-inkMuted leading-relaxed">
              {copy.howToOrder.step2Desc}
            </p>
          </div>

          <div className="p-6 bg-surface border border-border rounded-theme space-y-3">
            <div className="w-10 h-10 rounded-full bg-surfaceStrong border border-border flex items-center justify-center font-display font-bold text-ink">
              3
            </div>
            <h3 className="font-display font-semibold text-lg text-ink">
              {copy.howToOrder.step3Title}
            </h3>
            <p className="text-sm text-inkMuted leading-relaxed">
              {copy.howToOrder.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            {copy.faq.title}
          </h2>
          <p className="text-sm text-inkMuted mt-1">
            {copy.faq.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {copy.faq.items.map((item, index) => (
            <div
              key={index}
              className="p-5 bg-surface border border-border rounded-theme space-y-2"
            >
              <h3 className="font-display font-semibold text-base text-ink flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>{item.question}</span>
              </h3>
              <p className="text-sm text-inkMuted leading-relaxed pl-7">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
