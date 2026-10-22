import { getSiteConfig } from "@/config/site.config";

export interface OrderWithItems {
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
  items: Array<{
    productName: string;
    variantLabel: string;
    unitPrice: number;
    quantity: number;
  }>;
}

export function buildWhatsAppOrderMessage(order: OrderWithItems): string {
  const config = getSiteConfig();
  const template = config.order.whatsappMessageTemplate;

  // Format line items
  const itemsText = order.items
    .map(
      (item) =>
        `- ${item.productName} (${item.variantLabel}) x${item.quantity}: Rp ${(
          item.unitPrice * item.quantity
        ).toLocaleString("id-ID")}`
    )
    .join("\n");

  // Format date
  const dateObj = new Date(order.deliveryDate);
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalText =
    order.deliveryFee > 0
      ? `Rp ${order.total.toLocaleString("id-ID")} (termasuk ongkir Rp ${order.deliveryFee.toLocaleString("id-ID")})`
      : `Rp ${order.total.toLocaleString("id-ID")} (Gratis ongkir)`;

  // Fill in placeholders
  let message = template
    .replace("{storeName}", config.store.name)
    .replace("{items}", itemsText)
    .replace("{total}", totalText)
    .replace("{recipientName}", `${order.recipientName} (${order.recipientPhone})`)
    .replace("{address}", `${order.address} - Area: ${order.area}`)
    .replace("{deliveryDate}", formattedDate)
    .replace("{deliverySlot}", order.deliverySlot)
    .replace("{cardMessage}", order.cardMessage?.trim() || "-")
    .replace("{notes}", order.notes?.trim() || "-")
    .replace("{orderCode}", order.code);

  return message;
}

export function getWhatsAppOrderUrl(order: OrderWithItems): string {
  const config = getSiteConfig();
  const message = buildWhatsAppOrderMessage(order);
  return `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
