export default async function AdminCustomers() {
  const dbConfigured = Boolean(process.env.DATABASE_URL);
  let count = 0;
  type Row = { email: string; name: string | null; orders: number };
  let rows: Row[] = [];

  if (dbConfigured) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const customers = await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { _count: { select: { orders: true } } },
      });
      count = customers.length;
      rows = customers.map((c) => ({ email: c.email, name: c.name, orders: c._count.orders }));
    } catch {
      /* db unreachable */
    }
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-lav-900">Customers</h1>
      <p className="mb-5 text-sm text-muted">{count} customers</p>
      {rows.length === 0 ? (
        <div className="grid place-items-center rounded-2xl bg-white py-16 text-center shadow-soft">
          <p className="text-5xl">🧸</p>
          <p className="mt-3 font-display font-semibold text-lav-900">No customers yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {dbConfigured ? "Customer accounts will show here." : "Connect your database to see customer accounts."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead className="border-b border-lav-150 text-left text-xs uppercase tracking-wide text-muted">
              <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Orders</th></tr>
            </thead>
            <tbody className="divide-y divide-lav-100">
              {rows.map((c) => (
                <tr key={c.email} className="hover:bg-lav-50">
                  <td className="p-3 font-semibold text-lav-900">{c.name ?? "—"}</td>
                  <td className="p-3 text-lav-700">{c.email}</td>
                  <td className="p-3">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
