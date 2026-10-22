import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getOrders } from "@/lib/data/orders";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { copy } from "@/config/copy.id";

export const metadata = {
  title: "Daftar Pesanan - Admin",
};

export default async function AdminOrdersPage() {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect("/admin/login");
  }

  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            {copy.admin.ordersTitle}
          </h1>
          <p className="text-xs text-inkMuted mt-1">
            Pantau pesanan yang masuk, ubah status, dan hubungi pemesan secara langsung lewat WhatsApp.
          </p>
        </div>
      </div>

      <OrdersTable initialOrders={orders} />
    </div>
  );
}
