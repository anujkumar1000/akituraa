import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data/repository";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default async function AdminProducts() {
  const [{ items }, categories] = await Promise.all([
    getProducts({ perPage: 1000 }),
    getCategories(),
  ]);
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-lav-900">Products</h1>
          <p className="text-sm text-muted">{items.length} products</p>
        </div>
        <ButtonLink href="/admin/products/new"><Plus className="h-4 w-4" /> Add product</ButtonLink>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead className="border-b border-lav-150 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="p-3">Product</th>
              <th className="hidden p-3 sm:table-cell">Category</th>
              <th className="p-3">Price</th>
              <th className="hidden p-3 sm:table-cell">Stock</th>
              <th className="hidden p-3 md:table-cell">Flags</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lav-100">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-lav-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                      <ProductMedia url={p.images[0]?.url ?? "placeholder:default"} alt={p.name} sizes="44px" />
                    </div>
                    <div>
                      <p className="font-semibold text-lav-900">{p.name}</p>
                      <p className="text-xs text-muted">{p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden p-3 text-lav-700 sm:table-cell">{catName(p.categorySlug)}</td>
                <td className="p-3">
                  <span className="font-semibold text-lav-900">{formatPrice(p.salePrice ?? p.price)}</span>
                  {p.salePrice && <span className="ml-1 text-xs text-muted line-through">{formatPrice(p.price)}</span>}
                </td>
                <td className="hidden p-3 sm:table-cell">
                  <span className={p.inventory <= (p.lowStockAt ?? 5) ? "font-semibold text-blush-deep" : "text-lav-700"}>{p.inventory}</span>
                </td>
                <td className="hidden p-3 md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {p.isFeatured && <Badge tone="blush">Featured</Badge>}
                    {p.isBestseller && <Badge tone="butter">Best</Badge>}
                    {p.isNewArrival && <Badge tone="mint">New</Badge>}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/products/${p.id}/edit`} className="inline-grid h-8 w-8 place-items-center rounded-full text-lav-600 hover:bg-lav-100" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
