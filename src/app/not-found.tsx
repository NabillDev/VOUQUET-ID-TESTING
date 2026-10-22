import Link from "next/link";
import { copy } from "@/config/copy.id";

export const metadata = {
  title: "Halaman Tidak Ditemukan",
};

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 sm:py-32 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surfaceStrong border border-border text-primary font-display font-bold text-2xl">
        404
      </div>

      <div className="space-y-2">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
          {copy.notFound.title}
        </h1>
        <p className="text-sm text-inkMuted leading-relaxed">
          {copy.notFound.desc}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-onPrimary font-semibold text-sm rounded-theme hover:bg-primaryHover transition-colors min-h-[44px] flex items-center justify-center"
        >
          {copy.notFound.cta}
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto px-5 py-2.5 border border-border bg-surface text-ink font-semibold text-sm rounded-theme hover:bg-surfaceStrong transition-colors min-h-[44px] flex items-center justify-center"
        >
          {copy.hero.cta}
        </Link>
      </div>
    </div>
  );
}
