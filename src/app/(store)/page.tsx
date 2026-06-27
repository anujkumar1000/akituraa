import { Hero } from "@/components/home/Hero";
export const revalidate = 60; // ISR — reflect catalog edits in ~1 min
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductRail } from "@/components/home/ProductRail";
import { About } from "@/components/home/About";
import { Reviews } from "@/components/home/Reviews";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { Newsletter } from "@/components/home/Newsletter";
import { FAQ, faqs } from "@/components/home/FAQ";
import {
  getCategories,
  getFeaturedProducts,
  getBestsellers,
  getNewArrivals,
} from "@/lib/data/repository";

// FAQ schema for rich results
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function HomePage() {
  const [categories, featured, bestsellers, newArrivals] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getBestsellers(8),
    getNewArrivals(8),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Hero categories={categories} />
      <CategoryGrid categories={categories} />

      <ProductRail
        eyebrow="Handpicked for you"
        title="Featured pieces ✨"
        subtitle="Our current obsessions."
        href="/shop?featured=1"
        products={featured}
        priority
      />

      <ProductRail
        eyebrow="Crowd favourites"
        title="Bestsellers 💜"
        subtitle="The pieces everyone's wearing."
        href="/shop?bestseller=1"
        products={bestsellers}
      />

      <About />

      <ProductRail
        eyebrow="Fresh drops"
        title="New arrivals ✿"
        subtitle="Just landed in the studio."
        href="/shop?sort=newest"
        products={newArrivals}
      />

      <Reviews />
      <InstagramFeed />
      <Newsletter />
      <div id="faq">
        <FAQ />
      </div>
    </>
  );
}
