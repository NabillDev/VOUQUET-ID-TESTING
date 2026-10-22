"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, Check, Clock, HeartHandshake, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { copy } from "@/config/copy.id";

export interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    isSample: boolean;
    category: {
      name: string;
      slug: string;
    };
    images: Array<{
      id: string;
      url: string;
      alt: string;
    }>;
    variants: Array<{
      id: string;
      label: string;
      price: number;
    }>;
  };
}

export function ProductPurchaseSection({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedNotice, setAddedNotice] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        variantId: selectedVariant.id,
        variantLabel: selectedVariant.label,
        unitPrice: selectedVariant.price,
        imageUrl: product.images[0]?.url,
      },
      quantity
    );

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const currentImage = product.images[activeImageIndex] || product.images[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* 1. Left Column: Image Gallery */}
      <div className="lg:col-span-6 space-y-4">
        <div className="relative aspect-[4/5] bg-surface rounded-theme overflow-hidden border border-border shadow-sm">
          {currentImage ? (
            <Image
              src={currentImage.url}
              alt={currentImage.alt || product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-inkMuted text-sm">
              Foto Buket
            </div>
          )}

          {product.isSample && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-surfaceStrong/90 border border-border text-xs font-bold text-inkMuted rounded-theme">
              {copy.common.sampleBadge}
            </span>
          )}
        </div>

        {/* Thumbnail Selector if multiple images */}
        {product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                aria-label={`Lihat foto ${i + 1}`}
                className={`relative w-20 aspect-[4/5] rounded-theme overflow-hidden border-2 transition-all shrink-0 ${
                  activeImageIndex === i
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-inkMuted"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Right Column: Details & Variant Selection */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
            {product.category.name}
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight">
            {product.name}
          </h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-display font-bold text-2xl sm:text-3xl text-ink">
              Rp {selectedVariant?.price.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-inkMuted font-medium">
              / {selectedVariant?.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-border pt-4">
          <p className="text-sm text-ink leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Variant Size Selector */}
        <div className="space-y-3 border-t border-border pt-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
            {copy.product.sizeLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`p-3 text-left rounded-theme border transition-all min-h-[44px] flex items-center justify-between ${
                    isSelected
                      ? "border-primary bg-surfaceStrong text-ink ring-1 ring-primary"
                      : "border-border bg-bg text-ink hover:bg-surface"
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold">{v.label}</p>
                    <p className="text-xs text-inkMuted font-mono">
                      Rp {v.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink">
              {copy.product.quantityLabel}
            </label>
            <div className="flex items-center border border-border rounded-theme bg-surface">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Kurangi jumlah"
                className="p-2 text-ink hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-semibold text-ink min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Tambah jumlah"
                className="p-2 text-ink hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-all min-h-[44px] shadow-sm active:scale-[0.99]"
          >
            {addedNotice ? (
              <>
                <Check className="w-4 h-4" />
                <span>Buket Ditambahkan ke Keranjang</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{copy.product.addToCart}</span>
              </>
            )}
          </button>
        </div>

        {/* Delivery Info Block */}
        <div className="bg-surface border border-border rounded-theme p-4 space-y-3">
          <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-ink">
            {copy.product.deliveryInfoTitle}
          </h3>
          <ul className="space-y-2 text-xs text-inkMuted">
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <span>{copy.product.deliveryInfoLeadTime}</span>
            </li>
            <li className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <span>{copy.product.deliveryInfoCard}</span>
            </li>
            <li className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <span>{copy.product.deliveryInfoCourier}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
