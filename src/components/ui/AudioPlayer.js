"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  // We use a free looping ambient space music URL
  // User can replace with their own audio file
  const audioSrc =
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749f7e7.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
  }, [volume]);

  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch (e) {
        console.log("Autoplay blocked, waiting for interaction");
      }
    }
  };

  return (
    <div className="fixed bottom-5 left-6 z-50 flex items-center gap-3">
      {/* Volume slider */}
      {playing && (
        <div className="glass-card px-3 py-2 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="w-20 accent-yellow-400"
          />
        </div>
      )}

      <button
        onClick={toggle}
        className="audio-btn w-12 h-12 rounded-full flex items-center justify-center relative group"
        title={playing ? "Pause musik" : "Play musik"}
      >
        {/* Pulse ring when playing */}
        {playing && (
          <>
            <div className="absolute inset-0 rounded-full border border-yellow-400 animate-ping opacity-30" />
            <div
              className="absolute inset-0 rounded-full border border-yellow-400 animate-ping opacity-20"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}
        <Music
          size={18}
          className={`text-yellow-400 ${playing ? "animate-pulse" : ""}`}
        />
      </button>

      <audio ref={audioRef} src={audioSrc} preload="none" />
    </div>
  );
}
