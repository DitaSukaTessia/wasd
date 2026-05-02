"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useApp } from "../../lib/AppContext";
import { FloatingPlanet } from "../ui/Planet";
import {
  CheckCircle,
  Lock,
  Unlock,
  Telescope,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const RIDDLES = [
  {
    id: 1,
    icon: "🌍",
    question:
      "Aku berputar mengelilingi Matahari, punya satu satelit yang setia, dan merupakan satu-satunya tempat yang diketahui manusia memiliki kehidupan. Siapakah aku?",
    hint: "Rumahmu, rumahku, dan rumah semua makhluk hidup.",
    answers: ["bumi", "earth", "planet bumi"],
    category: "Planet",
  },
  {
    id: 2,
    icon: "⭐",
    question:
      "Aku bukan bintang, bukan bulan. Di malam hari aku bersinar dengan cahaya yang aku pinjam. Aku mengelilingi planet seperti penari balet yang setia. Apakah aku?",
    hint: "Bumi punya satu dariku, Saturnus punya puluhan.",
    answers: ["bulan", "satelit", "moon", "satelit alami"],
    category: "Satelit",
  },
  {
    // FIX #5: Soal diperbaiki agar tidak misleading soal cincin Jupiter
    id: 3,
    icon: "🪐",
    question:
      "Aku planet terbesar di tata surya, punya Bintik Merah Raksasa — badai yang sudah berlangsung ratusan tahun. Aku raja dari semua planet, tapi bukan yang paling terkenal dengan cincinnya. Planet manakah aku?",
    hint: "Aku raja dari semua planet, namun Saturnus yang lebih terkenal dengan cincinnya.",
    answers: ["jupiter", "yupiter"],
    category: "Planet Raksasa",
  },
];

// ================= RIDDLE CARD =================
function RiddleCard({ riddle, index, solved, onAnswer }) {
  const [input, setInput] = useState("");
  // FIX #9: State error untuk feedback jawaban salah
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // FIX #3: Shake via CSS class yang benar-benar ada
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  // FIX #13: Animate solved state
  const [justSolved, setJustSolved] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = input.trim().toLowerCase();
    if (!normalized) return;

    if (riddle.answers.includes(normalized)) {
      setJustSolved(true);
      setError(false);
      setErrorMsg("");
      onAnswer(riddle.id);
    } else {
      // FIX #3 & #9: Shake + error message yang jelas
      setError(true);
      setErrorMsg("Hmm, coba lagi! 🤔");
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setError(false);
        setErrorMsg("");
      }, 1200);
      setInput("");
      // FIX #4: Auto-focus input setelah jawaban salah
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div
      className={`glass-card p-5 md:p-6 transition-all duration-500 ${
        solved
          ? "border-green-500/30 bg-green-500/5"
          : error
            ? "border-red-500/30"
            : "hover:border-purple-500/20"
      } ${shake ? "animate-shake" : ""} ${justSolved ? "animate-solve" : ""}`}
      style={{ animation: `pageEnter 0.6s ease ${index * 0.15}s both` }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{riddle.icon}</span>
          <div>
            <span className="text-xs font-exo text-purple-400 tracking-wider uppercase">
              {riddle.category}
            </span>
            <p className="text-xs text-gray-500 font-exo">Soal #{index + 1}</p>
          </div>
        </div>
        {solved ? (
          // FIX #13: CheckCircle muncul dengan scale animation
          <CheckCircle
            className="text-green-400 flex-shrink-0 transition-all duration-500"
            style={{
              animation: justSolved ? "solveCheck 0.4s ease both" : undefined,
            }}
            size={24}
          />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-purple-500/40 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-purple-500/40" />
          </div>
        )}
      </div>

      {/* Question */}
      <p className="font-exo text-gray-200 text-sm md:text-base leading-relaxed mb-4">
        {riddle.question}
      </p>

      {solved ? (
        <div className="flex items-center gap-2 text-green-400 font-exo text-sm">
          <CheckCircle size={16} />
          <span>Benar! Kamu jenius! ✨</span>
        </div>
      ) : (
        <div>
          {/* FIX #6: enterKeyHint="send" untuk mobile keyboard */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Jawaban kamu..."
              enterKeyHint="send"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              className={`riddle-input flex-1 px-4 py-2 rounded-xl font-exo text-sm transition-all duration-300 ${
                error ? "border-red-500/60" : ""
              }`}
            />
            {/* FIX #8: Touch target lebih besar */}
            <button
              type="submit"
              className="btn-cosmos px-4 rounded-xl font-exo text-sm text-white flex items-center gap-1"
              style={{ minHeight: "44px" }}
            >
              <span>Coba!</span>
            </button>
          </form>

          {/* FIX #9: Error message yang eksplisit */}
          {error && errorMsg && (
            <p className="mt-2 text-xs text-red-400 font-exo flex items-center gap-1">
              <span>✕</span>
              <span>{errorMsg}</span>
            </p>
          )}

          {/* FIX #11: Hint button dengan aria-expanded & lucide icon */}
          <button
            onClick={() => setShowHint((v) => !v)}
            aria-expanded={showHint}
            aria-controls={`hint-${riddle.id}`}
            className="mt-2 text-xs text-gray-500 hover:text-purple-400 font-exo transition-colors flex items-center gap-1"
          >
            {showHint ? (
              <>
                <ChevronUp size={12} />
                <span>Sembunyikan petunjuk</span>
              </>
            ) : (
              <>
                <ChevronDown size={12} />
                <span>Butuh petunjuk?</span>
              </>
            )}
          </button>

          {showHint && (
            <p
              id={`hint-${riddle.id}`}
              className="mt-2 text-xs text-purple-300 font-exo italic bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/20"
            >
              💡 {riddle.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ================= MAIN =================
export default function RiddleSection() {
  const { setRiddleSolved, setCurrentPage, riddleSolved } = useApp();

  // FIX #1: Inisialisasi solvedIds dari context agar sinkron saat navigasi balik
  const [solvedIds, setSolvedIds] = useState(() =>
    riddleSolved ? RIDDLES.map((r) => r.id) : [],
  );
  const [unlocking, setUnlocking] = useState(false);
  const celebrationRef = useRef(null);

  // FIX #2: Functional update untuk hindari stale closure
  const handleAnswer = useCallback(
    (id) => {
      setSolvedIds((prev) => {
        if (prev.includes(id)) return prev;
        const newSolved = [...prev, id];
        if (newSolved.length === RIDDLES.length && !riddleSolved) {
          setUnlocking(true);
          setTimeout(() => {
            setRiddleSolved(true);
            setUnlocking(false);
            // FIX #10: Auto-scroll ke celebration card
            setTimeout(() => {
              celebrationRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 300);
          }, 1500);
        }
        return newSolved;
      });
    },
    [riddleSolved, setRiddleSolved],
  );

  const allSolved = solvedIds.length === RIDDLES.length;

  return (
    <>
      {/* FIX #3: Keyframe animations via inline style tag */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-3px); }
          90%       { transform: translateX(3px); }
        }
        @keyframes solveCheck {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.25) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes solvePulse {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          70%  { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both !important;
        }
        .animate-solve {
          animation: solvePulse 0.6s ease both;
        }
      `}</style>

      <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden">
        {/* FIX #7: Planet hanya tampil di sm ke atas agar tidak overlap konten mobile */}
        <div className="hidden sm:block">
          <FloatingPlanet
            size={55}
            color="#0891b2"
            x="6%"
            y="8%"
            animDelay={0.5}
            hasRing
          />
          <FloatingPlanet
            size={45}
            color="#f59e0b"
            x="87%"
            y="15%"
            animDelay={1.5}
          />
          <FloatingPlanet
            size={65}
            color="#ec4899"
            x="88%"
            y="60%"
            animDelay={2}
            hasRing
          />
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500" />
              <Telescope size={20} className="text-cyan-400" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500" />
            </div>
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text-galaxy">Teka-Teki Antariksa</span>
            </h2>
            <p className="font-exo text-gray-400 text-sm max-w-sm mx-auto">
              Selesaikan semua teka-teki ini untuk membuka hadiah & galeri
              spesial yang menantimu! 🔓
            </p>

            {/* FIX #12: Progress bar dengan role & aria */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div
                role="progressbar"
                aria-valuenow={solvedIds.length}
                aria-valuemin={0}
                aria-valuemax={RIDDLES.length}
                aria-label="Progress teka-teki"
                className="flex-1 max-w-48 h-2 rounded-full bg-white/10 overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                  style={{
                    width: `${(solvedIds.length / RIDDLES.length) * 100}%`,
                  }}
                />
              </div>
              <span className="font-orbitron text-sm text-purple-300">
                {solvedIds.length}/{RIDDLES.length}
              </span>
            </div>
          </div>

          {/* Lock status banner */}
          <div
            className={`flex items-center justify-center gap-3 px-5 py-3 rounded-xl mb-8 transition-all duration-500 ${
              allSolved
                ? "bg-green-500/15 border border-green-500/30"
                : "bg-purple-500/10 border border-purple-500/20"
            }`}
          >
            {allSolved ? (
              <>
                <Unlock size={18} className="text-green-400" />
                <span className="font-exo text-sm text-green-300">
                  {unlocking
                    ? "🌟 Membuka hadiah..."
                    : "✅ Semua terjawab! Hadiah & Galeri terbuka!"}
                </span>
              </>
            ) : (
              <>
                <Lock size={18} className="text-purple-400" />
                <span className="font-exo text-sm text-gray-400">
                  Jawab semua soal untuk membuka Hadiah & Galeri 🎁
                </span>
              </>
            )}
          </div>

          {/* Riddle cards */}
          <div className="space-y-4 mb-8">
            {RIDDLES.map((riddle, i) => (
              <RiddleCard
                key={riddle.id}
                riddle={riddle}
                index={i}
                solved={solvedIds.includes(riddle.id)}
                onAnswer={handleAnswer}
              />
            ))}
          </div>

          {/* FIX #10: Ref untuk auto-scroll ke celebration card */}
          <div ref={celebrationRef}>
            {riddleSolved && (
              <div className="text-center page-enter">
                <div className="glass-card-strong p-6 border-green-500/30">
                  <div className="text-4xl mb-3">🎉🌟🎊</div>
                  <h3 className="font-cinzel text-xl text-green-300 mb-2">
                    Luar Biasa!
                  </h3>
                  <p className="font-exo text-sm text-gray-400 mb-4">
                    Kamu berhasil! Hadiah & Galeri sudah terbuka di navbar atas.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setCurrentPage("gift")}
                      className="btn-cosmos px-6 py-2 rounded-xl font-exo text-sm text-white"
                      style={{ minHeight: "44px" }}
                    >
                      🎁 Buka Hadiah
                    </button>
                    <button
                      onClick={() => setCurrentPage("gallery")}
                      className="btn-cosmos px-6 py-2 rounded-xl font-exo text-sm text-white"
                      style={{ minHeight: "44px" }}
                    >
                      📸 Galeri
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
