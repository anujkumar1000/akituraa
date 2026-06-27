"use client";

import { useState } from "react";
import { Heart, Minus, Plus, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";

// Quantity stepper + add-to-cart. Renders inline in the product
// info column AND as a sticky bottom bar on mobile (variant prop).
// Hook the onAdd into your cart store (Zustand) — stubbed here.
export function AddToCart({
  product,
  variant = "inline",
}: {
  product: Product;
  variant?: "inline" | "sticky";
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.inventory <= 0;
  const addToCart = useCart((s) => s.add);
  const wished = useWishlist((s) => s.items.some((i) => i.id === product.id));
  const toggleWish = useWishlist((s) => s.toggle);

  function add() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const stepper = (
    <div className="flex items-center rounded-full border border-lav-200 bg-white">
      <button
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className="grid h-11 w-11 place-items-center rounded-full text-lav-700 hover:bg-lav-100"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center font-display font-semibold">{qty}</span>
      <button
        onClick={() => setQty((q) => Math.min(product.inventory, q + 1))}
        className="grid h-11 w-11 place-items-center rounded-full text-lav-700 hover:bg-lav-100"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );

  if (variant === "sticky") {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-lav-200 bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <span className="font-display text-lg font-bold text-lav-700">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          <Button onClick={add} disabled={soldOut} className="ml-auto flex-1">
            {soldOut ? "Sold out" : added ? "Added ✓" : "Add to cart 💜"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {stepper}
        <Button onClick={add} disabled={soldOut} size="lg" className="flex-1">
          {soldOut ? (
            "Sold out 🥺"
          ) : added ? (
            <>
              <Check className="h-5 w-5" /> Added!
            </>
          ) : (
            "Add to cart 💜"
          )}
        </Button>
        <button
          onClick={() => toggleWish(product)}
          className={cn(
            "grid h-14 w-14 shrink-0 place-items-center rounded-full border border-lav-200 bg-white transition-colors",
            wished ? "text-blush-deep" : "text-lav-600 hover:text-blush-deep"
          )}
          aria-label="Add to wishlist"
          aria-pressed={wished}
        >
          <Heart className={cn("h-5 w-5", wished && "fill-blush-deep")} />
        </button>
      </div>
      <a href="/checkout" onClick={() => addToCart(product, qty)} className="contents">
        <Button variant="outline" size="lg" disabled={soldOut} className="w-full">
          Buy it now
        </Button>
      </a>
    </div>
  );
}
