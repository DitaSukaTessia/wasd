"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showVolume, setShowVolume] = useState(false);

  const audioSrc = "/wasd.mp3";

  // Run once on mount — set initial volume and loop, cleanup on unmount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      setShowVolume(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
        setShowVolume(true);
      } catch (e) {
        console.log("Autoplay blocked, waiting for interaction");
      }
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2">
      {/* Volume slider */}
      {showVolume && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{
            background: "rgba(13,15,24,0.9)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            animation: "slideIn 0.25s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
            {volume === 0 ? "○" : "◉"}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            aria-label="Volume"
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="volume-slider"
            style={{ width: "72px" }}
          />
        </div>
      )}

      {/* Play / pause button */}
      <button
        onClick={toggle}
        title={playing ? "Pause musik" : "Play musik"}
        aria-label={playing ? "Pause musik" : "Play musik"}
        className="audio-btn relative flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: "40px",
          height: "40px",
          background: playing ? "rgba(79,110,247,0.15)" : "rgba(13,15,24,0.9)",
          border: playing
            ? "1px solid rgba(79,110,247,0.4)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: playing ? "0 0 16px rgba(79,110,247,0.2)" : "none",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Pulse ring when playing */}
        {playing && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(79,110,247,0.4)",
              animation: "ping 2s ease-out infinite",
            }}
          />
        )}

        {/* Icon */}
        <span
          style={{
            fontSize: "16px",
            color: playing ? "rgba(79,110,247,0.9)" : "rgba(255,255,255,0.3)",
            transition: "color 0.2s",
            lineHeight: 1,
          }}
        >
          {playing ? "♫" : "♪"}
        </span>
      </button>

      <audio
        ref={audioRef}
        src={audioSrc}
        preload="none"
        onEnded={() => {
          setPlaying(false);
          setShowVolume(false);
        }}
      />

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .volume-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 2px;
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
          outline: none;
          cursor: pointer;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(79,110,247,0.9);
          box-shadow: 0 0 6px rgba(79,110,247,0.5);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
        .volume-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(79,110,247,0.9);
          border: none;
          cursor: pointer;
        }
        .volume-slider::-moz-range-track {
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        .audio-btn:hover {
          background: rgba(79,110,247,0.1) !important;
          border-color: rgba(79,110,247,0.25) !important;
        }
      `}</style>
    </div>
  );
}
