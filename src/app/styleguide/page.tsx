import { getSiteConfig } from "@/config/site.config";
import { copy } from "@/config/copy.id";

export const metadata = {
  title: "Styleguide - Design Tokens & Components",
};

export default function StyleguidePage() {
  const config = getSiteConfig();
  const { colors, fonts, radius } = config.theme;

  const colorTokens = [
    { name: "bg", value: colors.bg, desc: "Halaman & kartu utama" },
    { name: "surface", value: colors.surface, desc: "Area pendukung, footer, drawer" },
    { name: "surfaceStrong", value: colors.surfaceStrong, desc: "Elemen aktif, pill, badge" },
    { name: "border", value: colors.border, desc: "Garis batas kartu & input" },
    { name: "primary", value: colors.primary, desc: "Aksi utama, tombol, link aktif" },
    { name: "primaryHover", value: colors.primaryHover, desc: "State hover tombol utama" },
    { name: "onPrimary", value: colors.onPrimary, desc: "Teks di atas warna primary" },
    { name: "accentSoft", value: colors.accentSoft, desc: "Aksen lembut & dekoratif" },
    { name: "ink", value: colors.ink, desc: "Teks utama (kontras tinggi)" },
    { name: "inkMuted", value: colors.inkMuted, desc: "Teks sekunder & keterangan" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      <div className="border-b border-border pb-6">
        <span className="text-xs uppercase font-semibold text-primary tracking-wider">
          Dokumentasi Internal
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink mt-1">
          Design Tokens &amp; Component Styleguide
        </h1>
        <p className="text-sm text-inkMuted mt-2">
          Halaman pemeriksaan visual untuk memverifikasi token warna, tipografi, radius sudut ({radius}), dan state komponen.
        </p>
      </div>

      {/* 1. Colors */}
      <section className="space-y-6">
        <h2 className="font-display font-semibold text-2xl text-ink">
          1. Color Palette Tokens (from site.config.ts)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {colorTokens.map((token) => (
            <div
              key={token.name}
              className="border border-border rounded-theme p-3 bg-surface flex flex-col justify-between"
            >
              <div
                className="w-full h-16 rounded-theme mb-3 border border-border/50 shadow-sm"
                style={{ backgroundColor: `var(--color-${token.name.replace(/([A-Z])/g, "-$1").toLowerCase()})` }}
              />
              <div>
                <p className="font-mono text-xs font-bold text-ink">
                  {token.name}
                </p>
                <p className="font-mono text-[11px] text-inkMuted">
                  {token.value}
                </p>
                <p className="text-[11px] text-inkMuted mt-1">
                  {token.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Scale */}
      <section className="space-y-6">
        <h2 className="font-display font-semibold text-2xl text-ink">
          2. Typography Scale ({fonts.display} &amp; {fonts.body})
        </h2>
        <div className="space-y-4 border border-border rounded-theme p-6 bg-surface/40">
          <div>
            <span className="text-xs font-mono text-inkMuted">Display H1: Fraunces Bold 36px</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink">
              Rangkaian Bunga Segar Pilihan
            </h1>
          </div>
          <div>
            <span className="text-xs font-mono text-inkMuted">Display H2: Fraunces SemiBold 28px</span>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink">
              Buket Mawar Merah Segar
            </h2>
          </div>
          <div>
            <span className="text-xs font-mono text-inkMuted">Display H3: Fraunces SemiBold 20px</span>
            <h3 className="font-display font-semibold text-xl text-ink">
              Mulai dari Rp 185.000
            </h3>
          </div>
          <div>
            <span className="text-xs font-mono text-inkMuted">Body Regular: DM Sans 16px (Teks Utama)</span>
            <p className="font-body text-base text-ink leading-relaxed">
              Setiap bunga dirangkai langsung oleh florist kami sesaat sebelum pengiriman untuk memastikan kesegaran maksimal tiba di tangan penerima.
            </p>
          </div>
          <div>
            <span className="text-xs font-mono text-inkMuted">Body Muted: DM Sans 14px (Teks Sekunder)</span>
            <p className="font-body text-sm text-inkMuted leading-relaxed">
              Pemesanan minimal dilakukan 3 jam sebelum waktu pengiriman yang dipilih.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Buttons & Interactive States */}
      <section className="space-y-6">
        <h2 className="font-display font-semibold text-2xl text-ink">
          3. Button States
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-inkMuted">Primary Normal</span>
            <button
              type="button"
              className="w-full px-5 py-2.5 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-colors min-h-[44px]"
            >
              Tambah ke Keranjang
            </button>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono text-inkMuted">Secondary / Surface</span>
            <button
              type="button"
              className="w-full px-5 py-2.5 bg-surfaceStrong text-ink font-semibold text-sm rounded-theme hover:bg-border transition-colors min-h-[44px]"
            >
              Lihat Detail
            </button>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono text-inkMuted">Outline</span>
            <button
              type="button"
              className="w-full px-5 py-2.5 border border-border bg-bg text-ink font-semibold text-sm rounded-theme hover:bg-surface transition-colors min-h-[44px]"
            >
              Batal
            </button>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono text-inkMuted">Disabled State</span>
            <button
              type="button"
              disabled
              className="w-full px-5 py-2.5 bg-surfaceStrong text-inkMuted opacity-60 font-semibold text-sm rounded-theme cursor-not-allowed min-h-[44px]"
            >
              Stok Habis
            </button>
          </div>
        </div>
      </section>

      {/* 4. Form Controls */}
      <section className="space-y-6">
        <h2 className="font-display font-semibold text-2xl text-ink">
          4. Form Inputs &amp; Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-border rounded-theme p-6 bg-surface/30">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink">
              Nama Lengkap Pemesan <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Rina Anggraini"
              defaultValue="Rina Anggraini"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
            <p className="text-xs text-inkMuted">Nama Anda untuk konfirmasi pesanan.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink">
              Nomor WhatsApp <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              placeholder="081234567890"
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
            <p className="text-xs text-inkMuted">Gunakan nomor aktif untuk konfirmasi pemesanan.</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-ink">
              Pesan Kartu Ucapan
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan ucapan selamat..."
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-theme text-sm text-ink placeholder:text-inkMuted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-between text-xs text-inkMuted">
              <span>Termasuk kartu ucapan gratis.</span>
              <span>0 / 250 karakter</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Product Card Skeleton & Ratio 4:5 */}
      <section className="space-y-6">
        <h2 className="font-display font-semibold text-2xl text-ink">
          5. Product Card Layout (4:5 Aspect Ratio)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="border border-border rounded-theme bg-bg overflow-hidden flex flex-col group hover:border-primary/50 transition-colors">
            {/* 4:5 Image Container */}
            <div className="relative aspect-[4/5] bg-surface flex items-center justify-center border-b border-border text-xs text-inkMuted">
              <span className="px-3 py-1.5 bg-surfaceStrong/80 rounded-theme font-medium text-ink">
                4:5 Foto Buket Bunga
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="inline-block text-[11px] font-semibold text-primary uppercase tracking-wide mb-1">
                  Mawar
                </span>
                <h3 className="font-display font-semibold text-base text-ink group-hover:text-primary transition-colors">
                  Buket Mawar Merah Klasik
                </h3>
                <p className="text-xs text-inkMuted mt-1">
                  10 tangkai mawar merah segar dengan pembungkus dusty pink.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-inkMuted block">Mulai dari</span>
                  <span className="font-display font-bold text-base text-ink">
                    Rp 185.000
                  </span>
                </div>
                <span className="text-xs font-semibold text-primary group-hover:underline">
                  Pilih Ukuran &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
