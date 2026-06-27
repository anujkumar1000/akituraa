import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Truck, Sparkles, Ruler, Share2 } from "lucide-react";

export const revalidate = 60; // ISR — reflect product edits in ~1 min
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProductSlugs,
  getCategoryBySlug,
} from "@/lib/data/repository";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCart } from "@/components/product/AddToCartBar";
import { ProductRail } from "@/components/home/ProductRail";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, discountPercent, SITE } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getAllProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: p.seoTitle ?? p.name,
    description: p.seoDescription ?? p.description.slice(0, 160),
    alternates: { canonical: `${SITE.url}/products/${p.slug}` },
    openGraph: {
      title: p.name,
      description: p.description.slice(0, 160),
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const [related, category] = await Promise.all([
    getRelatedProducts(p, 4),
    getCategoryBySlug(p.categorySlug),
  ]);

  const onSale = p.salePrice != null && p.salePrice < p.price;
  const off = discountPercent(p.price, p.salePrice);
  const lowStock = p.inventory > 0 && p.inventory <= (p.lowStockAt ?? 5);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.sku,
    brand: { "@type": "Brand", name: SITE.name },
    aggregateRating:
      p.ratingCount && p.ratingCount > 0
        ? { "@type": "AggregateRating", ratingValue: p.ratingAvg, reviewCount: p.ratingCount }
        : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: ((p.salePrice ?? p.price) / 100).toFixed(2),
      availability: p.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE.url}/products/${p.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-lav-700">Home</Link>
        <span className="mx-1.5">/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-lav-700">{category.name}</Link>
            <span className="mx-1.5">/</span>
          </>
        )}
        <span className="text-lav-800">{p.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={p.images} name={p.name} />

        <div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {p.isBestseller && <Badge tone="butter">★ Bestseller</Badge>}
            {p.isNewArrival && <Badge tone="mint">New ✿</Badge>}
            {onSale && <Badge tone="danger">-{off}% off</Badge>}
          </div>

          <h1 className="text-3xl font-bold text-lav-900 sm:text-4xl">{p.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-butter">{"★".repeat(Math.round(p.ratingAvg ?? 0))}</span>
            <span className="font-semibold text-lav-700">{(p.ratingAvg ?? 0).toFixed(1)}</span>
            <span className="text-muted">· {p.ratingCount ?? 0} reviews</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-lav-700">
              {formatPrice(p.salePrice ?? p.price)}
            </span>
            {onSale && <span className="text-lg text-muted line-through">{formatPrice(p.price)}</span>}
          </div>

          {lowStock && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blush px-3 py-1.5 text-sm font-semibold text-[#a23b6e]">
              🔥 Only {p.inventory} left — selling fast!
            </p>
          )}

          <p className="mt-5 text-lav-800/90">{p.description}</p>

          <div className="mt-6">
            <AddToCart product={p} variant="inline" />
          </div>

          {/* Trust strip */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-muted">
            <span className="rounded-xl bg-white/70 p-2">💜 Hypoallergenic</span>
            <span className="rounded-xl bg-white/70 p-2">✨ Handmade</span>
            <span className="rounded-xl bg-white/70 p-2">🚚 Free over ₹999</span>
          </div>

          {/* Details accordions */}
          <div className="mt-6 space-y-2">
            <DetailRow icon={<Sparkles className="h-4 w-4" />} title="Handmade story" open>
              {p.handmadeStory ?? "Lovingly hand-assembled in small batches in our studio."}
            </DetailRow>
            <DetailRow icon={<Ruler className="h-4 w-4" />} title="Materials & details">
              <ul className="space-y-1">
                {p.materials && <li><strong>Materials:</strong> {p.materials}</li>}
                {p.weight && <li><strong>Weight:</strong> {p.weight}</li>}
                {p.dimensions && <li><strong>Dimensions:</strong> {p.dimensions}</li>}
                <li><strong>SKU:</strong> {p.sku}</li>
              </ul>
            </DetailRow>
            <DetailRow icon={<Truck className="h-4 w-4" />} title="Shipping & returns">
              {p.shippingInfo ?? "Ships in 2–4 days. Free shipping over ₹999. Easy 7-day returns."}
            </DetailRow>
          </div>

          {/* Social share */}
          <div className="mt-6 flex items-center gap-2 text-sm text-muted">
            <Share2 className="h-4 w-4" /> Share:
            <ShareLink href={`https://pinterest.com/pin/create/button/?url=${SITE.url}/products/${p.slug}&description=${encodeURIComponent(p.name)}`} label="Pinterest" />
            <ShareLink href={`https://wa.me/?text=${encodeURIComponent(`${p.name} — ${SITE.url}/products/${p.slug}`)}`} label="WhatsApp" />
            <ShareLink href={`https://twitter.com/intent/tweet?url=${SITE.url}/products/${p.slug}&text=${encodeURIComponent(p.name)}`} label="X" />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <ProductRail eyebrow="You might also love" title="Complete the look 💜" products={related} />
      )}

      <AddToCart product={p} variant="sticky" />
    </div>
  );
}

function DetailRow({
  icon,
  title,
  children,
  open,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details open={open} className="group rounded-2xl bg-white p-4 shadow-soft">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-sm font-semibold text-lav-900">
        <span className="text-lav-600">{icon}</span>
        {title}
        <span className="ml-auto grid h-6 w-6 place-items-center rounded-full bg-lav-100 text-lav-700 transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 text-sm text-lav-800/85">{children}</div>
    </details>
  );
}

function ShareLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-lav-100 px-3 py-1 font-semibold text-lav-700 hover:bg-lav-200">
      {label}
    </a>
  );
}
