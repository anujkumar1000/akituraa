import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { RAZORPAY_CONFIGURED } from "@/lib/razorpay";

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

// Marks the order PAID, decrements inventory and bumps sold counts.
async function finalizeOrder(razorpayOrderId: string, paymentId: string, signature: string) {
  if (!process.env.DATABASE_URL) return;
  const { prisma } = await import("@/lib/prisma");
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId },
    include: { items: true },
  });
  if (!order || order.paymentStatus === "CAPTURED") return;

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paymentStatus: "CAPTURED",
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      },
    }),
    ...order.items.map((it) =>
      prisma.product.update({
        where: { id: it.productId },
        data: {
          inventory: { decrement: it.quantity },
          soldCount: { increment: it.quantity },
        },
      })
    ),
  ]);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  // Dev/mock flow: no real signature to verify, but still finalize the order.
  if (!RAZORPAY_CONFIGURED) {
    await finalizeOrder(razorpay_order_id, razorpay_payment_id, razorpay_signature).catch(console.error);
    return NextResponse.json({ verified: true, mock: true });
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const ok =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

  if (!ok) return NextResponse.json({ verified: false }, { status: 400 });

  await finalizeOrder(razorpay_order_id, razorpay_payment_id, razorpay_signature).catch(console.error);
  return NextResponse.json({ verified: true });
}
