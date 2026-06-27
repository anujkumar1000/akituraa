import Link from "next/link";
import { Package, Sparkles, AlertTriangle, FolderTree, Star, TrendingUp, Plus } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data/repository";
import { RAZORPAY_CONFIGURED } from "@/lib/razorpay";
import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminDashboard() {
  const [{ items: products }, categories] = await Promise.all([
    getProducts({ perPage: 1000 }),
    getCategories(),
  ]);

  const lowStock = products.filter((p) => p.inventory > 0 && p.inventory <= (p.lowStockAt ?? 5));
  const outOfStock = products.filter((p) => p.inventory <= 0);
  const featured = products.filter((p) => p.isFeatured).length;
  const bestsellers = products.filter((p) => p.isBestseller).length;
  const collections = new Set(products.flatMap((p) => p.collectionSlugs ?? [])).size;
  const inventoryValue = products.reduce((s, p) => s + (p.salePrice ?? p.price) * p.inventory, 0);

  const dbConfigured = Boolean(process.env.DATABASE_URL);

  const stats = [
    { label: "Products", value: products.length, icon: Package, tone: "bg-lav-200 text-lav-700" },
    { label: "Categories", value: categories.length, icon: FolderTree, tone: "bg-sky text-[#2c6ca3]" },
    { label: "Collections", value: collections, icon: Star, tone: "bg-butter text-[#8a6d1a]" },
    { label: "Featured", value: featured, icon: Sparkles, tone: "bg-blush text-[#a23b6e]" },
    { label: "Bestsellers", value: bestsellers, icon: TrendingUp, tone: "bg-mint text-[#2f7a5c]" },
    { label: "Low / out of stock", value: `${lowStock.length} / ${outOfStock.length}`, icon: AlertTriangle, tone: "bg-blush-deep/20 text-[#a23b6e]" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-lav-900">Dashboard ✨</h1>
          <p className="text-sm text-muted">Welcome back! Here&apos;s your store at a glance.</p>
        </div>
        <ButtonLink href="/admin/products/new"><Plus className="h-4 w-4" /> Add product</ButtonLink>
      </div>

      {/* Connection notices */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Notice ok={dbConfigured} okText="Database connected" badText="Database not connected — showing sample catalog (read-only). Set DATABASE_URL + run db:push to manage live data." />
        <Notice ok={RAZORPAY_CONFIGURED} okText="Razorpay connected" badText="Razorpay keys not set — checkout runs in mock mode. Add RAZORPAY_KEY_ID/SECRET to go live." />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 shadow-soft">
            <span className={`grid h-9 w-9 place-items-center rounded-full ${s.tone}`}><s.icon className="h-4 w-4" /></span>
            <p className="mt-3 font-display text-2xl font-bold text-lav-900">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-soft">
        <p className="text-xs text-muted">Inventory value (at current prices)</p>
        <p className="font-display text-2xl font-bold text-lav-700">{formatPrice(inventoryValue)}</p>
      </div>

      {/* Low stock table */}
      <section className="mt-6 rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="mb-3 font-display text-lg font-bold text-lav-900">Needs attention ⚠️</h2>
        {lowStock.length === 0 && outOfStock.length === 0 ? (
          <p className="text-sm text-muted">Everything&apos;s well stocked. Nice! 💜</p>
        ) : (
          <ul className="divide-y divide-lav-100">
            {[...outOfStock, ...lowStock].map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5">
                <Link href={`/admin/products/${p.id}/edit`} className="font-semibold text-lav-800 hover:text-lav-600">{p.name}</Link>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.inventory <= 0 ? "bg-blush-deep text-white" : "bg-butter text-[#8a6d1a]"}`}>
                  {p.inventory <= 0 ? "Out of stock" : `${p.inventory} left`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Notice({ ok, okText, badText }: { ok: boolean; okText: string; badText: string }) {
  return (
    <div className={`rounded-2xl px-4 py-3 text-sm ${ok ? "bg-mint/50 text-[#2f7a5c]" : "bg-butter/60 text-[#8a6d1a]"}`}>
      <span className="font-semibold">{ok ? "✓ " : "⚠ "}</span>
      {ok ? okText : badText}
    </div>
  );
}
