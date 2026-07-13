// components/mini-player.tsx
"use client";

import { usePathname } from "next/navigation";
import { useMusic, PLAYLIST } from "@/context/music-context";

export default function MiniPlayer() {
  const pathname = usePathname();

  const {
    currentSong,
    setCurrentSong,
    playing,
    setPlaying,
    shuffle,
    setShuffle,
    audioRef,
    pauseMusic,
    currentTime,
    duration,
    setCurrentTime,
    setDuration,
  } = useMusic();

  // Home page pe mat dikhao
  if (pathname === "/") return null;

  const currentTrack = PLAYLIST[currentSong];

  const togglePlay = () => {
    if (playing) {
      pauseMusic();
    } else {
      setPlaying(true);
      audioRef.current?.play().catch(() => {});
    }
  };

  const nextTrack = () => {
    if (shuffle) {
      let random = currentSong;
      while (random === currentSong && PLAYLIST.length > 1) {
        random = Math.floor(Math.random() * PLAYLIST.length);
      }
      setCurrentSong(random);
    } else {
      setCurrentSong((prev) => (prev + 1) % PLAYLIST.length);
    }
    setPlaying(true);
  };

  const prevTrack = () => {
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    } else {
      setCurrentSong((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
      setPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration) {
      const newTime = x * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg shadow-purple-200/50 border border-purple-100/50 flex items-center gap-3 text-xs transition-all duration-300 hover:shadow-purple-200/70 hover:scale-[1.02]">
      {/* Track Info */}
      <div className="flex items-center gap-2">
        <span className="text-purple-500 text-sm">🎵</span>
        <span className="text-purple-800 font-medium truncate max-w-[120px]">
          {currentTrack.title}
        </span>
        <span className="text-purple-300">·</span>
        <span className="text-purple-500 truncate max-w-[80px]">
          {currentTrack.artist}
        </span>
        <span className="text-purple-400 text-[10px] font-mono ml-1">
          {formatTime(currentTime)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          onClick={prevTrack}
          className="group w-7 h-7 rounded-full flex items-center justify-center text-purple-300 hover:text-purple-500 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7M18 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="group w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 flex items-center justify-center text-white transition-all duration-200 shadow-sm shadow-purple-400/30 cursor-pointer"
        >
          {playing ? (
            <svg
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={nextTrack}
          className="group w-7 h-7 rounded-full flex items-center justify-center text-purple-300 hover:text-purple-500 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M6 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Shuffle */}
        <button
          onClick={() => setShuffle(!shuffle)}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] transition-all duration-200 cursor-pointer ${
            shuffle
              ? "text-purple-500 bg-purple-100 shadow-[1px_1px_0_rgba(68,58,104,0.25)]"
              : "text-purple-300 hover:text-purple-500 hover:bg-purple-50"
          }`}
        >
          🔀
        </button>
      </div>
    </div>
  );
}
