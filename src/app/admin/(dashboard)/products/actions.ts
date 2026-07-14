"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthed } from "@/lib/auth";

const dbConfigured = Boolean(process.env.DATABASE_URL);

export interface ActionResult {
  ok: boolean;
  message: string;
}

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  sku: z.string().min(1, "SKU required"),
  categorySlug: z.string().min(1, "Category required"),
  description: z.string().default(""),
  price: z.coerce.number().int().nonnegative(), // paise
  salePrice: z.coerce.number().int().nonnegative().optional(),
  inventory: z.coerce.number().int().nonnegative(),
  isFeatured: z.coerce.boolean().optional(),
  isBestseller: z.coerce.boolean().optional(),
  isNewArrival: z.coerce.boolean().optional(),
  // imageUrl: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
});

function parseForm(form: FormData) {
  return productSchema.safeParse({
    id: form.get("id") || undefined,
    name: form.get("name"),
    slug: form.get("slug"),
    sku: form.get("sku"),
    categorySlug: form.get("categorySlug"),
    description: form.get("description") ?? "",
    price: form.get("price"),
    salePrice: form.get("salePrice") || undefined,
    inventory: form.get("inventory"),
    isFeatured: form.get("isFeatured") === "on",
    isBestseller: form.get("isBestseller") === "on",
    isNewArrival: form.get("isNewArrival") === "on",
    // imageUrl: form.get("imageUrl") || undefined,
    imageUrls: form.getAll("imageUrls") as string[],
  });
}

export async function saveProduct(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  if (!(await isAdminAuthed()))
    return { ok: false, message: "Not authorised." };

  const parsed = parseForm(form);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const data = parsed.data;

  if (!dbConfigured) {
    return {
      ok: false,
      message:
        "Validated ✓ — but DATABASE_URL isn't set, so nothing was saved. Connect Postgres (db:push) to persist products.",
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const category = await prisma.category.findUnique({
      where: { slug: data.categorySlug },
    });
    if (!category) return { ok: false, message: "Category not found." };

    const base = {
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      description: data.description,
      price: data.price,
      salePrice: data.salePrice ?? null,
      inventory: data.inventory,
      isFeatured: !!data.isFeatured,
      isBestseller: !!data.isBestseller,
      isNewArrival: !!data.isNewArrival,
      categoryId: category.id,
    };

    if (data.id) {
      await prisma.product.update({ where: { id: data.id }, data: base });
      // Replace the primary image when a new one was uploaded.
      // if (data.imageUrl) {
      //   await prisma.productImage.deleteMany({ where: { productId: data.id } });
      //   await prisma.productImage.create({
      //     data: { productId: data.id, url: data.imageUrl, sortOrder: 0 },
      //   });
      // }
      await prisma.productImage.deleteMany({
  where: {
    productId: data.id,
  },
});

if (data.imageUrls?.length) {
  await prisma.productImage.createMany({
    data: data.imageUrls.map((url, index) => ({
      productId: data.id!,
      url,
      sortOrder: index,
    })),
  });
}
    } else {
  const created = await prisma.product.create({
    data: base,
  });

  if (data.imageUrls?.length) {
    await prisma.productImage.createMany({
      data: data.imageUrls.map((url, index) => ({
        productId: created.id,
        url,
        sortOrder: index,
      })),
    });
  }
}

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return {
      ok: true,
      message: data.id ? "Product updated 💜" : "Product created 💜",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Database error — check your connection." };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!(await isAdminAuthed())) {
    return { ok: false, message: "Not authorised." };
  }

  if (!dbConfigured) {
    return {
      ok: false,
      message: "DATABASE_URL not set — cannot delete.",
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    console.log("🗑 Delete request for ID:", id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    console.log("📦 Product found:", product);

    if (!product) {
      return {
        ok: false,
        message: "Product not found in database.",
      };
    }

    await prisma.product.delete({
      where: { id },
    });

    console.log("✅ Product deleted");

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return {
      ok: true,
      message: "Deleted successfully.",
    };
  } catch (e) {
    console.error("❌ Delete Error:", e);

    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not delete.",
    };
  }
}
