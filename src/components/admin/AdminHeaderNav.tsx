"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAdminAction } from "@/app/actions/admin";

export function AdminHeaderNav() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { label: "Pesanan", href: "/admin/orders" },
    { label: "Produk", href: "/admin/products" },
    { label: "Kategori", href: "/admin/categories" },
  ];

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-6">
      <nav aria-label="Navigasi Pengelola" className="flex items-center gap-4 sm:gap-6">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs sm:text-sm font-semibold transition-colors py-1 px-1.5 rounded-theme ${
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-inkMuted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-inkMuted hover:text-primary transition-colors py-1.5 px-2.5 rounded-theme hover:bg-surfaceStrong min-h-[38px]"
        aria-label="Keluar dari akun pengelola"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Keluar</span>
      </button>
    </div>
  );
}
