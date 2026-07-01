import { NextResponse } from "next/server";
import { z } from "zod";
import { createRazorpayOrder, RAZORPAY_CONFIGURED } from "@/lib/razorpay";
import { findCoupon, couponDiscount } from "@/data/coupons";

const FREE_SHIPPING_THRESHOLD = 99900;
const SHIPPING_FLAT = 4900;

const schema = z.object({
  items: z
    .array(
      z.object({ slug: z.string(), quantity: z.number().int().positive() }),
    )
    .min(1),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(6),
    fullName: z.string().min(1),
  }),
  address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(4),
  }),
  couponCode: z.string().optional(),
});

function orderNumber() {
  return `AK${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order details" },
      { status: 400 },
    );
  }
  const { items, contact, address, couponCode } = parsed.data;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Store not configured (no database)." },
      { status: 503 },
    );
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    // Recompute everything server-side from authoritative DB prices.
    const slugs = items.map((i) => i.slug);
    const products = await prisma.product.findMany({
      where: { slug: { in: slugs }, isActive: true },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    });

    const lineData = items.flatMap((i) => {
      const p = products.find((x) => x.slug === i.slug);
      if (!p) return [];
      const qty = Math.max(1, Math.min(i.quantity, p.inventory));
      const unitPrice = p.salePrice ?? p.price;
      return [{ product: p, qty, unitPrice }];
    });

    if (lineData.length === 0) {
      return NextResponse.json(
        { error: "No purchasable items." },
        { status: 400 },
      );
    }

    const subtotal = lineData.reduce((s, l) => s + l.unitPrice * l.qty, 0);

    const coupon = couponCode ? findCoupon(couponCode) : undefined;
    const discount = coupon ? couponDiscount(coupon, subtotal) : 0;
    const freeShip = subtotal - discount >= FREE_SHIPPING_THRESHOLD || coupon?.type === "FREE_SHIPPING";
    const shipping = freeShip ? 0 : SHIPPING_FLAT;
    const total = Math.max(0, subtotal - discount + shipping);

    const number = orderNumber();
    const rzp = await createRazorpayOrder(total, number);

    await prisma.order.create({
      data: {
        orderNumber: number,
        guestEmail: contact.email,
        guestPhone: contact.phone,
        subtotal,
        discount,
        shipping,
        total,
        razorpayOrderId: rzp.id,
        shippingAddress: { ...address, fullName: contact.fullName },
        items: {
          create: lineData.map((l) => ({
            productId: l.product.id,
            name: l.product.name,
            image: l.product.images[0]?.url ?? null,
            unitPrice: l.unitPrice,
            quantity: l.qty,
          })),
        },
      },
    });

    return NextResponse.json({
      orderNumber: number,
      order: rzp,
      total,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      configured: RAZORPAY_CONFIGURED,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 },
    );
  }
}
