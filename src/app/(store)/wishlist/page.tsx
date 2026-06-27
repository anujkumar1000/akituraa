"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, Share2, Check } from "lucide-react";
import { useWishlist } from "@/lib/store/wishlist";
import { useCart } from "@/lib/store/cart";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const addToCart = useCart((s) => s.add);
  const [mounted, setMounted] = useState(false);
  const [shared, setShared] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">Loading…</div>;

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: "My AKITAURAA wishlist", url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto grid max-w-7xl place-items-center px-4 py-20 text-center sm:px-6">
        <p className="text-6xl">💝</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-lav-900">Your wishlist is empty</h1>
        <p className="mt-1 text-muted">Tap the heart on anything you love ✿</p>
        <ButtonLink href="/shop" className="mt-6">Find something cute 💜</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-lav-900 sm:text-4xl">My wishlist 💝</h1>
        <Button onClick={share} variant="secondary" size="sm">
          {shared ? <><Check className="h-4 w-4" /> Link copied</> : <><Share2 className="h-4 w-4" /> Share</>}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {items.map((it) => {
          const price = it.salePrice ?? it.price;
          return (
            <div key={it.id} className="overflow-hidden rounded-2xl bg-white shadow-soft">
              <Link href={`/products/${it.slug}`} className="relative block aspect-square">
                <ProductMedia url={it.image} alt={it.name} />
              </Link>
              <div className="p-4">
                <Link href={`/products/${it.slug}`} className="line-clamp-1 font-display text-sm font-semibold text-lav-900">{it.name}</Link>
                <p className="mt-1 font-display font-bold text-lav-700">{formatPrice(price)}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      addToCart(
                        { id: it.id, slug: it.slug, name: it.name, images: [{ url: it.image }], price: it.price, salePrice: it.salePrice, inventory: 99, currency: "INR", sku: "", description: "", categorySlug: "", createdAt: "" },
                        1
                      )
                    }
                  >
                    Add to bag
                  </Button>
                  <button onClick={() => remove(it.id)} aria-label="Remove" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-lav-200 text-muted hover:text-blush-deep">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
