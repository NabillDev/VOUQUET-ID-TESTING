import { MetadataRoute } from "next";
import { getSiteConfig } from "@/config/site.config";
import { getProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = getSiteConfig();
  const baseUrl = `https://${config.store.domain}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts({ activeOnly: true });
    productRoutes = products.map((product) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    // If the database is not ready during build time, fallback to static routes
    console.warn("Sitemap: unable to query products during build, serving static routes.");
  }

  return [...staticRoutes, ...productRoutes];
}
