"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [{ url: "placeholder:default", alt: name }];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image with hover-zoom */}
      <div className="group relative aspect-square overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="h-full w-full transition-transform duration-500 ease-soft group-hover:scale-110">
          <ProductMedia
            url={list[active].url}
            alt={list[active].alt ?? name}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Thumbnails */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition-all",
                i === active ? "ring-lav-500" : "ring-transparent hover:ring-lav-300"
              )}
            >
              <ProductMedia url={img.url} alt={img.alt ?? `${name} ${i + 1}`} sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
