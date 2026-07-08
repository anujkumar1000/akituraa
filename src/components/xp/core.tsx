import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Window chrome ─────────────────────────────────────────── */

export function WinControls({ set = "mmx" }: { set?: string }) {
  // m = minimize, x = maximize, c = close (order via string, e.g. "mxc")
  const map: Record<string, string> = { m: "–", x: "□", c: "✕" };
  const keys = set === "mmx" ? ["m", "x", "c"] : set.split("");
  return (
    <span className="ml-auto flex items-center gap-1">
      {keys.map((k, i) => (
        <span
          key={i}
          aria-hidden
          className="grid h-4 w-4 place-items-center rounded-[2px] border border-xp-ink-2 bg-xp-panel text-[8px] leading-none text-xp-ink"
        >
          {map[k] ?? k}
        </span>
      ))}
    </span>
  );
}

export function XPWindow({
  title,
  right,
  controls = "xc",
  className,
  bodyClassName,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  controls?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("xp-window overflow-hidden rounded-[3px]", className)}>
      <div className="xp-titlebar flex h-8 items-center gap-2 px-2.5">
        <span className="truncate font-nav text-[11px] font-medium uppercase tracking-[0.12em] text-xp-ink">
          -- {title}
        </span>
        {right}
        <WinControls set={controls} />
      </div>
      <div className={cn("p-3", bodyClassName)}>{children}</div>
    </section>
  );
}

/* Full-page window wrapper for sub-pages */
export function PageWindow({
  title,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <XPWindow
      title={title}
      controls="mxc"
      className={cn("w-full", className)}
      bodyClassName={cn("bg-xp-window p-3 sm:p-5", bodyClassName)}
    >
      {children}
    </XPWindow>
  );
}

/* ── Buttons ───────────────────────────────────────────────── */

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 select-none font-nav uppercase tracking-[0.1em] rounded-[2px] " +
  "border border-xp-ink-2 transition-all duration-150 ease-soft " +
  "shadow-[2px_2px_0_rgba(68,58,104,0.25)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xp-accent disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid: "bg-xp-highlight text-xp-ink hover:bg-xp-inset",
  outline: "bg-xp-white text-xp-ink hover:bg-xp-highlight/50",
  ghost: "bg-transparent border-transparent shadow-none text-xp-ink hover:bg-xp-highlight/40",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[10px]",
  md: "h-10 px-4 text-[11px]",
  lg: "h-11 px-6 text-[12px]",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

export function XPButton({
  variant = "outline",
  size = "md",
  className,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function XPLink({
  variant = "outline",
  size = "md",
  className,
  href,
  children,
}: Common & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
