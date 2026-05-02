"use client";

import { useState, useEffect } from "react";
import { useApp } from "../../lib/AppContext";
import { useTypingAnimation } from "../../hooks/useTypingAnimation";
import { FloatingPlanet } from "../ui/Planet";
import { Gift, Star, Lock, Heart, Sparkles } from "lucide-react";

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

function EnvelopeGift({ onOpen, opened }) {
  const [hover, setHover] = useState(false);
  const [popped, setPopped] = useState(false);

  const handleClick = () => {
    if (opened) return;
    setPopped(true);
    setTimeout(() => onOpen(), 600);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Particles on open */}
      {popped && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                left: `${40 + Math.random() * 20}%`,
                top: "50%",
                background: [
                  "#fbbf24",
                  "#ec4899",
                  "#7c3aed",
                  "#67e8f9",
                  "#34d399",
                ][Math.floor(Math.random() * 5)],
                animation: `particle-${i} 1.5s ease-out forwards`,
                transform: `translate(${(Math.random() - 0.5) * 600}px, ${(Math.random() - 0.5) * 400}px)`,
                opacity: 0,
                transition: `all ${0.5 + Math.random()}s ease-out`,
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        disabled={opened}
        className="relative group cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        <div
          className={`glass-card-strong p-10 md:p-14 text-center transition-all duration-500 ${
            hover && !opened ? "glow-gold scale-105" : ""
          } ${popped ? "scale-110" : ""}`}
          style={{ border: "1px solid rgba(251,191,36,0.25)" }}
        >
          {/* Envelope flap */}
          <div
            className="mb-6 transition-transform duration-700 origin-top"
            style={{
              transform: opened
                ? "rotateX(180deg)"
                : hover
                  ? "rotateX(-20deg)"
                  : "rotateX(0deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Envelope visual */}
            <div className="relative w-64 mx-auto">
              {/* Body */}
              <div
                className="w-full rounded-b-2xl overflow-hidden"
                style={{
                  height: "160px",
                  background:
                    "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))",
                  border: "2px solid rgba(251,191,36,0.3)",
                  borderTop: "none",
                }}
              >
                {/* Inner V-fold lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-full h-full"
                    style={{
                      background:
                        "linear-gradient(135deg, transparent 49%, rgba(251,191,36,0.1) 49.5%, rgba(251,191,36,0.1) 50%, transparent 50%), linear-gradient(225deg, transparent 49%, rgba(251,191,36,0.1) 49.5%, rgba(251,191,36,0.1) 50%, transparent 50%)",
                    }}
                  />
                </div>

                {/* Seal / emoji */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-5xl transition-transform duration-300"
                    style={{ transform: hover ? "scale(1.2)" : "scale(1)" }}
                  >
                    {opened ? "💝" : hover ? "🎀" : "🎁"}
                  </span>
                </div>
              </div>

              {/* Flap triangle */}
              <div
                className="absolute top-0 left-0 w-full"
                style={{
                  height: "90px",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background:
                    "linear-gradient(180deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1))",
                  border: "2px solid rgba(251,191,36,0.3)",
                  transformOrigin: "top",
                  transform:
                    hover && !opened ? "rotateX(-30deg)" : "rotateX(0deg)",
                  transition: "transform 0.4s ease",
                }}
              />
            </div>
          </div>

          <p className="font-cinzel text-yellow-300 text-lg mb-1">
            Hadiah Spesialmu
          </p>
          <p className="font-exo text-gray-400 text-xs tracking-wider">
            {opened ? "💝 Sudah dibuka" : "✦ Klik untuk membuka ✦"}
          </p>

          {/* Sparkles */}
          {hover && !opened && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <Sparkles
                  key={i}
                  size={12}
                  className="absolute text-yellow-400"
                  style={{
                    top: `${10 + Math.random() * 80}%`,
                    left: `${5 + Math.random() * 90}%`,
                    opacity: Math.random(),
                    animation: `twinkle 1s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </button>

      {!opened && (
        <p className="font-exo text-xs text-gray-500 animate-pulse">
          ✦ Klik kado untuk membukanya ✦
        </p>
      )}
    </div>
  );
}

export default function GiftSection() {
  const { riddleSolved, giftOpened, setGiftOpened } = useApp();
  const [showLetter, setShowLetter] = useState(false);

  const { displayed, done } = useTypingAnimation(
    GIFT_LETTER,
    20,
    showLetter ? 500 : 99999999,
  );

  const handleOpen = () => {
    setGiftOpened(true);
    setTimeout(() => setShowLetter(true), 800);
  };

  if (!riddleSolved) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-sm">
          <Lock size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="font-cinzel text-xl text-gray-400 mb-2">
            Masih Terkunci
          </h3>
          <p className="font-exo text-sm text-gray-500">
            Selesaikan teka-teki terlebih dahulu untuk membuka hadiah ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden">
      {/* Planets */}
      <FloatingPlanet size={55} color="#f59e0b" x="5%" y="10%" animDelay={0} />
      <FloatingPlanet
        size={45}
        color="#7c3aed"
        x="88%"
        y="20%"
        animDelay={1.5}
        hasRing
      />
      <FloatingPlanet size={70} color="#ec4899" x="85%" y="65%" animDelay={2} />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500" />
            <Gift size={18} className="text-yellow-400" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500" />
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text-gold">Hadiahmu</span>
          </h2>
          <p className="font-exo text-gray-400 text-sm">
            — disiapkan khusus untukmu, dari jauh —
          </p>
        </div>

        {/* Envelope gift */}
        {!giftOpened && (
          <EnvelopeGift onOpen={handleOpen} opened={giftOpened} />
        )}

        {/* Gift letter */}
        {giftOpened && (
          <div className="page-enter">
            {/* Confetti-like stars header */}
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(9)].map((_, i) => (
                <Star
                  key={i}
                  size={i === 4 ? 28 : 16}
                  className="text-yellow-400 fill-yellow-400"
                  style={{
                    animation: `twinkle ${1 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                    transform: `rotate(${(i - 4) * 10}deg)`,
                  }}
                />
              ))}
            </div>

            <div
              className="glass-card-strong p-6 md:p-10 relative overflow-hidden"
              style={{
                border: "1px solid rgba(251,191,36,0.2)",
                boxShadow: "0 0 80px rgba(251,191,36,0.08)",
              }}
            >
              {/* Gold top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />

              {/* Decorative corner stars */}
              {[...Array(8)].map((_, i) => (
                <Star
                  key={i}
                  size={8}
                  className="absolute text-yellow-400 fill-yellow-400"
                  style={{
                    top: i < 4 ? `${4 + i * 8}%` : undefined,
                    bottom: i >= 4 ? `${4 + (i - 4) * 8}%` : undefined,
                    right: "2%",
                    opacity: 0.4,
                  }}
                />
              ))}

              <div
                className="font-exo text-gray-200 leading-relaxed whitespace-pre-line text-sm md:text-base"
                style={{ minHeight: "300px" }}
              >
                {displayed}
                {!done && <span className="typing-cursor" />}
              </div>

              {done && (
                <div className="mt-8 pt-6 border-t border-yellow-400/10 flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Heart
                        key={i}
                        size={20}
                        className="text-pink-400 fill-pink-400"
                        style={{
                          animation: `twinkle ${1 + i * 0.2}s ease-in-out infinite`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="font-cinzel text-yellow-400 text-sm text-glow-gold text-center">
                    Happy 18th Birthday, Eka Meilani ✨
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
