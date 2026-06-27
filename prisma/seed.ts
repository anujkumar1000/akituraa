// Seeds categories + the sample catalog into Postgres.
// Run with:  npm run db:seed   (after db:push)
import { PrismaClient } from "@prisma/client";
import { categories } from "../src/data/categories";
import { sampleProducts } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AKITAURAA…");

  // Categories
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        seoTitle: c.seoTitle,
        seoDescription: c.seoDescription,
        sortOrder: c.sortOrder ?? 0,
      },
    });
  }
  console.log(`  ✓ ${categories.length} categories`);

  // Products
  for (const p of sampleProducts) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
    if (!category) continue;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        handmadeStory: p.handmadeStory,
        materials: p.materials,
        weight: p.weight,
        dimensions: p.dimensions,
        shippingInfo: p.shippingInfo,
        price: p.price,
        salePrice: p.salePrice ?? null,
        currency: p.currency,
        isFeatured: p.isFeatured ?? false,
        isBestseller: p.isBestseller ?? false,
        isNewArrival: p.isNewArrival ?? false,
        inventory: p.inventory,
        lowStockAt: p.lowStockAt ?? 5,
        ratingAvg: p.ratingAvg ?? 0,
        ratingCount: p.ratingCount ?? 0,
        soldCount: p.soldCount ?? 0,
        categoryId: category.id,
        images: {
          create: p.images.map((img, i) => ({ url: img.url, alt: img.alt, sortOrder: i })),
        },
      },
    });
  }
  console.log(`  ✓ ${sampleProducts.length} products`);
  console.log("✨ Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
