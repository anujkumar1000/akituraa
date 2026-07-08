"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { XPButton } from "@/components/xp/core";
import { cn } from "@/lib/utils";

// The "SYSTEM MESSAGE — style has no gender. [OK]" dialog from the
// mockup. Dismissible; purely decorative.
export function SystemMessage({ className }: { className?: string }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className={cn("xp-window w-56 rounded-[3px] shadow-float", className)}>
      <div className="xp-titlebar flex h-7 items-center gap-2 px-2">
        <span className="font-nav text-[10px] font-semibold uppercase tracking-[0.12em] text-xp-ink">-- SYSTEM MESSAGE</span>
        <span className="ml-auto flex items-center gap-1">
          <span aria-hidden className="grid h-3.5 w-3.5 place-items-center rounded-[1px] border border-xp-ink-2 bg-xp-panel text-[7px] text-xp-ink">□</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close message"
            className="grid h-3.5 w-3.5 place-items-center rounded-[1px] border border-xp-ink-2 bg-xp-panel text-[7px] text-xp-ink hover:bg-xp-highlight"
          >
            ✕
          </button>
        </span>
      </div>
      <div className="bg-xp-white p-3">
        <p className="font-nav text-[12px] lowercase leading-snug text-xp-ink">
          style has<br />no gender.
        </p>
        <div className="mt-2 flex items-center justify-between">
          <XPButton size="sm" variant="outline" onClick={() => setOpen(false)} className="px-5">
            OK
          </XPButton>
          <Heart className="h-4 w-4 fill-xp-pink text-xp-pink" />
        </div>
      </div>
    </div>
  );
}
