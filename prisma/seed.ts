import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing sample data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Create Categories
  const catRose = await prisma.category.create({
    data: {
      name: "Buket Mawar",
      slug: "buket-mawar",
      sortOrder: 1,
    },
  });

  const catMix = await prisma.category.create({
    data: {
      name: "Buket Campur",
      slug: "buket-campur",
      sortOrder: 2,
    },
  });

  const catGrad = await prisma.category.create({
    data: {
      name: "Buket Wisuda & Hadiah",
      slug: "buket-wisuda-hadiah",
      sortOrder: 3,
    },
  });

  // 2. Create 6 Products (all marked isSample: true with plain descriptions)
  const productsData = [
    {
      name: "Buket Mawar Merah Klasik",
      slug: "buket-mawar-merah-klasik",
      description: "Rangkaian mawar merah segar dengan pembungkus kertas premium warna blush pink dan pita satin senada.",
      categoryId: catRose.id,
      occasion: "anniversary",
      isActive: true,
      isFeatured: true,
      isSample: true,
      image: "/images/bouquet-red-rose.svg",
      variants: [
        { label: "Standard (10 tangkai)", price: 185000 },
        { label: "Deluxe (20 tangkai)", price: 320000 },
      ],
    },
    {
      name: "Buket Mawar Putih Murni",
      slug: "buket-mawar-putih-murni",
      description: "Mawar putih segar dipadukan dengan daun eucalyptus dan pembungkus netral.",
      categoryId: catRose.id,
      occasion: "wedding",
      isActive: true,
      isFeatured: false,
      isSample: true,
      image: "/images/bouquet-white-rose.svg",
      variants: [
        { label: "Standard (10 tangkai)", price: 195000 },
        { label: "Besar (20 tangkai)", price: 340000 },
      ],
    },
    {
      name: "Buket Bunga Campur Pastel",
      slug: "buket-bunga-campur-pastel",
      description: "Kombinasi mawar peach, anyelir merah muda, aster, dan dedaunan segar.",
      categoryId: catMix.id,
      occasion: "birthday",
      isActive: true,
      isFeatured: true,
      isSample: true,
      image: "/images/bouquet-pastel.svg",
      variants: [
        { label: "Sedang", price: 225000 },
        { label: "Besar", price: 360000 },
      ],
    },
    {
      name: "Buket Bunga Matahari Ceria",
      slug: "buket-bunga-matahari-ceria",
      description: "Bunga matahari mekar dipadukan dengan baby's breath dan wrapping cokelat natural.",
      categoryId: catMix.id,
      occasion: "graduation",
      isActive: true,
      isFeatured: true,
      isSample: true,
      image: "/images/bouquet-sunflower.svg",
      variants: [
        { label: "Standard (3 tangkai)", price: 175000 },
        { label: "Spesial (5 tangkai)", price: 260000 },
      ],
    },
    {
      name: "Buket Wisuda Elegant Lilac",
      slug: "buket-wisuda-elegant-lilac",
      description: "Rangkaian bernuansa ungu lembut dengan bunga mawar lilac, gomphrena, dan pita ungu.",
      categoryId: catGrad.id,
      occasion: "graduation",
      isActive: true,
      isFeatured: false,
      isSample: true,
      image: "/images/bouquet-lilac.svg",
      variants: [
        { label: "Sedang", price: 210000 },
        { label: "Besar", price: 330000 },
      ],
    },
    {
      name: "Buket Cokelat & Mawar Baby Pink",
      slug: "buket-cokelat-mawar-baby-pink",
      description: "Perpaduan bunga mawar merah muda dan cokelat bulat dengan pembungkus warna peach.",
      categoryId: catGrad.id,
      occasion: "birthday",
      isActive: true,
      isFeatured: false,
      isSample: true,
      image: "/images/bouquet-chocolate.svg",
      variants: [
        { label: "Standard", price: 240000 },
        { label: "Premium", price: 375000 },
      ],
    },
  ];

  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        occasion: p.occasion,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        isSample: p.isSample,
        images: {
          create: [
            {
              url: p.image,
              alt: p.name,
              sortOrder: 0,
            },
          ],
        },
        variants: {
          create: p.variants.map((v) => ({
            label: v.label,
            price: v.price,
            isActive: true,
          })),
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
