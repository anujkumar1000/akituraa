import { SectionHeading } from "@/components/ui/SectionHeading";

export const faqs = [
  {
    q: "Are the pieces really handmade?",
    a: "Yes! Every AKITAURAA piece is hand-assembled in small batches in our studio. That's why each one feels a little extra special.",
  },
  {
    q: "Will the jewellery turn my skin green?",
    a: "Nope. We use hypoallergenic, nickel-free materials and gold-plated brass so our pieces are gentle on sensitive skin.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are crafted and dispatched within 2–4 business days. Pan-India delivery typically takes 3–7 days. Free shipping on orders over ₹999.",
  },
  {
    q: "What's your return policy?",
    a: "We offer easy 7-day returns on unused items in original packaging. Reach out to hello@akitauraa.com and we'll sort you out.",
  },
  {
    q: "Do you restock sold-out pieces?",
    a: "Bestsellers get restocked! Join the newsletter or follow @akitauraa to be the first to know about drops and restocks.",
  },
];

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <SectionHeading align="center" eyebrow="Need to know" title="Frequently asked ✿" />
      <div className="space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl bg-white p-5 shadow-soft transition-shadow open:shadow-glow"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-semibold text-lav-900">
              {f.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lav-200 text-lav-700 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-lav-800/85">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
