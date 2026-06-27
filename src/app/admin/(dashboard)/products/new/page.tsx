import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCategories } from "@/lib/data/repository";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-lav-700 hover:text-lav-900">
        <ChevronLeft className="h-4 w-4" /> Products
      </Link>
      <h1 className="mb-5 font-display text-2xl font-bold text-lav-900">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
