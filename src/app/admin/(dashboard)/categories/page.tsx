import { getProducts, getCategories } from "@/lib/data/repository";

export default async function AdminCategories() {
  const [categories, { items }] = await Promise.all([
    getCategories(),
    getProducts({ perPage: 1000 }),
  ]);
  const countFor = (slug: string) => items.filter((p) => p.categorySlug === slug).length;

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-lav-900">Categories</h1>
      <p className="mb-5 text-sm text-muted">
        {categories.length} categories · defined in <code className="rounded bg-lav-100 px-1.5 py-0.5">src/data/categories.ts</code> (or the DB)
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white p-5 text-center shadow-soft">
            <span className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-gradient-to-br from-lav-200 to-blush text-3xl">{c.emoji}</span>
            <p className="mt-3 font-display font-semibold text-lav-900">{c.name}</p>
            <p className="text-xs text-muted">{countFor(c.slug)} products</p>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-2xl bg-butter/50 px-4 py-3 text-sm text-[#8a6d1a]">
        💡 Adding a new category = one entry in the categories source (or a DB row). Nav, filters, and the category page pick it up automatically.
      </p>
    </div>
  );
}
