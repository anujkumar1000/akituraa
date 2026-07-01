"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import {
  useCart,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT,
} from "@/lib/store/cart";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { loadRazorpayScript } from "@/lib/razorpay";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    phone: "",
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  useEffect(() => setMounted(true), []);

  if (!mounted)
    return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">Loading…</div>;

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD || lines.length === 0 ? 0 : SHIPPING_FLAT;
  const total = sub + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto grid max-w-7xl place-items-center px-4 py-20 text-center sm:px-6">
        <p className="text-6xl">🧺</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-lav-900">
          Nothing to check out
        </h1>
        <ButtonLink href="/shop" className="mt-6">
          Back to shop
        </ButtonLink>
      </div>
    );
  }

  const update =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  function valid() {
    return (
      form.email &&
      form.phone &&
      form.fullName &&
      form.line1 &&
      form.city &&
      form.state &&
      form.pincode.length >= 5
    );
  }

  async function pay() {
    setError("");
    if (!valid()) return setError("Please fill in all required fields 🥺");
    setLoading(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
          contact: {
            email: form.email,
            phone: form.phone,
            fullName: form.fullName,
          },
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Order failed");

      const finish = () => {
        clear();
        router.push("/order/success");
      };

      // Dev / no-keys: skip the gateway and confirm directly.
      if (data.order?.mock || !data.configured || !data.keyId) {
        await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: data.order.id,
            razorpay_payment_id: "mock",
            razorpay_signature: "mock",
          }),
        });
        finish();
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Could not load payment gateway");

      const RZ = (
        window as unknown as {
          Razorpay: new (o: unknown) => { open: () => void };
        }
      ).Razorpay;
      const rzp = new RZ({
        key: data.keyId,
        amount: data.order.amount,
        currency: "INR",
        name: "AKITAURAA",
        description: "Handmade jewellery",
        order_id: data.order.id,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        notes: { address: `${form.line1}, ${form.city}` },
        theme: { color: "#8F79B8" },
        handler: async (response: RazorpayResponse) => {
          const v = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (v.ok) finish();
          else setError("Payment could not be verified. Please contact us.");
        },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 text-3xl font-bold text-lav-900 sm:text-4xl">
        Checkout 🔒
      </h1>
      <p className="mb-6 flex items-center gap-1.5 text-sm text-muted">
        <ShieldCheck className="h-4 w-4 text-mint" /> Secure guest checkout · no
        account needed
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Section title="Contact">
            <Field
              label="Email"
              value={form.email}
              onChange={update("email")}
              type="email"
              placeholder="you@email.com"
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={update("phone")}
              type="tel"
              placeholder="10-digit mobile"
            />
          </Section>

          <Section title="Shipping address">
            <Field
              label="Full name"
              value={form.fullName}
              onChange={update("fullName")}
            />
            <Field
              label="Address line 1"
              value={form.line1}
              onChange={update("line1")}
            />
            <Field
              label="Address line 2 (optional)"
              value={form.line2}
              onChange={update("line2")}
              required={false}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" value={form.city} onChange={update("city")} />
              <Field
                label="State"
                value={form.state}
                onChange={update("state")}
              />
            </div>
            <Field
              label="PIN code"
              value={form.pincode}
              onChange={update("pincode")}
            />
          </Section>

          <p className="text-xs text-muted">
            Want an account?{" "}
            <a href="/account" className="font-semibold text-lav-700 underline">
              Sign in
            </a>{" "}
            to save addresses & track orders — totally optional.
          </p>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-lav-900">
            Your order
          </h2>
          <ul className="mt-4 space-y-3">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <ProductMedia url={l.image} alt={l.name} sizes="56px" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-lav-600 text-[10px] font-bold text-white">
                    {l.quantity}
                  </span>
                </div>
                <span className="line-clamp-1 flex-1 text-sm text-lav-900">
                  {l.name}
                </span>
                <span className="text-sm font-semibold">
                  {formatPrice(l.unitPrice * l.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-lav-150 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(sub)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="font-semibold">
                {shipping === 0 ? "FREE 🎉" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-lav-150 pt-2">
              <dt className="font-display font-bold text-lav-900">Total</dt>
              <dd className="font-display text-lg font-bold text-lav-700">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>

          {error && (
            <p className="mt-3 rounded-xl bg-blush/60 px-3 py-2 text-sm text-[#a23b6e]">
              {error}
            </p>
          )}

          <Button
            onClick={pay}
            disabled={loading}
            size="lg"
            className="mt-4 w-full"
          >
            <Lock className="h-4 w-4" />{" "}
            {loading ? "Processing…" : `Pay ${formatPrice(total)}`}
          </Button>
          <p className="mt-2 text-center text-xs text-muted">
            Razorpay · UPI · Cards · Wallets · NetBanking
          </p>
        </aside>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-soft">
      <h2 className="mb-3 font-display text-lg font-bold text-lav-900">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-lav-700">
        {label}
        {required && " *"}
      </span>
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-lav-200 px-4 text-sm focus:outline-none focus:ring-4 focus:ring-lav-300"
      />
    </label>
  );
}
