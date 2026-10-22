import Link from "next/link";
import { MapPin, Clock, Phone, Instagram } from "lucide-react";
import type { SiteConfig } from "@/config/site.config";
import { copy } from "@/config/copy.id";

interface FooterProps {
  config: SiteConfig;
}

export function Footer({ config }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="kontak" className="bg-surface border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand & Tagline */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-ink tracking-tight">
              {config.store.name}
            </h2>
            <p className="text-sm text-inkMuted leading-relaxed">
              {config.store.tagline || config.store.description}
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primaryHover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-theme py-1"
              >
                {copy.hero.cta} &rarr;
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-base text-ink">
              {copy.contact.title}
            </h3>
            <ul className="space-y-3 text-sm text-inkMuted">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {config.contact.address}, {config.contact.city}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>{config.contact.openingHours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <a
                  href={`https://wa.me/${config.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-theme px-1"
                >
                  +{config.contact.whatsapp}
                </a>
              </li>
              {config.contact.instagram && (
                <li className="flex items-center gap-2.5">
                  <Instagram className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <a
                    href={`https://instagram.com/${config.contact.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-theme px-1"
                  >
                    @{config.contact.instagram}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Nav & Info */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-base text-ink">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm text-inkMuted">
              {config.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-theme py-0.5 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-theme py-0.5 inline-block text-xs opacity-75"
                >
                  {copy.admin.title}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-inkMuted">
          <p>
            &copy; {currentYear} {config.store.name}. Seluruh hak cipta dilindungi.
          </p>
          <p>
            Buket bunga dirangkai segar setiap hari.
          </p>
        </div>
      </div>
    </footer>
  );
}
