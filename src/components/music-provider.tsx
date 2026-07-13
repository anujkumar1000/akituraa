"use client";

import { useEffect } from "react";
import {
  MusicProviderContext,
  PLAYLIST,
  useMusic,
} from "@/context/music-context";

function AudioPlayer() {
  const {
    audioRef,
    currentSong,
    playing,
    setCurrentTime,
    setDuration,
    setCurrentSong,
    shuffle,
  } = useMusic();

  // Play / Pause
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playing, currentSong]);

  // Time update
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const update = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, []);

  // Auto next song
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnd = () => {
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
    };

    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("ended", handleEnd);
    };
  }, [currentSong, shuffle]);

  return (
    <audio ref={audioRef} src={PLAYLIST[currentSong].src} preload="metadata" />
  );
}

export default function MusicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MusicProviderContext>
      <AudioPlayer />
      {children}
    </MusicProviderContext>
  );
}
