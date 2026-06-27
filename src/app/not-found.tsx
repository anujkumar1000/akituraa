import { ButtonLink } from "@/components/ui/Button";
import { FloatingDecor } from "@/components/decorations/Kawaii";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden px-4 text-center">
      <FloatingDecor />
      <div className="relative">
        <p className="font-display text-7xl font-bold text-gradient sm:text-9xl">404</p>
        <p className="mt-3 text-2xl">🥺</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-lav-900">
          This page wandered off…
        </h1>
        <p className="mt-2 text-muted">But there&apos;s plenty of sparkle waiting for you.</p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/">Go home 💜</ButtonLink>
          <ButtonLink href="/shop" variant="secondary">Shop all</ButtonLink>
        </div>
      </div>
    </section>
  );
}
