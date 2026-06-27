"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Search, ShoppingBag, Menu, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";

const mainNav = [
  { label: "Shop", href: "/shop" },
  { label: "New", href: "/shop?sort=newest" },
  { label: "Bestsellers", href: "/shop?bestseller=1" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Header({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const openCart = useCart((s) => s.open);
  const wishCount = useWishlist((s) => s.items.length);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          className="grid h-10 w-10 place-items-center rounded-full text-lav-700 hover:bg-lav-100 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="font-display text-2xl font-bold tracking-tight text-lav-700">
          akitauraa<span className="text-blush-deep">.</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-lav-800 transition-colors hover:bg-lav-100 hover:text-lav-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/search" aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-lav-700 hover:bg-lav-100">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-full text-lav-700 hover:bg-lav-100">
            <Heart className="h-5 w-5" />
            {mounted && wishCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-lav-500 px-1 text-[10px] font-bold text-white">
                {wishCount}
              </span>
            )}
          </Link>
          <button onClick={openCart} aria-label="Open cart" className="relative grid h-10 w-10 place-items-center rounded-full text-lav-700 hover:bg-lav-100">
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-blush-deep px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category strip (desktop) */}
      <div className="hidden border-t border-white/50 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-6 py-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-full px-3 py-1.5 text-sm text-lav-700 transition-colors hover:bg-lav-100"
            >
              <span className="mr-1">{c.emoji}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-lav-900/30 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[82%] max-w-sm overflow-y-auto bg-background p-5 shadow-float transition-transform duration-300 ease-soft",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xl font-bold text-lav-700">akitauraa.</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-lav-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-6 flex flex-col gap-1" onClick={() => setOpen(false)}>
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl px-3 py-3 font-display font-semibold text-lav-900 hover:bg-lav-100">
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-wide text-muted">Categories</p>
          <nav className="mt-1 flex flex-col gap-1" onClick={() => setOpen(false)}>
            {categories.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="rounded-xl px-3 py-2.5 text-lav-800 hover:bg-lav-100">
                <span className="mr-2">{c.emoji}</span>
                {c.name}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </header>
  );
}
