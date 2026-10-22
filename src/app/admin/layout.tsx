import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/config/site.config";
import { isAuthenticated } from "@/lib/auth";
import { AdminHeaderNav } from "@/components/admin/AdminHeaderNav";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();
  const authenticated = await isAuthenticated();

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      {/* Admin Header: shows store.name from site.config.ts */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="font-display font-bold text-lg text-ink hover:text-primary transition-colors flex items-center gap-2"
            >
              <span>{config.store.name}</span>
              <span className="text-[11px] font-sans px-2 py-0.5 bg-surfaceStrong border border-border rounded-full text-ink font-semibold">
                Pengelola
              </span>
            </Link>
          </div>

          {authenticated && <AdminHeaderNav />}
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
