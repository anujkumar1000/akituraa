import { Instagram } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { SITE } from "@/lib/utils";

// Placeholder grid. Swap for a real feed (Instagram Basic Display
// API or a service like Behold/EmbedSocial) — keep the markup.
const tiles = Array.from({ length: 6 }, (_, i) => `placeholder:ig-${i}`);

export function InstagramFeed() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <SectionHeading
        align="center"
        eyebrow="@akitauraa"
        title="Follow the sparkle ✨"
        subtitle="Tag us for a chance to be featured 💜"
      />
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
        {tiles.map((t, i) => (
          <a
            key={t}
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-2xl shadow-soft"
            aria-label="View on Instagram"
          >
            <ProductMedia url={t} alt={`Instagram post ${i + 1}`} sizes="(max-width:768px) 33vw, 16vw" />
            <span className="absolute inset-0 grid place-items-center bg-lav-900/0 text-white opacity-0 transition-all duration-300 group-hover:bg-lav-900/30 group-hover:opacity-100">
              <Instagram className="h-6 w-6" />
            </span>
          </a>
        ))}
      </div>
      <div className="mt-7 text-center">
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-display font-semibold text-lav-700 hover:text-lav-900"
        >
          <Instagram className="h-5 w-5" /> Follow @akitauraa
        </a>
      </div>
    </section>
  );
}
