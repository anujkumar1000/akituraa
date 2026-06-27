"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export interface CartLine {
  id: string; // product id (+ variant key if any)
  slug: string;
  name: string;
  image: string;
  unitPrice: number; // paise (sale price if any)
  quantity: number;
  variant?: string;
  maxQty: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product, qty?: number, variant?: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  // derived
  count: () => number;
  subtotal: () => number;
}

export const FREE_SHIPPING_THRESHOLD = 99900; // ₹999 in paise
export const SHIPPING_FLAT = 4900; // ₹49

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      add: (product, qty = 1, variant) => {
        const id = variant ? `${product.id}:${variant}` : product.id;
        const unitPrice = product.salePrice ?? product.price;
        set((s) => {
          const existing = s.lines.find((l) => l.id === id);
          if (existing) {
            return {
              isOpen: true,
              lines: s.lines.map((l) =>
                l.id === id
                  ? { ...l, quantity: Math.min(l.maxQty, l.quantity + qty) }
                  : l
              ),
            };
          }
          return {
            isOpen: true,
            lines: [
              ...s.lines,
              {
                id,
                slug: product.slug,
                name: product.name,
                image: product.images[0]?.url ?? "placeholder:default",
                unitPrice,
                quantity: Math.min(product.inventory, qty),
                variant,
                maxQty: product.inventory,
              },
            ],
          };
        });
      },

      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),

      setQty: (id, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) =>
              l.id === id ? { ...l, quantity: Math.max(0, Math.min(l.maxQty, qty)) } : l
            )
            .filter((l) => l.quantity > 0),
        })),

      clear: () => set({ lines: [] }),

      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    }),
    { name: "akitauraa-cart" }
  )
);
