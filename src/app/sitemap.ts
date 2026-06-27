import type { MetadataRoute } from "next";
import { getCategories, getAllProductSlugs, getAllBlogSlugs } from "@/lib/data/repository";
import { SITE } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, productSlugs, blogSlugs] = await Promise.all([
    getCategories(),
    getAllProductSlugs(),
    getAllBlogSlugs(),
  ]);

  const staticPages = ["", "/shop", "/about", "/blog", "/contact"].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryPages = cats.map((c) => ({
    url: `${SITE.url}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages = productSlugs.map((slug) => ({
    url: `${SITE.url}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogPages = blogSlugs.map((slug) => ({
    url: `${SITE.url}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
