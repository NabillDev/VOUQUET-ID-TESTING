"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, AlertCircle, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getSiteConfig } from "@/config/site.config";
import { copy } from "@/config/copy.id";
import { processCheckoutAction } from "@/app/actions/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const config = getSiteConfig();
  const { items, subtotal, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();

  // Form State
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerPhone: "",
    recipientName: "",
    recipientPhone: "",
    address: "",
    area: config.order.deliveryAreas[0]?.name || "",
    deliveryDate: new Date().toISOString().slice(0, 10),
    deliverySlot: config.order.deliverySlots[0] || "",
    cardMessage: "",
    notes: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Selected area fee calculation
  const selectedAreaFee = useMemo(() => {
    const found = config.order.deliveryAreas.find(
      (a) => a.name === formData.area
    );
    return found ? found.fee : 0;
  }, [formData.area, config.order.deliveryAreas]);

  const grandTotal = subtotal + selectedAreaFee;

  // Minimum date for delivery (today's date)
  const todayDateString = useMemo(() => {
    return new Date().toISOString().slice(0, 10);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (items.length === 0) {
      setServerError("Keranjang belanja Anda masih kosong.");
      return;
    }

    // Client-side quick validation
    const errors: Record<string, string> = {};
    if (!formData.buyerName.trim()) errors.buyerName = "Nama pemesan wajib diisi.";
    if (!formData.buyerPhone.trim()) errors.buyerPhone = "Nomor WhatsApp pemesan wajib diisi.";
    if (!formData.recipientName.trim()) errors.recipientName = "Nama penerima wajib diisi.";
    if (!formData.recipientPhone.trim()) errors.recipientPhone = "Nomor telepon penerima wajib diisi.";
    if (!formData.address.trim()) errors.address = "Alamat lengkap pengiriman wajib diisi.";
    if (!formData.area) errors.area = "Pilih area pengiriman.";
    if (!formData.deliveryDate) errors.deliveryDate = "Pilih tanggal pengiriman.";
    if (!formData.deliverySlot) errors.deliverySlot = "Pilih waktu pengiriman.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    startTransition(async () => {
      const payload = {
        ...formData,
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const result = await processCheckoutAction(payload);

      if (!result.success) {
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setServerError(result.error || "Gagal memproses pesanan.");
        return;
      }

      // Order created successfully
      clearCart();

      // Attempt automatic redirect to WhatsApp, while forwarding to order confirmation
      if (result.whatsappUrl && result.orderCode) {
        // Open WhatsApp in current or new window
        window.location.href = result.whatsappUrl;
        // Also fallback navigate to confirmation page
        setTimeout(() => {
          router.push(`/order/${result.orderCode}`);
        }, 600);
      } else if (result.orderCode) {
        router.push(`/order/${result.orderCode}`);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-surfaceStrong border border-border flex items-center justify-center text-primary">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="font-display font-bold text-2xl text-ink">
          {copy.cart.emptyTitle}
        </h1>
        <p className="text-sm text-inkMuted">
          Tambahkan buket bunga ke keranjang terlebih dahulu sebelum melanjutkan ke checkout.
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
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkMuted hover:text-primary transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{copy.checkout.backToCart}</span>
        </Link>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink tracking-tight">
          {copy.checkout.title}
        </h1>
        <p className="text-sm text-inkMuted mt-1">
          {copy.checkout.subtitle}
        </p>
      </div>

      {serverError && (
        <div className="p-4 bg-surfaceStrong border border-primary/30 rounded-theme flex items-start gap-3 text-sm text-ink">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Fields: Left Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Buyer Information */}
          <div className="p-5 sm:p-6 bg-surface/50 border border-border rounded-theme space-y-4">
            <h2 className="font-display font-semibold text-lg text-ink">
              {copy.checkout.buyerSection}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="buyerName" className="block text-xs font-semibold text-ink">
                  {copy.checkout.buyerName} <span className="text-primary">*</span>
                </label>
                <input
                  id="buyerName"
                  name="buyerName"
                  type="text"
                  required
                  placeholder={copy.checkout.buyerNamePlaceholder}
                  value={formData.buyerName}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-bg border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] ${
                    fieldErrors.buyerName ? "border-primary" : "border-border"
                  }`}
                />
                {fieldErrors.buyerName && (
                  <p className="text-xs text-primary">{fieldErrors.buyerName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="buyerPhone" className="block text-xs font-semibold text-ink">
                  {copy.checkout.buyerPhone} <span className="text-primary">*</span>
                </label>
                <input
                  id="buyerPhone"
                  name="buyerPhone"
                  type="tel"
                  required
                  placeholder={copy.checkout.buyerPhonePlaceholder}
                  value={formData.buyerPhone}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-bg border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] ${
                    fieldErrors.buyerPhone ? "border-primary" : "border-border"
                  }`}
                />
                {fieldErrors.buyerPhone && (
                  <p className="text-xs text-primary">{fieldErrors.buyerPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Recipient Information */}
          <div className="p-5 sm:p-6 bg-surface/50 border border-border rounded-theme space-y-4">
            <h2 className="font-display font-semibold text-lg text-ink">
              {copy.checkout.recipientSection}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="recipientName" className="block text-xs font-semibold text-ink">
                  {copy.checkout.recipientName} <span className="text-primary">*</span>
                </label>
                <input
                  id="recipientName"
                  name="recipientName"
                  type="text"
                  required
                  placeholder={copy.checkout.recipientNamePlaceholder}
                  value={formData.recipientName}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-bg border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] ${
                    fieldErrors.recipientName ? "border-primary" : "border-border"
                  }`}
                />
                {fieldErrors.recipientName && (
                  <p className="text-xs text-primary">{fieldErrors.recipientName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="recipientPhone" className="block text-xs font-semibold text-ink">
                  {copy.checkout.recipientPhone} <span className="text-primary">*</span>
                </label>
                <input
                  id="recipientPhone"
                  name="recipientPhone"
                  type="tel"
                  required
                  placeholder={copy.checkout.recipientPhonePlaceholder}
                  value={formData.recipientPhone}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-bg border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] ${
                    fieldErrors.recipientPhone ? "border-primary" : "border-border"
                  }`}
                />
                {fieldErrors.recipientPhone && (
                  <p className="text-xs text-primary">{fieldErrors.recipientPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* 3. Delivery Schedule & Address */}
          <div className="p-5 sm:p-6 bg-surface/50 border border-border rounded-theme space-y-4">
            <h2 className="font-display font-semibold text-lg text-ink">
              {copy.checkout.deliverySection}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="deliveryDate" className="block text-xs font-semibold text-ink">
                  {copy.checkout.date} <span className="text-primary">*</span>
                </label>
                <input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  min={todayDateString}
                  required
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-bg border rounded-theme text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] ${
                    fieldErrors.deliveryDate ? "border-primary" : "border-border"
                  }`}
                />
                {fieldErrors.deliveryDate && (
                  <p className="text-xs text-primary">{fieldErrors.deliveryDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="deliverySlot" className="block text-xs font-semibold text-ink">
                  {copy.checkout.slot} <span className="text-primary">*</span>
                </label>
                <select
                  id="deliverySlot"
                  name="deliverySlot"
                  required
                  value={formData.deliverySlot}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                >
                  {config.order.deliverySlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} WIB
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="area" className="block text-xs font-semibold text-ink">
                {copy.checkout.area} <span className="text-primary">*</span>
              </label>
              <select
                id="area"
                name="area"
                required
                value={formData.area}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              >
                {config.order.deliveryAreas.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name} - {area.fee === 0 ? "Gratis Ongkir" : `Rp ${area.fee.toLocaleString("id-ID")}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="address" className="block text-xs font-semibold text-ink">
                {copy.checkout.address} <span className="text-primary">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                placeholder={copy.checkout.addressPlaceholder}
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 bg-bg border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary ${
                  fieldErrors.address ? "border-primary" : "border-border"
                }`}
              />
              {fieldErrors.address && (
                <p className="text-xs text-primary">{fieldErrors.address}</p>
              )}
            </div>
          </div>

          {/* 4. Greeting Card Message & Special Notes */}
          <div className="p-5 sm:p-6 bg-surface/50 border border-border rounded-theme space-y-4">
            <h2 className="font-display font-semibold text-lg text-ink">
              {copy.checkout.messageSection}
            </h2>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="cardMessage" className="block text-xs font-semibold text-ink">
                  {copy.checkout.cardMessage}
                </label>
                <span className="text-xs text-inkMuted">
                  {formData.cardMessage.length} / 250
                </span>
              </div>
              <textarea
                id="cardMessage"
                name="cardMessage"
                maxLength={250}
                rows={3}
                placeholder={copy.checkout.cardMessagePlaceholder}
                value={formData.cardMessage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-inkMuted">
                Gratis kartu ucapan eksklusif dicetak dan disematkan di dalam buket bunga Anda.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="notes" className="block text-xs font-semibold text-ink">
                {copy.checkout.notes}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                maxLength={500}
                placeholder={copy.checkout.notesPlaceholder}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Order Summary: Right Column */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-theme p-5 sm:p-6 space-y-6 sticky top-24">
          <h2 className="font-display font-semibold text-lg text-ink">
            {copy.checkout.orderSummary}
          </h2>

          {/* List of items in checkout summary */}
          <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-border">
            {items.map((item) => (
              <div key={item.variantId} className="pt-2 first:pt-0 flex justify-between text-xs">
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-inkMuted">
                    {item.variantLabel} &times; {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-ink">
                  Rp {(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink">
              <span className="text-inkMuted">Subtotal Produk</span>
              <span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-ink">
              <span className="text-inkMuted">{copy.checkout.deliveryFee}</span>
              <span className="font-medium">
                {selectedAreaFee === 0
                  ? copy.checkout.freeDelivery
                  : `Rp ${selectedAreaFee.toLocaleString("id-ID")}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-ink border-t border-border pt-3">
              <span>{copy.checkout.total}</span>
              <span className="font-display text-primary text-xl">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Submit button */}
          <div className="border-t border-border pt-4 space-y-3">
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-all min-h-[44px] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span>{copy.checkout.submitting}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{copy.checkout.submitButton}</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-inkMuted text-center leading-relaxed">
              Setelah menekan tombol ini, rincian pesanan Anda akan otomatis terbuka di aplikasi WhatsApp untuk konfirmasi dan pembayaran.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
