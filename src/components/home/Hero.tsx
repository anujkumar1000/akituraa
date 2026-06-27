"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { FloatingDecor, Sparkle } from "@/components/decorations/Kawaii";
import type { Category } from "@/lib/types";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero({ categories }: { categories: Category[] }) {
  return (
    <section className="relative overflow-hidden">
      {/* soft blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blush/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-lav-300/60 blur-3xl" />
      <FloatingDecor />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 text-center sm:px-6 sm:pt-20 lg:pb-20 lg:pt-24">
        <motion.span
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-semibold text-lav-700"
        >
          <Sparkle className="h-4 w-4 text-blush-deep" />
          Handmade with love · 10,000+ happy souls
        </motion.span>

        <motion.h1
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-[1.05] text-lav-900 sm:text-6xl lg:text-7xl"
        >
          Jewellery for the{" "}
          <span className="text-gradient">Gen&nbsp;Z Soul</span>
          <span className="ml-2 inline-block animate-wiggle">🦋</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg"
        >
          Dreamy, handmade necklaces, earrings, charms & more — crafted in soft
          lavender tones for your softest, sparkliest self. ✨
        </motion.p>

        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <ButtonLink href="/shop" size="lg" className="w-full sm:w-auto">
            Shop Collection 💜
          </ButtonLink>
          <ButtonLink href="/shop?sort=newest" size="lg" variant="secondary" className="w-full sm:w-auto">
            Explore New Arrivals
          </ButtonLink>
        </motion.div>

        {/* Category highlights */}
        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {categories.slice(0, 7).map((c) => (
            <a
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-full border border-lav-200 bg-white/70 px-4 py-2 text-sm font-semibold text-lav-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-soft"
            >
              <span className="mr-1">{c.emoji}</span>
              {c.name}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
