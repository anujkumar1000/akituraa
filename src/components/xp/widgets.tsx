import Link from "next/link";
import {
  Star, Circle, Link2, Sparkles, Gem, KeyRound, Smartphone, Heart,
  Globe, Instagram, Mail, ArrowRight,
} from "lucide-react";
import type { Category } from "@/lib/types";
import { XPWindow, XPLink } from "@/components/xp/core";

/* icon per category slug (fallback: sparkles) */
const CAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  necklaces: Link2,
  rings: Circle,
  bracelets: Gem,
  earrings: Sparkles,
  chokers: Circle,
  keychains: KeyRound,
  "phone-charms": Smartphone,
};

export function NavigationWindow({ categories }: { categories: Category[] }) {
  return (
    <XPWindow title="NAVIGATION.EXE" controls="mxc" bodyClassName="p-1.5">
      <nav>
        <ul className="divide-y divide-xp-inset">
          {categories.map((c) => {
            const Icon = CAT_ICONS[c.slug] ?? Sparkles;
            return (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2.5 rounded-[2px] px-2.5 py-2 font-nav text-[11px] uppercase tracking-[0.12em] text-xp-ink-2 transition-colors hover:bg-xp-highlight hover:text-xp-ink"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {c.name}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/shop?bestseller=1" className="flex items-center gap-2.5 rounded-[2px] px-2.5 py-2 font-nav text-[11px] uppercase tracking-[0.12em] text-xp-ink-2 transition-colors hover:bg-xp-highlight hover:text-xp-ink">
              <Star className="h-3.5 w-3.5" /> BESTSELLERS
            </Link>
          </li>
          <li>
            <Link href="/shop?featured=1" className="flex items-center gap-2.5 rounded-[2px] px-2.5 py-2 font-nav text-[11px] uppercase tracking-[0.12em] text-xp-ink-2 transition-colors hover:bg-xp-highlight hover:text-xp-ink">
              <Heart className="h-3.5 w-3.5" /> SALE
            </Link>
          </li>
        </ul>
      </nav>
    </XPWindow>
  );
}

export function Reminder() {
  return (
    <XPWindow title="REMINDER" controls="c" bodyClassName="relative p-4">
      <p className="font-nav text-[15px] leading-relaxed text-xp-ink">
        wear it.<br />own it.<br />be you.
      </p>
      {/* sparkle + wireframe globe doodles */}
      <svg aria-hidden viewBox="0 0 24 24" className="absolute right-8 top-10 h-5 w-5 text-xp-accent animate-twinkle">
        <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="currentColor" />
      </svg>
      <svg aria-hidden viewBox="0 0 24 24" className="absolute right-14 top-16 h-3 w-3 text-xp-accent/70 animate-twinkle">
        <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="currentColor" />
      </svg>
      <svg aria-hidden viewBox="0 0 48 48" className="mt-6 ml-auto block h-16 w-16 text-xp-ink-2/50">
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="24" cy="24" rx="20" ry="8" fill="none" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="24" cy="24" rx="8" ry="20" fill="none" stroke="currentColor" strokeWidth="1" />
        <line x1="4" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1" />
      </svg>
    </XPWindow>
  );
}

export function AboutPanel() {
  return (
    <XPWindow title="ABOUT_AKITAURAA" controls="xc" bodyClassName="relative p-4">
      <p className="font-nav text-[12px] leading-relaxed text-xp-ink">
        we make jewelry that fits every version of you. minimal. bold. timeless.
      </p>
      <p className="mt-4 font-nav text-[12px] leading-relaxed text-xp-ink">
        made for everyone.<br />made to stand out.
      </p>
      <div className="mt-5">
        <XPLink href="/about" size="sm">MORE INFO</XPLink>
      </div>
      <svg aria-hidden viewBox="0 0 24 24" className="absolute bottom-4 right-4 h-6 w-6 text-xp-accent animate-twinkle">
        <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </XPWindow>
  );
}

export function TrustedBy() {
  return (
    <XPWindow title="TRUSTED BY" controls="c" bodyClassName="p-4">
      <div className="flex items-center gap-3">
        <Globe className="h-10 w-10 text-xp-ink-2" strokeWidth={1.2} />
        <div>
          <p className="font-nav text-[13px] font-semibold text-xp-ink">100+</p>
          <p className="font-nav text-[11px] lowercase text-xp-muted">happy<br />customers</p>
        </div>
      </div>
      <div className="mt-3 flex gap-1 text-xp-accent">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-xp-accent" />
        ))}
      </div>
    </XPWindow>
  );
}

const socials = [
  { label: "INSTAGRAM", href: "https://instagram.com/akitauraa", icon: <Instagram className="h-4 w-4" /> },
  // {
  //   label: "TIKTOK", href: "https://tiktok.com/@akitauraa",
  //   icon: (
  //     <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
  //       <path d="M16.6 3c.4 2.1 1.8 3.6 3.9 3.9v3c-1.5 0-2.8-.5-3.9-1.3v6.1a5.7 5.7 0 1 1-5.7-5.7c.3 0 .7 0 1 .1v3.1a2.7 2.7 0 1 0 1.7 2.5V3h3z" />
  //     </svg>
  //   ),
  // },
  // {
  //   label: "PINTEREST", href: "https://pinterest.com/akitauraa",
  //   icon: (
  //     <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
  //       <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 .1-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.7-4.1-4.2-4.1a4.4 4.4 0 0 0-4.6 4.4c0 .9.3 1.8.8 2.3l-.3 1.1c-.1.4-.3.5-.7.3-1.2-.6-2-2.4-2-3.8 0-3.1 2.3-6 6.6-6 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2z" />
  //     </svg>
  //   ),
  // },
  { label: "EMAIL US", href: "mailto:hello@akitauraa.com", icon: <Mail className="h-4 w-4" /> },
];

export function ConnectPanel() {
  return (
    <XPWindow title="CONNECT" controls="c" bodyClassName="p-2">
      <ul className="divide-y divide-xp-inset">
        {socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[2px] px-2.5 py-2.5 font-nav text-[11px] uppercase tracking-[0.12em] text-xp-ink-2 transition-colors hover:bg-xp-highlight hover:text-xp-ink"
            >
              {s.icon}
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </XPWindow>
  );
}

export function ArrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 font-nav text-[12px] font-semibold uppercase tracking-[0.14em] text-xp-ink">
      {children} <ArrowRight className="h-4 w-4" />
    </span>
  );
}
