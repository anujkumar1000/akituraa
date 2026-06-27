import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/data/repository";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import type { SortKey } from "@/lib/types";

export const revalidate = 60; // ISR — reflect catalog edits in ~1 min
import { SITE } from "@/lib/utils";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: cat.seoTitle ?? `${cat.name} | AKITAURAA`,
    description: cat.seoDescription ?? cat.description,
    alternates: { canonical: `${SITE.url}/category/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const sort = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) as SortKey | undefined;
  const { items, total } = await getProducts({
    categorySlug: slug,
    sort: sort ?? "featured",
    isNewArrival: !!sp.new,
    isBestseller: !!sp.bestseller,
    isFeatured: !!sp.featured,
    inStockOnly: !!sp.instock,
    perPage: 48,
  });

  const others = (await getCategories()).filter((c) => c.slug !== slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE.url}/shop` },
      { "@type": "ListItem", position: 3, name: cat.name, item: `${SITE.url}/category/${cat.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-lav-700">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-lav-700">Shop</Link>
        <span className="mx-1.5">/</span>
        <span className="text-lav-800">{cat.name}</span>
      </nav>

      <header className="mb-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-lav-900 sm:text-4xl">
          <span className="text-4xl">{cat.emoji}</span> {cat.name}
        </h1>
        {cat.description && <p className="mt-1 text-muted">{cat.description}</p>}
      </header>

      <ShopToolbar total={total} />
      <ProductGrid products={items} />

      {/* Related categories */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-lg font-bold text-lav-900">Explore more ✿</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-full border border-lav-200 bg-white px-4 py-2 text-sm font-semibold text-lav-700 hover:bg-lav-100"
            >
              <span className="mr-1">{c.emoji}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
