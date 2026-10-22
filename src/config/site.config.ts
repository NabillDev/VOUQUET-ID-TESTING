import { z } from "zod";

const deliveryAreaSchema = z.object({
  name: z.string().min(1, "Nama area wajib diisi"),
  fee: z.number().nonnegative("Ongkos kirim tidak boleh negatif"),
});

const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const hexColorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Warna harus berupa format hex yang valid");

export const siteConfigSchema = z.object({
  store: z.object({
    name: z.string().min(1, "Nama toko wajib diisi"),
    shortName: z.string().min(1, "Nama pendek toko wajib diisi"),
    tagline: z.string(),
    description: z.string(),
    domain: z.string().min(1),
    locale: z.string().min(1),
    currency: z.string().min(1),
    logo: z.string().nullable(),
  }),
  contact: z.object({
    whatsapp: z.string().regex(/^\d{9,15}$/, "Nomor WhatsApp harus berupa angka internasional 9-15 digit (contoh: 6281234567890)"),
    email: z.string(),
    instagram: z.string(),
    address: z.string(),
    city: z.string(),
    openingHours: z.string(),
  }),
  order: z.object({
    whatsappMessageTemplate: z.string().min(1),
    minLeadTimeHours: z.number().nonnegative(),
    deliverySlots: z.array(z.string()).min(1),
    deliveryAreas: z.array(deliveryAreaSchema).min(1),
    orderCodePrefix: z.string().min(1),
  }),
  theme: z.object({
    colors: z.object({
      bg: hexColorSchema,
      surface: hexColorSchema,
      surfaceStrong: hexColorSchema,
      border: hexColorSchema,
      primary: hexColorSchema,
      primaryHover: hexColorSchema,
      onPrimary: hexColorSchema,
      accentSoft: hexColorSchema,
      ink: hexColorSchema,
      inkMuted: hexColorSchema,
    }),
    fonts: z.object({
      display: z.string(),
      body: z.string(),
    }),
    radius: z.string(),
  }),
  nav: z.array(navItemSchema),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

export const siteConfig: SiteConfig = {
  store: {
    name: "VOUQUET.ID",
    shortName: "VOUQUET",
    tagline: "Buket Bunga Segar & Rangkaian Hadiah Personal",
    description: "Toko buket bunga segar dan hadiah untuk ulang tahun, wisuda, dan momen berharga lainnya.",
    domain: "vouquet.id",
    locale: "id-ID",
    currency: "IDR",
    logo: null,
  },
  contact: {
    whatsapp: "62895616018766",
    email: "halo@vouquet.id",
    instagram: "sadamdlyy",
    address: "Jl. Bunga Melati No. 18, Rawa Lumbu",
    city: "Bekasi",
    openingHours: "Setiap Hari: 08.00 - 18.00 WIB",
  },
  order: {
    whatsappMessageTemplate:
      "Halo {storeName}, saya mau pesan:\n{items}\n\nTotal: {total}\nPenerima: {recipientName}\nAlamat: {address}\nTanggal kirim: {deliveryDate} ({deliverySlot})\nKartu ucapan: {cardMessage}\nCatatan: {notes}\n\nKode pesanan: {orderCode}",
    minLeadTimeHours: 3,
    deliverySlots: ["09:00-12:00", "12:00-15:00", "15:00-18:00"],
    deliveryAreas: [
      { name: "Bekasi Barat & Timur", fee: 0 },
      { name: "Bekasi Selatan & Utara", fee: 15000 },
      { name: "Jakarta Timur & Selatan", fee: 25000 },
      { name: "Jakarta Pusat, Barat & Utara", fee: 35000 },
      { name: "Depok", fee: 30000 },
      { name: "Tangerang", fee: 40000 },
    ],
    orderCodePrefix: "VQ",
  },
  theme: {
    colors: {
      bg: "#FFFFFF",
      surface: "#FFF5F8",
      surfaceStrong: "#FDE4EC",
      border: "#F3C9D6",
      primary: "#C2336B",
      primaryHover: "#A82A5B",
      onPrimary: "#FFFFFF",
      accentSoft: "#F7A8C0",
      ink: "#3B1D2A",
      inkMuted: "#7A5565",
    },
    fonts: {
      display: "Fraunces",
      body: "DM Sans",
    },
    radius: "14px",
  },
  nav: [
    { label: "Beranda", href: "/" },
    { label: "Katalog", href: "/shop" },
    { label: "Cara Pesan", href: "/#cara-pesan" },
    { label: "Kontak", href: "/#kontak" },
  ],
};

// Validates the configuration at startup and fails fast in development
export function getSiteConfig(): SiteConfig {
  const parsed = siteConfigSchema.safeParse(siteConfig);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`[siteConfig Validation Error]\n${errorDetails}`);
  }
  return parsed.data;
}
