import type { Category } from "@/lib/types";

// Category config. Adding a future category = add one object here
// (or a row in the DB). Pages, nav, and filters pick it up
// automatically — no other code changes required.
export const categories: Category[] = [
  {
    id: "cat-necklaces",
    name: "Necklaces",
    slug: "necklaces",
    emoji: "💜",
    description: "Dainty chains, charm pendants & layering pieces.",
    seoTitle: "Handmade Necklaces | AKITAURAA",
    seoDescription:
      "Shop handmade necklaces crafted for the Gen Z soul — dainty chains, charm pendants and layering pieces in dreamy lavender tones.",
    sortOrder: 1,
  },
  {
    id: "cat-earrings",
    name: "Earrings",
    slug: "earrings",
    emoji: "🦋",
    description: "Studs, dangles & hoops with kawaii charm.",
    seoTitle: "Handmade Earrings | AKITAURAA",
    seoDescription:
      "Handmade earrings for the Gen Z soul — kawaii studs, butterfly dangles and dreamy hoops.",
    sortOrder: 2,
  },
  {
    id: "cat-rings",
    name: "Rings",
    slug: "rings",
    emoji: "💍",
    description: "Stackable rings & adjustable cuties.",
    seoTitle: "Handmade Rings | AKITAURAA",
    seoDescription: "Stackable, adjustable handmade rings in soft pastel tones.",
    sortOrder: 3,
  },
  {
    id: "cat-bracelets",
    name: "Bracelets",
    slug: "bracelets",
    emoji: "🌸",
    description: "Beaded, charm & friendship bracelets.",
    seoTitle: "Handmade Bracelets | AKITAURAA",
    seoDescription: "Beaded and charm bracelets, handmade for the Gen Z soul.",
    sortOrder: 4,
  },
  {
    id: "cat-chokers",
    name: "Chokers",
    slug: "chokers",
    emoji: "⭐",
    description: "Y2K chokers with attitude.",
    seoTitle: "Y2K Chokers | AKITAURAA",
    seoDescription: "Y2K-inspired handmade chokers with soft-girl attitude.",
    sortOrder: 5,
  },
  {
    id: "cat-keychains",
    name: "Keychains",
    slug: "keychains",
    emoji: "🔑",
    description: "Cute clip-on charms for your keys & bags.",
    seoTitle: "Cute Keychains | AKITAURAA",
    seoDescription: "Handmade kawaii keychains to clip on your keys and bags.",
    sortOrder: 6,
  },
  {
    id: "cat-phone-charms",
    name: "Phone Charms",
    slug: "phone-charms",
    emoji: "📱",
    description: "Beaded phone charms & wrist straps.",
    seoTitle: "Phone Charms | AKITAURAA",
    seoDescription: "Beaded handmade phone charms and wrist straps, Gen-Z approved.",
    sortOrder: 7,
  },
];
