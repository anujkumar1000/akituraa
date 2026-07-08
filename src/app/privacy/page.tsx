import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { FloatingDecor } from "@/components/decorations/Kawaii";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <FloatingDecor />
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <ShieldCheck className="mx-auto h-16 w-16 text-lav-600" />
          <h1 className="mt-4 font-display text-5xl text-lav-700">
            Store Policies ♡
          </h1>
          <p className="mt-3 text-muted">
            Please read our policies before placing an order.
          </p>
        </div>

        <div className="space-y-6 text-lg leading-9 text-lav-800">
          <Policy>
            We take approximately <strong>6–7 business days</strong> to dispatch
            your orders.
          </Policy>

          <Policy>
            Please make sure all shipping details, address and contact
            information are entered correctly while placing an order.
          </Policy>

          <Policy>
            If a package is returned due to incorrect details provided by the
            customer, re-shipping charges will need to be paid again.
          </Policy>

          <Policy>
            We offer <strong>FREE shipping on all orders above ₹499</strong>.
            For orders below ₹499, a flat shipping fee of <strong>₹49</strong>{" "}
            will be charged.
          </Policy>

          <Policy>Cash On Delivery (COD) is currently not available.</Policy>

          <Policy>
            We do not offer returns, refunds, or replacements unless the product
            arrives damaged.
          </Policy>

          <Policy>
            To claim a damaged product, an unedited 360° unboxing video must be
            provided as proof.
          </Policy>

          <Policy>
            Orders are accepted only through the official Akitauraa website.
          </Policy>

          <Policy>
            As we are a very small handmade business, response times may
            occasionally be slower than larger brands.
          </Policy>

          <Policy>
            For any questions, concerns, or order-related issues, please contact
            us at:
            <br />
            <strong>akitauraa@gmail.com</strong>
          </Policy>
        </div>

        {/* Back Button */}
        <div className="mt-16 flex justify-end">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-lav-600 px-6 py-3 text-white shadow-float transition hover:scale-105"
          >
            <ArrowLeft size={18} />
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}

function Policy({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-lav-200 bg-white/50 p-5 shadow-soft">
      {children}
    </div>
  );
}
