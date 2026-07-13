"use client";

import { createContext, useContext, useRef, useState } from "react";

export const PLAYLIST = [
  {
    title: "Animals",
    artist: "Maroon 5",
    src: "/music/change.mp3",
  },
  {
    title: "Mirror ",
    artist: "Justin Timberlake",
    src: "/music/afterdark.mp3",
  },
  {
    title: "On My Way",
    artist: "Alan Walker",
    src: "/music/sweater-weather.mp3",
  },
  {
    title: "More Than You Know",
    artist: "Axwell & Ingrosso",
    src: "/music/apocalypse.mp3",
  },
];

type MusicContextType = {
  currentSong: number;
  setCurrentSong: React.Dispatch<React.SetStateAction<number>>;

  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  shuffle: boolean;
  setShuffle: React.Dispatch<React.SetStateAction<boolean>>;

  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;

  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;

  stopMusic: () => void;
  pauseMusic: () => void;

  audioRef: React.RefObject<HTMLAudioElement | null>;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentSong, setCurrentSong] = useState(0);

  const [playing, setPlaying] = useState(false);

  const [shuffle, setShuffle] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const stopMusic = () => {
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
  };

  const pauseMusic = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        setCurrentSong,

        playing,
        setPlaying,

        audioRef,
        stopMusic,
        pauseMusic,

        shuffle,
        setShuffle,

        currentTime,
        setCurrentTime,

        duration,
        setDuration,

       
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error("useMusic must be used inside MusicProviderContext");
  }

  return context;
}
