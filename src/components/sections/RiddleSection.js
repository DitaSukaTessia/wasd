"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useApp } from "../../lib/AppContext";

const RIDDLES = [
  {
    id: 1,
    icon: "1",
    question: "Siapa cewe yang hari ini makin tua (+1 tahun)?",
    hint: "citalahab, pandeglang, kesayangan dita",
    answers: ["eka meilani", "eka", "meilani"],
    category: "mudah",
  },
  {
    id: 2,
    icon: "2",
    question:
      "decrypt bilangan biner berikut: 01001001 00100000 01101100 01101111 01110110 01100101 00100000 01111001 01101111 01110101",
    hint: (
      <a
        href="https://www.rapidtables.com/convert/number/binary-to-ascii.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        manusia membaca rangkaian kata. mesin membaca 0 dan 1.
      </a>
    ),
    answers: ["i love you", "I love you"],
    category: "susah",
  },
  {
    id: 3,
    icon: "3",
    question: "kamu sayang dita ngga?",
    hint: "nyari apa lu? jelas lah ya",
    answers: ["iyaa", "iya", "sayang"],
    category: "mudah",
  },
  {
    id: 4,
    icon: "4",
    question: "siapa developer ganteng nan keren yang membuat website ini?",
    hint: "raja iblis",
    answers: ["dita", "anos", "ditaputa"],
    category: "mudah",
  },
  {
    id: 5,
    icon: "5",
    question: "Complete the sentence: today is my ____ birthday.",
    hint: "ordinal number suffix (st, nd, rd, th)",
    answers: ["18th", "eighteenth"],
    category: "sedang",
  },
];

// ── Star field ──────────────────────────────────────────────────────────────
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
// ── Riddle Card ─────────────────────────────────────────────────────────────
function RiddleCard({ riddle, index, solved, onAnswer }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const val = input.trim().toLowerCase();
    if (!val) return;

    if (riddle.answers.includes(val)) {
      setError(false);
      onAnswer(riddle.id);
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => {
        setShake(false);
        setError(false);
        inputRef.current?.focus();
      }, 1000);
    }
  };

  // Card entrance delay via inline style
  const entranceDelay = `${0.15 + index * 0.12}s`;

  return (
    <div
      className={[
        "relative rounded-xl border p-6 transition-colors duration-300",
        "animate-[rise_0.8s_cubic-bezier(0.16,1,0.3,1)_both]",
        solved
          ? "bg-[#0d0f18] border-emerald-500/20"
          : error
            ? "bg-[#0d0f18] border-red-500/25"
            : "bg-[#0d0f18] border-white/[0.07] hover:border-indigo-400/25",
        shake ? "animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ animationDelay: entranceDelay }}
    >
      {/* Top shimmer line on hover */}
      <div
        className={[
          "absolute top-0 left-0 right-0 h-px rounded-t-xl transition-opacity duration-400",
          "bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent",
          solved ? "opacity-0" : "opacity-0 group-hover:opacity-100",
        ].join(" ")}
      />

      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-sm flex-shrink-0">
            {riddle.icon}
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-indigo-400/70">
              {riddle.category}
            </p>
            <p className="font-mono text-[10px] text-white/20 mt-0.5">
              Soal #{index + 1}
            </p>
          </div>
        </div>

        {solved ? (
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[11px] animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both] flex-shrink-0">
            ✓
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border border-white/15 flex-shrink-0" />
        )}
      </div>

      {/* Question */}
      <p className="text-sm leading-[1.75] text-white/80 mb-5">
        {riddle.question}
      </p>

      {/* Solved state */}
      {solved ? (
        <p className="font-mono text-xs text-emerald-400 flex items-center gap-2">
          <span>✓</span>
          <span>Benar! Kamu jenius.</span>
        </p>
      ) : (
        <div>
          {/* Input row */}
          <div className="flex gap-2 mb-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Jawaban kamu..."
              enterKeyHint="send"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              className={[
                "flex-1 min-w-0 bg-[#12151f] rounded-lg px-3.5 py-2.5 text-[13px] text-white/90",
                "font-sans placeholder:text-white/20 outline-none transition-all duration-200",
                "border",
                error
                  ? "border-red-500/40 shadow-[0_0_0_3px_rgba(230,80,80,0.06)]"
                  : "border-white/[0.07] focus:border-indigo-400/40 focus:shadow-[0_0_0_3px_rgba(79,110,247,0.06)]",
              ].join(" ")}
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white text-xs font-bold tracking-wide px-4 rounded-lg transition-all duration-150 whitespace-nowrap min-h-[40px] hover:shadow-[0_0_16px_rgba(99,102,241,0.4)]"
            >
              Coba
            </button>
          </div>

          {/* Error message */}
          <p
            className={`font-mono text-[11px] text-red-400 mb-2 transition-opacity duration-200 ${
              error ? "opacity-100" : "opacity-0"
            }`}
          >
            Jawaban salah. Coba lagi!
          </p>

          {/* Hint toggle */}
          <button
            onClick={() => setShowHint((v) => !v)}
            className="font-mono text-[11px] text-white/30 hover:text-indigo-400 transition-colors duration-200"
          >
            {showHint ? "− Sembunyikan" : "+ hint?"}
          </button>

          {showHint && (
            <div className="mt-2.5 px-3.5 py-2.5 rounded-lg border border-indigo-500/15 bg-indigo-500/[0.07] font-mono text-[11px] text-white/50 leading-relaxed animate-[rise_0.3s_ease_both]">
              {riddle.hint}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(3px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0) rotate(-20deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function RiddleSection() {
  const { setRiddleSolved, setCurrentPage, riddleSolved } = useApp();

  const [solvedIds, setSolvedIds] = useState(() =>
    riddleSolved ? RIDDLES.map((r) => r.id) : [],
  );
  const [unlocking, setUnlocking] = useState(false);
  const celebrationRef = useRef(null);

  const handleAnswer = useCallback(
    (id) => {
      setSolvedIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        if (next.length === RIDDLES.length && !riddleSolved) {
          setUnlocking(true);
          setTimeout(() => {
            setRiddleSolved(true);
            setUnlocking(false);
            setTimeout(() => {
              celebrationRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 300);
          }, 1000);
        }
        return next;
      });
    },
    [riddleSolved, setRiddleSolved],
  );

  const allSolved = solvedIds.length === RIDDLES.length;
  const progress = (solvedIds.length / RIDDLES.length) * 100;

  return (
    <div className="relative min-h-screen bg-[#07080d] text-white overflow-hidden">
      <StarField />

      <div className="relative z-10 max-w-xl mx-auto px-5 pt-14 pb-24">
        {/* Header */}
        <div
          className="text-center mb-14 animate-[rise_0.8s_cubic-bezier(0.16,1,0.3,1)_both]"
          style={{ animationDelay: "0s" }}
        >
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-indigo-400/60 mt-6 mb-4">
            Finish the riddles, unlock the secrets
          </p>
          <h1 className="text-[clamp(26px,5vw,38px)] font-bold tracking-tight leading-tight text-white mb-3">
            Complete
            <br />
            to Proceed
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto mb-7">
            Solve all the riddles to unlock the gallery and the gift waiting for
            you. Good luck babe!
          </p>

          {/* Progress bar */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-44 h-0.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-white/30">
              {solvedIds.length} / {RIDDLES.length}
            </span>
          </div>
        </div>

        {/* Status bar */}
        <div
          className={[
            "flex items-center gap-2.5 px-4 py-2.5 rounded-lg border mb-8 text-[12px] font-mono transition-all duration-500",
            "animate-[rise_0.8s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]",
            allSolved
              ? "bg-emerald-500/[0.07] border-emerald-500/20 text-emerald-400"
              : "bg-white/[0.02] border-white/[0.07] text-white/30",
          ].join(" ")}
        >
          <span
            className={[
              "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-500",
              allSolved
                ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse"
                : "bg-white/20",
            ].join(" ")}
          />
          <span>
            {allSolved
              ? unlocking
                ? "Membuka hadiah..."
                : "Semua terjawab — Hadiah & Galeri terbuka!"
              : "Jawab semua soal untuk membuka Hadiah & Galeri (tips: tekan tombol hint klo kamu mumnet)"}
          </span>
        </div>

        {/* Riddle cards */}
        <div className="flex flex-col gap-4 mb-8">
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

        {/* Celebration */}
        <div ref={celebrationRef}>
          {riddleSolved && (
            <div className="bg-[#0d0f18] border border-emerald-500/20 rounded-xl p-8 text-center animate-[rise_0.8s_cubic-bezier(0.16,1,0.3,1)_both]">
              <p className="text-2xl mb-3 text-emerald-400">✦</p>
              <h3 className="text-xl font-bold tracking-tight text-emerald-400 mb-2">
                Nice Babe!
              </h3>
              <p className="font-mono text-xs text-white/30 mb-6">
                Semua terjawab — Hadiah & Galeri terbuka.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setCurrentPage("gift")}
                  className="bg-emerald-400 hover:bg-emerald-300 text-[#07080d] font-bold text-sm px-6 py-2.5 rounded-lg transition-all duration-150 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] min-h-[40px]"
                >
                  Buka Hadiah
                </button>
                <button
                  onClick={() => setCurrentPage("gallery")}
                  className="bg-transparent border border-emerald-500/25 hover:bg-emerald-500/[0.07] text-emerald-400 font-bold text-sm px-6 py-2.5 rounded-lg transition-all duration-150 min-h-[40px]"
                >
                  Galeri
                </button>
              </div>
            </div>
          )}
        </div>
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
