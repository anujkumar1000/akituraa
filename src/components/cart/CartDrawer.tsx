"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/store/cart";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { ButtonLink } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";

export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const sub = subtotal();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - sub);
  const progress = Math.min(100, (sub / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className={cn("fixed inset-0 z-[60]", isOpen ? "pointer-events-auto" : "pointer-events-none")}>
      <div
        className={cn("absolute inset-0 bg-lav-900/40 transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")}
        onClick={close}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-float transition-transform duration-300 ease-soft",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b border-lav-200 px-5 py-4">
          <h2 className="font-display text-lg font-bold text-lav-900">
            Your bag 💜 {lines.length > 0 && <span className="text-muted">({lines.length})</span>}
          </h2>
          <button onClick={close} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-full hover:bg-lav-100">
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Free shipping progress */}
        {lines.length > 0 && (
          <div className="border-b border-lav-100 px-5 py-3">
            <p className="text-xs text-lav-700">
              {remaining > 0 ? (
                <>You&apos;re <strong>{formatPrice(remaining)}</strong> away from free shipping! 🚚</>
              ) : (
                <>Yay! You&apos;ve unlocked <strong>free shipping</strong> 🎉</>
              )}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-lav-150">
              <div className="h-full rounded-full bg-gradient-to-r from-lav-500 to-blush-deep transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Lines */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <ShoppingBag className="mx-auto h-12 w-12 text-lav-300" />
                <p className="mt-3 font-display font-semibold text-lav-900">Your bag is empty</p>
                <p className="mt-1 text-sm text-muted">Let&apos;s fix that ✿</p>
                <ButtonLink href="/shop" className="mt-4" >Shop now</ButtonLink>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-3">
                  <Link href={`/products/${l.slug}`} onClick={close} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                    <ProductMedia url={l.image} alt={l.name} sizes="80px" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link href={`/products/${l.slug}`} onClick={close} className="line-clamp-1 font-display text-sm font-semibold text-lav-900">
                      {l.name}
                    </Link>
                    {l.variant && <span className="text-xs text-muted">{l.variant}</span>}
                    <span className="text-sm font-bold text-lav-700">{formatPrice(l.unitPrice)}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-lav-200">
                        <button onClick={() => setQty(l.id, l.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-lav-100" aria-label="Decrease">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">{l.quantity}</span>
                        <button onClick={() => setQty(l.id, l.quantity + 1)} disabled={l.quantity >= l.maxQty} className="grid h-8 w-8 place-items-center rounded-full hover:bg-lav-100 disabled:opacity-40" aria-label="Increase">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button onClick={() => remove(l.id)} aria-label="Remove" className="text-muted hover:text-blush-deep">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <footer className="border-t border-lav-200 px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-display text-lg font-bold text-lav-700">{formatPrice(sub)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">Shipping & taxes calculated at checkout.</p>
            <ButtonLink href="/checkout" size="lg" className="mt-3 w-full" >
              Checkout
            </ButtonLink>
            <button onClick={close} className="mt-2 w-full text-center text-sm font-semibold text-lav-600 hover:text-lav-800">
              Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
