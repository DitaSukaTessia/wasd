"use client";

import { useState, useEffect } from "react";
import { useApp } from "../../lib/AppContext";
import { useTypingAnimation } from "../../hooks/useTypingAnimation";

const line1 = "Selamat Ulang Tahun ke-18 ";
const line2 = "Eka Meilani";
const line3 =
  "Semoga semua impianmu setinggi bintang-bintang di langit, dan setiap harimu selalu bersinar seperti supernova.";

// ── Star field ───────────────────────────────────────────────────────────────
// FIX hydration: Math.random() hanya jalan di client via useEffect
// agar nilai server render (array kosong) cocok dengan client sebelum hydration
function StarField() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${2 + Math.random() * 4}s`,
        delay: `${-Math.random() * 5}s`,
      })),
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute w-px h-px rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Cursor blink ─────────────────────────────────────────────────────────────
function Cursor({
  width = "2px",
  height = "1em",
  color = "rgba(79,110,247,0.8)",
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width,
        height,
        background: color,
        marginLeft: "2px",
        verticalAlign: "text-bottom",
        animation: "blink 1s step-end infinite",
      }}
    />
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function HomeSection() {
  const { setCurrentPage, setLaunched } = useApp();
  const [launching, setLaunching] = useState(false);

  const { displayed: d1, done: done1 } = useTypingAnimation(line1, 55, 500);
  const { displayed: d2, done: done2 } = useTypingAnimation(
    line2,
    80,
    done1 ? 200 : 999999,
  );
  const { displayed: d3, done: done3 } = useTypingAnimation(
    line3,
    30,
    done2 ? 400 : 999999,
  );
  // Derive phase langsung tanpa state tambahan
  const phase = done3 ? 3 : done2 ? 2 : done1 ? 1 : 0;

  const handleLaunch = () => {
    if (launching) return;
    setLaunching(true);
    setLaunched(true);
    setCurrentPage("letter");
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: "#07080d" }}
    >
      <StarField />

      {/* Ambient glow — min(700px, 100vw) agar tidak overflow di mobile */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          width: "min(700px, 100vw)",
          height: "min(700px, 100vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(79,110,247,0.06) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl w-full mt-[-10vh]">
        {/* Dot row */}
        <div className="flex justify-center items-center gap-3 mb-10">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              style={{
                fontSize: i === 2 ? "16px" : "9px",
                color: "rgba(79,110,247,0.5)",
                animation: `twinkle ${1 + i * 0.25}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              ✦
            </span>
          ))}
        </div>

        {/* Line 1 */}
        <div className="min-h-[2rem] mb-5">
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "clamp(11px, 1.6vw, 13px)",
              letterSpacing: "0.18em",
              color: "rgba(79,110,247,0.65)",
            }}
          >
            {d1}
            {!done1 && <Cursor />}
          </p>
        </div>

        {/* Line 2 — Name */}
        <div className="mb-6">
          {phase >= 1 && (
            <h1
              style={{
                animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both",
              }}
              className="text-[clamp(36px,5vw,48px)] font-bold tracking-tight leading-tight text-white mb-3"
            >
              {d2}
              {!done2 && <Cursor width="3px" height="0.85em" />}
            </h1>
          )}
        </div>

        {/* Hairline divider */}
        {phase >= 2 && (
          <div
            className="flex items-center justify-center gap-4 mb-7"
            style={{ animation: "rise 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <div
              className="h-px w-20"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(79,110,247,0.4))",
              }}
            />
            <span style={{ fontSize: "10px", color: "rgba(79,110,247,0.5)" }}>
              ✦
            </span>
            <div
              className="h-px w-20"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(79,110,247,0.4))",
              }}
            />
          </div>
        )}

        {/* Line 3 */}
        <div className="mb-12">
          {phase >= 2 && (
            <p
              className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto mb-7"
              style={{
                animation: "rise 0.6s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {d3}
              {!done3 && <Cursor color="rgba(79,110,247,0.6)" />}
            </p>
          )}
        </div>

        {/* CTA */}
        {phase >= 3 && (
          <div
            style={{ animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <button
              onClick={handleLaunch}
              disabled={launching}
              aria-label="Mulai jelajahi galaksi"
              className="group relative overflow-hidden rounded-xl transition-all duration-300 cta-btn"
              style={{
                padding: "13px 36px",
                minHeight: "44px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.75)",
                cursor: launching ? "not-allowed" : "pointer",
                opacity: launching ? 0.6 : 1,
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <span aria-hidden="true" style={{ fontSize: "14px" }}>
                  ✦
                </span>
                {launching ? "MELUNCUR..." : "EXPLORE MORE"}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  style={{ fontSize: "11px", color: "rgba(79,110,247,0.7)" }}
                >
                  →
                </span>
              </span>
            </button>

            {/* "KETUK" di mobile, "KLIK" di desktop */}
            <p
              className="mt-5 animate-pulse"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.18)",
              }}
            >
              <span className="sm:hidden">
                ✦ &nbsp;KETUK UNTUK MEMULAI PETUALANGAN&nbsp; ✦
              </span>
              <span className="hidden sm:inline">
                ✦ &nbsp;KLIK UNTUK MEMULAI PETUALANGAN&nbsp; ✦
              </span>
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50%       { opacity: 0.6; transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .cta-btn {
          background: rgba(79,110,247,0.12);
          border: 1px solid rgba(79,110,247,0.3);
        }
        .cta-btn:hover:not(:disabled) {
          background: rgba(79,110,247,0.2);
          border-color: rgba(79,110,247,0.5);
          box-shadow: 0 0 24px rgba(79,110,247,0.2);
          color: rgba(255,255,255,0.95);
        }
        .cta-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
