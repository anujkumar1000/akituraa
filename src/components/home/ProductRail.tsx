import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Horizontal-scroll on mobile, grid on desktop. Used for Featured,
// Bestsellers and New Arrivals — all fed by the repository.
export function ProductRail({
  eyebrow,
  title,
  subtitle,
  href,
  products,
  priority,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  products: Product[];
  priority?: boolean;
}) {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} href={href} />

      {/* Mobile: snap scroll. Desktop: grid. */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            priority={priority && i < 2}
            className="w-[68vw] shrink-0 snap-start sm:w-auto"
          />
        ))}
      </div>
    </section>
  );
}
