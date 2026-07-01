import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FloatingDecor } from "@/components/decorations/Kawaii";

export const metadata: Metadata = {
  title: "About Us | Akitauraa",
  description:
    "The story behind Akitauraa — handmade jewelry crafted with love.",
};

export default function AboutPage() {
  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden px-4 py-16 sm:px-6">
      <FloatingDecor />
      {/* <div className="glass rounded-[32px] border border-lav-200 p-8 shadow-float sm:p-12"> */}
      <div className="mb-8 text-center">
        <Image
          src="/akito1.jpg"
          alt="Akito"
          width={160}
          height={160}
          className="mx-auto aspect-square rounded-full object-cover border-4 border-lav-200 shadow-float"
        />

        <p className="mt-4 font-display text-2xl font-bold text-lav-700">
          Akito ♡
        </p>

        <p className="text-sm text-muted">Founder of Akitauraa</p>
      </div>
      <h1 className="font-display text-center text-5xl font-bold text-lav-700">
        About Akitauraa ♡
      </h1>

      <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-lav-300" />

      <div className="mt-10 space-y-6 text-lg leading-relaxed text-lav-800">
        <p>
          hii, i'm <strong>Akito ♡</strong>
        </p>

        <p>Akitauraa started in the simplest way possible...</p>

        <p>I began making jewelry for myself. ✧₊⁺</p>

        <p>
          As someone who loves gaming, fashion, anime-inspired aesthetics, and
          unique accessories, I was always drawn to gothic and alternative
          jewelry that felt personal and meaningful.
        </p>

        <p>
          I wanted pieces that represented who I am — my style, my interests,
          and my aura. ♡‧₊˚
        </p>

        <p>
          That idea eventually became <strong>Akitauraa.</strong>
        </p>

        <p>
          The name comes from the belief that jewelry is more than just an
          accessory. Every piece you wear becomes a part of your story and
          reflects your unique aura.
        </p>

        <p>
          Whether your vibe is bold, mysterious, dreamy, cute, elegant, or a
          little chaotic, your jewelry should feel like you. ⋆｡°✩
        </p>

        <p>
          What started as a personal hobby slowly grew into something bigger
          when my friends encouraged me to share my creations with others.
        </p>

        <p>
          Their support gave me the confidence to turn Akitauraa into a small
          handmade jewelry brand built from home, one piece at a time. (´｡• ◡
          •｡`) ♡
        </p>

        <p>
          Because Akitauraa is a small-scale business, every order truly means
          the world to me.
        </p>

        <p>
          Each piece is carefully crafted, checked, and packed with lots of love
          and care before it reaches you. ✧˖°
        </p>

        <p>
          Every order makes me do a little happy dance behind the scenes hehe ♡
        </p>

        <p>
          You're not just buying jewelry — you're supporting a dream, a creator,
          and a passion project that I'm incredibly grateful for. ໒꒰ྀི´ ˘ `
          ꒱ྀིა
        </p>

        <div className="my-10 rounded-3xl bg-lav-100 p-6">
          <h2 className="font-display text-2xl font-bold text-lav-700">
            Why Akitauraa? 💜
          </h2>

          <ul className="mt-4 space-y-2 text-lav-800">
            <li>✦ Handmade with care</li>
            <li>✦ Inspired by gaming, anime & alternative fashion</li>
            <li>✦ Small business, packed by hand</li>
            <li>✦ Custom orders welcome</li>
            <li>✦ Made for every unique aura</li>
          </ul>
        </div>

        <p>
          I also love bringing your ideas to life through custom orders,
          creating pieces that are as unique as the people who wear them.
        </p>

        <p>
          So if you have something special in mind, I'd love to create it
          together! ♡₊˚
        </p>

        <p>Thank you for being here and for supporting handmade creations.</p>

        <p>It genuinely means more than you know. ˚₊‧꒰ა ☆ ໒꒱ ‧₊˚</p>

        <p>I can't wait to create something special for you. ♡</p>

        <div className="pt-6 text-center">
          <p className="text-xl font-semibold text-lav-700">with love,</p>

          <p className="mt-2 font-display text-3xl font-bold text-lav-800">
            Akito ♡
          </p>

          <p className="mt-2 text-muted">Founder of Akitauraa ✧₊⁺</p>

          <p className="mt-6 text-3xl">༄₊˚.༄༘₊⁺⋆.˚♡˚.⋆⁺₊༄</p>
        </div>
      </div>
      <div className="mt-16 flex justify-end">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-full bg-lav-600 px-6 py-3 font-semibold text-white shadow-float transition-all duration-300 hover:scale-105 hover:bg-lav-700"
        >
          ← Back Home
        </Link>
      </div>
    </div>
    // </div>
  );
}

function Policy({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-lav-200 bg-white/50 p-5 shadow-soft">
      {children}
    </div>
  );
}
