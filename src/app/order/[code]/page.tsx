import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { getOrderByCode } from "@/lib/data/orders";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { copy } from "@/config/copy.id";
import { isAuthenticated, verifyOrderAccessToken } from "@/lib/auth";
import { OrderVerificationForm } from "@/components/OrderVerificationForm";

interface OrderConfirmationPageProps {
  params: {
    code: string;
  };
  searchParams: {
    token?: string;
  };
}

export const metadata = {
  title: "Konfirmasi Pesanan",
};

function maskPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length < 8) return "08***";
  return clean.slice(0, 4) + "-****-" + clean.slice(-4);
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const order = await getOrderByCode(params.code);

  if (!order) {
    notFound();
  }

  const isAdmin = await isAuthenticated();
  const isTokenValid = verifyOrderAccessToken(
    order.code,
    order.id,
    searchParams.token
  );
  const isAuthorized = isAdmin || isTokenValid;

  const whatsappUrl = getWhatsAppOrderUrl(order);

  const statusLabels: Record<string, string> = {
    NEW: copy.orderConfirmation.statusNew,
    CONFIRMED: copy.orderConfirmation.statusConfirmed,
    PAID: copy.orderConfirmation.statusPaid,
    DELIVERED: copy.orderConfirmation.statusDelivered,
    CANCELLED: copy.orderConfirmation.statusCancelled,
  };

  const formattedDate = new Date(order.deliveryDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      {/* Success Badge & Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-surfaceStrong border border-border flex items-center justify-center text-primary">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
          {copy.orderConfirmation.title}
        </h1>
        <p className="text-sm text-inkMuted max-w-md mx-auto">
          {copy.orderConfirmation.subtitle}
        </p>
      </div>

      {/* Verification Widget if accessed without valid token */}
      {!isAuthorized && <OrderVerificationForm orderCode={order.code} />}

      {/* Main Order Details Card */}
      <div className="bg-surface border border-border rounded-theme p-6 sm:p-8 space-y-6">
        {/* Order Code & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="text-xs text-inkMuted font-medium block">
              {copy.orderConfirmation.orderCode}
            </span>
            <span className="font-mono font-bold text-xl text-primary tracking-wide">
              {order.code}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthorized && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-surfaceStrong border border-border rounded-full text-[11px] font-semibold text-primary">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Terverifikasi</span>
              </span>
            )}
            <div className="px-3 py-1 bg-surfaceStrong border border-border rounded-full text-xs font-semibold text-ink">
              {statusLabels[order.status] || order.status}
            </div>
          </div>
        </div>

        {/* WhatsApp Reopen Button (shown when authorized) */}
        {isAuthorized && (
          <div className="space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-all min-h-[44px] shadow-sm"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <span>{copy.orderConfirmation.reopenWhatsapp}</span>
            </a>
            <p className="text-[11px] text-inkMuted text-center">
              Klik tombol di atas jika pesan WhatsApp belum terbuka secara otomatis.
            </p>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h2 className="font-display font-semibold text-sm text-ink">
            {copy.orderConfirmation.itemsTitle}
          </h2>
          <div className="divide-y divide-border border border-border rounded-theme bg-bg overflow-hidden">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-semibold text-ink">{item.productName}</span>
                  <span className="text-inkMuted block">
                    {item.variantLabel} &times; {item.quantity}
                  </span>
                </div>
                <span className="font-semibold text-ink">
                  Rp {(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="space-y-3 pt-2 text-xs text-ink">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-sm text-ink">
              {copy.orderConfirmation.deliveryDetails}
            </h2>
            {!isAuthorized && (
              <span className="text-[11px] font-semibold text-primary">
                Sebagian data disamarkan
              </span>
            )}
          </div>

          <div className="space-y-2 bg-bg border border-border rounded-theme p-4">
            <p>
              <strong className="text-inkMuted">Penerima:</strong>{" "}
              {order.recipientName}{" "}
              <span className="text-inkMuted">
                ({isAuthorized ? order.recipientPhone : maskPhone(order.recipientPhone)})
              </span>
            </p>
            <p>
              <strong className="text-inkMuted">Waktu Pengiriman:</strong>{" "}
              {formattedDate} ({order.deliverySlot} WIB)
            </p>
            <p>
              <strong className="text-inkMuted">Alamat:</strong>{" "}
              {isAuthorized ? (
                `${order.address} (${order.area})`
              ) : (
                <span className="italic text-inkMuted">
                  Alamat lengkap disamarkan ({order.area})
                </span>
              )}
            </p>

            {isAuthorized ? (
              order.cardMessage && (
                <p className="pt-2 border-t border-border">
                  <strong className="text-inkMuted">Kartu Ucapan:</strong> &ldquo;{order.cardMessage}&rdquo;
                </p>
              )
            ) : (
              <p className="pt-2 border-t border-border text-inkMuted italic">
                Pesan kartu ucapan dirahasiakan demi privasi pemesan.
              </p>
            )}

            {isAuthorized && order.notes && (
              <p className="pt-2 border-t border-border">
                <strong className="text-inkMuted">Catatan Khusus:</strong> {order.notes}
              </p>
            )}
          </div>
        </div>

        {/* Total Summary */}
        <div className="border-t border-border pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-ink">
            <span className="text-inkMuted">Subtotal</span>
            <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-ink">
            <span className="text-inkMuted">Biaya Pengiriman</span>
            <span>
              {order.deliveryFee === 0
                ? "Gratis"
                : `Rp ${order.deliveryFee.toLocaleString("id-ID")}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-ink border-t border-border pt-2">
            <span>Total Pembayaran</span>
            <span className="font-display text-primary text-lg">
              Rp {order.total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkMuted hover:text-primary transition-colors min-h-[44px] px-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{copy.orderConfirmation.backHome}</span>
        </Link>
      </div>
    </div>
  );
}