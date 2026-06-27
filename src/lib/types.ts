// ─────────────────────────────────────────────────────────────
// Domain types — mirror the Prisma schema but are decoupled from
// it so the UI never imports the DB client. Prices are in paise.
// ─────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  emoji?: string; // kawaii accent per category
  parentId?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder?: number;
}

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductVideo {
  url: string;
  poster?: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  title?: string;
  body?: string;
  images?: string[];
  isVerified?: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  handmadeStory?: string;
  materials?: string;
  weight?: string;
  dimensions?: string;
  shippingInfo?: string;

  /** in paise (INR) */
  price: number;
  /** in paise (INR) */
  salePrice?: number | null;
  currency: string;

  categorySlug: string;
  collectionSlugs?: string[];
  tags?: string[];

  images: ProductImage[];
  videos?: ProductVideo[];

  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;

  inventory: number;
  lowStockAt?: number;

  ratingAvg?: number;
  ratingCount?: number;
  soldCount?: number;

  relatedSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isFeatured?: boolean;
}

// ── Query primitives used by the repository + shop UI ─────────

export type SortKey =
  | "featured"
  | "newest"
  | "bestselling"
  | "price-asc"
  | "price-desc";

export interface ProductFilter {
  categorySlug?: string;
  collectionSlug?: string;
  minPrice?: number; // paise
  maxPrice?: number; // paise
  inStockOnly?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  search?: string;
}

export interface ProductQuery extends ProductFilter {
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
