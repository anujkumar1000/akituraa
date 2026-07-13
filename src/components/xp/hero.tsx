import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { XPWindow, XPLink, WinControls } from "@/components/xp/core";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { SystemMessage } from "@/components/xp/sysmsg";

/* ── Pixel-art sky: clouds, saturn, sparkles, dither ───────── */

function PixelSky() {
  // px() renders a rect grid string into pixel rects
  const cloud = ["..XXXX....", ".XXXXXX.XX", "XXXXXXXXXX"];
  const px = (
    grid: string[],
    x0: number,
    y0: number,
    s: number,
    fill: string,
    opacity = 1,
  ) => {
    const rects: React.ReactNode[] = [];
    grid.forEach((row, y) =>
      row.split("").forEach((ch, x) => {
        if (ch === "X")
          rects.push(
            <rect
              key={`${x0}-${y0}-${x}-${y}`}
              x={x0 + x * s}
              y={y0 + y * s}
              width={s}
              height={s}
              fill={fill}
              opacity={opacity}
            />,
          );
      }),
    );
    return rects;
  };

  return (
    <svg
      aria-hidden
      viewBox="0 0 800 460"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ shapeRendering: "crispEdges" }}
    >
      {/* clouds */}
      <g>{px(cloud, 40, 36, 9, "#f7f4fc")}</g>
      <g>{px(cloud, 250, 70, 7, "#f0ebf9")}</g>
      <g>{px(cloud, 120, 380, 8, "#f0ebf9", 0.9)}</g>
      <g>{px(cloud, 520, 400, 7, "#f7f4fc", 0.8)}</g>

      {/* saturn */}
      <g transform="translate(120 120)">
        <circle cx="0" cy="0" r="22" fill="#c1b3e6" />
        <circle cx="-7" cy="-6" r="4" fill="#d6cbec" />
        <circle cx="8" cy="4" r="3" fill="#a996d6" />
        <ellipse
          cx="0"
          cy="2"
          rx="38"
          ry="10"
          fill="none"
          stroke="#6f61ad"
          strokeWidth="3"
          transform="rotate(-14)"
        />
      </g>

      {/* sparkles + */}
      <g fill="#6f61ad">
        <path d="M320 40 l3 8 8 3 -8 3 -3 8 -3-8 -8-3 8-3z" />
        <path
          d="M690 90 l2.5 7 7 2.5 -7 2.5 -2.5 7 -2.5-7 -7-2.5 7-2.5z"
          opacity="0.7"
        />
        <path d="M600 300 l2 6 6 2 -6 2 -2 6 -2-6 -6-2 6-2z" opacity="0.6" />
        <rect x="440" y="150" width="3" height="13" />
        <rect x="435" y="155" width="13" height="3" />
        <rect x="70" y="250" width="3" height="11" />
        <rect x="66" y="254" width="11" height="3" />
      </g>

      {/* dither clusters */}
      <g fill="#a996d6" opacity="0.55">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect
            key={`d1-${i}`}
            x={640 + (i % 4) * 10}
            y={210 + Math.floor(i / 4) * 10}
            width="5"
            height="5"
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={`d2-${i}`}
            x={30 + (i % 3) * 10}
            y={320 + Math.floor(i / 3) * 10}
            width="5"
            height="5"
          />
        ))}
      </g>

      {/* pixel mountain, bottom-left */}
      <g fill="#c1b3e6" opacity="0.8">
        {Array.from({ length: 9 }).map((_, i) => (
          <rect
            key={`m-${i}`}
            x={i * 14}
            y={460 - (i < 5 ? i + 1 : 9 - i) * 14}
            width="14"
            height={(i < 5 ? i + 1 : 9 - i) * 14}
          />
        ))}
      </g>
    </svg>
  );
}

/* ── Small image-viewer window ─────────────────────────────── */

export function ImgWindow({
  title,
  url,
  alt,
  className,
}: {
  title: string;
  url: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`xp-window overflow-hidden rounded-[3px] ${className ?? ""}`}
    >
      <div className="xp-titlebar flex h-6 items-center gap-1.5 px-1.5">
        <span
          aria-hidden
          className="grid h-3.5 w-3.5 place-items-center rounded-[1px] border border-xp-ink-2 bg-xp-panel text-[7px] text-xp-ink"
        >
          ✕
        </span>
        <span className="truncate font-nav text-[9px] font-semibold uppercase tracking-[0.14em] text-xp-ink">
          {title}
        </span>
        <span
          aria-hidden
          className="ml-auto grid h-3.5 w-3.5 place-items-center rounded-[1px] border border-xp-ink-2 bg-xp-panel text-[7px] text-xp-ink"
        >
          ✕
        </span>
      </div>
      <div className="bg-xp-white p-1">
        <div className="relative aspect-square overflow-hidden border border-xp-inset">
          <ProductMedia url={url} alt={alt} sizes="260px" priority />
        </div>
      </div>
    </div>
  );
}

/* ── Hero window ───────────────────────────────────────────── */

export function HeroWindow({ products }: { products: Product[] }) {
  const img = (i: number) =>
    products[i]?.images[0]?.url ?? `placeholder:hero-${i}`;
  const alt = (i: number) => products[i]?.name ?? "AKITAURAA piece";

  return (
    <section className="xp-window overflow-hidden rounded-[3px]">
      <div className="xp-titlebar flex h-8 items-center gap-2 px-2.5">
        <span aria-hidden className="font-nav text-[10px] text-xp-ink-2">
          ♪-
        </span>
        <span className="font-nav text-[11px] font-semibold uppercase tracking-[0.14em] text-xp-ink">
          WELCOME_TO_AKITAURAA
        </span>
        <WinControls set="mxc" />
      </div>

      <div className="relative bg-xp-window">
        <PixelSky />

        <div className="relative grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_420px] lg:gap-4 lg:p-10">
          {/* Copy */}
          <div className="max-w-md">
            <h1 className="font-pixel text-[34px] leading-none tracking-tight text-xp-accent sm:text-5xl lg:text-[54px]">
              AKITAURAA
            </h1>
            <p className="mt-6 font-nav text-[13px] font-medium uppercase leading-relaxed tracking-[0.14em] text-xp-ink sm:text-sm">
              JEWELRY FOR EVERY MOOD,
              <br />
              EVERY PERSON, EVERY DAY.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <XPLink href="/shop" variant="solid" size="lg">
                SHOP ALL <ArrowRight className="h-4 w-4" />
              </XPLink>
              <XPLink href="/shop?featured=1" variant="outline" size="lg">
                EXPLORE COLLECTIONS
              </XPLink>
            </div>
            <div className="mt-10 flex justify-center">
              <div className="animate-pulse rounded-md border-2 border-xp-accent bg-xp-white px-5 py-3 shadow-[4px_4px_0px_rgba(111,97,173,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(111,97,173,0.45)]">
                <p className="font-nav text-[15px] font-extrabold uppercase tracking-[0.12em] text-xp-accent">
                  🎁 FREE SHIPPING + FREEBIES
                </p>
                <p className="mt-1 text-center font-nav text-[12px] font-semibold uppercase tracking-[0.08em] text-xp-ink">
                  ON ORDERS ABOVE <span className="text-xp-accent">₹499</span>{" "}
                  🎀
                </p>
              </div>
            </div>
          </div>

          {/* Overlapping image-viewer windows (desktop) */}
          <div className="relative hidden h-[430px] lg:block">
            <ImgWindow
              title="IMG_001"
              url={img(0)}
              alt={alt(0)}
              className="absolute right-8 top-0 z-10 w-56"
            />
            <ImgWindow
              title="IMG_002"
              url={img(1)}
              alt={alt(1)}
              className="absolute left-0 top-40 z-20 w-52"
            />
            <ImgWindow
              title="IMG_003"
              url={img(2)}
              alt={alt(2)}
              className="absolute bottom-0 right-0 z-30 w-56"
            />
            <SystemMessage className="absolute -right-2 top-24 z-40" />
          </div>

          {/* Mobile: stacked simplified layout */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            <ImgWindow title="IMG_001" url={img(0)} alt={alt(0)} />
            <ImgWindow title="IMG_002" url={img(1)} alt={alt(1)} />
            <div className="col-span-2 flex justify-center">
              <SystemMessage />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
