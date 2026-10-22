import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { getSiteConfig } from "@/config/site.config";
import { ClientShell } from "@/components/ClientShell";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const config = getSiteConfig();
  return {
    metadataBase: new URL(`https://${config.store.domain}`),
    title: {
      default: `${config.store.name} - ${config.store.tagline}`,
      template: `%s | ${config.store.name}`,
    },
    description: config.store.description,
    openGraph: {
      title: config.store.name,
      description: config.store.description,
      siteName: config.store.name,
      locale: config.store.locale,
      type: "website",
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();
  const { colors, radius } = config.theme;

  // Injects design token CSS variables dynamically into :root
  const cssVariables = `
    :root {
      --color-bg: ${colors.bg};
      --color-surface: ${colors.surface};
      --color-surface-strong: ${colors.surfaceStrong};
      --color-border: ${colors.border};
      --color-primary: ${colors.primary};
      --color-primary-hover: ${colors.primaryHover};
      --color-on-primary: ${colors.onPrimary};
      --color-accent-soft: ${colors.accentSoft};
      --color-ink: ${colors.ink};
      --color-ink-muted: ${colors.inkMuted};
      --theme-radius: ${radius};
    }
  `;

  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${dmSans.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-bg text-ink">
        <ClientShell config={config}>{children}</ClientShell>
      </body>
    </html>
  );
}
