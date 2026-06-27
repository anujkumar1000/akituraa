import crypto from "crypto";
import { cookies } from "next/headers";

// Lightweight admin session: a signed cookie (HMAC). Good enough to
// gate the dashboard without pulling in a full auth library. For
// customer accounts / OAuth, layer Auth.js on top later.

const COOKIE = "ak_admin";
const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
// Dev default password; override with ADMIN_PASSWORD in env.
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "akitauraa";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function makeToken() {
  const payload = "admin";
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  return (
    expected.length === sig.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  );
}

export const SESSION_COOKIE = COOKIE;

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}
