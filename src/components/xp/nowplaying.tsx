"use client";

import { useState } from "react";
import { Music, Play, Pause, Rewind, FastForward } from "lucide-react";
import { XPWindow } from "@/components/xp/core";

// Decorative retro media-player widget. No audio — just vibes.
export function NowPlaying() {
  const [playing, setPlaying] = useState(true);

  return (
    <XPWindow title="NOW PLAYING" controls="mxc" bodyClassName="p-3">
      <div className="flex items-start gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[2px] border border-xp-ink-2 bg-xp-inset text-xp-ink">
          <Music className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-nav text-[12px] font-semibold lowercase text-xp-ink">deftones</p>
          <p className="truncate font-nav text-[10px] lowercase text-xp-muted">change (in the house of flies)</p>
        </div>
      </div>

      {/* progress */}
      <div className="mt-3">
        <div className="relative h-1.5 rounded-[1px] border border-xp-ink-2 bg-xp-white">
          <div className="h-full w-[31%] bg-xp-accent" />
          <span className="absolute -top-[3px] left-[31%] h-3 w-1.5 -translate-x-1/2 rounded-[1px] border border-xp-ink-2 bg-xp-panel" />
        </div>
        <div className="mt-1 flex justify-between font-nav text-[9px] text-xp-muted">
          <span>01:37</span>
          <span>05:01</span>
        </div>
      </div>

      {/* transport */}
      <div className="mt-2 flex items-center justify-center gap-3">
        <TransportBtn label="Rewind"><Rewind className="h-3.5 w-3.5" /></TransportBtn>
        <TransportBtn label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </TransportBtn>
        <TransportBtn label="Fast forward"><FastForward className="h-3.5 w-3.5" /></TransportBtn>
      </div>
    </XPWindow>
  );
}

function TransportBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid h-7 w-9 place-items-center rounded-[2px] border border-xp-ink-2 bg-xp-white text-xp-ink shadow-[1px_1px_0_rgba(68,58,104,0.25)] transition-all hover:bg-xp-highlight/50 active:translate-y-[1px] active:shadow-none"
    >
      {children}
    </button>
  );
}
