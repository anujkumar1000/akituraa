"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { SortKey } from "@/lib/types";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "bestselling", label: "Best selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const TOGGLES: { key: string; label: string }[] = [
  { key: "new", label: "New ✿" },
  { key: "bestseller", label: "Bestsellers ★" },
  { key: "featured", label: "Featured ✨" },
  { key: "instock", label: "In stock" },
];

export function ShopToolbar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value?: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function toggle(key: string) {
    setParam(key, params.get(key) ? undefined : "1");
  }

  return (
    <div className="static -mx-4 mb-6 border-b border-lav-200 bg-background/80 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4 lg:sticky lg:top-16 lg:z-30">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">{total} pieces</span>

        <div className="flex flex-wrap gap-1.5">
          {TOGGLES.map((t) => {
            const active = !!params.get(t.key);
            return (
              <button
                key={t.key}
                onClick={() => toggle(t.key)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-lav-600 text-white"
                    : "bg-white text-lav-700 hover:bg-lav-100"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted">Sort</span>
          <select
            value={params.get("sort") ?? "featured"}
            onChange={(e) => setParam("sort", e.target.value)}
            className="rounded-full border border-lav-200 bg-white px-3 py-1.5 text-sm font-semibold text-lav-800 focus:outline-none focus:ring-4 focus:ring-lav-300"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
