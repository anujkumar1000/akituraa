# AKITAURAA — Strategy Playbook

SEO · CRO · Deployment · Launch Checklist · 90-Day Growth Roadmap.
Pairs with the codebase in this repo.

---

## 1. SEO Strategy

### Homepage
- **Title:** `AKITAURAA | Handmade Jewellery for the Gen Z Soul`
- **Meta:** `Discover handmade necklaces, earrings, rings, bracelets, chokers, keychains and phone charms crafted for the Gen Z soul.`
- Implemented in `src/app/layout.tsx` with OpenGraph + Twitter cards.

### Category SEO structure
Pattern (already wired via `generateMetadata` in `category/[slug]`):
- **Title:** `{Category} | AKITAURAA` → e.g. *Handmade Necklaces | AKITAURAA*
- **Meta:** benefit + audience + material, ~150 chars.
- **H1:** `{emoji} {Category}` · one keyword-rich intro paragraph.
- **Canonical:** `/category/{slug}`.
- Target keywords: `handmade {category} india`, `kawaii {category}`, `y2k {category}`, `aesthetic {category} for girls`.

### Product SEO structure
- **Title:** `{Product Name}` (template appends `| AKITAURAA`).
- **Meta:** first 160 chars of description (override via `seoTitle`/`seoDescription` fields).
- **URL:** `/products/{slug}` — short, keyword-bearing slugs.
- **Schema:** `Product` + `Offer` + `AggregateRating` (live in product page).

### Blog SEO strategy
Top-of-funnel content to capture aesthetic + styling searches and feed Pinterest:
| Cluster | Example titles | Intent |
| --- | --- | --- |
| Y2K trends | "2026 Y2K Jewellery Trends Gen Z Loves" | discovery |
| Styling guides | "How to Layer Necklaces Like a Soft Girl" | consideration |
| Care | "How to Stop Jewellery From Tarnishing" | retention |
| Gift guides | "Coquette Gift Guide Under ₹999" | seasonal/transaction |
| Aesthetic | "Build a Coquette Jewellery Box" | inspiration |

Each post → internal links to 2–3 relevant categories/products. Publish 2×/week.

### Internal linking strategy
- Home → all 7 categories (hero chips + category grid + footer).
- Category → sibling categories ("Explore more") + products.
- Product → related products ("Complete the look") + parent category breadcrumb.
- Blog → products/categories contextually.
- Footer → categories on every page (sitewide equity distribution).

### Schema markup (all implemented)
- `Organization` — `layout.tsx`
- `Product` + `Offer` + `AggregateRating` — product page
- `FAQPage` — homepage
- `BreadcrumbList` — category + product pages
- `Review` — add per-review nodes once real reviews load from DB.

### Technical SEO
- `sitemap.xml` (dynamic, includes products + categories) and `robots.txt` are generated.
- Set `NEXT_PUBLIC_SITE_URL` to the production domain so canonicals/sitemap resolve correctly.
- Submit sitemap in Google Search Console + Bing Webmaster Tools on launch.

---

## 2. Conversion Rate Optimization (CRO)

### Already in the build
- ⭐ Bestseller / ✿ New / −% sale **badges** (data-driven from product flags).
- 🔥 **Low-stock indicator** ("Only N left") on cards + product page.
- ⭐ **Ratings & review counts** on every card.
- **Sticky mobile add-to-cart** bar on product pages.
- **Trust strip** (hypoallergenic · handmade · free shipping).
- **Social proof** (10k+ souls, review wall, Instagram feed).
- **Newsletter incentive** (10% off first order).
- **Free-shipping threshold** (₹999) surfaced in the announcement bar.

### Recommended next (high ROI, ranked)
1. **Cart drawer with free-shipping progress bar** ("You're ₹120 away from free shipping!"). +AOV.
2. **Recently-purchased pop-ups** ("Aanya in Mumbai just bought…") — use the `Order` data; throttle + make dismissible. Big trust lift for Gen Z.
3. **Bundle / "complete the set" upsell** in cart (cross-sell from `relatedSlugs`).
4. **Exit-intent / scroll popup** for the newsletter code (mobile = on scroll-up).
5. **UGC gallery** on product pages (pull `Review.images`) — "styled by you".
6. **Express checkout** (Razorpay UPI one-tap) above the fold in cart.
7. **Wishlist → email reminder** when a saved item is low-stock or on sale.
8. **Quick-add** from cards (skip PDP for impulse buys).
9. **Size/length guide** modal where relevant (reduces returns).
10. **Post-purchase upsell** ("add this for 20% off") on the thank-you page.

### Measurement
- Track: add-to-cart rate, cart→checkout, checkout→purchase, AOV, returning-customer rate.
- Funnel tooling: GA4 + Vercel Analytics; heatmaps via Microsoft Clarity (free).

---

## 3. Performance (target Lighthouse 95+)
- `next/image` with AVIF/WebP + responsive `sizes` everywhere (done).
- `next/font` self-hosts Fredoka + Nunito (no layout shift, no Google round-trip).
- Server Components by default; `"use client"` only where interactive.
- `optimizePackageImports` for `lucide-react` + `framer-motion`.
- Lazy-load below-the-fold sections; prioritize only first 2–4 images.
- Respect `prefers-reduced-motion` (done globally in `globals.css`).
- Host product media on **Cloudinary** (CDN, auto-format, transformations).

---

## 4. Security
- **SSL** — automatic on Vercel.
- **Input validation** — Zod on all API routes (see `api/newsletter`).
- **Rate limiting** — in-memory now; move to **Upstash Redis** for production/multi-instance.
- **XSS** — React escapes by default; only `dangerouslySetInnerHTML` is trusted JSON-LD.
- **CSRF** — use same-site cookies + server actions / verify Razorpay webhook **signature** (`RAZORPAY_WEBHOOK_SECRET`).
- **Auth** — add Auth.js (NextAuth) with hashed passwords (argon2/bcrypt) + role gate on `/admin`.
- **Bot protection** — Cloudflare Turnstile on signup/checkout; Vercel WAF.
- **Secrets** — only in env vars; never commit `.env`.

---

## 5. Deployment (Vercel + Postgres)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "AKITAURAA storefront"
git branch -M main && git remote add origin <repo> && git push -u origin main

# 2. Database — create a Postgres (Neon / Supabase / Vercel Postgres)
#    copy its connection string into DATABASE_URL

# 3. Import the repo on vercel.com → add env vars from .env.example

# 4. Run migrations against prod DB
npx prisma db push        # or: prisma migrate deploy
npm run db:seed           # optional sample data

# 5. Deploy (automatic on push). Add custom domain in Vercel → Domains.
```

**Env vars to set in Vercel:** `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`,
`RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`,
`CLOUDINARY_*`, `AUTH_SECRET`.

**Go-live switch:** flip the two `load*` functions in
`src/lib/data/repository.ts` from sample arrays to Prisma queries.

---

## 6. Launch Checklist

**Pre-launch**
- [ ] Real product photos uploaded (Cloudinary) + alt text.
- [ ] Repository switched to Prisma provider; DB seeded with real catalog.
- [ ] Razorpay live keys + webhook configured & test order placed.
- [ ] Cart, checkout, order confirmation email working end-to-end.
- [ ] Auth + admin dashboard live and role-protected.
- [ ] Legal pages: Privacy, Terms, Shipping, Returns, Contact.
- [ ] `NEXT_PUBLIC_SITE_URL` = production domain; canonicals correct.
- [ ] Favicon, OG image, app icons, manifest.
- [ ] 404 + error states reviewed.
- [ ] Lighthouse ≥95 on mobile (home, shop, PDP).
- [ ] Test on real iPhone + Android (one-handed, thumb reach, sticky CTA).

**SEO/Analytics**
- [ ] GA4 + Vercel Analytics + Clarity installed.
- [ ] Search Console + Bing verified; sitemap submitted.
- [ ] Meta Pixel + Pinterest Tag + TikTok Pixel installed.
- [ ] Product schema validated (Rich Results Test).

**Trust/Ops**
- [ ] SSL active; HTTPS redirect.
- [ ] Inventory accurate; low-stock thresholds set.
- [ ] Support email + WhatsApp live.
- [ ] Return/refund flow documented.
- [ ] Backups enabled on DB.

---

## 7. 90-Day Growth Roadmap

### Days 1–30 — Foundation & soft launch
- Finish cart → checkout → Razorpay → order emails.
- Ship admin dashboard; migrate to live DB.
- Launch to a small list (friends/family + waitlist). Collect first 20–50 reviews (incentivize with discount).
- Set up Instagram/Pinterest/TikTok; post 3–5×/week. Pin every product (Pinterest = #1 channel for this aesthetic).
- Install all pixels; establish baseline conversion + AOV.

### Days 31–60 — Content & paid testing
- Publish 2 blog posts/week (styling + trend clusters).
- Start UGC engine: ship "tag us" inserts; repost customer photos.
- Test paid: ₹low/day Meta + Pinterest ads to bestsellers; retarget cart abandoners.
- Launch referral ("give 10%, get 10%") + abandoned-cart email/WhatsApp flow.
- Add cart drawer + recently-purchased popups; A/B the free-shipping threshold.

### Days 61–90 — Scale & retain
- Influencer/micro-creator seeding (soft-girl/coquette niche, 5k–50k followers).
- First collection drop / limited edition to drive urgency + email signups.
- Loyalty points + VIP early-access tier.
- Bundles & gift sets for festive/seasonal (Raksha Bandhan, Valentine's, birthdays).
- Double down on the best-performing channel; cut the rest. Target repeat-purchase rate >20%.

**North-star metrics:** conversion rate, AOV, CAC:LTV, repeat-purchase rate, email/social list growth.
