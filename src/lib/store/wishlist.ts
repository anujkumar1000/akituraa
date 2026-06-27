"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export interface WishItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number | null;
}

interface WishlistState {
  items: WishItem[];
  has: (id: string) => boolean;
  toggle: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (id) => get().items.some((i) => i.id === id),
      toggle: (product) =>
        set((s) => {
          if (s.items.some((i) => i.id === product.id)) {
            return { items: s.items.filter((i) => i.id !== product.id) };
          }
          return {
            items: [
              ...s.items,
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0]?.url ?? "placeholder:default",
                price: product.price,
                salePrice: product.salePrice,
              },
            ],
          };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "akitauraa-wishlist" }
  )
);
