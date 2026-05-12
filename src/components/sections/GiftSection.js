"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useApp } from "../../lib/AppContext";
import { useTypingAnimation } from "../../hooks/useTypingAnimation";

const GIFT_LETTER = `Untuk Eka Meilani yang bersinar... ✨
 
Kalau kamu bisa membaca ini, artinya kamu sudah cukup berani dan penasaran untuk membuka hadiah ini. Dan itu hal yang membuatmu istimewa.
 
Hadiah sejatinya bukan soal benda. Ini tentang momen. Tentang perasaan. Tentang kata-kata yang mungkin susah diucapkan secara langsung.
 
Jadi di sini, izinkan aku berkata dengan jujur:
 
Kamu adalah seseorang yang bikin hari-hari terasa lebih berwarna. Kehadiranmu, walau kadang dari jauh, selalu terasa hangat seperti sinar matahari yang menembus awan.
 
Di hari ulang tahunmu yang ke-18 ini, aku berharap:
🌟 Bahwa setiap impianmu menemukan jalannya
💫 Bahwa setiap langkahmu dipenuhi keberanian
🪐 Bahwa kamu terus menjelajahi dunia dengan rasa ingin tahu
✨ Dan bahwa kamu tahu, selalu ada yang bangga padamu
 
Ini bukan sekadar hadiah — ini adalah sebuah janji bahwa aku akan selalu ada, mendukungmu dari belakang, seperti bintang-bintang yang terus bersinar meski siang hari.
 
Selamat ulang tahun, Eka. Semoga 18 menjadi awal dari petualanganmu yang paling indah. 🚀
 
Dengan segala ketulusan dari galaksi ini,
Seseorang yang beruntung bisa mengenalmu 💜`;

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

// ── Particle burst ───────────────────────────────────────────────────────────
// FIX #3: particles di-generate sekali dengan useMemo, bukan tiap render
// FIX #13: onDone callback untuk unmount setelah animasi selesai
function ParticleBurst({ onDone }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 340,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 0.3,
        dur: 0.8 + Math.random() * 0.6,
      })),
    [],
  );

  // FIX #13: Unmount setelah semua partikel selesai animasi
  useEffect(() => {
    const maxDur = Math.max(...particles.map((p) => p.delay + p.dur));
    const t = setTimeout(onDone, (maxDur + 0.1) * 1000);
    return () => clearTimeout(t);
  }, [onDone, particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background:
              p.id % 3 === 0
                ? "rgba(79,110,247,0.9)"
                : p.id % 3 === 1
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(79,110,247,0.4)",
            animation: `burst ${p.dur}s ease-out ${p.delay}s forwards`,
            "--tx": `${p.x}px`,
            "--ty": `${p.y}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes burst {
          0%   { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.3); }
        }
      `}</style>
    </div>
  );
}

// ── Envelope / gift button ───────────────────────────────────────────────────
function EnvelopeGift({ onOpen }) {
  const [hover, setHover] = useState(false);
  const [popped, setPopped] = useState(false);
  // FIX #11: loading state untuk mengisi gap 1.4 detik
  const [opening, setOpening] = useState(false);
  // FIX #7: touch support untuk flap animation
  const [touched, setTouched] = useState(false);

  const handleClick = () => {
    if (popped || opening) return;
    setPopped(true);
    setOpening(true);
    setTimeout(() => onOpen(), 600);
  };

  // FIX #7: flap terangkat saat hover di desktop atau touch di mobile
  const flapLifted = (hover || touched) && !popped;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* FIX #13: ParticleBurst di-unmount via state setelah animasi selesai */}
      {popped && <ParticleBurst onDone={() => setPopped(false)} />}

      <button
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setTouched(false);
        }}
        // FIX #7: touch events untuk flap di mobile
        onTouchStart={() => setTouched(true)}
        onTouchEnd={() => setTouched(false)}
        disabled={opening}
        aria-label="Buka hadiah spesialmu" // FIX #12
        className="relative"
        style={{ perspective: "1000px" }}
      >
        <div
          className="transition-all duration-500"
          style={{
            transform: opening
              ? "scale(1.06)"
              : hover || touched
                ? "scale(1.03)"
                : "scale(1)",
          }}
        >
          <div
            className="p-8 sm:p-10 md:p-14 text-center rounded-xl transition-all duration-500"
            style={{
              background:
                hover || touched
                  ? "rgba(79,110,247,0.08)"
                  : "rgba(13,15,24,0.9)",
              border:
                hover || touched
                  ? "1px solid rgba(79,110,247,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                hover || touched ? "0 0 40px rgba(79,110,247,0.12)" : "none",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* FIX #6: Envelope responsif — w-36 di mobile, w-56 di desktop */}
            <div
              className="relative w-36 sm:w-48 md:w-56 mx-auto mb-8 transition-transform duration-700 origin-top"
              style={{
                transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Body */}
              <div
                className="w-full rounded-b-xl overflow-hidden relative"
                style={{
                  height: "clamp(90px, 22vw, 140px)",
                  background: "rgba(79,110,247,0.06)",
                  border: "1px solid rgba(79,110,247,0.2)",
                  borderTop: "none",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 49%, rgba(79,110,247,0.07) 49.5%, rgba(79,110,247,0.07) 50%, transparent 50%), linear-gradient(225deg, transparent 49%, rgba(79,110,247,0.07) 49.5%, rgba(79,110,247,0.07) 50%, transparent 50%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* FIX #11: tunjukkan spinner saat opening */}
                  {opening ? (
                    <div
                      className="w-8 h-8 rounded-full border-2 border-indigo-400/30 border-t-indigo-400"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    />
                  ) : (
                    <span
                      className="text-3xl sm:text-4xl transition-transform duration-300"
                      style={{
                        transform: flapLifted ? "scale(1.15)" : "scale(1)",
                      }}
                    >
                      {flapLifted ? "🎀" : "🎁"}
                    </span>
                  )}
                </div>
              </div>

              {/* Flap — FIX #7: animasi flap pakai flapLifted yang support touch */}
              <div
                className="absolute top-0 left-0 w-full transition-all duration-400"
                style={{
                  height: "clamp(55px, 14vw, 80px)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "rgba(79,110,247,0.08)",
                  border: "1px solid rgba(79,110,247,0.2)",
                  transformOrigin: "top",
                  transform: flapLifted ? "rotateX(-25deg)" : "rotateX(0deg)",
                }}
              />
            </div>

            <p
              className="mb-1"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "-0.01em",
              }}
            >
              Hadiah Spesialmu
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: opening
                  ? "rgba(79,110,247,0.8)"
                  : "rgba(79,110,247,0.6)",
              }}
            >
              {/* FIX #11: label berubah saat opening */}
              {opening ? "MEMBUKA..." : "KLIK UNTUK MEMBUKA"}
            </p>
          </div>
        </div>
      </button>

      {!opening && (
        <p
          className="animate-pulse"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          ✦ &nbsp;KETUK KADO&nbsp; ✦
        </p>
      )}
    </div>
  );
}

// ── Locked state ─────────────────────────────────────────────────────────────
// FIX #15: tambah animasi masuk yang konsisten dengan section lain
function Locked() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "#07080d",
        animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <div
        className="p-10 text-center rounded-xl max-w-sm"
        style={{
          background: "rgba(13,15,24,0.9)",
          border: "1px solid rgba(255,255,255,0.07)",
          animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.25)" }}>
            🔒
          </span>
        </div>
        <p
          className="mb-2"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Masih Terkunci
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          Selesaikan teka-teki terlebih dahulu untuk membuka hadiah ini.
        </p>
      </div>

      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function GiftSection() {
  const { riddleSolved, giftOpened, setGiftOpened } = useApp();

  const isReturning = useRef(giftOpened); // capture initial value, never changes

  const [showLetter, setShowLetter] = useState(giftOpened);
  const { displayed, done } = useTypingAnimation(
    GIFT_LETTER,
    20,
    showLetter ? 0 : 99999999,
  );

  const finalDisplayed = isReturning.current ? GIFT_LETTER : displayed;
  const finalDone = isReturning.current ? true : done;

  const handleOpen = () => {
    setGiftOpened(true);
    setTimeout(() => setShowLetter(true), 800);
  };

  if (!riddleSolved) return <Locked />;

  return (
    <div
      className="relative min-h-screen pb-24 px-4 overflow-hidden"
      style={{
        background: "#07080d",
        // FIX #5: safe area inset untuk navbar
        paddingTop: "calc(80px + env(safe-area-inset-top, 0px))",
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

      {/* FIX #16: Ambient glow pakai % bukan px agar tidak overflow di mobile */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(600px, 100vw)",
          height: "400px",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(79,110,247,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-xl mx-auto relative z-10">
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
            <span style={{ fontSize: "14px" }}>✦</span>
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
            Hadiah Untukmu
          </p>
          <h1 className="text-[clamp(26px,5vw,38px)] font-bold tracking-tight leading-tight text-white mb-3">
            Hadiahmu
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto mb-7">
            — disiapkan khusus untukmu, dari jauh —
          </p>
        </div>

        {/* FIX #4: Envelope hanya render kalau belum dibuka */}
        {!giftOpened && (
          <div
            style={{
              animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both",
            }}
          >
            <EnvelopeGift onOpen={handleOpen} />
          </div>
        )}

        {/* Letter */}
        {giftOpened && (
          <div
            style={{ animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {/* Star row */}
            <div className="flex justify-center gap-2 mb-7">
              {[0, 1, 2, 3, 4].map(
                (
                  i, // FIX #14: pakai value konkret, bukan index dari Array.from
                ) => (
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
                ),
              )}
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

              {/* FIX #9: padding lebih kecil di mobile */}
              <div className="p-5 sm:p-7 md:p-10">
                <div
                  className="whitespace-pre-line leading-relaxed"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    // FIX #10: minimum font size 14px untuk readability
                    fontSize: "clamp(14px, 1.8vw, 15px)",
                    color: "rgba(255,255,255,0.7)",
                    minHeight: "300px",
                  }}
                >
                  {finalDisplayed}
                  {!finalDone && (
                    <span
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

                {finalDone && (
                  <div
                    className="mt-8 pt-6 flex flex-col items-center gap-3"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      animation: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both",
                    }}
                  >
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map(
                        (
                          i, // FIX #14
                        ) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "14px",
                              color: "rgba(79,110,247,0.5)",
                              animation: `twinkle ${1 + i * 0.2}s ease-in-out infinite`,
                              animationDelay: `${i * 0.15}s`,
                            }}
                          >
                            ♡
                          </span>
                        ),
                      )}
                    </div>
                    <p
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        color: "rgba(79,110,247,0.7)",
                        textAlign: "center",
                      }}
                    >
                      Happy 18th Birthday, Eka Meilani ✨
                    </p>
                  </div>
                )}
              </div>
            </div>
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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
