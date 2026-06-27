"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Minus, Trash2, Tag } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT } from "@/lib/store/cart";
import { findCoupon, couponDiscount, type Coupon } from "@/data/coupons";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { lines, setQty, remove, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">Loading…</div>;

  const sub = subtotal();
  const discount = coupon ? couponDiscount(coupon, sub) : 0;
  const freeShip = sub - discount >= FREE_SHIPPING_THRESHOLD || coupon?.type === "FREE_SHIPPING";
  const shipping = lines.length === 0 || freeShip ? 0 : SHIPPING_FLAT;
  const total = Math.max(0, sub - discount + shipping);

  function applyCoupon() {
    setErr("");
    const c = findCoupon(code);
    if (!c) return setErr("Hmm, that code isn't valid 🥺");
    if (c.minSubtotal && sub < c.minSubtotal) return setErr(`Spend ${formatPrice(c.minSubtotal)} to use this code.`);
    setCoupon(c);
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto grid max-w-7xl place-items-center px-4 py-20 text-center sm:px-6">
        <p className="text-6xl">🛍️</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-lav-900">Your bag is empty</h1>
        <p className="mt-1 text-muted">Time to find your next obsession ✿</p>
        <ButtonLink href="/shop" className="mt-6">Shop the collection 💜</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-lav-900 sm:text-4xl">Your bag 💜</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lines */}
        <ul className="space-y-4">
          {lines.map((l) => (
            <li key={l.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft">
              <Link href={`/products/${l.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <ProductMedia url={l.image} alt={l.name} sizes="96px" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${l.slug}`} className="font-display font-semibold text-lav-900">{l.name}</Link>
                {l.variant && <span className="text-xs text-muted">{l.variant}</span>}
                <span className="text-sm font-bold text-lav-700">{formatPrice(l.unitPrice)}</span>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-lav-200">
                    <button onClick={() => setQty(l.id, l.quantity - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-lav-100" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center font-semibold">{l.quantity}</span>
                    <button onClick={() => setQty(l.id, l.quantity + 1)} disabled={l.quantity >= l.maxQty} className="grid h-9 w-9 place-items-center rounded-full hover:bg-lav-100 disabled:opacity-40" aria-label="Increase"><Plus className="h-4 w-4" /></button>
                  </div>
                  <span className="font-display font-bold text-lav-900">{formatPrice(l.unitPrice * l.quantity)}</span>
                </div>
              </div>
              <button onClick={() => remove(l.id)} aria-label="Remove" className="self-start text-muted hover:text-blush-deep"><Trash2 className="h-5 w-5" /></button>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-lav-900">Order summary</h2>

          {/* Coupon */}
          <div className="mt-4">
            {coupon ? (
              <div className="flex items-center justify-between rounded-xl bg-mint/50 px-3 py-2 text-sm">
                <span className="flex items-center gap-1.5 font-semibold text-[#2f7a5c]"><Tag className="h-4 w-4" />{coupon.code} applied</span>
                <button onClick={() => { setCoupon(null); setCode(""); }} className="text-xs font-semibold text-muted hover:text-foreground">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" className="h-10 flex-1 rounded-full border border-lav-200 px-4 text-sm focus:outline-none focus:ring-4 focus:ring-lav-300" />
                <Button onClick={applyCoupon} variant="secondary" size="sm">Apply</Button>
              </div>
            )}
            {err && <p className="mt-1.5 text-xs text-blush-deep">{err}</p>}
            <p className="mt-1.5 text-xs text-muted">Try <strong>SOFT10</strong> for 10% off ✨</p>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(sub)} />
            {discount > 0 && <Row label="Discount" value={`− ${formatPrice(discount)}`} accent />}
            <Row label="Shipping" value={shipping === 0 ? "FREE 🎉" : formatPrice(shipping)} />
            <div className="my-2 border-t border-lav-150" />
            <Row label="Total" value={formatPrice(total)} big />
          </dl>

          <ButtonLink href="/checkout" size="lg" className="mt-4 w-full">Checkout securely 🔒</ButtonLink>
          <p className="mt-2 text-center text-xs text-muted">Razorpay · UPI · Cards · Wallets</p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, big, accent }: { label: string; value: string; big?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={big ? "font-display font-bold text-lav-900" : "text-muted"}>{label}</dt>
      <dd className={big ? "font-display text-lg font-bold text-lav-700" : accent ? "font-semibold text-[#2f7a5c]" : "font-semibold text-lav-900"}>{value}</dd>
    </div>
  );
}
