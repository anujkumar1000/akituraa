import { coupons } from "@/data/coupons";
import { formatPrice } from "@/lib/utils";

function describe(c: (typeof coupons)[number]) {
  if (c.type === "PERCENT") return `${c.value}% off`;
  if (c.type === "FIXED") return `${formatPrice(c.value)} off`;
  return "Free shipping";
}

export default function AdminCoupons() {
  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-lav-900">Coupons</h1>
      <p className="mb-5 text-sm text-muted">{coupons.length} active codes</p>

      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <table className="w-full text-sm">
          <thead className="border-b border-lav-150 text-left text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-3">Code</th><th className="p-3">Discount</th><th className="p-3">Min spend</th><th className="p-3">Label</th></tr>
          </thead>
          <tbody className="divide-y divide-lav-100">
            {coupons.map((c) => (
              <tr key={c.code} className="hover:bg-lav-50">
                <td className="p-3"><code className="rounded bg-lav-100 px-2 py-1 font-bold text-lav-700">{c.code}</code></td>
                <td className="p-3 font-semibold text-lav-900">{describe(c)}</td>
                <td className="p-3 text-lav-700">{c.minSubtotal ? formatPrice(c.minSubtotal) : "—"}</td>
                <td className="p-3 text-muted">{c.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 rounded-2xl bg-butter/50 px-4 py-3 text-sm text-[#8a6d1a]">
        💡 Coupons live in <code className="rounded bg-white/60 px-1.5 py-0.5">src/data/coupons.ts</code>. With the DB connected, manage them in the Coupon table and validate server-side at checkout.
      </p>
    </div>
  );
}
