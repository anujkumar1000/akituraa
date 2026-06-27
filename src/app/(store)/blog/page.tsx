import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/data/repository";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/utils";

export const revalidate = 300; // ISR — refresh blog list every 5 min

export const metadata: Metadata = {
  title: "The Aura Journal — styling, trends & care",
  description:
    "Y2K trends, jewellery styling guides, care tips and aesthetic inspiration for the Gen Z soul. The AKITAURAA blog.",
  alternates: { canonical: `${SITE.url}/blog` },
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BlogIndex() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8 text-center">
        <span className="inline-block rounded-full bg-lav-200 px-3 py-1 font-display text-xs font-semibold text-lav-700">The Aura Journal</span>
        <h1 className="mt-3 text-3xl font-bold text-lav-900 sm:text-4xl">Styling, trends & sparkle ✨</h1>
        <p className="mt-2 text-muted">Your guide to wearing AKITAURAA your way.</p>
      </header>

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="group mb-8 grid overflow-hidden rounded-3xl bg-white shadow-soft transition-shadow hover:shadow-float md:grid-cols-2">
          <div className="relative aspect-[16/10] md:aspect-auto">
            <ProductMedia url={featured.cover} alt={featured.title} sizes="(max-width:768px) 100vw, 50vw" priority />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="mb-2 flex gap-1.5">{featured.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>
            <h2 className="font-display text-2xl font-bold text-lav-900 group-hover:text-lav-700">{featured.title}</h2>
            <p className="mt-2 text-muted">{featured.excerpt}</p>
            <p className="mt-3 text-xs text-muted">{fmt(featured.date)} · {featured.readMins} min read</p>
          </div>
        </Link>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-float">
            <div className="relative aspect-[16/10]">
              <ProductMedia url={p.cover} alt={p.title} sizes="(max-width:768px) 100vw, 33vw" />
            </div>
            <div className="p-5">
              <div className="mb-2 flex gap-1.5">{p.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>
              <h3 className="font-display text-lg font-bold text-lav-900 group-hover:text-lav-700">{p.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted">{p.excerpt}</p>
              <p className="mt-3 text-xs text-muted">{fmt(p.date)} · {p.readMins} min read</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
