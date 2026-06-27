import Link from "next/link";
import type { Category } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <SectionHeading
        eyebrow="Shop by category"
        title="Find your aesthetic ✿"
        subtitle="From dainty necklaces to clip-on phone charms — pick your vibe."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-7">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-soft transition-all duration-300 ease-soft hover:-translate-y-1.5 hover:shadow-float"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-lav-200 to-blush text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:animate-wiggle">
              {c.emoji}
            </span>
            <span className="font-display text-sm font-semibold text-lav-900">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
