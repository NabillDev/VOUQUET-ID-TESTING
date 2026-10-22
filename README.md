# VOUQUET.ID

Storefront buket bunga segar dan panel pengelola toko sederhana. Dibuat dengan Next.js App Router, TypeScript, Tailwind CSS, dan Prisma ORM dengan SQLite.

## Persyaratan Sistem

- Node.js v18.17+ atau v20+
- npm v9+

## Panduan Memulai Cepat

1. **Pasang Dependensi**:
   ```bash
   npm install
   ```

2. **Pengaturan Lingkungan (.env)**:
   Salin berkas contoh konfigurasi:
   ```bash
   cp .env.example .env
   ```
   Pastikan variabel berikut telah ditentukan:
   - `DATABASE_URL="file:./dev.db"`
   - `ADMIN_PASSWORD="kata_sandi_rahasia_admin"`
   - `SESSION_SECRET="string_acak_minimal_32_karakter"`

3. **Inisialisasi Database & Migrasi**:
   ```bash
   npm run db:migrate
   ```

4. **Isi Data Awal (Seed)**:
   ```bash
   npm run db:seed
   ```

5. **Jalankan Aplikasi dalam Mode Pengembangan**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di peramban Anda.

## Perintah Database (Prisma)

- `npm run db:migrate`: Menjalankan migrasi skema database SQLite.
- `npm run db:seed`: Mengisi database dengan data kategori dan produk contoh (`isSample: true`).
- `npm run db:reset`: Menghapus dan membuat ulang database dari awal beserta migrasinya.
- `npm run db:studio`: Membuka Prisma Studio GUI di peramban untuk melihat data langsung.

## Cadangan Data & Catatan Deployment VPS

- **Mencadangkan Database SQLite**:
  Cukup salin berkas `prisma/dev.db` ke lokasi penyimpanan aman:
  ```bash
  cp prisma/dev.db backup/dev-$(date +%Y%m%d).db
  ```
- **Penyimpanan Permanen di VPS**:
  Jika Anda mendeploy proyek ini ke VPS (seperti Ubuntu / Debian) menggunakan Docker atau PM2:
  - Berkas database SQLite (`prisma/dev.db`) dan direktori unggahan foto (`public/uploads`) **harus berada pada volume penyimpanan persisten**.
  - Jangan simpan berkas database di dalam container ephemeral tanpa volume mount, agar data pesanan dan katalog tidak hilang saat container diperbarui.

## Konfigurasi Toko (Single Source of Truth)

Seluruh informasi toko seperti nama, nomor WhatsApp, warna tema, daftar wilayah kirim, dan template pesan WhatsApp tersimpan di satu berkas:
`src/config/site.config.ts`
