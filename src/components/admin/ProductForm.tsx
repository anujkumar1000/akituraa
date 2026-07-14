"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import {
  saveProduct,
  deleteProduct,
  type ActionResult,
} from "@/app/admin/(dashboard)/products/actions";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils";
import { useRouter } from "next/navigation";

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Saving…" : editing ? "Save changes" : "Create product"}
    </Button>
  );
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    saveProduct,
    null,
  );
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const editing = Boolean(product);
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-soft">
        <Field label="Name">
          <input
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!editing) setSlug(slugify(e.target.value));
            }}
            className="input"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug">
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="SKU">
            <input
              name="sku"
              required
              defaultValue={product?.sku}
              className="input"
            />
          </Field>
        </div>
        <Field label="Category">
          <select
            name="categorySlug"
            required
            defaultValue={product?.categorySlug ?? ""}
            className="input"
          >
            <option value="" disabled>
              Choose a category…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description}
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-soft sm:grid-cols-3">
        <Field label="Price (₹)">
          <input
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={product ? (product.price / 100).toString() : ""}
            onChange={(e) => {
              const el = document.getElementById(
                "price-paise",
              ) as HTMLInputElement;
              el.value = String(Math.round(Number(e.target.value) * 100));
            }}
            className="input"
          />
          <input
            id="price-paise"
            type="hidden"
            name="price"
            defaultValue={product?.price ?? 0}
          />
        </Field>
        <Field label="Sale price (₹, optional)">
          <input
            type="number"
            min="0"
            step="0.01"
            defaultValue={
              product?.salePrice ? (product.salePrice / 100).toString() : ""
            }
            onChange={(e) => {
              const el = document.getElementById(
                "sale-paise",
              ) as HTMLInputElement;
              el.value = e.target.value
                ? String(Math.round(Number(e.target.value) * 100))
                : "";
            }}
            className="input"
          />
          <input
            id="sale-paise"
            type="hidden"
            name="salePrice"
            defaultValue={product?.salePrice ?? ""}
          />
        </Field>
        <Field label="Inventory">
          <input
            name="inventory"
            type="number"
            min="0"
            required
            defaultValue={product?.inventory ?? 0}
            className="input"
          />
        </Field>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <span className="mb-2 block text-xs font-semibold text-lav-700">
          Product image
        </span>
        <ImageUpload
          defaultUrls={
            product?.images
              ?.map((img) => img.url)
              .filter((url) => url.startsWith("http")) ?? []
          }
        />
        <p className="mt-2 text-xs text-muted">
          Leave empty to use an on-brand gradient placeholder.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 rounded-2xl bg-white p-5 shadow-soft">
        <Toggle
          name="isFeatured"
          label="Featured ✨"
          defaultChecked={product?.isFeatured}
        />
        <Toggle
          name="isBestseller"
          label="Bestseller ★"
          defaultChecked={product?.isBestseller}
        />
        <Toggle
          name="isNewArrival"
          label="New arrival ✿"
          defaultChecked={product?.isNewArrival}
        />
      </div>

      {state && (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${state.ok ? "bg-mint/50 text-[#2f7a5c]" : "bg-butter/60 text-[#8a6d1a]"}`}
        >
          {state.message}
        </p>
      )}

      <div className="flex gap-3">
        <SubmitButton editing={editing} />

        {editing && (
          <Button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-8 h-14 text-base font-display font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300 disabled:pointer-events-none disabled:opacity-50"
          >
            Delete Product
          </Button>
        )}

        <Link
          href="/admin/products"
          className="grid place-items-center rounded-full px-5 font-display font-semibold text-lav-700 hover:bg-lav-100"
        >
          Cancel
        </Link>
      </div>

      <style>{`.input{height:2.75rem;width:100%;border-radius:0.75rem;border:1px solid var(--color-lav-200);padding:0 0.9rem;font-size:0.875rem;background:#fff}.input:focus{outline:none;box-shadow:0 0 0 4px var(--color-lav-300)}textarea.input{height:auto;padding:0.6rem 0.9rem}`}</style>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-lav-900">Delete Product?</h2>

            <p className="mt-3 text-sm text-gray-600">
              This action cannot be undone. Are you sure you want to delete this
              product?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border px-5 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={async () => {
                  if (!product) return;

                  setDeleting(true);

                  const result = await deleteProduct(product.id);

                  setShowDeleteModal(false);

                  if (result.ok) {
                    // Toast message ko next page ke liye store karo
                    sessionStorage.setItem(
                      "toast",
                      JSON.stringify({
                        success: true,
                        message: "Product deleted successfully 🎉",
                      }),
                    );

                    router.replace("/admin/products");
                    router.refresh();
                    return;
                  }

                  setDeleting(false);
                  alert(result.message);
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-lav-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-lav-800">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-lav-600"
      />
      {label}
    </label>
  );
}
