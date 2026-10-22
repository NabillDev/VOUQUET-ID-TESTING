import { prisma } from "@/lib/prisma";
import type { ProductInput } from "@/lib/validations";

export interface ProductFilterOptions {
  categorySlug?: string;
  occasion?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  activeOnly?: boolean;
}

export async function getProducts(options: ProductFilterOptions = {}) {
  const { categorySlug, occasion, sort = "newest", activeOnly = true } = options;

  // Build where clause
  const where: any = {};
  if (activeOnly) {
    where.isActive = true;
  }
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (occasion) {
    where.occasion = occasion;
  }

  // Fetch products with relations
  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: activeOnly ? { isActive: true } : undefined,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Client / in-memory sorting by computed lowest price if requested
  if (sort === "price-asc" || sort === "price-desc") {
    products.sort((a, b) => {
      const minA = a.variants.length > 0 ? Math.min(...a.variants.map((v) => v.price)) : 0;
      const minB = b.variants.length > 0 ? Math.min(...b.variants.map((v) => v.price)) : 0;
      return sort === "price-asc" ? minA - minB : minB - minA;
    });
  }

  return products;
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
      },
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: true,
    },
  });
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 3) {
  return prisma.product.findMany({
    where: {
      id: { not: productId },
      categoryId,
      isActive: true,
    },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
      },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(data: ProductInput) {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      categoryId: data.categoryId,
      occasion: data.occasion || null,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      isSample: data.isSample,
      images: {
        create: data.images.map((img, i) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder ?? i,
        })),
      },
      variants: {
        create: data.variants.map((v) => ({
          label: v.label,
          price: v.price,
          isActive: v.isActive,
        })),
      },
    },
  });
}

export async function updateProduct(id: string, data: ProductInput) {
  // Replace images and variants atomically
  return prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.productVariant.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        occasion: data.occasion || null,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isSample: data.isSample,
        images: {
          create: data.images.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder ?? i,
          })),
        },
        variants: {
          create: data.variants.map((v) => ({
            label: v.label,
            price: v.price,
            isActive: v.isActive,
          })),
        },
      },
    });
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}

export async function toggleProductActive(id: string, isActive: boolean) {
  return prisma.product.update({
    where: { id },
    data: { isActive },
  });
}
