"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Rewind, FastForward } from "lucide-react";
import { PLAYLIST, useMusic } from "@/context/music-context";
import { XPWindow } from "@/components/xp/core";

// const PLAYLIST = [
//   {
//     title: "Change (In the House of Flies)",
//     artist: "Deftones",
//     src: "/music/change.mp3",
//   },
//   {
//     title: "After Dark",
//     artist: "Mr.Kitty",
//     src: "/music/afterdark.mp3",
//   },
//   {
//     title: "Sweater Weather",
//     artist: "The Neighbourhood",
//     src: "/music/sweater-weather.mp3",
//   },
//   {
//     title: "More than you know",
//     artist: "Axwell & Ingrosso",
//     src: "/music/apocalypse.mp3",
//   },
// ];

// Decorative retro media-player widget. No audio — just vibes.
export function NowPlaying() {
  // const [currentSong, setCurrentSong] = useState(0);

  // const [playing, setPlaying] = useState(false);

  // const [shuffle, setShuffle] = useState(false);

  // const [currentTime, setCurrentTime] = useState(0);

  // const [duration, setDuration] = useState(0);

  // const [dragging, setDragging] = useState(false);

  // const audioRef = useRef<HTMLAudioElement>(null);

const {
  currentSong,
  setCurrentSong,
  playing,
  setPlaying,
  shuffle,
  setShuffle,
  currentTime,
  setCurrentTime,
  duration,
  audioRef,
} = useMusic();

  const [dragging, setDragging] = useState(false);

  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    if (!time || Number.isNaN(time)) return "00:00";

    const min = Math.floor(time / 60);

    const sec = Math.floor(time % 60);

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // useEffect(() => {
  //   const audio = audioRef.current;

  //   if (!audio) return;

  //   if (playing) {
  //     audio.play().catch(() => {});
  //   } else {
  //     audio.pause();
  //   }
  // }, [playing, currentSong]);

  // useEffect(() => {
  //   const audio = audioRef.current;

  //   if (!audio) return;

  //   const update = () => {
  //     setCurrentTime(audio.currentTime);
  //     setDuration(audio.duration || 0);
  //   };

  //   audio.addEventListener("timeupdate", update);

  //   audio.addEventListener("loadedmetadata", update);

  //   return () => {
  //     audio.removeEventListener("timeupdate", update);
  //     audio.removeEventListener("loadedmetadata", update);
  //   };
  // }, []);

  const nextSong = () => {
    if (shuffle) {
      let random = currentSong;

      if (PLAYLIST.length > 1) {
        while (random === currentSong) {
          random = Math.floor(Math.random() * PLAYLIST.length);
        }
      }
      setCurrentSong(random);
    } else {
      setCurrentSong((prev) => (prev + 1) % PLAYLIST.length);
    }

    setPlaying(true);
  };

  const prevSong = () => {
    setCurrentSong((prev) => (prev === 0 ? PLAYLIST.length - 1 : prev - 1));

    setPlaying(true);
  };

  // useEffect(() => {
  //   const audio = audioRef.current;

  //   if (!audio) return;

  //   const handleEnd = () => {
  //     nextSong();
  //   };

  //   audio.addEventListener("ended", handleEnd);

  //   return () => {
  //     audio.removeEventListener("ended", handleEnd);
  //   };
  // }, [currentSong, shuffle]);

  const updateSeek = (clientX: number) => {
    const audio = audioRef.current;
    const bar = progressRef.current;

    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();

    let percent = (clientX - rect.left) / rect.width;

    percent = Math.max(0, Math.min(1, percent));

    audio.currentTime = percent * duration;

    setCurrentTime(audio.currentTime);
  };

  const progress = duration === 0 ? 0 : (currentTime / duration) * 100;

  // useEffect(() => {
  //   if (!playing) return;

  //   audioRef.current?.play().catch(() => {});
  // }, [currentSong]);

  useEffect(() => {
    document.title = `${PLAYLIST[currentSong].artist} - ${PLAYLIST[currentSong].title}`;
  }, [currentSong]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging) return;
      updateSeek(e.clientX);
    };

    const up = () => {
      setDragging(false);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, duration]);

  useEffect(() => {
    const move = (e: TouchEvent) => {
      if (!dragging) return;
      updateSeek(e.touches[0].clientX);
    };

    const up = () => {
      setDragging(false);
    };

    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);

    return () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, duration]);

  return (
    <XPWindow title="NOW PLAYING" controls="mxc" bodyClassName="p-3">
      {/* <audio
        ref={audioRef}
        src={PLAYLIST[currentSong].src}
        preload="metadata"
      /> */}

      <div className="flex items-start gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[2px] border border-xp-ink-2 bg-xp-inset text-xp-ink">
          <Music className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          {/* Song Name */}
          <p className="truncate font-nav text-[12px] font-semibold text-xp-ink">
            {PLAYLIST[currentSong].title}
          </p>

          {/* Artist */}
          <p className="truncate font-nav text-[10px] text-xp-muted">
            {PLAYLIST[currentSong].artist}
          </p>
        </div>
      </div>

      {/* progress */}
      <div
        ref={progressRef}
        onMouseDown={(e) => {
          setDragging(true);
          updateSeek(e.clientX);
        }}
        onTouchStart={(e) => {
          setDragging(true);
          updateSeek(e.touches[0].clientX);
        }}
        className="relative h-1.5 cursor-pointer rounded-[1px] border border-xp-ink-2 bg-xp-white select-none"
      >
        <div
          className="h-full bg-xp-accent transition-all"
          style={{ width: `${progress}%` }}
        />

        <span
          className="absolute -top-[3px] h-3 w-1.5 -translate-x-1/2 rounded-[1px] border border-xp-ink-2 bg-xp-panel transition-all"
          style={{ left: `${progress}%` }}
        />
      </div>

      <div className="mt-1 flex justify-between font-nav text-[9px] text-xp-muted">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* transport */}
      <div className="mt-2 flex items-center justify-center gap-3">
        <TransportBtn label="Previous" onClick={prevSong}>
          <Rewind className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
        </TransportBtn>

        <TransportBtn
          label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((prev) => !prev)}
        >
          {playing ? (
            <Pause className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
          ) : (
            <Play className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
          )}
        </TransportBtn>

        <TransportBtn label="Next" onClick={nextSong}>
          <FastForward className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
        </TransportBtn>
      </div>

      <button
        onClick={() => setShuffle(!shuffle)}
        className={`mt-3 w-full cursor-pointer rounded-[2px] border border-xp-ink-2 py-1 font-nav text-[10px] uppercase shadow-[1px_1px_0_rgba(68,58,104,0.25)] transition-all duration-200 hover:-translate-y-[1px] hover:scale-[1.02] hover:shadow-[2px_2px_0_rgba(68,58,104,0.35)] active:translate-y-[1px] active:scale-[0.98] active:shadow-none ${
          shuffle
            ? "bg-xp-accent text-white"
            : "bg-xp-white text-xp-ink hover:bg-xp-highlight/40"
        }`}
      >
        🔀 Shuffle {shuffle ? "ON" : "OFF"}
      </button>
    </XPWindow>
  );
}

function TransportBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="
        group
        grid
        h-7
        w-9
        cursor-pointer
        place-items-center
        rounded-[2px]
        border
        border-xp-ink-2
        bg-xp-white
        text-xp-ink
        shadow-[1px_1px_0_rgba(68,58,104,0.25)]
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:scale-105
        hover:bg-xp-highlight/40
        hover:shadow-[2px_2px_0_rgba(68,58,104,0.35)]
        active:translate-y-[1px]
        active:scale-95
        active:shadow-none
      "
    >
      {children}
    </button>
  );
}
