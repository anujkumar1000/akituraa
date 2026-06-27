import type { Product } from "@/lib/types";

// ⚠️ SAMPLE / PLACEHOLDER CATALOG.
// This exists only so the UI renders before the real catalog is
// loaded. The app reads products through the repository layer
// (src/lib/data/repository.ts), NOT from this file directly — so
// swapping this for the Prisma-backed provider is a one-line change.
// Image urls use the "placeholder:<key>" scheme → rendered as
// on-brand gradients by <ProductMedia>. Replace with Cloudinary
// URLs (or let admins upload) when real product photos exist.

const now = new Date().toISOString();

export const sampleProducts: Product[] = [
  {
    id: "p1", name: "Cloud Nine Pearl Necklace", slug: "cloud-nine-pearl-necklace",
    sku: "AK-NK-001", description: "A dreamy freshwater pearl necklace on a dainty gold-tone chain. Your everyday cloud of soft-girl energy.",
    handmadeStory: "Hand-knotted one pearl at a time in our tiny studio, with a little heart charm clasp.",
    materials: "Freshwater pearls, 18k gold-plated brass", weight: "4g", dimensions: "16\" + 2\" extender",
    shippingInfo: "Ships in 2–4 days. Free shipping over ₹999.",
    price: 89900, salePrice: 69900, currency: "INR",
    categorySlug: "necklaces", collectionSlugs: ["soft-girl"], tags: ["pearl", "dainty", "coquette"],
    images: [{ url: "placeholder:necklaces", alt: "Cloud Nine Pearl Necklace" }, { url: "placeholder:necklaces-2", alt: "On model" }],
    isFeatured: true, isBestseller: true, inventory: 14, ratingAvg: 4.9, ratingCount: 128, soldCount: 540, createdAt: now,
  },
  {
    id: "p2", name: "Butterfly Kisses Earrings", slug: "butterfly-kisses-earrings",
    sku: "AK-ER-001", description: "Iridescent butterfly dangles that catch the light. Pure Y2K magic.",
    materials: "Acrylic, hypoallergenic steel posts", weight: "2g", dimensions: "3cm drop",
    price: 49900, currency: "INR",
    categorySlug: "earrings", collectionSlugs: ["y2k"], tags: ["butterfly", "y2k", "iridescent"],
    images: [{ url: "placeholder:earrings", alt: "Butterfly Kisses Earrings" }],
    isFeatured: true, isNewArrival: true, inventory: 3, lowStockAt: 5, ratingAvg: 4.8, ratingCount: 64, soldCount: 210, createdAt: now,
  },
  {
    id: "p3", name: "Sugar Star Stackable Rings", slug: "sugar-star-stackable-rings",
    sku: "AK-RG-001", description: "A set of three adjustable star rings. Mix, match, stack your sparkle.",
    materials: "18k gold-plated brass, cubic zirconia", weight: "3g", dimensions: "Adjustable",
    price: 59900, salePrice: 44900, currency: "INR",
    categorySlug: "rings", tags: ["star", "stackable", "set"],
    images: [{ url: "placeholder:rings", alt: "Sugar Star Stackable Rings" }],
    isBestseller: true, inventory: 22, ratingAvg: 4.7, ratingCount: 89, soldCount: 330, createdAt: now,
  },
  {
    id: "p4", name: "Berry Bliss Beaded Bracelet", slug: "berry-bliss-beaded-bracelet",
    sku: "AK-BR-001", description: "Hand-strung lavender and blush beads with a smiley charm.",
    materials: "Glass beads, elastic cord", weight: "6g", dimensions: "Stretch, fits most",
    price: 39900, currency: "INR",
    categorySlug: "bracelets", collectionSlugs: ["soft-girl"], tags: ["beaded", "smiley", "kawaii"],
    images: [{ url: "placeholder:bracelets", alt: "Berry Bliss Beaded Bracelet" }],
    isNewArrival: true, inventory: 40, ratingAvg: 4.9, ratingCount: 51, soldCount: 180, createdAt: now,
  },
  {
    id: "p5", name: "Heartcore Velvet Choker", slug: "heartcore-velvet-choker",
    sku: "AK-CH-001", description: "Soft velvet choker with a dangling heart. The main-character accessory.",
    materials: "Velvet ribbon, gold-tone heart charm", weight: "5g", dimensions: "Adjustable 12–15\"",
    price: 54900, currency: "INR",
    categorySlug: "chokers", collectionSlugs: ["y2k"], tags: ["heart", "velvet", "y2k"],
    images: [{ url: "placeholder:chokers", alt: "Heartcore Velvet Choker" }],
    isFeatured: true, inventory: 11, ratingAvg: 4.6, ratingCount: 37, soldCount: 96, createdAt: now,
  },
  {
    id: "p6", name: "Lucky Charm Keychain", slug: "lucky-charm-keychain",
    sku: "AK-KC-001", description: "A cluster of cute charms — star, cloud, heart — on a sturdy clip.",
    materials: "Acrylic charms, alloy clip", weight: "18g", dimensions: "10cm",
    price: 34900, currency: "INR",
    categorySlug: "keychains", tags: ["charm", "cloud", "star"],
    images: [{ url: "placeholder:keychains", alt: "Lucky Charm Keychain" }],
    isBestseller: true, inventory: 60, ratingAvg: 4.8, ratingCount: 72, soldCount: 410, createdAt: now,
  },
  {
    id: "p7", name: "Bubble Pop Phone Charm", slug: "bubble-pop-phone-charm",
    sku: "AK-PC-001", description: "Beaded wrist strap phone charm in pastel candy colors.",
    materials: "Acrylic beads, nylon cord", weight: "12g", dimensions: "18cm loop",
    price: 29900, salePrice: 24900, currency: "INR",
    categorySlug: "phone-charms", collectionSlugs: ["soft-girl"], tags: ["beaded", "pastel", "strap"],
    images: [{ url: "placeholder:phone-charms", alt: "Bubble Pop Phone Charm" }],
    isNewArrival: true, isBestseller: true, inventory: 4, lowStockAt: 5, ratingAvg: 5.0, ratingCount: 44, soldCount: 260, createdAt: now,
  },
  {
    id: "p8", name: "Daydream Layered Necklace", slug: "daydream-layered-necklace",
    sku: "AK-NK-002", description: "A pre-layered two-strand necklace with a tiny star and moon.",
    materials: "18k gold-plated brass", weight: "5g", dimensions: "16\" + 18\"",
    price: 99900, currency: "INR",
    categorySlug: "necklaces", tags: ["layered", "star", "moon"],
    images: [{ url: "placeholder:necklaces-3", alt: "Daydream Layered Necklace" }],
    isFeatured: true, isNewArrival: true, inventory: 17, ratingAvg: 4.7, ratingCount: 29, soldCount: 70, createdAt: now,
  },
];
