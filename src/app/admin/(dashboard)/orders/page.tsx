import { formatPrice } from "@/lib/utils";

type OrderRow = {
  orderNumber: string;
  email: string;
  status: string;
  total: number;
  createdAt: Date;
};

async function loadOrders(): Promise<{ rows: OrderRow[]; dbConfigured: boolean }> {
  const dbConfigured = Boolean(process.env.DATABASE_URL);
  if (!dbConfigured) return { rows: [], dbConfigured };
  try {
    const { prisma } = await import("@/lib/prisma");
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return {
      dbConfigured,
      rows: orders.map((o) => ({
        orderNumber: o.orderNumber,
        email: o.guestEmail ?? "—",
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
      })),
    };
  } catch {
    return { rows: [], dbConfigured };
  }
}

export default async function AdminOrders() {
  const { rows, dbConfigured } = await loadOrders();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-lav-900">Orders</h1>
      <p className="mb-5 text-sm text-muted">{rows.length} orders</p>

      {rows.length === 0 ? (
        <div className="grid place-items-center rounded-2xl bg-white py-16 text-center shadow-soft">
          <p className="text-5xl">🧾</p>
          <p className="mt-3 font-display font-semibold text-lav-900">No orders yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {dbConfigured
              ? "Orders will appear here as customers check out."
              : "Connect your database (DATABASE_URL) to capture and view real orders."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-lav-150 text-left text-xs uppercase tracking-wide text-muted">
              <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Status</th><th className="p-3">Total</th><th className="p-3">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-lav-100">
              {rows.map((o) => (
                <tr key={o.orderNumber} className="hover:bg-lav-50">
                  <td className="p-3 font-semibold text-lav-900">{o.orderNumber}</td>
                  <td className="p-3 text-lav-700">{o.email}</td>
                  <td className="p-3"><span className="rounded-full bg-lav-100 px-2.5 py-1 text-xs font-semibold text-lav-700">{o.status}</span></td>
                  <td className="p-3 font-semibold">{formatPrice(o.total)}</td>
                  <td className="p-3 text-muted">{o.createdAt.toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
