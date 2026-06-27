import { cn } from "@/lib/utils";

type Tone = "lav" | "blush" | "mint" | "butter" | "danger";

const tones: Record<Tone, string> = {
  lav: "bg-lav-200 text-lav-800",
  blush: "bg-blush text-[#a23b6e]",
  mint: "bg-mint text-[#2f7a5c]",
  butter: "bg-butter text-[#8a6d1a]",
  danger: "bg-blush-deep text-white",
};

export function Badge({
  tone = "lav",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-display font-semibold tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
