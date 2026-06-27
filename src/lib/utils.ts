import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format paise (integer) as INR. e.g. 49900 -> "₹499" */
export function formatPrice(paise: number, opts?: { withDecimals?: boolean }) {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: opts?.withDecimals ? 2 : 0,
    maximumFractionDigits: opts?.withDecimals ? 2 : 0,
  }).format(rupees);
}

export function discountPercent(price: number, salePrice?: number | null) {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const SITE = {
  name: "AKITAURAA",
  tagline: "Jewellery for the Gen Z Soul",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://akitauraa.com",
  instagram: "https://instagram.com/akitauraa",
  pinterest: "https://pinterest.com/akitauraa",
  tiktok: "https://tiktok.com/@akitauraa",
} as const;
