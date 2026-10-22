import { prisma } from "@/lib/prisma";
import type { CategoryInput } from "@/lib/validations";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  });
}

export async function createCategory(data: CategoryInput) {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      sortOrder: data.sortOrder,
    },
  });
}

export async function updateCategory(id: string, data: CategoryInput) {
  return prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      sortOrder: data.sortOrder,
    },
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}
