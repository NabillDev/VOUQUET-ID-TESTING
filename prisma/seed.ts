import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

// 1. Pastikan file .env ada (salin dari .env.example jika belum ada)
const rootDir = process.cwd();
const envPath = path.join(rootDir, ".env");
const envExamplePath = path.join(rootDir, ".env.example");

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log("ℹ️  File .env otomatis dibuat dari .env.example.");
  } catch (err) {
    // Abaikan
  }
}

// 2. Baca DATABASE_URL dari .env jika belum ada di process.env
if (!process.env.DATABASE_URL && fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed.startsWith("DATABASE_URL=")) {
        let val = trimmed.slice("DATABASE_URL=".length).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        process.env.DATABASE_URL = val;
        break;
      }
    }
  } catch (err) {
    // Abaikan
  }
}

// 3. Fallback default DATABASE_URL ke file SQLite lokal jika masih kosong
const prismaDir = path.join(rootDir, "prisma");
const devDb = path.join(prismaDir, "dev.db");
const seedDb = path.join(prismaDir, "seed.sqlite");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${devDb}`;
}

// 4. Jika dev.db belum ada tetapi seed.sqlite ada, salin template agar tabel siap
if (!fs.existsSync(devDb) && fs.existsSync(seedDb)) {
  try {
    fs.copyFileSync(seedDb, devDb);
  } catch (err) {
    // Abaikan
  }
}

// 5. Pastikan skema tabel sudah siap di SQLite jika dev.db belum ada
try {
  if (!fs.existsSync(devDb)) {
    execSync("npx prisma db push --skip-generate", {
      stdio: "inherit",
      env: process.env,
    });
  }
} catch (err) {
  // Abaikan
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const categoriesData = [
  {
    "name": "Buket Mawar",
    "slug": "buket-mawar",
    "sortOrder": 1
  },
  {
    "name": "Buket Campur",
    "slug": "buket-campur",
    "sortOrder": 2
  },
  {
    "name": "Buket Wisuda & Hadiah",
    "slug": "buket-wisuda-hadiah",
    "sortOrder": 3
  }
];

const productsData = [
  {
    "name": "Buket Mawar Merah Klasik",
    "slug": "buket-mawar-merah-klasik",
    "description": "Rangkaian mawar merah segar dengan pembungkus kertas premium warna blush pink dan pita satin senada.",
    "categorySlug": "buket-mawar",
    "occasion": "anniversary",
    "isActive": true,
    "isFeatured": true,
    "isSample": true,
    "images": [
      {
        "url": "/images/bouquet-red-rose.svg",
        "alt": "Buket Mawar Merah Klasik",
        "sortOrder": 0
      }
    ],
    "variants": [
      {
        "label": "Standard (10 tangkai)",
        "price": 185000,
        "isActive": true
      },
      {
        "label": "Deluxe (20 tangkai)",
        "price": 320000,
        "isActive": true
      }
    ]
  },
  {
    "name": "Buket Mawar Putih Murni",
    "slug": "buket-mawar-putih-murni",
    "description": "Mawar putih segar dipadukan dengan daun eucalyptus dan pembungkus netral.",
    "categorySlug": "buket-mawar",
    "occasion": "wedding",
    "isActive": true,
    "isFeatured": false,
    "isSample": true,
    "images": [
      {
        "url": "/images/bouquet-white-rose.svg",
        "alt": "Buket Mawar Putih Murni",
        "sortOrder": 0
      }
    ],
    "variants": [
      {
        "label": "Standard (10 tangkai)",
        "price": 195000,
        "isActive": true
      },
      {
        "label": "Besar (20 tangkai)",
        "price": 340000,
        "isActive": true
      }
    ]
  },
  {
    "name": "Buket Bunga Campur Pastel",
    "slug": "buket-bunga-campur-pastel",
    "description": "Kombinasi mawar peach, anyelir merah muda, aster, dan dedaunan segar.",
    "categorySlug": "buket-campur",
    "occasion": "birthday",
    "isActive": true,
    "isFeatured": true,
    "isSample": true,
    "images": [
      {
        "url": "/images/bouquet-pastel.svg",
        "alt": "Buket Bunga Campur Pastel",
        "sortOrder": 0
      }
    ],
    "variants": [
      {
        "label": "Sedang",
        "price": 225000,
        "isActive": true
      },
      {
        "label": "Besar",
        "price": 360000,
        "isActive": true
      }
    ]
  },
  {
    "name": "Buket Bunga Matahari Ceria",
    "slug": "buket-bunga-matahari-ceria",
    "description": "Bunga matahari mekar dipadukan dengan baby's breath dan wrapping cokelat natural.",
    "categorySlug": "buket-campur",
    "occasion": "graduation",
    "isActive": true,
    "isFeatured": true,
    "isSample": true,
    "images": [
      {
        "url": "/images/bouquet-sunflower.svg",
        "alt": "Buket Bunga Matahari Ceria",
        "sortOrder": 0
      }
    ],
    "variants": [
      {
        "label": "Standard (3 tangkai)",
        "price": 175000,
        "isActive": true
      },
      {
        "label": "Spesial (5 tangkai)",
        "price": 260000,
        "isActive": true
      }
    ]
  },
  {
    "name": "Buket Wisuda Elegant Lilac",
    "slug": "buket-wisuda-elegant-lilac",
    "description": "Rangkaian bernuansa ungu lembut dengan bunga mawar lilac, gomphrena, dan pita ungu.",
    "categorySlug": "buket-wisuda-hadiah",
    "occasion": "graduation",
    "isActive": true,
    "isFeatured": false,
    "isSample": true,
    "images": [
      {
        "url": "/images/bouquet-lilac.svg",
        "alt": "Buket Wisuda Elegant Lilac",
        "sortOrder": 0
      }
    ],
    "variants": [
      {
        "label": "Sedang",
        "price": 210000,
        "isActive": true
      },
      {
        "label": "Besar",
        "price": 330000,
        "isActive": true
      }
    ]
  },
  {
    "name": "Buket Cokelat & Mawar Baby Pink",
    "slug": "buket-cokelat-mawar-baby-pink",
    "description": "Perpaduan bunga mawar merah muda dan cokelat bulat dengan pembungkus warna peach.",
    "categorySlug": "buket-wisuda-hadiah",
    "occasion": "birthday",
    "isActive": true,
    "isFeatured": false,
    "isSample": true,
    "images": [
      {
        "url": "/images/bouquet-chocolate.svg",
        "alt": "Buket Cokelat & Mawar Baby Pink",
        "sortOrder": 0
      }
    ],
    "variants": [
      {
        "label": "Standard",
        "price": 240000,
        "isActive": true
      },
      {
        "label": "Premium",
        "price": 375000,
        "isActive": true
      }
    ]
  }
];

async function main() {
  console.log("Seeding database...");

  // Hapus data lama agar sinkron
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Buat Kategori
  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  // 2. Buat Produk beserta Foto dan Varian
  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        categoryId: categoryId,
        occasion: prod.occasion,
        isActive: prod.isActive,
        isFeatured: prod.isFeatured,
        isSample: prod.isSample,
        images: {
          create: prod.images,
        },
        variants: {
          create: prod.variants,
        },
      },
    });
    console.log(`Produk dibuat: ${prod.name}`);
  }

  console.log("Database berhasil di-seed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
