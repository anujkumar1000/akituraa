// ─────────────────────────────────────────────────────────────
// REPOSITORY LAYER
// The single source the UI talks to for catalog data. When
// DATABASE_URL is set it reads from Postgres (Prisma); otherwise it
// falls back to the in-memory sample provider. Every page/component
// calls these functions — never the raw data — so this is the only
// place that knows where the catalog lives.
//
// This is what makes the catalog "fully dynamic / data-driven".
// Note: filtering/sorting happens in JS after load. Fine for a
// modest catalog; push filters into SQL when you cross ~1k products.
// ─────────────────────────────────────────────────────────────

import { sampleProducts } from "@/data/products";
import { categories as sampleCategories } from "@/data/categories";
import { blogPosts, type BlogPost } from "@/data/blog";
import type {
  Category,
  Paginated,
  Product,
  ProductQuery,
  SortKey,
} from "@/lib/types";

const DB_CONFIGURED = Boolean(process.env.DATABASE_URL);

// Emoji is a presentation accent that doesn't live in the DB — map
// it back on by slug from the static config (falling back to ✦).
const EMOJI_BY_SLUG = new Map(sampleCategories.map((c) => [c.slug, c.emoji]));

// ── Provider ─────────────────────────────────────────────────
let productsCache: Product[] | null = null;
let categoriesCache: Category[] | null = null;

async function loadProducts(): Promise<Product[]> {
  if (productsCache) {
    return productsCache;
  }

  if (!DB_CONFIGURED) {
    productsCache = sampleProducts;
    return productsCache;
  }
  // if (!DB_CONFIGURED) return sampleProducts;
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        videos: { orderBy: { sortOrder: "asc" } },
        category: true,
        collections: true,
        tags: true,
      },
    });
    // if (rows.length === 0) return sampleProducts; // empty DB → keep the demo alive
    if (rows.length === 0) {
      productsCache = sampleProducts;
      return productsCache;
    }
    productsCache = rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      handmadeStory: p.handmadeStory ?? undefined,
      materials: p.materials ?? undefined,
      weight: p.weight ?? undefined,
      dimensions: p.dimensions ?? undefined,
      shippingInfo: p.shippingInfo ?? undefined,
      price: p.price,
      salePrice: p.salePrice,
      currency: p.currency,
      categorySlug: p.category.slug,
      collectionSlugs: p.collections.map((c) => c.slug),
      tags: p.tags.map((t) => t.name),
      images: p.images.map((i) => ({ url: i.url, alt: i.alt ?? undefined })),
      videos: p.videos.map((v) => ({
        url: v.url,
        poster: v.poster ?? undefined,
      })),
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      isNewArrival: p.isNewArrival,
      inventory: p.inventory,
      lowStockAt: p.lowStockAt,
      ratingAvg: p.ratingAvg,
      ratingCount: p.ratingCount,
      soldCount: p.soldCount,
      seoTitle: p.seoTitle ?? undefined,
      seoDescription: p.seoDescription ?? undefined,
      createdAt: p.createdAt.toISOString(),
    }));
    return productsCache;
  } catch (e) {
    console.error("[repository] product load failed, using sample data:", e);
    // return sampleProducts;
    productsCache = sampleProducts;
    return productsCache;
  }
}

async function loadCategories(): Promise<Category[]> {
  if (!DB_CONFIGURED) return sampleCategories;
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.category.findMany({ where: { isActive: true } });
    if (rows.length === 0) return sampleCategories;
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? undefined,
      image: c.image ?? undefined,
      emoji: EMOJI_BY_SLUG.get(c.slug) ?? "✦",
      seoTitle: c.seoTitle ?? undefined,
      seoDescription: c.seoDescription ?? undefined,
      sortOrder: c.sortOrder,
    }));
  } catch (e) {
    console.error("[repository] category load failed, using sample data:", e);
    return sampleCategories;
  }
}

// ── Helpers ──────────────────────────────────────────────────
function effectivePrice(p: Product) {
  return p.salePrice ?? p.price;
}

function sortProducts(items: Product[], sort: SortKey = "featured"): Product[] {
  const copy = [...items];
  switch (sort) {
    case "newest":
      return copy.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      );
    case "bestselling":
      return copy.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
    case "price-asc":
      return copy.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price-desc":
      return copy.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "featured":
    default:
      return copy.sort(
        (a, b) =>
          Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false) ||
          (b.soldCount ?? 0) - (a.soldCount ?? 0),
      );
  }
}

function matchesFilter(p: Product, q: ProductQuery): boolean {
  if (q.categorySlug && p.categorySlug !== q.categorySlug) return false;
  if (q.collectionSlug && !p.collectionSlugs?.includes(q.collectionSlug))
    return false;
  if (q.isNewArrival && !p.isNewArrival) return false;
  if (q.isBestseller && !p.isBestseller) return false;
  if (q.isFeatured && !p.isFeatured) return false;
  if (q.inStockOnly && p.inventory <= 0) return false;
  if (q.minPrice != null && effectivePrice(p) < q.minPrice) return false;
  if (q.maxPrice != null && effectivePrice(p) > q.maxPrice) return false;
  if (q.tags?.length && !q.tags.some((t) => p.tags?.includes(t))) return false;
  if (q.search) {
    const s = q.search.toLowerCase();
    const hay = `${p.name} ${p.description} ${p.tags?.join(" ")}`.toLowerCase();
    if (!hay.includes(s)) return false;
  }
  return true;
}

// ── Public API ───────────────────────────────────────────────

export async function getProducts(
  query: ProductQuery = {},
): Promise<Paginated<Product>> {
  const all = await loadProducts();
  const filtered = all.filter((p) => matchesFilter(p, query));
  const sorted = sortProducts(filtered, query.sort);

  const page = Math.max(1, query.page ?? 1);
  const perPage = query.perPage ?? 24;
  const total = sorted.length;
  const start = (page - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await loadProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return (await getProducts({ isFeatured: true, perPage: limit })).items;
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  return (
    await getProducts({
      isBestseller: true,
      sort: "bestselling",
      perPage: limit,
    })
  ).items;
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return (
    await getProducts({ isNewArrival: true, sort: "newest", perPage: limit })
  ).items;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const all = await loadProducts();
  const explicit = product.relatedSlugs
    ? all.filter((p) => product.relatedSlugs!.includes(p.slug))
    : [];
  if (explicit.length >= limit) return explicit.slice(0, limit);
  // fall back to same-category products
  const sameCat = all.filter(
    (p) => p.categorySlug === product.categorySlug && p.slug !== product.slug,
  );
  return [...explicit, ...sameCat].slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return (await loadCategories()).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return (await loadCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  return (await loadProducts()).map((p) => p.slug);
}

// ── Blog ─────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  return [...blogPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  return blogPosts.map((p) => p.slug);
}
