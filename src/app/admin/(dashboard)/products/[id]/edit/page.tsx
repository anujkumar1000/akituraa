import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data/repository";
import { ProductForm } from "@/components/admin/ProductForm";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const [{ items }, categories] = await Promise.all([
    getProducts({ perPage: 1000 }),
    getCategories(),
  ]);
  const product = items.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-lav-700 hover:text-lav-900">
        <ChevronLeft className="h-4 w-4" /> Products
      </Link>
      <h1 className="mb-5 font-display text-2xl font-bold text-lav-900">Edit: {product.name}</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
