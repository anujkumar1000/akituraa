// export default function SearchPage() {
//   return (
//     <div className="mx-auto max-w-4xl px-4 py-20">
//       <h1 className="text-3xl font-bold">Search Products</h1>

//       <input
//         type="text"
//         placeholder="Search jewellery..."
//         className="mt-6 w-full rounded-xl border p-4"
//       />
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { sampleProducts } from "@/data/products";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return sampleProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.categorySlug?.toLowerCase().includes(q) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-display font-bold text-lav-900">
        Search Products
      </h1>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-lav-500" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search earrings, necklaces, chokers..."
          className="w-full rounded-full border border-lav-300 bg-white px-14 py-4 text-lg outline-none focus:border-lav-500"
        />
      </div>

      {query && (
        <p className="mt-4 text-sm text-muted">
          {results.length} result(s) found
        </p>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="rounded-3xl border border-lav-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-lg font-bold text-lav-900">{product.name}</h3>

            <p className="mt-2 text-sm text-muted">{product.categorySlug}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags?.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-lav-100 px-3 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-4 font-bold text-lav-700">
              ₹{(product.salePrice ?? product.price) / 100}
            </p>
          </Link>
        ))}
      </div>

      {query && results.length === 0 && (
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold">No products found 😢</h3>

          <p className="mt-2 text-muted">
            Try searching necklaces, earrings, chokers, rings...
          </p>
        </div>
      )}
    </div>
  );
}
