"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { copy } from "@/config/copy.id";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalCount, subtotal } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight">
          {copy.cart.title}
        </h1>
        <p className="text-sm text-inkMuted mt-1">
          {totalCount} {copy.cart.unit} di dalam keranjang
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-theme bg-surface/50 p-8 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-surfaceStrong border border-border flex items-center justify-center text-primary">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-display font-semibold text-lg text-ink">
            {copy.cart.emptyTitle}
          </h2>
          <p className="text-sm text-inkMuted max-w-sm mx-auto">
            {copy.cart.emptyDesc}
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-colors min-h-[44px]"
            >
              {copy.cart.browseButton}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Cart Item List */}
          <div className="md:col-span-8 border border-border rounded-theme bg-bg divide-y divide-border overflow-hidden">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="p-4 sm:p-5 flex gap-4 sm:gap-6 items-center"
              >
                {item.imageUrl ? (
                  <div className="relative w-20 sm:w-24 aspect-[4/5] bg-surface rounded-theme overflow-hidden border border-border shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 sm:w-24 aspect-[4/5] bg-surfaceStrong rounded-theme border border-border shrink-0 flex items-center justify-center text-xs text-inkMuted">
                    Foto
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link
                        href={`/shop/${item.slug}`}
                        className="font-display font-semibold text-base text-ink hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-inkMuted mt-0.5">
                        Ukuran: {item.variantLabel}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      aria-label={`${copy.cart.removeItem} ${item.name}`}
                      className="p-1.5 text-inkMuted hover:text-primary transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border rounded-theme bg-surface">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        aria-label="Kurangi jumlah"
                        className="p-1.5 text-ink hover:text-primary transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-ink min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        aria-label="Tambah jumlah"
                        className="p-1.5 text-ink hover:text-primary transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-bold text-base text-ink block">
                        Rp {(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[11px] text-inkMuted block">
                          Rp {item.unitPrice.toLocaleString("id-ID")} / item
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal & Checkout Action */}
          <div className="md:col-span-4 bg-surface border border-border rounded-theme p-5 space-y-4 sticky top-24">
            <h2 className="font-display font-semibold text-lg text-ink">
              {copy.checkout.orderSummary}
            </h2>

            <div className="space-y-2 text-sm border-t border-border pt-3">
              <div className="flex justify-between text-ink">
                <span className="text-inkMuted">{copy.cart.subtotal}</span>
                <span className="font-semibold">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-xs text-inkMuted leading-relaxed">
                Biaya pengiriman akan dihitung otomatis saat Anda memilih area pengiriman di formulir checkout.
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-colors shadow-sm min-h-[44px]"
              >
                <span>{copy.cart.checkoutButton}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="text-center pt-1">
              <Link
                href="/shop"
                className="text-xs font-semibold text-ink hover:text-primary transition-colors"
              >
                &larr; Lanjut Pilih Bunga Lainnya
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
