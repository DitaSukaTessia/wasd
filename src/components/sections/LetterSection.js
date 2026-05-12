"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "../../lib/AppContext";
import { useTypingAnimation } from "../../hooks/useTypingAnimation";

const LETTER_TEXT = `Haii eka meilani

happy birthday yaa eksayaangg

18 tahun bukan waktu yang sebentar. kamu udah ngelewatin banyak hal sampe bisa jadi diri kamu yang sekarang. dan jujur, aku bersyukur banget bisa kenal kamu, bisa deket sama kamu sampe sekarang, makasi sayang aku harap aku bakal selamanya ada di hidup kamu.

di umur yang baru ini, aku harap banyak hal baik datang ke kamu. semoga semua mimpi, keinginan, dan hal-hal yang lagi kamu perjuangin bisa pelan-pelan tercapai. semoga kamu selalu dikasih kesehatan, panjang umur, banyak kebahagiaan, dan orang-orang baik di sekitar kamu.

18 itu awal dari bab baru kan ya. semoga bab ini jadi bab yang indah buat kamu karena kali ini kamu bakal menghadapi hiruk pikuk dunia yang sebenarnya. aku harap jalan kamu dimudahkan, dan kamu bisa menghadapi semua hal yang udah nunggu kamu di depan, good luck ekaa.

sekali lagi makasi dan selamat ulang tahun, Eka Meilani 

— made with love, ditaputa 🤍`;
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

export default function LetterSection() {
  const { setCurrentPage, letterOpened, setLetterOpened } = useApp();

  // Capture SEKALI saat mount — tidak berubah meski letterOpened di context berubah
  const wasAlreadyOpened = useRef(letterOpened).current;

  const [open, setOpen] = useState(wasAlreadyOpened);
  const [showText, setShowText] = useState(false);

  const { displayed, done } = useTypingAnimation(
    LETTER_TEXT,
    18,
    showText ? 0 : 9999999,
  );

  // wasAlreadyOpened tidak akan berubah selama component hidup
  const finalDisplayed = wasAlreadyOpened ? LETTER_TEXT : displayed;
  const finalDone = wasAlreadyOpened ? true : done;

  const handleOpen = () => {
    setOpen(true);
    setLetterOpened(true); // update context, tapi wasAlreadyOpened tetap false
    setTimeout(() => setShowText(true), 800);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-5 overflow-hidden"
      style={{
        background: "#07080d",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <StarField />
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(600px, 100vw)",
          height: "400px",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(79,110,247,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* Header */}
        <div
          className="text-center mb-12"
          style={{ animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(79,110,247,0.4))",
              }}
            />
            <span style={{ fontSize: "14px", color: "rgba(79,110,247,0.6)" }}>
              ✦
            </span>
            <div
              className="h-px w-16"
              style={{
                background:
                  "linear-gradient(to left, transparent, rgba(79,110,247,0.4))",
              }}
            />
          </div>
          <p
            className="mb-3"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "rgba(79,110,247,0.6)",
              textTransform: "uppercase",
            }}
          >
            a letter for you
          </p>
          <h1 className="text-[clamp(30px,5vw,38px)] font-bold tracking-tight leading-tight text-white mb-3">
            Pesan dari Raja Iblis
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto mb-7">
            — blagung, 19 mei 2026 —
          </p>
        </div>

        {/* Envelope — closed */}
        {!open && (
          <div
            className="flex flex-col items-center gap-6"
            style={{
              animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both",
            }}
          >
            <EnvelopeButton onOpen={handleOpen} />
            <p
              className="animate-pulse"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.18)",
              }}
            >
              <span className="sm:hidden">
                ✦ &nbsp;KETUK AMPLOP UNTUK MEMBUKA&nbsp; ✦
              </span>
              <span className="hidden sm:inline">
                ✦ &nbsp;KLIK AMPLOP UNTUK MEMBUKA&nbsp; ✦
              </span>
            </p>
          </div>
        )}

        {/* Letter — open */}
        {open && (
          <div
            style={{ animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {/* Star row */}
            <div className="flex justify-center gap-2 mb-7">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  style={{
                    fontSize: i === 2 ? "18px" : "11px",
                    color: "rgba(79,110,247,0.6)",
                    animation: `twinkle ${1 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.12}s`,
                  }}
                >
                  ✦
                </span>
              ))}
            </div>

            {/* Letter card */}
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: "rgba(13,15,24,0.95)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 0 60px rgba(79,110,247,0.06)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(79,110,247,0.5), transparent)",
                }}
              />

              <div className="p-5 sm:p-7 md:p-10">
                <div
                  className="whitespace-pre-line leading-relaxed"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(14px, 1.8vw, 15px)",
                    color: "rgba(255,255,255,0.7)",
                    minHeight: "300px",
                  }}
                >
                  {finalDisplayed}
                  {!finalDone && (
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "1em",
                        background: "rgba(79,110,247,0.8)",
                        marginLeft: "2px",
                        verticalAlign: "text-bottom",
                        animation: "blink 1s step-end infinite",
                      }}
                    />
                  )}
                </div>

                {/* Footer */}
                {finalDone && (
                  <div
                    className="mt-8 pt-6 flex flex-col items-center gap-3"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both",
                    }}
                  >
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          aria-hidden="true"
                          style={{
                            fontSize: "14px",
                            color: "rgba(79,110,247,0.5)",
                            animation: `twinkle ${1 + i * 0.2}s ease-in-out infinite`,
                            animationDelay: `${i * 0.15}s`,
                          }}
                        >
                          ♡
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next button */}
            {finalDone && (
              <div
                className="flex justify-center mt-8"
                style={{
                  animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                <NextButton onClick={() => setCurrentPage("riddle")} />
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .envelope-btn {
          background: rgba(13,15,24,0.9);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .envelope-btn:hover {
          background: rgba(79,110,247,0.08);
          border-color: rgba(79,110,247,0.35);
          box-shadow: 0 0 40px rgba(79,110,247,0.12);
        }
        .next-btn {
          background: rgba(79,110,247,0.12);
          border: 1px solid rgba(79,110,247,0.3);
          color: rgba(255,255,255,0.75);
        }
        .next-btn:hover {
          background: rgba(79,110,247,0.2);
          border-color: rgba(79,110,247,0.5);
          box-shadow: 0 0 24px rgba(79,110,247,0.2);
          color: rgba(255,255,255,0.95);
        }
        .next-btn:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
}

// ── Envelope button ──────────────────────────────────────────────────────────
function EnvelopeButton({ onOpen }) {
  const [hover, setHover] = useState(false);
  const [touched, setTouched] = useState(false);
  const [opening, setOpening] = useState(false);

  const active = hover || touched;

  const handleClick = () => {
    if (opening) return;
    setOpening(true);
    onOpen();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setTouched(false);
      }}
      onTouchStart={() => setTouched(true)}
      onTouchEnd={() => setTouched(false)}
      disabled={opening}
      aria-label="Buka surat"
      className="envelope-btn relative rounded-xl transition-all duration-500"
      style={{
        padding: "clamp(32px, 6vw, 56px)",
        transform: opening
          ? "scale(1.04)"
          : active
            ? "scale(1.02)"
            : "scale(1)",
      }}
    >
      {/* Envelope body */}
      <div
        className="relative mx-auto mb-8"
        style={{ width: "clamp(140px, 40vw, 220px)" }}
      >
        {/* Flap */}
        <div
          className="absolute top-0 left-0 w-full transition-all duration-500"
          style={{
            height: "clamp(50px, 12vw, 75px)",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: "rgba(79,110,247,0.08)",
            border: "1px solid rgba(79,110,247,0.2)",
            transformOrigin: "top",
            transform: active && !opening ? "rotateX(-25deg)" : "rotateX(0deg)",
          }}
        />

        {/* Body */}
        <div
          className="w-full rounded-b-xl relative overflow-hidden"
          style={{
            height: "clamp(90px, 22vw, 140px)",
            background: "rgba(79,110,247,0.06)",
            border: "1px solid rgba(79,110,247,0.2)",
            borderTop: "none",
          }}
        >
          {/* V-fold lines */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, transparent 49%, rgba(79,110,247,0.07) 49.5%, rgba(79,110,247,0.07) 50%, transparent 50%), linear-gradient(225deg, transparent 49%, rgba(79,110,247,0.07) 49.5%, rgba(79,110,247,0.07) 50%, transparent 50%)",
            }}
          />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {opening ? (
              <div
                className="w-7 h-7 rounded-full border-2 border-indigo-400/30 border-t-indigo-400"
                style={{ animation: "spin 0.8s linear infinite" }}
              />
            ) : (
              <span
                className="transition-transform duration-300"
                style={{
                  fontSize: "clamp(28px, 8vw, 40px)",
                  transform: active ? "scale(1.15)" : "scale(1)",
                }}
              >
                {active ? "💌" : "✉️"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Label */}
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "13px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "-0.01em",
          marginBottom: "4px",
        }}
      >
        for: Eka Meilani
      </p>
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: opening ? "rgba(79,110,247,0.8)" : "rgba(79,110,247,0.5)",
        }}
      >
        {opening ? "MEMBUKA..." : "from dita · with love"}
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}

// ── Next button ──────────────────────────────────────────────────────────────
function NextButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="next-btn group relative overflow-hidden rounded-xl transition-all duration-300"
      style={{
        padding: "13px 36px",
        minHeight: "44px",
        fontFamily: "'Space Mono', monospace",
        fontSize: "11px",
        letterSpacing: "0.18em",
        cursor: "pointer",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
        }}
      />
      <span className="relative z-10 flex items-center gap-3">
        <span
          aria-hidden="true"
          style={{ fontSize: "12px", color: "rgba(79,110,247,0.6)" }}
        >
          ✦
        </span>
        LANJUT KE TEKA-TEKI
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
          style={{ fontSize: "11px", color: "rgba(79,110,247,0.7)" }}
        >
          →
        </span>
      </span>
    </button>
  );
}
