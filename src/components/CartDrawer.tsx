"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { copy } from "@/config/copy.id";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalCount,
    subtotal,
  } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.cart.title}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-bg shadow-xl flex flex-col border-l border-border animate-in slide-in-from-right duration-200"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-ink">
              {copy.cart.title} ({totalCount})
            </h2>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Tutup keranjang"
              className="p-2 text-inkMuted hover:text-ink hover:bg-surface rounded-theme transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <p className="font-display font-medium text-base text-ink mb-1">
                  {copy.cart.emptyTitle}
                </p>
                <p className="text-sm text-inkMuted mb-6 max-w-xs">
                  {copy.cart.emptyDesc}
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-colors min-h-[44px]"
                >
                  {copy.cart.browseButton}
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border" role="list">
                {items.map((item) => (
                  <li key={item.variantId} className="py-4 flex gap-4">
                    {item.imageUrl ? (
                      <div className="relative w-20 h-24 bg-surface rounded-theme overflow-hidden shrink-0 border border-border">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-24 bg-surfaceStrong rounded-theme shrink-0 flex items-center justify-center text-xs text-inkMuted border border-border">
                        Foto
                      </div>
                    )}

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-display font-semibold text-sm text-ink">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            aria-label={`${copy.cart.removeItem} ${item.name}`}
                            className="p-1 text-inkMuted hover:text-primary transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-inkMuted mt-0.5">
                          Ukuran: {item.variantLabel}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
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
                          <span className="px-2 text-xs font-semibold text-ink min-w-[24px] text-center">
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

                        <span className="font-semibold text-sm text-ink">
                          Rp {(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer with subtotal and checkout link */}
          {items.length > 0 && (
            <div className="p-5 border-t border-border bg-surface/50 space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-inkMuted font-medium">
                  {copy.cart.subtotal}
                </span>
                <span className="font-display font-bold text-lg text-ink">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-xs text-inkMuted leading-tight">
                Ongkos kirim dihitung berdasarkan area pada langkah checkout.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center px-4 py-3 border border-border bg-bg hover:bg-surface text-ink font-semibold text-sm rounded-theme transition-colors min-h-[44px]"
                >
                  Buka Keranjang
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-onPrimary hover:bg-primaryHover font-semibold text-sm rounded-theme transition-colors shadow-sm min-h-[44px]"
                >
                  <span>{copy.cart.checkoutButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
