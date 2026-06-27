"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Link2 } from "lucide-react";

// Drag-and-drop image upload → Cloudinary (signed). Writes the
// resulting secure_url into a hidden input named `imageUrl` so the
// product form submits it. Falls back to a plain URL field if
// Cloudinary isn't configured.
export function ImageUpload({ defaultUrl }: { defaultUrl?: string }) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [manual, setManual] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    setUploading(true);
    try {
      const sigRes = await fetch("/api/admin/cloudinary-sign", { method: "POST" });
      const sig = await sigRes.json();
      if (!sig.configured) {
        setManual(true);
        setError("Cloudinary isn't configured — paste an image URL instead, or add CLOUDINARY_* env vars.");
        return;
      }

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.apiKey);
      fd.append("timestamp", String(sig.timestamp));
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);

      const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await up.json();
      if (data.secure_url) setUrl(data.secure_url);
      else setError(data.error?.message ?? "Upload failed");
    } catch {
      setError("Upload failed — check your connection.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name="imageUrl" value={url} />

      {url ? (
        <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-lav-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {url.startsWith("http") ? (
            <Image src={url} alt="Product" fill className="object-cover" sizes="176px" />
          ) : (
            <div className="grid h-full place-items-center text-xs text-muted">{url}</div>
          )}
          <button type="button" onClick={() => setUrl("")} aria-label="Remove image"
            className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-lav-700 shadow-soft hover:text-blush-deep">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : manual ? (
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://res.cloudinary.com/…"
          className="h-11 w-full rounded-xl border border-lav-200 px-4 text-sm focus:outline-none focus:ring-4 focus:ring-lav-300"
        />
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}
          className="grid h-44 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-lav-300 bg-lav-50 text-center transition-colors hover:border-lav-500 hover:bg-lav-100"
        >
          <div>
            <UploadCloud className="mx-auto h-8 w-8 text-lav-500" />
            <p className="mt-2 text-sm font-semibold text-lav-700">{uploading ? "Uploading…" : "Drop an image or click to upload"}</p>
            <p className="text-xs text-muted">PNG / JPG / WEBP</p>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />

      <div className="mt-2 flex items-center gap-3">
        <button type="button" onClick={() => setManual((m) => !m)} className="inline-flex items-center gap-1 text-xs font-semibold text-lav-600 hover:text-lav-800">
          <Link2 className="h-3.5 w-3.5" /> {manual ? "Use uploader" : "Paste URL instead"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-blush-deep">{error}</p>}
    </div>
  );
}
