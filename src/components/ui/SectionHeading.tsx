import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel = "View all",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-7 flex flex-wrap items-end gap-4",
        align === "center" ? "flex-col text-center" : "justify-between",
        className
      )}
    >
      <div className={align === "center" ? "mx-auto max-w-xl" : ""}>
        {eyebrow && (
          <span className="mb-2 inline-block rounded-full bg-lav-200 px-3 py-1 font-display text-xs font-semibold tracking-wide text-lav-700">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-bold text-lav-900 sm:text-3xl md:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 max-w-prose text-muted">{subtitle}</p>}
      </div>

      {href && align !== "center" && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 font-display text-sm font-semibold text-lav-700 hover:text-lav-900"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
