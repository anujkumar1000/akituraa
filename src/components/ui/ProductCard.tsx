import Link from "next/link";
import type { Product } from "@/lib/types";
import { cn, formatPrice, discountPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { WishlistButton } from "@/components/ui/WishlistButton";

export function ProductCard({
  product,
  className,
  priority,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const onSale = product.salePrice != null && product.salePrice < product.price;
  const off = discountPercent(product.price, product.salePrice);
  const lowStock =
    product.inventory > 0 && product.inventory <= (product.lowStockAt ?? 5);

  return (
    <div className={cn("group relative", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="block overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-300 ease-soft hover:-translate-y-1.5 hover:shadow-float"
      >
        <div className="relative aspect-square overflow-hidden">
          <div className="h-full w-full transition-transform duration-500 ease-soft group-hover:scale-105">
            <ProductMedia
              url={product.images[0]?.url ?? "placeholder:default"}
              alt={product.images[0]?.alt ?? product.name}
              priority={priority}
            />
          </div>

          {/* Merch badges (data-driven) */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.isBestseller && <Badge tone="butter">★ Bestseller</Badge>}
            {product.isNewArrival && <Badge tone="mint">New ✿</Badge>}
            {onSale && <Badge tone="danger">-{off}%</Badge>}
          </div>

          {lowStock && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-[#a23b6e] backdrop-blur">
              Only {product.inventory} left!
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="line-clamp-1 font-display text-[15px] font-semibold text-lav-900">
            {product.name}
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted">
            <span className="text-butter">★</span>
            <span className="font-semibold text-lav-700">
              {(product.ratingAvg ?? 0).toFixed(1)}
            </span>
            <span>({product.ratingCount ?? 0})</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-lav-700">
              {formatPrice(onSale ? product.salePrice! : product.price)}
            </span>
            {onSale && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <WishlistButton product={product} className="absolute right-3 top-3" />
    </div>
  );
}
