import type { Metadata } from "next";
import { LogOut, Package, Heart, MapPin, Sparkles } from "lucide-react";
import { auth, signOut } from "@/auth";
import { AuthForms } from "@/components/account/AuthForms";
import { ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your account",
  description: "Sign in to track orders, save addresses and view your wishlist.",
};

async function loadOrders(email: string) {
  if (!process.env.DATABASE_URL) return [];
  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma.order.findMany({
      where: { guestEmail: email },
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 20,
    });
  } catch {
    return [];
  }
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <h1 className="mb-1 text-center text-3xl font-bold text-lav-900">Welcome 💜</h1>
        <p className="mb-6 text-center text-muted">Sign in or create an account — or just check out as a guest.</p>
        <AuthForms />
        <p className="mt-4 text-center text-xs text-muted">No account needed to shop — guest checkout is always available.</p>
      </div>
    );
  }

  const orders = await loadOrders(session.user.email ?? "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-lav-900">Hi, {session.user.name ?? "cutie"}! 💜</h1>
          <p className="text-muted">{session.user.email}</p>
        </div>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/account" }); }}>
          <button className="inline-flex items-center gap-2 rounded-full border border-lav-200 bg-white px-4 py-2 text-sm font-semibold text-lav-700 hover:bg-lav-100">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-bold text-lav-900">Your orders</h2>
        {orders.length === 0 ? (
          <div className="grid place-items-center rounded-2xl bg-white py-12 text-center shadow-soft">
            <p className="text-5xl">🛍️</p>
            <p className="mt-3 font-display font-semibold text-lav-900">No orders yet</p>
            <ButtonLink href="/shop" className="mt-4">Start shopping</ButtonLink>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="rounded-2xl bg-white p-4 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display font-bold text-lav-900">{o.orderNumber}</p>
                    <p className="text-xs text-muted">{o.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {o.items.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-lav-100 px-2.5 py-1 text-xs font-semibold text-lav-700">{o.status}</span>
                    <p className="mt-1 font-display font-bold text-lav-700">{formatPrice(o.total)}</p>
                  </div>
                </div>
                <p className="mt-2 line-clamp-1 text-sm text-muted">{o.items.map((i) => i.name).join(", ")}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { icon: Package, title: "Order tracking", desc: "Follow every order from studio to door." },
          { icon: Heart, title: "Wishlist", desc: "Your saved favourites." },
          { icon: MapPin, title: "Addresses", desc: "Faster checkout next time." },
          { icon: Sparkles, title: "Early access", desc: "First dibs on drops & restocks." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl bg-white p-5 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-lav-200 text-lav-700"><f.icon className="h-5 w-5" /></span>
            <p className="mt-3 font-display font-semibold text-lav-900">{f.title}</p>
            <p className="text-sm text-muted">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
