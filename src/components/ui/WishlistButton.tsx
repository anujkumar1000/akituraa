"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/lib/store/wishlist";
import { cn } from "@/lib/utils";

// Client island so the surrounding ProductCard can stay a Server
// Component. Takes only the minimal product fields it needs.
export function WishlistButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const wished = useWishlist((s) => s.items.some((i) => i.id === product.id));
  const toggle = useWishlist((s) => s.toggle);
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(product);
      }}
      aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={mounted ? wished : undefined}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-white/85 shadow-soft backdrop-blur transition-all hover:scale-110",
        mounted && wished ? "text-blush-deep" : "text-lav-600 hover:text-blush-deep",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", mounted && wished && "fill-blush-deep")} />
    </button>
  );
}
