# VOUQUET.ID

Website toko online (storefront) buket bunga segar siap pakai, dirancang khusus untuk toko bunga dan UMKM. Dilengkapi alur pemesanan langsung terhubung ke **WhatsApp**, keranjang belanja interaktif, serta **Panel Admin** untuk mengelola katalog dan memantau pesanan.

Dibuat menggunakan Next.js (App Router), TypeScript, Tailwind CSS, dan Prisma ORM dengan SQLite.

---

## Fitur Utama

- **Katalog Produk & Varian**: Menampilkan pilihan buket dengan ragam ukuran, varian harga, deskripsi, dan galeri foto.
- **Pemesanan Cepat via WhatsApp**: Pembeli mengisi form pengiriman (alamat, tanggal & jam kirim, kartu ucapan), lalu sistem otomatis menyusun pesan rapi untuk dikirim ke WhatsApp penjual.
- **Keranjang Belanja (Cart Drawer)**: Pengunjung dapat memilih beberapa buket sekaligus dengan perhitungan total otomatis.
- **Panel Pengelola Toko (`/admin`)**:
  - Tambah, edit, dan hapus produk buket beserta fotonya.
  - Atur kategori bunga.
  - Pantau dan perbarui status pesanan (Menunggu Konfirmasi, Dikonfirmasi, Diproses, Dikirim, Selesai, Dibatalkan).
  - Dilindungi otentikasi sesi berbasis kata sandi yang aman.
- **SEO & Performa Maksimal**: Dukungan otomatis untuk OpenGraph, sitemap.xml, robots.txt, metadata dinamis, serta skema JSON-LD.
- **Desain Responsif**: Tampilan nyaman diakses dari ponsel pintar maupun desktop komputer.

---

## Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terpasang:
- **Node.js**: versi 18.17+ atau 20+ (rekomendasi LTS)
- **npm**: versi 9+ atau yang sesuai

---

## Panduan Menjalankan di Komputer Lokal (Localhost)

Ikuti langkah mudah berikut untuk menjalankan proyek di komputer Anda:

### 1. Pasang Dependensi
Buka terminal di folder proyek, lalu jalankan:
```bash
npm install
```

### 2. Buat File Konfigurasi Lingkungan (`.env`)
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi file `.env` dengan konfigurasi Anda:
```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="kata_sandi_rahasia_admin_anda"
SESSION_SECRET="buat_string_acak_panjang_minimal_32_karakter"
```

### 3. Inisialisasi Database & Isi Data Contoh
Jalankan perintah berikut untuk membuat database SQLite lokal dan mengisinya dengan data contoh awal:
```bash
npm run db:seed
```

### 4. Jalankan Aplikasi
Jalankan server pengembangan:
```bash
npm run dev
```

Buka peramban (browser) Anda dan akses:
- **Toko Online**: [http://localhost:3000](http://localhost:3000)
- **Panel Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) *(masuk menggunakan kata sandi yang Anda tentukan di `ADMIN_PASSWORD`)*

---

## Kustomisasi Toko Anda

Semua pengaturan utama toko dibuat terpusat agar mudah disesuaikan:

### 1. Pengaturan Toko & Nomor WhatsApp
Buka file [`src/config/site.config.ts`](src/config/site.config.ts):
- **Nomor WhatsApp**: Ganti nilai `contact.whatsapp` dengan nomor WhatsApp toko Anda (gunakan format internasional tanpa tanda plus, contoh: `6281234567890`).
- **Nama Toko & Slogan**: Ubah nilai `name` dan `tagline`.
- **Wilayah Pengiriman**: Sesuaikan daftar kecamatan/kota di `shippingZones`.
- **Jam Operasional & Media Sosial**: Sesuaikan di bagian `operatingHours` dan `social`.

### 2. Teks & Pesan Website
Buka file [`src/config/copy.id.ts`](src/config/copy.id.ts) jika ingin mengubah teks tombol, label navigasi, atau kata sambutan di halaman utama.

---

## Panduan Deploy ke Vercel

Proyek ini telah dikonfigurasi agar dapat langsung dideploy ke platform Vercel.

### 1. Pengaturan Environment Variables di Vercel
Saat menghubungkan repository ke Vercel (atau di menu **Project Settings > Environment Variables**), tambahkan variabel berikut:
- `ADMIN_PASSWORD`: Kata sandi rahasia untuk masuk ke halaman `/admin`.
- `SESSION_SECRET`: String acak aman minimal 32 karakter.
- *(Opsional)* `DATABASE_URL`: Sistem otomatis menggunakan template database aman di `/tmp/dev.db` untuk serverless Vercel jika variabel ini kosong.

### 2. Memindahkan Data Produk Lokal ke Vercel
Jika Anda telah menambahkan produk atau mengubah data di komputer lokal dan ingin data tersebut tampil di Vercel:
1. Di komputer lokal, jalankan perintah:
   ```bash
   npm run db:export-seed
   ```
   *(Perintah ini akan menyalin database lokal Anda menjadi template `prisma/seed.sqlite` yang dibawa saat deploy).*
2. Simpan dan unggah perubahan ke repository Git:
   ```bash
   git add prisma/seed.sqlite
   git commit -m "update: perbarui data produk untuk deploy"
   git push
   ```
3. Vercel akan otomatis melakukan redeploy dengan data produk terbaru Anda.

---

## Daftar Perintah Penting (NPM Scripts)

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan aplikasi dalam mode pengembangan di `localhost:3000`. |
| `npm run build` | Menyiapkan Prisma Client, sinkronisasi skema, dan membuat bundle produksi Next.js. |
| `npm run start` | Menjalankan server aplikasi Next.js dalam mode produksi. |
| `npm run db:seed` | Mengisi database lokal dengan data contoh produk awal. |
| `npm run db:export-seed` | Menyimpan database lokal saat ini ke `prisma/seed.sqlite` untuk deploy. |
| `npm run db:studio` | Membuka antarmuka grafis (GUI) Prisma Studio di browser untuk melihat dan mengedit database secara langsung. |
| `npm run db:reset` | Menghapus database dan membuat ulang dari awal. |

---

## Struktur Folder Proyek

```text
├── prisma/
│   ├── schema.prisma      # Definisi tabel database (Produk, Kategori, Pesanan)
│   ├── seed.ts            # Skrip pembuat data awal
│   └── seed.sqlite        # Template database bawaan untuk deploy
├── public/
│   ├── images/            # Ilustrasi vektor buket bunga
│   └── uploads/           # Direktori penyimpanan foto yang diunggah dari admin
├── scripts/
│   ├── build.mjs          # Otomatisasi persiapan database saat build di cloud/Vercel
│   └── export-seed.mjs    # Skrip ekspor database lokal ke template
└── src/
    ├── app/               # Rute halaman Next.js App Router (Storefront & Admin)
    ├── components/        # Komponen UI (Navbar, Kartu Produk, Modal, Drawer Keranjang)
    ├── config/            # Konfigurasi toko (site.config.ts) dan teks bahasa (copy.id.ts)
    ├── context/           # State keranjang belanja (CartContext)
    └── lib/               # Utilitas (koneksi database Prisma, auth, format mata uang)
```

---

## Lisensi & Bantuan

Proyek ini dibuat untuk mendukung ekosistem usaha lokal dan toko bunga independen. Jika Anda memiliki pertanyaan atau kendala konfigurasi, silakan cek pengaturan di file konfigurasi atau hubungi tim pengembang Anda.
