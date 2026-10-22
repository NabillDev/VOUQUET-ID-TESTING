"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import type { SiteConfig } from "@/config/site.config";
import { copy } from "@/config/copy.id";

interface HeaderProps {
  config: SiteConfig;
  cartCount?: number;
  onOpenCart?: () => void;
}

export function Header({ config, cartCount = 0, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur-sm border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Wordmark or Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-ink hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-theme py-1 px-1.5 -ml-1.5"
        >
          {config.store.logo ? (
            <Image
              src={config.store.logo}
              alt={config.store.name}
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          ) : (
            <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-ink">
              {config.store.name}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-8"
        >
          {config.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-theme px-2 py-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls: Cart & Mobile Menu */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`${copy.nav.cart}, ${cartCount} ${copy.cart.unit}`}
            className="relative p-2.5 text-ink hover:text-primary hover:bg-surface rounded-theme transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            <span
              className={`absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 text-[11px] font-bold rounded-full flex items-center justify-center transition-colors ${
                cartCount > 0
                  ? "bg-primary text-onPrimary"
                  : "bg-surfaceStrong text-inkMuted"
              }`}
            >
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? copy.nav.closeMenu : copy.nav.openMenu}
            className="md:hidden p-2.5 text-ink hover:text-primary hover:bg-surface rounded-theme transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 pt-3 pb-6 space-y-2">
          {config.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-medium text-ink hover:text-primary hover:bg-surfaceStrong rounded-theme transition-colors min-h-[44px] flex items-center"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
