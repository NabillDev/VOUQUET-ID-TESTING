import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCategories } from "@/lib/data/categories";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata = {
  title: "Kelola Kategori - Admin",
};

export default async function AdminCategoriesPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect("/admin/login");
  }

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
          Kelola Kategori
        </h1>
        <p className="text-xs text-inkMuted mt-1">
          Atur pengelompokan buket bunga dan urutan penampilannya di katalog toko.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
