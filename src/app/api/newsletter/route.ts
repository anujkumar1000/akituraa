import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

// Simple in-memory rate limit (per-instance). Swap for Upstash/
// Redis in production for durable, multi-instance limiting.
const hits = new Map<string, { count: number; ts: number }>();
function limited(ip: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > windowMs) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > max;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Persist when the DB is wired:
  //   await prisma.newsletterSubscriber.upsert({
  //     where: { email: parsed.data.email },
  //     update: { isActive: true },
  //     create: { email: parsed.data.email, source: parsed.data.source },
  //   });
  // For now we accept + (optionally) forward to an ESP.
  console.log("[newsletter] subscribe:", parsed.data.email, parsed.data.source);

  return NextResponse.json({ ok: true });
}
