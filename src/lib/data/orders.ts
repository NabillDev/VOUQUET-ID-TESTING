import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/config/site.config";
import type { OrderCheckoutInput } from "@/lib/validations";

export function generateOrderCode(prefix = "VQ"): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix}-${dateStr}-${randomStr}`;
}

export async function createOrder(input: OrderCheckoutInput) {
  const config = getSiteConfig();

  // 1. Re-verify prices directly from database to prevent client tampering
  const variantIds = input.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: variantIds },
      isActive: true,
      product: { isActive: true },
    },
    include: { product: true },
  });

  if (variants.length !== input.items.length) {
    throw new Error("Beberapa produk di keranjang Anda sudah tidak tersedia atau tidak aktif.");
  }

  // 2. Compute verified subtotal and build snapshot line items
  let subtotal = 0;
  const snapshotItems = input.items.map((cartItem) => {
    const variant = variants.find((v) => v.id === cartItem.variantId);
    if (!variant) {
      throw new Error(`Varian tidak ditemukan: ${cartItem.variantId}`);
    }
    const itemTotal = variant.price * cartItem.quantity;
    subtotal += itemTotal;

    return {
      productName: variant.product.name,
      variantLabel: variant.label,
      unitPrice: variant.price,
      quantity: cartItem.quantity,
    };
  });

  // 3. Verify delivery fee from site config
  const areaConfig = config.order.deliveryAreas.find(
    (a) => a.name.toLowerCase() === input.area.toLowerCase()
  );
  const deliveryFee = areaConfig ? areaConfig.fee : 0;
  const total = subtotal + deliveryFee;

  // 4. Generate unique order code
  const code = generateOrderCode(config.order.orderCodePrefix);

  // 5. Store order in SQLite
  const order = await prisma.order.create({
    data: {
      code,
      buyerName: input.buyerName,
      buyerPhone: input.buyerPhone,
      recipientName: input.recipientName,
      recipientPhone: input.recipientPhone,
      address: input.address,
      area: input.area,
      deliveryDate: new Date(input.deliveryDate),
      deliverySlot: input.deliverySlot,
      cardMessage: input.cardMessage || null,
      notes: input.notes || null,
      subtotal,
      deliveryFee,
      total,
      status: "NEW",
      items: {
        create: snapshotItems,
      },
    },
    include: {
      items: true,
    },
  });

  return order;
}

export async function getOrderByCode(code: string) {
  return prisma.order.findUnique({
    where: { code },
    include: {
      items: true,
    },
  });
}

export async function getOrders(status?: string) {
  return prisma.order.findMany({
    where: status && status !== "ALL" ? { status } : undefined,
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}
