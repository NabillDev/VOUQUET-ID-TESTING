import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/config/site.config";
import { updateOrderStatusAction } from "@/app/actions/admin";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: "Detail Pesanan - Admin",
};

export default async function AdminOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect("/admin/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  const config = getSiteConfig();
  let buyerPhoneFormatted = order.buyerPhone.replace(/\D/g, "");
  if (buyerPhoneFormatted.startsWith("0")) {
    buyerPhoneFormatted = "62" + buyerPhoneFormatted.slice(1);
  }
  const chatText = encodeURIComponent(
    `Halo Kak ${order.buyerName}, kami dari ${config.store.name} terkait pesanan Anda ${order.code}.`
  );
  const waChatUrl = `https://wa.me/${buyerPhoneFormatted}?text=${chatText}`;

  const formattedDate = new Date(order.deliveryDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkMuted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Daftar Pesanan</span>
      </Link>

      <div className="bg-surface border border-border rounded-theme p-6 sm:p-8 space-y-6">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="text-xs text-inkMuted font-medium block">
              Kode Pesanan
            </span>
            <span className="font-mono font-bold text-2xl text-primary">
              {order.code}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={waChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-onPrimary font-semibold text-xs rounded-theme hover:bg-primaryHover transition-colors min-h-[40px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Pembeli di WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Status Update Form */}
        <div className="p-4 bg-bg border border-border rounded-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-ink block">
              Status Pesanan Saat Ini:
            </span>
            <span className="text-xs text-inkMuted">
              Ubah status untuk mencatat proses pesanan.
            </span>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server";
              const newStatus = formData.get("status") as string;
              if (newStatus) {
                await updateOrderStatusAction(order.id, newStatus);
              }
            }}
            className="flex items-center gap-2"
          >
            <select
              name="status"
              defaultValue={order.status}
              className="px-3 py-1.5 bg-surface border border-border rounded-theme text-xs font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[38px]"
            >
              <option value="NEW">Menunggu Konfirmasi</option>
              <option value="CONFIRMED">Terkonfirmasi</option>
              <option value="PAID">Lunas / Diproses</option>
              <option value="DELIVERED">Telah Terkirim</option>
              <option value="CANCELLED">Dibatalkan</option>
            </select>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-surfaceStrong border border-border hover:bg-border text-ink rounded-theme text-xs font-semibold transition-colors min-h-[38px]"
            >
              Perbarui
            </button>
          </form>
        </div>

        {/* Customer & Recipient Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-bg border border-border rounded-theme space-y-1.5 text-xs">
            <h3 className="font-semibold text-sm text-ink mb-1">
              Data Pemesan
            </h3>
            <p>
              <strong className="text-inkMuted">Nama:</strong> {order.buyerName}
            </p>
            <p>
              <strong className="text-inkMuted">WhatsApp:</strong> {order.buyerPhone}
            </p>
          </div>

          <div className="p-4 bg-bg border border-border rounded-theme space-y-1.5 text-xs">
            <h3 className="font-semibold text-sm text-ink mb-1">
              Data Penerima &amp; Jadwal
            </h3>
            <p>
              <strong className="text-inkMuted">Penerima:</strong> {order.recipientName} ({order.recipientPhone})
            </p>
            <p>
              <strong className="text-inkMuted">Tanggal:</strong> {formattedDate}
            </p>
            <p>
              <strong className="text-inkMuted">Slot:</strong> {order.deliverySlot} WIB
            </p>
            <p>
              <strong className="text-inkMuted">Area:</strong> {order.area}
            </p>
            <p>
              <strong className="text-inkMuted">Alamat:</strong> {order.address}
            </p>
          </div>
        </div>

        {/* Card Message & Notes */}
        {(order.cardMessage || order.notes) && (
          <div className="p-4 bg-bg border border-border rounded-theme space-y-3 text-xs">
            {order.cardMessage && (
              <div>
                <h4 className="font-semibold text-ink mb-1">Pesan Kartu Ucapan:</h4>
                <p className="p-2.5 bg-surface rounded border border-border italic text-ink">
                  &ldquo;{order.cardMessage}&rdquo;
                </p>
              </div>
            )}
            {order.notes && (
              <div>
                <h4 className="font-semibold text-ink mb-1">Catatan Tambahan:</h4>
                <p className="text-inkMuted">{order.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Ordered Items Table */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-ink">
            Rincian Item yang Dipesan
          </h3>
          <div className="border border-border rounded-theme bg-bg divide-y divide-border overflow-hidden">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 flex justify-between items-center text-xs"
              >
                <div>
                  <p className="font-semibold text-ink">{item.productName}</p>
                  <p className="text-inkMuted">
                    {item.variantLabel} &times; {item.quantity} (Rp {item.unitPrice.toLocaleString("id-ID")}/item)
                  </p>
                </div>
                <span className="font-semibold text-ink">
                  Rp {(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t border-border pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-ink">
            <span className="text-inkMuted">Subtotal Item</span>
            <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-ink">
            <span className="text-inkMuted">Ongkos Kirim ({order.area})</span>
            <span>
              {order.deliveryFee === 0
                ? "Gratis"
                : `Rp ${order.deliveryFee.toLocaleString("id-ID")}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-ink border-t border-border pt-3">
            <span>Total Akhir</span>
            <span className="font-display text-primary text-xl">
              Rp {order.total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
