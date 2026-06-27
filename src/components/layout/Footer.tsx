import Link from "next/link";
import { Instagram, Heart } from "lucide-react";
import { getCategories } from "@/lib/data/repository";
import { SITE } from "@/lib/utils";

const shopLinks = [
  { label: "Shop all", href: "/shop" },
  { label: "New arrivals", href: "/shop?sort=newest" },
  { label: "Bestsellers", href: "/shop?bestseller=1" },
  { label: "Wishlist", href: "/wishlist" },
];

const helpLinks = [
  { label: "Shipping & returns", href: "/shipping" },
  { label: "Track order", href: "/track" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

const aboutLinks = [
  { label: "Our story", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Terms and Privacy", href: "/privacy" },
  // { label: "Terms", href: "/terms" },
];

export async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="mt-8 border-t border-lav-200 bg-white/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link
            href="/"
            className="font-display text-2xl font-bold text-lav-700"
          >
            akitauraa<span className="text-blush-deep">.</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted">
            {SITE.tagline} — handmade, dreamy & made for your softest self. 💜
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href={SITE.instagram}
              target="_blank"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full bg-lav-100 text-lav-700 hover:bg-lav-200"
            >
              <Instagram className="h-5 w-5" />
            </a>
            {/* <a href={SITE.pinterest} aria-label="Pinterest" className="grid h-10 w-10 place-items-center rounded-full bg-lav-100 text-lav-700 hover:bg-lav-200">
              <span className="font-display text-sm font-bold">P</span>
            </a>
            <a href={SITE.tiktok} aria-label="TikTok" className="grid h-10 w-10 place-items-center rounded-full bg-lav-100 text-lav-700 hover:bg-lav-200">
              <span className="font-display text-sm font-bold">t</span>
            </a> */}
            <a
              href="mailto:akitauraa@gmail.com"
              aria-label="Email"
              className="grid h-10 w-10 place-items-center rounded-full bg-lav-100 text-lav-700 hover:bg-lav-200"
            >
              <span className="font-display text-sm font-bold">E</span>
            </a>
          </div>
        </div>

        <FooterCol title="Shop" links={shopLinks} />
        <FooterCol title="Help" links={helpLinks} />
        <FooterCol title="About" links={aboutLinks} />
      </div>

      <div className="border-t border-lav-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:px-6">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} AKITAURAA · Made with
            <Heart className="h-3.5 w-3.5 fill-blush-deep text-blush-deep" /> in
            India
          </p>
          <p className="flex flex-wrap gap-3">
            {categories.slice(0, 7).map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="hover:text-lav-700"
              >
                {c.name}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-lav-900">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted hover:text-lav-700"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
