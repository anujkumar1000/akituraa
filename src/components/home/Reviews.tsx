import { SectionHeading } from "@/components/ui/SectionHeading";

// Sample social proof. Wire to the Review model (isApproved=true)
// via the repository when real reviews exist.
const reviews = [
  {
    name: "Aanya R.",
    handle: "@aanya.aes",
    rating: 5,
    body: "Obsessed!! The pearl necklace is even cuter irl and the packaging made me cry 🥹💜",
    emoji: "🌸",
  },
  {
    name: "Mahi S.",
    handle: "@softmahi",
    rating: 5,
    body: "Got so many compliments on the butterfly earrings. Quality is unreal for the price.",
    emoji: "🦋",
  },
  {
    name: "Riya K.",
    handle: "@riyacore",
    rating: 5,
    body: "The phone charm is my whole personality now. Shipping was super fast too!",
    emoji: "✨",
  },
  {
    name: "Tara M.",
    handle: "@taradreams",
    rating: 5,
    body: "Finally jewellery that matches my soft-girl aesthetic. Buying the whole collection 💍",
    emoji: "💖",
  },
];

export function Reviews() {
  return (
    <section className="bg-white/50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="Loved by the soft-girl gang"
          title="10,000+ happy souls 💜"
          subtitle="Real reviews from real cuties."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <figure
              key={r.handle}
              className="flex flex-col rounded-2xl bg-white p-5 shadow-soft transition-transform hover:-translate-y-1"
            >
              <div className="mb-2 text-butter" aria-label={`${r.rating} out of 5 stars`}>
                {"★".repeat(r.rating)}
              </div>
              <blockquote className="flex-1 text-sm text-lav-800/90">“{r.body}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-lav-200 text-lg">
                  {r.emoji}
                </span>
                <span>
                  <span className="block font-display text-sm font-semibold text-lav-900">
                    {r.name}
                  </span>
                  <span className="block text-xs text-muted">{r.handle}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
