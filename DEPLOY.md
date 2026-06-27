# Deploying AKITAURAA to production 🚀

The app is deploy-ready. This is the exact path from local → live on Vercel
with a hosted Postgres. Steps marked **(you)** need your accounts/logins.

---

## 1. Push to GitHub **(you)**

```bash
cd akitauraa
git init && git add . && git commit -m "AKITAURAA storefront"
git branch -M main
git remote add origin https://github.com/<you>/akitauraa.git
git push -u origin main
```

`.env` is gitignored — your secrets won't be committed. ✅

## 2. Create a hosted Postgres **(you)**

Pick one (all have free tiers):
- **Neon** — neon.tech → new project → copy the connection string
- **Supabase** — supabase.com → Project → Database → Connection string (URI)
- **Vercel Postgres** — create from the Vercel dashboard (auto-injects env)

You'll get a `postgresql://…` URL. Keep it for step 4.

## 3. Import the repo on Vercel **(you)**

- vercel.com → **Add New → Project** → import your GitHub repo
- Framework preset: **Next.js** (auto-detected)
- Build command is already `prisma generate && next build`; `postinstall` also
  runs `prisma generate`. No overrides needed.

## 4. Set environment variables in Vercel **(you)**

Project → Settings → Environment Variables. Minimum to go live:

| Var | Value |
| --- | --- |
| `DATABASE_URL` | your hosted Postgres URL (step 2) |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `AUTH_SECRET` | run `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | a strong admin password |

To enable **real payments** (otherwise checkout stays in safe mock mode):

| Var | From |
| --- | --- |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | dashboard.razorpay.com → API keys |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | same key id |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay → Webhooks |

To enable **image uploads** in the admin (otherwise it falls back to a URL field):

| Var | From |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | cloudinary.com → dashboard |

> Cloudinary delivery host is already allow-listed in `next.config.ts`
> (`res.cloudinary.com`).

## 5. Create the schema + seed the prod DB

From your machine, pointed at the **prod** `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://…prod…" npx prisma db push
DATABASE_URL="postgresql://…prod…" npm run db:seed   # optional sample data
```

(Or run `prisma migrate deploy` if you switch to migrations.)

## 6. Deploy + domain **(you)**

- Vercel auto-deploys on push. Add your custom domain under **Settings → Domains**
  and point DNS as instructed. SSL is automatic.

## 7. Go-live smoke test

- [ ] Home, shop, a product, a category, blog all load
- [ ] Add to cart → checkout → (test) payment → `/order/success`
- [ ] Order shows in `/admin/orders`; inventory decremented
- [ ] `/admin/login` works with `ADMIN_PASSWORD`; add a product → appears on shop
- [ ] Register at `/account`, sign in, see order history
- [ ] `https://yourdomain.com/sitemap.xml` resolves; submit in Search Console

See `docs/STRATEGY.md` for the full launch checklist, SEO/CRO plan and 90-day
growth roadmap.
