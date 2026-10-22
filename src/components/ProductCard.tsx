import Link from "next/link";
import Image from "next/image";
import { copy } from "@/config/copy.id";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  isSample?: boolean;
  category?: {
    name: string;
  };
  images: Array<{
    url: string;
    alt: string;
  }>;
  variants: Array<{
    price: number;
    label: string;
  }>;
}

export function ProductCard({
  name,
  slug,
  isSample,
  category,
  images,
  variants,
}: ProductCardProps) {
  const lowestPrice =
    variants.length > 0
      ? Math.min(...variants.map((v) => v.price))
      : 0;
  const mainImage = images[0];

  return (
    <Link
      href={`/shop/${slug}`}
      className="group flex flex-col bg-bg border border-border rounded-theme overflow-hidden hover:border-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {/* 4:5 Aspect Ratio Image Container */}
      <div className="relative aspect-[4/5] bg-surface overflow-hidden border-b border-border">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-inkMuted bg-surfaceStrong">
            Foto Buket
          </div>
        )}

        {/* Sample Badge */}
        {isSample && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-surfaceStrong/90 border border-border text-[11px] font-bold text-inkMuted rounded-theme">
            {copy.common.sampleBadge}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {category && (
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block mb-1">
              {category.name}
            </span>
          )}
          <h3 className="font-display font-semibold text-base text-ink group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-inkMuted block">
              {copy.shop.startsFrom}
            </span>
            <span className="font-display font-bold text-base text-ink">
              Rp {lowestPrice.toLocaleString("id-ID")}
            </span>
          </div>
          <span className="text-xs font-semibold text-primary group-hover:underline">
            Lihat &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
