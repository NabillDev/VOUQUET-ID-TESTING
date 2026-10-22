import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function exportSeed() {
  console.log("Mengambil data kategori dan produk dari database lokal...");

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Ditemukan ${categories.length} kategori dan ${products.length} produk.`);

  const categoriesData = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    sortOrder: c.sortOrder,
  }));

  const productsData = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    categorySlug: p.category.slug,
    occasion: p.occasion,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    isSample: p.isSample,
    images: p.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder,
    })),
    variants: p.variants.map((v) => ({
      label: v.label,
      price: v.price,
      isActive: v.isActive,
    })),
  }));

  const seedContent = `import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoriesData = ${JSON.stringify(categoriesData, null, 2)};

const productsData = ${JSON.stringify(productsData, null, 2)};

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
    console.log(\`Produk dibuat: \${prod.name}\`);
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
`;

  const targetPath = path.join(process.cwd(), "prisma", "seed.ts");
  fs.writeFileSync(targetPath, seedContent, "utf8");
  console.log(`Berhasil mengekspor data ke ${targetPath}!`);
  console.log("Sekarang Anda bisa commit dan push ke GitHub agar Vercel otomatis mengimpor data ini.");
}

exportSeed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
