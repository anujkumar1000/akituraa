import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAdminAuthed } from "@/lib/auth";

// Returns a short-lived signature so the admin browser can upload
// directly to Cloudinary without ever seeing the API secret.
export async function POST() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ configured: false });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "akitauraa/products";
  // Sign params alphabetically: folder, timestamp
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

  return NextResponse.json({ configured: true, cloudName, apiKey, timestamp, folder, signature });
}
