"use server";

import { orderCheckoutInputSchema } from "@/lib/validations";
import { createOrder } from "@/lib/data/orders";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { getSiteConfig } from "@/config/site.config";

export interface CheckoutResult {
  success: boolean;
  orderCode?: string;
  whatsappUrl?: string;
  error?: string;
  errors?: Record<string, string>;
}

export async function processCheckoutAction(
  data: unknown
): Promise<CheckoutResult> {
  try {
    const config = getSiteConfig();

    // 1. Zod schema validation
    const parsed = orderCheckoutInputSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString() || "form";
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      return {
        success: false,
        error: "Mohon periksa kembali isian formulir pemesanan Anda.",
        errors: fieldErrors,
      };
    }

    const input = parsed.data;

    // 2. Lead time validation
    const requestedDate = new Date(input.deliveryDate);
    const now = new Date();
    // Normalize to date comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const deliveryDay = new Date(
      requestedDate.getFullYear(),
      requestedDate.getMonth(),
      requestedDate.getDate()
    );

    if (deliveryDay < today) {
      return {
        success: false,
        error: "Tanggal pengiriman tidak boleh di masa lampau.",
        errors: { deliveryDate: "Pilih tanggal pengiriman hari ini atau yang akan datang." },
      };
    }

    // 3. Create Order via Data-Access Layer (re-fetches DB prices and creates snapshots)
    const order = await createOrder(input);

    // 4. Generate WhatsApp handoff URL
    const whatsappUrl = getWhatsAppOrderUrl(order);

    return {
      success: true,
      orderCode: order.code,
      whatsappUrl,
    };
  } catch (err: any) {
    console.error("Checkout action error:", err);
    return {
      success: false,
      error:
        err.message ||
        "Terjadi kesalahan saat memproses pesanan Anda. Silakan coba lagi.",
    };
  }
}
