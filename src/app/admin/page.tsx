import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminRootPage() {
  const auth = await isAuthenticated();
  if (auth) {
    redirect("/admin/orders");
  } else {
    redirect("/admin/login");
  }
}
