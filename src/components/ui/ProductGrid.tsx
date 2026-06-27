import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="grid place-items-center rounded-3xl bg-white/60 py-20 text-center">
        <p className="text-5xl">🫧</p>
        <p className="mt-3 font-display text-lg font-semibold text-lav-900">
          Nothing here yet
        </p>
        <p className="mt-1 text-sm text-muted">Try adjusting your filters ✿</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
