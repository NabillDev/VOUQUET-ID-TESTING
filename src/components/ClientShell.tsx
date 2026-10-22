"use client";

import React from "react";
import { CartProvider, useCart } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { CartDrawer } from "@/components/CartDrawer";
import type { SiteConfig } from "@/config/site.config";

function HeaderWithCart({ config }: { config: SiteConfig }) {
  const { totalCount, openCart } = useCart();
  return (
    <Header
      config={config}
      cartCount={totalCount}
      onOpenCart={openCart}
    />
  );
}

interface ClientShellProps {
  config: SiteConfig;
  children: React.ReactNode;
}

export function ClientShell({ config, children }: ClientShellProps) {
  return (
    <CartProvider>
      <SkipLink />
      <HeaderWithCart config={config} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer config={config} />
      <CartDrawer />
    </CartProvider>
  );
}
