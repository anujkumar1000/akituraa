export interface Coupon {
  code: string;
  type: "PERCENT" | "FIXED" | "FREE_SHIPPING";
  value: number; // percent (0-100) or paise
  minSubtotal?: number; // paise
  label: string;
}

// Sample coupons. Swap for the Coupon table via the repository when
// the DB is wired. Codes are matched case-insensitively.
export const coupons: Coupon[] = [
  { code: "SOFT10", type: "PERCENT", value: 10, label: "10% off your order" },
  { code: "FREESHIP", type: "FREE_SHIPPING", value: 0, minSubtotal: 49900, label: "Free shipping" },
  { code: "AURA100", type: "FIXED", value: 10000, minSubtotal: 79900, label: "₹100 off ₹799+" },
];

export function findCoupon(code: string): Coupon | undefined {
  return coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
}

/** Returns the discount in paise that a coupon applies to a subtotal. */
export function couponDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0;
  switch (coupon.type) {
    case "PERCENT":
      return Math.round((subtotal * coupon.value) / 100);
    case "FIXED":
      return Math.min(coupon.value, subtotal);
    case "FREE_SHIPPING":
      return 0; // handled by zeroing shipping
    default:
      return 0;
  }
}
