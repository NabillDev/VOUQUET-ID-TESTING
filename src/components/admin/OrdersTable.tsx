"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MessageCircle, ExternalLink, RefreshCw } from "lucide-react";
import { updateOrderStatusAction } from "@/app/actions/admin";
import { getSiteConfig } from "@/config/site.config";
import { copy } from "@/config/copy.id";

interface OrderItem {
  id: string;
  productName: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
}

interface OrderRecord {
  id: string;
  code: string;
  buyerName: string;
  buyerPhone: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  area: string;
  deliveryDate: Date | string;
  deliverySlot: string;
  cardMessage?: string | null;
  notes?: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: Date | string;
  items: OrderItem[];
}

interface OrdersTableProps {
  initialOrders: OrderRecord[];
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const config = getSiteConfig();
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  const statusOptions = [
    { label: "Semua Status", value: "ALL" },
    { label: "Menunggu Konfirmasi", value: "NEW" },
    { label: "Terkonfirmasi", value: "CONFIRMED" },
    { label: "Lunas / Diproses", value: "PAID" },
    { label: "Telah Terkirim", value: "DELIVERED" },
    { label: "Dibatalkan", value: "CANCELLED" },
  ];

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    });
  };

  const cleanPhone = (phone: string) => {
    let p = phone.replace(/\D/g, "");
    if (p.startsWith("0")) p = "62" + p.slice(1);
    return p;
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilterStatus(opt.value)}
            className={`px-3.5 py-1.5 rounded-theme text-xs font-semibold transition-colors min-h-[36px] ${
              filterStatus === opt.value
                ? "bg-primary text-onPrimary shadow-sm"
                : "bg-surface border border-border text-ink hover:bg-surfaceStrong"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-theme bg-surface/40 p-6">
          <p className="font-semibold text-sm text-ink">
            Tidak ada pesanan dengan status ini.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-theme bg-bg overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border text-inkMuted font-semibold">
              <tr>
                <th className="py-3 px-4">Kode &amp; Waktu</th>
                <th className="py-3 px-4">Pemesan</th>
                <th className="py-3 px-4">Penerima &amp; Jadwal</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => {
                const buyerPhoneFormatted = cleanPhone(order.buyerPhone);
                const chatText = encodeURIComponent(
                  `Halo Kak ${order.buyerName}, kami dari ${config.store.name} terkait pesanan Anda dengan kode ${order.code}.`
                );
                const waChatUrl = `https://wa.me/${buyerPhoneFormatted}?text=${chatText}`;
                const orderDateStr = new Date(order.deliveryDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                });

                return (
                  <tr key={order.id} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-bold text-primary hover:underline block"
                      >
                        {order.code}
                      </Link>
                      <span className="text-[11px] text-inkMuted">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-ink block">
                        {order.buyerName}
                      </span>
                      <span className="text-[11px] text-inkMuted block">
                        {order.buyerPhone}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-ink block">
                        {order.recipientName}
                      </span>
                      <span className="text-[11px] text-inkMuted block">
                        {orderDateStr} ({order.deliverySlot})
                      </span>
                      <span className="text-[11px] text-inkMuted line-clamp-1">
                        {order.area}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-ink">
                      Rp {order.total.toLocaleString("id-ID")}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        disabled={isPending}
                        className="px-2 py-1 bg-surface border border-border rounded-theme text-xs font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[32px]"
                      >
                        <option value="NEW">Menunggu Konfirmasi</option>
                        <option value="CONFIRMED">Terkonfirmasi</option>
                        <option value="PAID">Lunas / Diproses</option>
                        <option value="DELIVERED">Telah Terkirim</option>
                        <option value="CANCELLED">Dibatalkan</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <a
                        href={waChatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-surfaceStrong border border-border hover:bg-border text-ink rounded-theme font-semibold transition-colors min-h-[32px]"
                        title={copy.admin.chatBuyer}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-primary" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-border hover:bg-surface text-ink rounded-theme font-semibold transition-colors min-h-[32px]"
                      >
                        <span>Detail</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
