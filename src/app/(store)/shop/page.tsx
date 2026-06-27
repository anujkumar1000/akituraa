import type { Metadata } from "next";
import { getProducts } from "@/lib/data/repository";
import type { ProductQuery, SortKey } from "@/lib/types";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { ShopToolbar } from "@/components/shop/ShopToolbar";

export const metadata: Metadata = {
  title: "Shop all handmade jewellery",
  description:
    "Browse every AKITAURAA piece — necklaces, earrings, rings, bracelets, chokers, keychains and phone charms. Filter, sort and find your aesthetic.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toQuery(sp: Record<string, string | string[] | undefined>): ProductQuery {
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined));
  return {
    sort: (get("sort") as SortKey) ?? "featured",
    isNewArrival: !!get("new"),
    isBestseller: !!get("bestseller"),
    isFeatured: !!get("featured"),
    inStockOnly: !!get("instock"),
    categorySlug: get("category"),
    minPrice: get("min") ? Number(get("min")) : undefined,
    maxPrice: get("max") ? Number(get("max")) : undefined,
    search: get("q"),
    perPage: 48,
  };
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { items, total } = await getProducts(toQuery(sp));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-2">
        <h1 className="text-3xl font-bold text-lav-900 sm:text-4xl">Shop all 💜</h1>
        <p className="mt-1 text-muted">Handmade pieces for the Gen Z soul.</p>
      </header>

      <ShopToolbar total={total} />
      <ProductGrid products={items} />
    </div>
  );
}
