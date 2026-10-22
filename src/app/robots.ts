import { MetadataRoute } from "next";
import { getSiteConfig } from "@/config/site.config";

export default function robots(): MetadataRoute.Robots {
  const config = getSiteConfig();
  const baseUrl = `https://${config.store.domain}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/*", "/api/*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
