import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_PASSWORD, makeToken, SESSION_COOKIE } from "@/lib/auth";

const schema = z.object({ password: z.string().min(1) });

// Naive per-instance rate limit on login attempts.
const attempts = new Map<string, { n: number; ts: number }>();
function limited(ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.ts > 60_000) {
    attempts.set(ip, { n: 1, ts: now });
    return false;
  }
  rec.n += 1;
  return rec.n > 8;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  if (parsed.data.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}
