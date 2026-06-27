# AKITAURAA 💜

> Jewellery for the Gen Z Soul — a handmade jewellery & accessories storefront.

Soft-lavender, kawaii, Y2K, mobile-first e-commerce built on **Next.js 15 (App
Router) · TypeScript · Tailwind v4 · Prisma/PostgreSQL · Framer Motion ·
Razorpay · Cloudinary**.

---

## ✨ What's built so far

| Area | Status |
| --- | --- |
| Design system (lavender tokens, fonts, kawaii decor) | ✅ |
| Dynamic, data-driven catalog (no hardcoded products) | ✅ |
| Full Prisma schema (products → orders → coupons → blog) | ✅ |
| Home page (11 sections, animated hero) | ✅ |
| Shop page (filter + sort, URL-driven) | ✅ |
| Category pages (dynamic SEO + breadcrumb schema) | ✅ |
| Product page (gallery, sticky add-to-cart, schema) | ✅ |
| SEO: metadata, sitemap, robots, JSON-LD (Product/Org/FAQ/Breadcrumb/Article) | ✅ |
| Newsletter API (validated + rate-limited) | ✅ |
| Cart (Zustand + persist), slide-out drawer, free-ship bar, coupons | ✅ |
| Wishlist store + shareable wishlist page | ✅ |
| Checkout (guest, mobile-first) + Razorpay (mock fallback in dev) | ✅ |
| Blog (list + post pages, lightweight markdown, Article schema) | ✅ |
| Admin auth (signed-cookie session) + gated dashboard | ✅ |
| Admin: dashboard stats, product CRUD, orders/customers/categories/coupons/blog | ✅ |
| **Live PostgreSQL** — repository reads from DB (sample fallback) | ✅ |
| **Order persistence** — server-authoritative pricing, inventory decrement on pay | ✅ |
| **Customer accounts** (Auth.js v5: register, login, JWT session, order history) | ✅ |
| **Cloudinary image upload** (signed, drag-and-drop, URL fallback) | ✅ |
| **Deploy-ready** — ISR revalidation, postinstall, [DEPLOY.md](DEPLOY.md) guide | ✅ |

See [`docs/STRATEGY.md`](docs/STRATEGY.md) for SEO, CRO, launch checklist and the
90-day growth roadmap.

---

## 🚀 Getting started

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env        # then fill in DATABASE_URL etc.

# 3. set up the database (Postgres)
npm run db:push             # create tables from schema
npm run db:seed             # load sample categories + products

# 4. Run
npm run dev                 # http://localhost:3000
```

> The site also runs **without a database** — the catalog falls back to the
> in-memory sample provider automatically. With `DATABASE_URL` set, the
> repository reads live data, the admin persists product edits, orders are
> recorded, and customer accounts work.
>
> **This workspace is already wired to a local PostgreSQL 17** (installed via
> winget; `DATABASE_URL` points at `localhost:5432/akitauraa`, password
> `akitauraa`). The DB is pushed + seeded. For production, swap `DATABASE_URL`
> for a hosted Postgres (Neon/Supabase/Vercel) — no code changes.

---

## 🧩 The "fully dynamic" architecture (important)

Products are **never hardcoded into pages**. Everything flows through one layer:

```
UI (pages/components)
        │  calls
        ▼
src/lib/data/repository.ts   ← single source of truth for catalog reads
        │  backed by
        ▼
  Provider:  sample data (now)  →  Prisma/Postgres (later)
```

To go live with the database, change **only** the two `load*` functions inside
[`src/lib/data/repository.ts`](src/lib/data/repository.ts) from returning the
sample arrays to running Prisma queries. Every page, filter, and sort keeps
working unchanged. This is what lets the catalog scale to **500+ products /
50+ collections** with no structural rewrites.

**Adding a category** = add one object to `src/data/categories.ts` (or a DB row).
Nav, footer, filters, and the category page pick it up automatically.

---

## 📁 Project structure

```
prisma/
  schema.prisma        # full DB model (catalog, orders, reviews, coupons, blog…)
  seed.ts              # seeds categories + sample products
src/
  app/
    layout.tsx         # root: html/body + fonts only
    (store)/           # storefront route group (Header/Footer/CartDrawer)
      layout.tsx       # store chrome + org schema
      page.tsx         # home (11 sections)
      shop/ category/[slug]/ products/[slug]/
      cart/ checkout/ wishlist/ account/ order/success/
      blog/ blog/[slug]/
    admin/             # outside store group → no storefront chrome
      login/           # password login
      (dashboard)/     # auth-gated: layout redirects if not signed in
        page.tsx       # dashboard stats
        products/      # list + new + [id]/edit + actions.ts (server actions)
        orders/ customers/ categories/ coupons/ blog/
    api/
      newsletter/  admin/{login,logout}/  razorpay/{order,verify}/
    sitemap.ts robots.ts not-found.tsx
  components/
    ui/                # Button, Badge, ProductCard, ProductMedia, …
    layout/            # Header, Footer, AnnouncementBar
    home/              # Hero, CategoryGrid, ProductRail, Reviews, …
    product/           # Gallery, AddToCart (inline + sticky)
    shop/              # ShopToolbar (filter/sort)
    decorations/       # kawaii SVG sprites + floating layer
  data/                # categories + SAMPLE products (swappable)
  lib/
    types.ts           # domain types (decoupled from Prisma)
    repository.ts(data)# the catalog API the UI talks to
    prisma.ts utils.ts
```

---

## 🎨 Design tokens

Defined CSS-first in [`src/app/globals.css`](src/app/globals.css) via Tailwind v4
`@theme`. Use them as normal Tailwind classes: `bg-lav-600`, `text-blush-deep`,
`shadow-float`, `animate-float`, `text-gradient`, `glass`.

| Token | Hex | Use |
| --- | --- | --- |
| `lav-600` | `#8F79B8` | primary buttons, headings |
| `lav-500` | `#B9A5D6` | rings, accents |
| `lav-300` | `#DCCEF2` | soft fills |
| `lav-200` | `#E9D6F6` | borders, chips |
| `lav-100/50` | `#F7F2FF/#FAF8FF` | backgrounds |
| `blush-deep` | `#FF9EC4` | kawaii pop / sale |

Fonts: **Fredoka** (display/bubble) + **Nunito** (body).

---

## 🔐 Admin & payments

- **Admin:** visit `/admin/login`. Dev password is `akitauraa` — override with
  `ADMIN_PASSWORD` (and set a strong `AUTH_SECRET`) in `.env`. The session is a
  signed httpOnly cookie; every `/admin/(dashboard)` page is gated server-side.
- **Without a DB:** the admin reads the sample catalog (read-only) and the
  product form validates but won't persist — it tells you so. Set `DATABASE_URL`
  + `npm run db:push` to manage live data.
- **Razorpay:** with no keys, checkout runs in **mock mode** (the full flow works
  end-to-end and lands on the success page without charging). Add
  `RAZORPAY_KEY_ID/SECRET` + `NEXT_PUBLIC_RAZORPAY_KEY_ID` to enable the real
  gateway; payments are signature-verified server-side.

## 🧪 Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` | prisma generate + production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | sync schema → DB |
| `npm run db:seed` | seed sample data |
| `npm run db:studio` | Prisma Studio |

---

Made with 💜 for the soft-girl gang.
