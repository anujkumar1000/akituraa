// Razorpay helpers. We hit the REST API directly with fetch (Basic
// auth) so there's no extra server dependency. When keys are absent
// (local dev), the order route returns a mock so the whole flow is
// still clickable end-to-end.

export const RAZORPAY_CONFIGURED = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  if (!RAZORPAY_CONFIGURED) {
    // Dev fallback — pretend an order was created.
    return { id: `order_mock_${Date.now()}`, amount: amountPaise, currency: "INR", mock: true };
  }

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt }),
  });

  if (!res.ok) throw new Error(`Razorpay order failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as { id: string; amount: number; currency: string };
}

// Loads the Razorpay Checkout script on the client (idempotent).
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
