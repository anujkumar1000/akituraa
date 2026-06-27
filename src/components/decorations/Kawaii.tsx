// Hand-drawn kawaii SVG sprites + floating decoration layer.
// Pure SVG so they're crisp, themeable, and weightless.

import { cn } from "@/lib/utils";

type IconProps = { className?: string };

export function Heart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 4.8 5.4 4.5 7.6 4.3 9.3 5.6 12 8c2.7-2.4 4.4-3.7 6.6-3.5 3.4.3 5 3.9 3.4 7.2C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function Star({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l2.6 6.3L21 9l-5 4.3L17.5 21 12 17.3 6.5 21 8 13.3 3 9l6.4-.7L12 2z" />
    </svg>
  );
}

export function Sparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2c.5 4.5 1.5 5.5 6 6-4.5.5-5.5 1.5-6 6-.5-4.5-1.5-5.5-6-6 4.5-.5 5.5-1.5 6-6z" />
    </svg>
  );
}

export function Butterfly({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 12c-1.6-3.4-4-5.4-6.6-4.8C2.7 7.8 2 11 4 13.4c1.7 2 4.7 2.4 8 .6 3.3 1.8 6.3 1.4 8-.6 2-2.4 1.3-5.6-1.4-6.2C16 6.6 13.6 8.6 12 12z" />
      <circle cx="12" cy="11" r="1.1" />
    </svg>
  );
}

export function Cloud({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M7 18a4 4 0 010-8 5 5 0 019.6-1.4A3.5 3.5 0 1117 18H7z" />
    </svg>
  );
}

export function Smiley({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14a4 4 0 007 0" />
      <circle cx="9" cy="10" r="0.6" fill="currentColor" />
      <circle cx="15" cy="10" r="0.6" fill="currentColor" />
    </svg>
  );
}

// Decorative floating layer — drop into any `relative` section.
// Purely ornamental, hidden from a11y, respects reduced-motion.
export function FloatingDecor({ className }: IconProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <Heart className="absolute left-[6%] top-[18%] h-7 w-7 text-blush-deep/60 animate-float" />
      <Star className="absolute right-[10%] top-[12%] h-6 w-6 text-lav-500/70 animate-float-slow" />
      <Sparkle className="absolute left-[20%] bottom-[14%] h-8 w-8 text-butter animate-twinkle" />
      <Butterfly className="absolute right-[18%] bottom-[20%] h-9 w-9 text-lav-400/70 animate-wiggle" />
      <Cloud className="absolute left-[32%] top-[8%] h-10 w-10 text-white/70 animate-float" />
      <Star className="absolute right-[40%] bottom-[10%] h-4 w-4 text-blush-deep/60 animate-twinkle" />
    </div>
  );
}
