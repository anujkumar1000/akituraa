// import { Hero } from "@/components/home/Hero";
// export const revalidate = 60; // ISR — reflect catalog edits in ~1 min
// import { CategoryGrid } from "@/components/home/CategoryGrid";
// import { ProductRail } from "@/components/home/ProductRail";
// import { About } from "@/components/home/About";
// import { Reviews } from "@/components/home/Reviews";
// import { InstagramFeed } from "@/components/home/InstagramFeed";
// import { Newsletter } from "@/components/home/Newsletter";
// import { FAQ, faqs } from "@/components/home/FAQ";
// import {
//   getCategories,
//   getFeaturedProducts,
//   getBestsellers,
//   getNewArrivals,
// } from "@/lib/data/repository";

// // FAQ schema for rich results
// const faqJsonLd = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   mainEntity: faqs.map((f) => ({
//     "@type": "Question",
//     name: f.q,
//     acceptedAnswer: { "@type": "Answer", text: f.a },
//   })),
// };

// export default async function HomePage() {
//   const [categories, featured, bestsellers, newArrivals] = await Promise.all([
//     getCategories(),
//     getFeaturedProducts(8),
//     getBestsellers(8),
//     getNewArrivals(8),
//   ]);

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
//       />

//       <Hero categories={categories} />
//       <CategoryGrid categories={categories} />

//       <ProductRail
//         eyebrow="Handpicked for you"
//         title="Featured pieces ✨"
//         subtitle="Our current obsessions."
//         href="/shop?featured=1"
//         products={featured}
//         priority
//       />

//       <ProductRail
//         eyebrow="Crowd favourites"
//         title="Bestsellers 💜"
//         subtitle="The pieces everyone's wearing."
//         href="/shop?bestseller=1"
//         products={bestsellers}
//       />

//       <About />

//       <ProductRail
//         eyebrow="Fresh drops"
//         title="New arrivals ✿"
//         subtitle="Just landed in the studio."
//         href="/shop?sort=newest"
//         products={newArrivals}
//       />

//       <Reviews />
//       <InstagramFeed />
//       <Newsletter />
//       <div id="faq">
//         <FAQ />
//       </div>
//     </>
//   );
// }

export const revalidate = 60; // ISR — reflect catalog edits in ~1 min

import {
  getCategories,
  getFeaturedProducts,
  getBestsellers,
} from "@/lib/data/repository";
import { HeroWindow } from "@/components/xp/hero";
import { MarqueeStrip, CategoryCards } from "@/components/xp/extras";
import {
  NavigationWindow,
  Reminder,
  AboutPanel,
  TrustedBy,
  ConnectPanel,
} from "@/components/xp/widgets";
import { NowPlaying } from "@/components/xp/nowplaying";
import { XPProductCard } from "@/components/xp/product";
import { XPLink } from "@/components/xp/core";

export default async function HomePage() {
  const [categories, featured, bestsellers] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getBestsellers(8),
  ]);

  // All product data flows from the repository — nothing hardcoded.
  const pool = featured.length ? featured : bestsellers;
  // const gridProducts = pool.slice(0, 4);
  const gridProducts = bestsellers.length
    ? bestsellers.slice(0, 4)
    : featured.slice(0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-[236px_minmax(0,1fr)_236px]">
      {/* ── Left sidebar ─────────────────────────────────── */}
      <aside className="order-2 flex flex-col gap-4 lg:order-1">
        <NavigationWindow categories={categories} />
        <NowPlaying />
        <Reminder />
      </aside>

      {/* ── Main column ──────────────────────────────────── */}
      <div className="order-1 flex min-w-0 flex-col gap-4 lg:order-2">
        <HeroWindow products={pool} />
        <MarqueeStrip />
        {/* <CategoryCards
          products={pool.slice(3, 6).length ? pool.slice(3, 6) : pool}
        /> */}
        <CategoryCards products={featured.slice(0, 3)} />

        {/* Featured grid — real catalog via repository */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-nav text-[13px] font-semibold uppercase tracking-[0.16em] text-xp-ink">
              -- BESTSELLERS
            </h2>
            <XPLink href="/shop" size="sm">
              VIEW ALL
            </XPLink>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {gridProducts.map((p, i) => (
              <XPProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </div>
        </section>
      </div>

      {/* ── Right sidebar ────────────────────────────────── */}
      <aside className="order-3 flex flex-col gap-4">
        <AboutPanel />
        <TrustedBy />
        <ConnectPanel />
      </aside>
    </div>
  );
}
