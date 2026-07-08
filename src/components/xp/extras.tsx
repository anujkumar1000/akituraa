import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductMedia } from "@/components/ui/ProductMedia";

/* ── Marquee info strip ────────────────────────────────────── */

const ITEMS = [
  "FREE SHIPPING ON ORDERS OVER ₹999",
  "WORLDWIDE SHIPPING",
  "MADE TO LAST",
  "DESIGNED TO STAND OUT",
  "SECURE CHECKOUT",
];

export function MarqueeStrip() {
  const track = [...ITEMS, ...ITEMS];
  return (
    <div className="xp-window overflow-hidden rounded-[3px] bg-xp-panel py-2.5">
      <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap">
        {track.map((t, i) => (
          <span key={i} className="flex items-center gap-6 font-nav text-[10px] font-medium uppercase tracking-[0.16em] text-xp-ink-2">
            {t}
            <span aria-hidden className="text-xp-accent">✦·˙</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── FOR HER / FOR HIM / UNISEX PICKS cards ────────────────── */

function PixelSmiley({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ shapeRendering: "crispEdges" }} aria-hidden>
      <rect width="24" height="24" fill="#f7f4fc" />
      <rect x="6" y="7" width="3" height="5" fill="#443a68" />
      <rect x="15" y="7" width="3" height="5" fill="#443a68" />
      <rect x="6" y="16" width="2" height="2" fill="#443a68" />
      <rect x="8" y="18" width="8" height="2" fill="#443a68" />
      <rect x="16" y="16" width="2" height="2" fill="#443a68" />
    </svg>
  );
}

function PixelHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ shapeRendering: "crispEdges" }} aria-hidden>
      <rect width="24" height="24" fill="#f7f4fc" />
      <g fill="#b492d8">
        <rect x="5" y="6" width="5" height="4" /><rect x="14" y="6" width="5" height="4" />
        <rect x="3" y="8" width="18" height="5" /><rect x="5" y="13" width="14" height="3" />
        <rect x="8" y="16" width="8" height="3" /><rect x="10" y="19" width="4" height="2" />
      </g>
    </svg>
  );
}

const CARDS = [
  { label: "FOR HER", href: "/shop", sticker: "smiley" as const },
  { label: "FOR HIM", href: "/shop?bestseller=1", sticker: "smiley" as const },
  { label: "UNISEX PICKS", href: "/shop?sort=newest", sticker: "heart" as const },
];

export function CategoryCards({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {CARDS.map((c, i) => {
        const p = products[i];
        const url = p?.images[0]?.url ?? `placeholder:card-${i}`;
        return (
          <Link key={c.label} href={c.href} className="group xp-window overflow-hidden rounded-[3px] transition-transform duration-200 hover:-translate-y-0.5">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="font-nav text-[12px] font-semibold uppercase tracking-[0.14em] text-xp-ink">{c.label}</span>
              <ArrowRight className="h-4 w-4 text-xp-ink transition-transform group-hover:translate-x-1" />
            </div>
            <div className="border-t border-xp-ink-2 bg-xp-white p-1.5">
              <div className="relative aspect-[4/3] overflow-hidden border border-xp-inset">
                <div className="h-full w-full transition-transform duration-500 ease-soft group-hover:scale-105">
                  <ProductMedia url={url} alt={p?.name ?? c.label} sizes="(max-width:640px) 100vw, 33vw" />
                </div>
                {c.sticker === "smiley" ? (
                  <PixelSmiley className="absolute bottom-2 left-2 h-10 w-10 border border-xp-ink-2 shadow-[2px_2px_0_rgba(68,58,104,0.25)]" />
                ) : (
                  <PixelHeart className="absolute bottom-2 left-2 h-10 w-10 border border-xp-ink-2 shadow-[2px_2px_0_rgba(68,58,104,0.25)]" />
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
