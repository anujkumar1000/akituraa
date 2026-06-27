export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string; // placeholder:<key> or url
  author: string;
  tags: string[];
  date: string; // ISO
  readMins: number;
  body: string; // lightweight markdown (##, -, **bold**, paragraphs)
  seoTitle?: string;
  seoDescription?: string;
}

// Sample editorial content. Swap for the BlogPost table via the
// repository when the DB is wired. Bodies use a tiny markdown subset
// rendered by <Markdown> (## heading, - list, **bold**, paragraphs).
export const blogPosts: BlogPost[] = [
  {
    slug: "y2k-jewellery-trends-2026",
    title: "2026 Y2K Jewellery Trends the Gen Z Soul Will Love",
    excerpt: "Butterflies, beaded chokers and chunky charms are back — here's how to wear the Y2K revival without looking like a costume.",
    cover: "placeholder:blog-y2k",
    author: "Team Akitauraa",
    tags: ["Y2K", "Trends"],
    date: "2026-05-02",
    readMins: 4,
    body: `The Y2K revival isn't slowing down — it's evolving. This year it's softer, dreamier and a little more grown-up.

## Beaded everything
From phone charms to chokers, hand-beaded pieces in pastel candy tones are everywhere. Mix lavender with blush for that coquette-meets-Y2K look.

## Butterflies are forever
The butterfly motif is the unofficial mascot of Gen Z jewellery. Layer iridescent butterfly earrings with a dainty chain for instant main-character energy.

## How to style it
- Start with one statement piece (a choker or charm)
- Keep the rest dainty so it doesn't compete
- Match metals loosely — perfectly matched is *so* 2010

The vibe is playful, personal and a little nostalgic. Wear what makes you smile. 💜`,
  },
  {
    slug: "how-to-layer-necklaces",
    title: "How to Layer Necklaces Like a Soft Girl",
    excerpt: "The art of the perfect necklace stack — lengths, spacing and pieces that actually work together.",
    cover: "placeholder:blog-layer",
    author: "Team Akitauraa",
    tags: ["Styling", "Necklaces"],
    date: "2026-04-18",
    readMins: 5,
    body: `Necklace layering looks effortless but there's a tiny bit of method to the magic. Here's our no-stress formula.

## The 3-length rule
Pick three different lengths so each piece has room to breathe:
- A choker or 14" piece
- A 16–18" pendant
- A longer 20"+ chain

## Mix textures, not chaos
Pair a beaded strand with a smooth chain and one charm pendant. Three textures max keeps it cute, not cluttered.

## Make it personal
Add a piece that *means* something — an initial, a birthstone, a little heart. That's what turns a stack into a signature.`,
  },
  {
    slug: "handmade-jewellery-care",
    title: "How to Stop Your Jewellery From Tarnishing",
    excerpt: "Keep your handmade pieces shiny and new with these easy, gentle care tips.",
    cover: "placeholder:blog-care",
    author: "Team Akitauraa",
    tags: ["Care", "Guides"],
    date: "2026-03-30",
    readMins: 3,
    body: `Handmade jewellery loves a little TLC. Treat your pieces kindly and they'll stay gorgeous for years.

## The golden rules
- **Last on, first off** — put jewellery on after perfume and makeup
- Keep it dry — remove before showers, pools and workouts
- Store it in a pouch or box, away from air and humidity

## Cleaning
Wipe with a soft, dry cloth after wearing. For a deeper clean, use a tiny bit of mild soap and water, then dry completely.

## What to avoid
Harsh chemicals, ultrasonic cleaners and leaving pieces in the bathroom. A little care goes a long way. ✨`,
  },
];
