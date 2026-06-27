import { ButtonLink } from "@/components/ui/Button";
import { Heart, Sparkle, Cloud } from "@/components/decorations/Kawaii";

const stats = [
  { label: "Handmade pieces", value: "120+" },
  { label: "Happy souls", value: "10k+" },
  { label: "Avg. rating", value: "4.9★" },
];

export function About() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-lav-200 via-lav-150 to-blush/60 p-7 sm:p-12">
        <Cloud className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-white/50" />
        <Heart className="pointer-events-none absolute bottom-6 right-10 h-8 w-8 text-blush-deep/50 animate-float" />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-lav-700 backdrop-blur">
              <Sparkle className="h-4 w-4 text-blush-deep" /> Our little story
            </span>
            <h2 className="mt-4 text-3xl font-bold text-lav-900 sm:text-4xl">
              Made by hand, made for you 💜
            </h2>
            <p className="mt-4 max-w-prose text-lav-800/90">
              AKITAURAA started as a tiny bedroom studio with a big dream: to
              make jewellery that feels like a hug. Every piece is hand-assembled
              in small batches with hypoallergenic materials, dreamy pastel tones,
              and a whole lot of love. No mass production, no boring basics — just
              cute, shareable pieces for your softest self.
            </p>

            <dl className="mt-6 flex flex-wrap gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-bold text-lav-700">{s.value}</dt>
                  <dd className="text-sm text-lav-800/80">{s.label}</dd>
                </div>
              ))}
            </dl>

            <ButtonLink href="/about" className="mt-7">
              Read our story
            </ButtonLink>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 to-lav-300/60 shadow-float">
            <div className="absolute inset-0 grid place-items-center text-7xl">
              🧸💐✨
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
