"use server";

import { revalidatePath } from "next/cache";
import {
  isAuthenticated,
  setAdminSession,
  clearAdminSession,
  verifyAdminPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from "@/lib/data/products";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/data/categories";
import { updateOrderStatus } from "@/lib/data/orders";
import { storage } from "@/lib/storage";
import { productInputSchema, categoryInputSchema } from "@/lib/validations";

export async function loginAdminAction(password: string) {
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "Terlalu banyak percobaan login yang gagal. Silakan coba kembali dalam 15 menit.",
    };
  }

  const isValid = verifyAdminPassword(password);
  if (!isValid) {
    recordFailedAttempt();
    return {
      success: false,
      error: "Kata sandi yang Anda masukkan salah.",
    };
  }

  resetRateLimit();
  await setAdminSession();
  return { success: true };
}

export async function logoutAdminAction() {
  await clearAdminSession();
  return { success: true };
}

export async function createProductAction(formData: FormData) {
  const auth = await isAuthenticated();
  if (!auth) throw new Error("Tidak memiliki izin akses.");

  // Handle image upload if a file was provided
  const imageFile = formData.get("imageFile") as File | null;
  let imageUrl = formData.get("imageUrl") as string | null;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await storage.save(imageFile);
  }

  const variantsRaw = formData.get("variantsJson") as string;
  let variants = [];
  try {
    variants = JSON.parse(variantsRaw || "[]");
  } catch {
    variants = [{ label: "Standard", price: 100000, isActive: true }];
  }

  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") as string,
    occasion: (formData.get("occasion") as string) || null,
    isActive: formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "true",
    isSample: false,
    images: [
      {
        url: imageUrl || "/images/bouquet-red-rose.svg",
        alt: (formData.get("name") as string) || "Foto buket",
        sortOrder: 0,
      },
    ],
    variants,
  };

  const parsed = productInputSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Data produk tidak valid.",
    };
  }

  await createProduct(parsed.data);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}

export async function updateProductAction(id: string, formData: FormData) {
  const auth = await isAuthenticated();
  if (!auth) throw new Error("Tidak memiliki izin akses.");

  const imageFile = formData.get("imageFile") as File | null;
  let imageUrl = formData.get("imageUrl") as string | null;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await storage.save(imageFile);
  }

  const variantsRaw = formData.get("variantsJson") as string;
  let variants = [];
  try {
    variants = JSON.parse(variantsRaw || "[]");
  } catch {
    variants = [{ label: "Standard", price: 100000, isActive: true }];
  }

  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") as string,
    occasion: (formData.get("occasion") as string) || null,
    isActive: formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "true",
    isSample: formData.get("isSample") === "true",
    images: [
      {
        url: imageUrl || "/images/bouquet-red-rose.svg",
        alt: (formData.get("name") as string) || "Foto buket",
        sortOrder: 0,
      },
    ],
    variants,
  };

  const parsed = productInputSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Data produk tidak valid.",
    };
  }

  await updateProduct(id, parsed.data);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProductAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await isAuthenticated();
    if (!auth) throw new Error("Tidak memiliki izin akses.");

    await deleteProduct(id);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus produk." };
  }
}

export async function toggleProductActiveAction(id: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await isAuthenticated();
    if (!auth) throw new Error("Tidak memiliki izin akses.");

    await toggleProductActive(id, isActive);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengubah status produk." };
  }
}

export async function createCategoryAction(data: unknown): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await isAuthenticated();
    if (!auth) throw new Error("Tidak memiliki izin akses.");

    const parsed = categoryInputSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Data kategori tidak valid.",
      };
    }

    await createCategory(parsed.data);
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal membuat kategori." };
  }
}

export async function updateCategoryAction(id: string, data: unknown): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await isAuthenticated();
    if (!auth) throw new Error("Tidak memiliki izin akses.");

    const parsed = categoryInputSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Data kategori tidak valid.",
      };
    }

    await updateCategory(id, parsed.data);
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui kategori." };
  }
}

export async function deleteCategoryAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await isAuthenticated();
    if (!auth) throw new Error("Tidak memiliki izin akses.");

    await deleteCategory(id);
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus kategori." };
  }
}

export async function updateOrderStatusAction(orderId: string, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await isAuthenticated();
    if (!auth) throw new Error("Tidak memiliki izin akses.");

    await updateOrderStatus(orderId, status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui status pesanan." };
  }
}
