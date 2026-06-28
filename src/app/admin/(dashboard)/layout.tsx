export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FolderTree,
  Newspaper,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { isAdminAuthed } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-lav-50">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-lav-200 bg-white p-4 lg:flex">
          <Link
            href="/admin"
            className="px-2 font-display text-xl font-bold text-lav-700"
          >
            akitauraa<span className="text-blush-deep">.</span>
            <span className="ml-1 text-xs font-semibold text-muted">admin</span>
          </Link>
          <nav className="mt-6 flex flex-1 flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-lav-800 hover:bg-lav-100"
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-1 border-t border-lav-150 pt-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-lav-100"
            >
              <ExternalLink className="h-4 w-4" /> View store
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-lav-100">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </aside>

        {/* Mobile top nav */}
        <div className="flex w-full flex-col">
          <header className="flex items-center gap-3 overflow-x-auto border-b border-lav-200 bg-white px-4 py-3 lg:hidden">
            <Link href="/admin" className="font-display font-bold text-lav-700">
              admin.
            </Link>
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-lav-700 hover:bg-lav-100"
              >
                {n.label}
              </Link>
            ))}
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
