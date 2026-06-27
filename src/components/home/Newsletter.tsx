"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FloatingDecor } from "@/components/decorations/Kawaii";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-lav-600 to-lav-500 px-6 py-12 text-center text-white sm:px-12">
        <FloatingDecor className="opacity-40" />
        <div className="relative mx-auto max-w-xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Join the sparkle squad 💌</h2>
          <p className="mt-3 text-white/85">
            Get 10% off your first order, early access to drops & cute things in
            your inbox. No spam, pinky promise. 🤙
          </p>

          {state === "done" ? (
            <p className="mt-6 rounded-full bg-white/20 px-5 py-3 font-display font-semibold">
              You&apos;re in! Check your inbox for your code ✨
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 flex-1 rounded-full border-0 px-5 text-lav-900 placeholder:text-lav-400 focus:outline-none focus:ring-4 focus:ring-white/40"
              />
              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={state === "loading"}
                className="h-12"
              >
                {state === "loading" ? "Joining…" : "Get 10% off"}
              </Button>
            </form>
          )}
          {state === "error" && (
            <p className="mt-3 text-sm text-blush">Oops, something went wrong. Try again 🥺</p>
          )}
        </div>
      </div>
    </section>
  );
}
