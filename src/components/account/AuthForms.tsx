"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function AuthForms() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "register") {
        const res = await fetch("/api/account/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) { setError(d.error ?? "Could not register"); setLoading(false); return; }
      }
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Wrong email or password 🥺");
      } else {
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft sm:p-8">
      <div className="mb-5 flex rounded-full bg-lav-100 p-1">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); }}
            className={`flex-1 rounded-full py-2 text-sm font-display font-semibold transition-colors ${tab === t ? "bg-white text-lav-700 shadow-soft" : "text-muted"}`}
          >
            {t === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {tab === "register" && (
          <Input label="Name" value={form.name} onChange={set("name")} placeholder="Your name" />
        )}
        <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" />
        <Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />

        {error && <p className="text-sm text-blush-deep">{error}</p>}

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Please wait…" : tab === "login" ? "Sign in 💜" : "Create account ✨"}
        </Button>
      </form>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-lav-700">{label}</span>
      <input required type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-lav-200 px-4 text-sm focus:outline-none focus:ring-4 focus:ring-lav-300" />
    </label>
  );
}
