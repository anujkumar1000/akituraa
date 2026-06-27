"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Login failed");
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-gradient-to-br from-lav-200 to-blush/50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-float">
        <div className="mb-6 text-center">
          <span className="font-display text-2xl font-bold text-lav-700">akitauraa<span className="text-blush-deep">.</span></span>
          <p className="mt-1 text-sm text-muted">Admin dashboard</p>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-lav-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="h-11 w-full rounded-xl border border-lav-200 px-4 text-sm focus:outline-none focus:ring-4 focus:ring-lav-300"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="mt-3 text-sm text-blush-deep">{error}</p>}

        <Button type="submit" disabled={loading} size="lg" className="mt-5 w-full">
          <Lock className="h-4 w-4" /> {loading ? "Signing in…" : "Sign in"}
        </Button>
        {/* <p className="mt-4 text-center text-xs text-muted">Dev password: <code className="rounded bg-lav-100 px-1.5 py-0.5">akitauraa</code></p> */}
      </form>
    </div>
  );
}
