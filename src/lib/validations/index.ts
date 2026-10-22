import { z } from "zod";

export const variantInputSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label varian ukuran wajib diisi"),
  price: z.number().int().positive("Harga harus berupa bilangan bulat positif"),
  isActive: z.boolean().default(true),
});

export const imageInputSchema = z.object({
  url: z.string().min(1, "URL foto wajib diisi"),
  alt: z.string().min(1, "Deskripsi foto wajib diisi"),
  sortOrder: z.number().int().default(0),
});

export const productInputSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  slug: z.string().min(2, "Slug URL wajib diisi"),
  description: z.string().min(5, "Deskripsi produk minimal 5 karakter"),
  categoryId: z.string().min(1, "Kategori produk wajib dipilih"),
  occasion: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isSample: z.boolean().default(false),
  images: z.array(imageInputSchema).min(1, "Minimal sertakan 1 foto produk"),
  variants: z.array(variantInputSchema).min(1, "Minimal sertakan 1 varian ukuran"),
});

export const categoryInputSchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  slug: z.string().min(2, "Slug kategori wajib diisi"),
  sortOrder: z.number().int().default(0),
});

export const orderItemInputSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().positive("Jumlah minimal 1"),
});

export const orderCheckoutInputSchema = z.object({
  buyerName: z.string().min(2, "Nama pemesan minimal 2 karakter"),
  buyerPhone: z.string().regex(/^(\+62|62|08)[0-9]{8,13}$/, "Nomor WhatsApp tidak valid (contoh: 081234567890)"),
  recipientName: z.string().min(2, "Nama penerima minimal 2 karakter"),
  recipientPhone: z.string().regex(/^(\+62|62|08)[0-9]{8,13}$/, "Nomor telepon penerima tidak valid (contoh: 081234567890)"),
  address: z.string().min(5, "Alamat pengiriman minimal 5 karakter"),
  area: z.string().min(1, "Area pengiriman wajib dipilih"),
  deliveryDate: z.string().min(1, "Tanggal pengiriman wajib dipilih"),
  deliverySlot: z.string().min(1, "Waktu pengiriman wajib dipilih"),
  cardMessage: z.string().max(250, "Pesan kartu ucapan maksimal 250 karakter").optional().nullable(),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional().nullable(),
  items: z.array(orderItemInputSchema).min(1, "Keranjang belanja tidak boleh kosong"),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type VariantInput = z.infer<typeof variantInputSchema>;
export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type OrderCheckoutInput = z.infer<typeof orderCheckoutInputSchema>;
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
