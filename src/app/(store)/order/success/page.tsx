import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { FloatingDecor } from "@/components/decorations/Kawaii";

export const metadata: Metadata = { title: "Order confirmed 💜", robots: { index: false } };

export default function OrderSuccessPage() {
  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden px-4 text-center">
      <FloatingDecor />
      <div className="relative">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-mint to-lav-300 text-5xl shadow-float">
          🎉
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-lav-900 sm:text-4xl">Yay! Order confirmed 💜</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Thank you for shopping with AKITAURAA! We&apos;re already packing your
          goodies with love. You&apos;ll get a confirmation email with tracking soon. ✨
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <ButtonLink href="/shop">Keep shopping</ButtonLink>
          <ButtonLink href="/" variant="secondary">Back home</ButtonLink>
        </div>
      </div>
    </section>
  );
}
