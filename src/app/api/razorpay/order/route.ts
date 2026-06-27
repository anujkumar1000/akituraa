import { NextResponse } from "next/server";
import { z } from "zod";
import { createRazorpayOrder, RAZORPAY_CONFIGURED } from "@/lib/razorpay";

const schema = z.object({
  amount: z.number().int().positive(), // paise
  receipt: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  // ⚠️ Production: recompute `amount` here from the DB cart/products —
  // never trust the client-sent amount for the real charge.
  try {
    const order = await createRazorpayOrder(parsed.data.amount, parsed.data.receipt);
    return NextResponse.json({
      order,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      configured: RAZORPAY_CONFIGURED,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
