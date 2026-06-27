import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/utils";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  icons: {
    icon: "/images.png",
    shortcut: "/images.png",
    apple: "/images.png",
  },

  title: {
    default: "AKITAURAA | Handmade Jewellery for the Gen Z Soul",
    template: "%s | AKITAURAA",
  },
  description:
    "Discover handmade necklaces, earrings, rings, bracelets, chokers, keychains and phone charms crafted for the Gen Z soul.",
  keywords: [
    "handmade jewellery",
    "Gen Z jewellery",
    "kawaii jewellery",
    "Y2K accessories",
    "coquette jewellery",
    "phone charms",
    "soft girl aesthetic",
    "AKITAURAA",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "AKITAURAA | Handmade Jewellery for the Gen Z Soul",
    description:
      "Dreamy, handmade jewellery & accessories in soft lavender tones. Made for your softest, sparkliest self.",
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: SITE.url },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
