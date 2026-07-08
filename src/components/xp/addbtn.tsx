"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { XPButton } from "@/components/xp/core";
import { useCart } from "@/lib/store/cart";

// Thin client island over the existing cart store — no logic change.
export function AddBtn({ product, className }: { product: Product; className?: string }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const soldOut = product.inventory <= 0;

  return (
    <XPButton
      size="sm"
      variant="outline"
      disabled={soldOut}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        add(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
    >
      {soldOut ? "SOLD OUT" : added ? (<>ADDED <Check className="h-3 w-3" /></>) : (<>ADD TO CART <ArrowRight className="h-3 w-3" /></>)}
    </XPButton>
  );
}
