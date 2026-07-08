import Link from "next/link";
import type { Product } from "@/lib/types";
import { cn, formatPrice, discountPercent } from "@/lib/utils";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { AddBtn } from "@/components/xp/addbtn";

// Product card as a mini desktop window: titlebar with the SKU,
// framed photo, uppercase mono name, price + ADD TO CART.
export function XPProductCard({
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
  const lowStock = product.inventory > 0 && product.inventory <= (product.lowStockAt ?? 5);

  return (
    <div className={cn("group xp-window relative flex flex-col overflow-hidden rounded-[3px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-float", className)}>
      {/* mini titlebar */}
      <div className="xp-titlebar flex h-6 items-center gap-1.5 px-2">
        <span className="truncate font-nav text-[9px] font-semibold uppercase tracking-[0.14em] text-xp-ink">
          -- {product.sku || "IMG_00X"}
        </span>
        <span className="ml-auto flex items-center gap-1">
          {product.isNewArrival && <Chip>NEW</Chip>}
          {product.isBestseller && <Chip>★</Chip>}
          {onSale && <Chip>-{off}%</Chip>}
        </span>
      </div>

      {/* framed photo */}
      <Link href={`/products/${product.slug}`} className="block border-b border-xp-ink-2 bg-xp-white p-1.5">
        <div className="relative aspect-square overflow-hidden border border-xp-inset">
          <div className="h-full w-full transition-transform duration-500 ease-soft group-hover:scale-105">
            <ProductMedia url={product.images[0]?.url ?? "placeholder:default"} alt={product.images[0]?.alt ?? product.name} priority={priority} />
          </div>
        </div>
      </Link>

      <WishlistButton
        product={product}
        className="absolute right-2.5 top-8 rounded-[2px] border border-xp-ink-2 bg-xp-white/90 text-xp-accent shadow-none"
      />

      {/* info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 font-nav text-[12px] font-semibold uppercase tracking-[0.1em] text-xp-ink transition-colors group-hover:text-xp-accent">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="font-nav text-[13px] font-semibold text-xp-accent">
            {formatPrice(onSale ? product.salePrice! : product.price)}
          </span>
          {onSale && <span className="font-nav text-[11px] text-xp-muted line-through">{formatPrice(product.price)}</span>}
        </div>
        {lowStock && (
          <p className="font-nav text-[9px] uppercase tracking-[0.12em] text-xp-pink">only {product.inventory} left</p>
        )}
        <AddBtn product={product} className="mt-auto w-full" />
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[1px] border border-xp-ink-2 bg-xp-white px-1 font-nav text-[8px] font-semibold uppercase tracking-wide text-xp-ink">
      {children}
    </span>
  );
}
