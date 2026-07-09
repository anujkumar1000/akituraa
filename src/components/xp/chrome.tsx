"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Menu,
  X,
  Wifi,
  Volume2,
  Sparkles,
} from "lucide-react";
import type { Category } from "@/lib/types";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { WinControls } from "@/components/xp/core";
import { cn } from "@/lib/utils";

/* ── Top bar: the application window title ─────────────────── */

export function TitleBarTop() {
  return (
    <div className="sticky top-0 z-[60] border-b border-xp-ink-2 bg-xp-titlebar">
      <div className="mx-auto flex h-9 max-w-[1440px] items-center gap-2 px-3">
        <Sparkles className="h-3.5 w-3.5 text-xp-accent" />
        <span className="font-nav text-[11px] font-semibold uppercase tracking-[0.14em] text-xp-ink">
          AKITAURAA.EXE
        </span>
        <WinControls set="mxc" />
      </div>
    </div>
  );
}

/* ── Bottom taskbar ─────────────────────────────────────────── */

const TAB_LABELS: [string, string][] = [
  ["/products", "ITEM_VIEWER.EXE"],
  ["/category", "CATEGORY.EXE"],
  ["/checkout", "CHECKOUT.EXE"],
  ["/wishlist", "WISHLIST.EXE"],
  ["/account", "ACCOUNT.EXE"],
  ["/order", "ORDER.EXE"],
  ["/shop", "SHOP.EXE"],
  ["/blog", "LOOKBOOK.EXE"],
  ["/about", "ABOUT.EXE"],
  ["/contact", "CONTACT.EXE"],
  ["/cart", "CART.EXE"],
];

function tabLabel(pathname: string) {
  if (pathname === "/") return "WELCOME_TO_AKITAURAA";
  return (
    TAB_LABELS.find(([p]) => pathname.startsWith(p))?.[1] ?? "AKITAURAA.EXE"
  );
}

function Clock() {
  const [time, setTime] = useState("11:11 PM");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-nav text-[11px] uppercase tracking-wide text-xp-ink">
      {time}
    </span>
  );
}

export function TaskbarBottom() {
  const pathname = usePathname();
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-xp-ink-2 bg-xp-titlebar">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center gap-2 px-2 sm:px-3">
        <button className="flex h-7 items-center gap-1.5 rounded-[2px] border border-xp-ink-2 bg-xp-panel px-3 font-nav text-[11px] font-semibold uppercase tracking-wide text-xp-ink shadow-[1px_1px_0_rgba(68,58,104,0.3)] active:translate-y-[1px] active:shadow-none">
          <Sparkles className="h-3 w-3 text-xp-accent" /> START
        </button>
        <span className="hidden h-7 items-center gap-1.5 rounded-[2px] border border-xp-ink-2 bg-xp-inset px-3 font-nav text-[10px] uppercase tracking-wide text-xp-ink sm:flex">
          {tabLabel(pathname)}{" "}
          <Heart className="h-3 w-3 fill-xp-pink text-xp-pink" />
        </span>
        <p className="mx-auto hidden font-nav text-[10px] uppercase tracking-[0.12em] text-xp-muted md:block">
          © 2024 AKITAURAA. ALL RIGHTS RESERVED.
        </p>
        <span className="ml-auto flex items-center gap-2 md:ml-0">
          <Wifi className="h-3.5 w-3.5 text-xp-ink-2" />
          <Volume2 className="h-3.5 w-3.5 text-xp-ink-2" />
          <Clock />
        </span>
      </div>
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────────── */

export function Navbar({ categories }: { categories: Category[] }) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const openCart = useCart((s) => s.open);
  const wishCount = useWishlist((s) => s.items.length);
  useEffect(() => setMounted(true), []);

  const nav = [
    { label: "HOME", href: "/" },
    {
      label: "SHOP",
      href: "/shop",
      dropdown: categories.map((c) => ({
        label: c.name.toUpperCase(),
        href: `/category/${c.slug}`,
      })),
    },
    {
      label: "COLLECTIONS",
      href: "/shop?featured=1",
      dropdown: [
        { label: "FEATURED", href: "/shop?featured=1" },
        { label: "BESTSELLERS", href: "/shop?bestseller=1" },
        { label: "NEW ARRIVALS", href: "/shop?sort=newest" },
      ],
    },
    { label: "ABOUT", href: "/about" },
    { label: "LOOKBOOK", href: "/blog" },
    { label: "CONTACT", href: "/contact" },
  ];

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
  }

  return (
    <header className="sticky top-9 z-50 border-b border-xp-ink-2 bg-xp-window">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-3 px-3 sm:px-5">
        {/* mobile menu */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-[2px] border border-xp-ink-2 bg-xp-panel text-xp-ink lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* logo + doodles */}
        <Link href="/" className="relative flex flex-col leading-none">
          <span className="relative font-logo text-3xl font-bold  tracking-tight text-xp-ink sm:text-4xl">
            Akitauraa
            <svg
              aria-hidden
              viewBox="0 0 40 40"
              className="absolute -right-7 -top-2 h-7 w-7 text-xp-accent"
            >
              <path
                d="M20 4 l2.5 6.5 L29 13 l-6.5 2.5 L20 22 l-2.5-6.5 L11 13 l6.5-2.5 Z"
                fill="currentColor"
              />
              <path
                d="M32 24 l1.4 3.6 3.6 1.4 -3.6 1.4 -1.4 3.6 -1.4-3.6 -3.6-1.4 3.6-1.4 Z"
                fill="currentColor"
                opacity="0.7"
              />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 120 44"
              className="pointer-events-none absolute -left-3 -top-2 h-[44px] w-[120%] text-xp-ink-2 opacity-40"
            >
              <ellipse
                cx="60"
                cy="22"
                rx="58"
                ry="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            </svg>
          </span>
          <span className="mt-1 font-nav text-[9px] tracking-[0.14em] text-xp-muted">
            jewelry for every version of you.
          </span>
        </Link>

        {/* center nav */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {nav.map((n) => {
            const active =
              n.href === "/"
                ? pathname === "/"
                : pathname.startsWith(n.href.split("?")[0]) && n.href !== "/";
            return (
              <div key={n.label} className="group relative">
                <Link
                  href={n.href}
                  className={cn(
                    "flex items-center gap-1 rounded-[2px] px-3 py-1.5 font-nav text-[11px] font-medium uppercase tracking-[0.12em] transition-colors",
                    active
                      ? "border border-xp-ink-2 bg-xp-highlight text-xp-ink"
                      : "border border-transparent text-xp-ink-2 hover:border-xp-ink-2 hover:bg-xp-panel",
                  )}
                >
                  {n.label}
                  {n.dropdown && <ChevronDown className="h-3 w-3" />}
                </Link>
                {n.dropdown && (
                  <div className="invisible absolute left-0 top-full z-50 pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="xp-window min-w-44 rounded-[3px] p-1">
                      {n.dropdown.map((d) => (
                        <Link
                          key={d.href}
                          href={d.href}
                          className="block rounded-[2px] px-3 py-1.5 font-nav text-[10px] uppercase tracking-[0.12em] text-xp-ink-2 hover:bg-xp-highlight hover:text-xp-ink"
                        >
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* right cluster */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <form onSubmit={submitSearch} className="relative hidden md:block">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="search..."
              className="h-9 w-44 rounded-[2px] border border-xp-ink-2 bg-xp-white px-3 pr-8 font-nav text-[11px] lowercase text-xp-ink placeholder:text-xp-muted focus:outline-none focus:ring-2 focus:ring-xp-accent"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xp-ink-2 hover:text-xp-ink"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <Link
            href="/account"
            aria-label="Account"
            className="grid h-9 w-9 place-items-center rounded-[2px] text-xp-ink-2 hover:bg-xp-panel hover:text-xp-ink"
          >
            <User className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="flex items-center gap-1 rounded-[2px] px-1.5 py-1 text-xp-ink-2 hover:bg-xp-panel hover:text-xp-ink"
          >
            <Heart className="h-4.5 w-4.5" />
            <span className="font-nav text-[11px]">
              ({mounted ? wishCount : 0})
            </span>
          </Link>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="flex items-center gap-1 rounded-[2px] px-1.5 py-1 text-xp-ink-2 hover:bg-xp-panel hover:text-xp-ink cursor-pointer"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span className="font-nav text-[11px]">
              ({mounted ? cartCount : 0})
            </span>
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[70] lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-xp-ink/40 transition-opacity",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[85%] max-w-[320px] overflow-y-auto border-r border-xp-ink-2 bg-xp-window p-3 transition-transform duration-300 ease-soft",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="xp-titlebar -m-3 mb-3 flex h-9 items-center gap-2 border-b border-xp-ink-2 px-3">
            <span className="font-nav text-[11px] font-semibold uppercase tracking-widest text-xp-ink">
              -- MENU.EXE
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="ml-auto grid h-5 w-5 place-items-center rounded-[2px] border border-xp-ink-2 bg-xp-panel text-[10px]"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <nav
            onClick={() => setMenuOpen(false)}
            className="flex flex-col gap-0.5"
          >
            {nav.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="rounded-[2px] px-3 py-2.5 font-nav text-[12px] uppercase tracking-[0.12em] text-xp-ink hover:bg-xp-highlight"
              >
                {n.label}
              </Link>
            ))}
            <p className="mt-3 px-3 font-nav text-[9px] uppercase tracking-widest text-xp-muted">
              categories
            </p>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="rounded-[2px] px-3 py-2 font-nav text-[11px] uppercase tracking-[0.12em] text-xp-ink-2 hover:bg-xp-highlight hover:text-xp-ink"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </header>
  );
}
