'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../../lib/AppContext'
import { useTypingAnimation } from '../../hooks/useTypingAnimation'
import { FloatingPlanet } from '../ui/Planet'
import { Send, Heart, Star, ArrowRight } from 'lucide-react'

const LETTER_TEXT = `Hii Eka... 💫

Hari ini, tepat di hari ulang tahunmu yang ke-18, aku ingin bilang satu hal yang mungkin udah kamu tau — tapi selalu layak untuk diulang.

Kamu itu luar biasa. Bukan karena sempurna, tapi karena kamu selalu jadi dirimu sendiri — dengan segala senyum, gelak tawa, dan kehangatanmu yang bikin dunia ini terasa lebih cerah.

Delapan belas tahun... itu berarti kamu udah hidup melewati 6.570 hari, dan setiap harinya pasti ada momen yang membentuk dirimu jadi yang sekarang — seseorang yang aku sangat bersyukur bisa kenal.

Aku berharap tahun ke-18 ini jadi awal dari babak baru yang indah untukmu. Penuh mimpi, penuh keberanian, penuh hal-hal baik yang kamu pantas dapat.

Seperti bintang-bintang di langit malam ini, semoga cahayamu terus bersinar — meskipun jarak dan waktu kadang memisahkan.

Selamat ulang tahun, Eka Meilani. 🌟
Semoga semua yang terbaik selalu menyertaimu.

Dengan sepenuh hati,
Seseorang yang peduli padamu ✨`

export default function LetterSection() {
  const { setCurrentPage } = useApp()
  const [open, setOpen] = useState(false)
  const [showText, setShowText] = useState(false)

  const { displayed, done } = useTypingAnimation(LETTER_TEXT, 18, showText ? 300 : 99999999)

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => setShowText(true), 800)
  }

  return (
    <div className="relative min-h-screen pt-20 pb-12 flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Planets */}
      <FloatingPlanet size={50} color="#ec4899" x="8%" y="12%" animDelay={1} />
      <FloatingPlanet size={70} color="#7c3aed" x="85%" y="70%" animDelay={2} hasRing />

      {/* Section header */}
      <div className="text-center mb-10 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-500" />
          <Send size={18} className="text-pink-400" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-500" />
        </div>
        <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-2">
          <span className="gradient-text-galaxy">Surat Untukmu</span>
        </h2>
        <p className="font-exo text-gray-400 text-sm tracking-wider">
          — dari suatu tempat di galaksi ini —
        </p>
      </div>

      {/* Envelope / Letter */}
      <div className="relative z-10 w-full max-w-2xl">
        {!open ? (
          /* Closed envelope */
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleOpen}
              className="envelope group relative cursor-pointer"
            >
              <div className="glass-card-strong p-8 md:p-12 text-center hover:border-pink-500/40 transition-all duration-500 glow-pink">
                {/* Envelope body */}
                <div className="w-64 md:w-80 mx-auto">
                  {/* Envelope flap top */}
                  <div
                    className="relative mb-4"
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'linear-gradient(90deg, rgba(236,72,153,0.2), rgba(124,58,237,0.2))',
                      borderRadius: '4px',
                    }}
                  />

                  {/* Envelope icon */}
                  <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    💌
                  </div>

                  <p className="font-cinzel text-lg text-pink-300 mb-2">Untuk: Eka Meilani</p>
                  <p className="font-exo text-xs text-gray-500 tracking-widest uppercase">Dengan Cinta, dari Galaksi ✦</p>

                  {/* Wax seal */}
                  <div className="mt-6 flex justify-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{
                        background: 'radial-gradient(circle, #7c3aed, #4c1d95)',
                        boxShadow: '0 0 20px rgba(124,58,237,0.6)',
                      }}
                    >
                      ✦
                    </div>
                  </div>
                </div>
              </div>
            </button>

            <p className="font-exo text-sm text-gray-500 animate-pulse">
              ✦ Klik amplop untuk membuka surat ✦
            </p>
          </div>
        ) : (
          /* Open letter */
          <div className="page-enter">
            <div
              className="glass-card-strong p-6 md:p-10 relative overflow-hidden"
              style={{
                border: '1px solid rgba(236,72,153,0.2)',
                boxShadow: '0 0 60px rgba(236,72,153,0.1)',
              }}
            >
              {/* Letter header decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />

              {/* Stars in corner */}
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className="absolute text-yellow-400 fill-yellow-400"
                  style={{
                    top: `${5 + i * 4}%`,
                    right: `${3 + i * 2}%`,
                    opacity: 0.5,
                    animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}

              {/* Letter content */}
              <div
                className="font-exo text-gray-200 leading-relaxed whitespace-pre-line text-sm md:text-base"
                style={{ minHeight: '300px' }}
              >
                {displayed}
                {!done && <span className="typing-cursor" />}
              </div>

              {/* Heart decoration */}
              {done && (
                <div className="mt-8 flex justify-center gap-2 page-enter">
                  {[...Array(7)].map((_, i) => (
                    <Heart
                      key={i}
                      size={i === 3 ? 24 : 14}
                      className="text-pink-400 fill-pink-400"
                      style={{
                        animation: `twinkle ${1 + i * 0.2}s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Next button */}
            {done && (
              <div className="flex justify-center mt-8 page-enter">
                <button
                  onClick={() => setCurrentPage('riddle')}
                  className="btn-cosmos group px-8 py-3 rounded-xl font-exo font-semibold text-sm tracking-wider text-white flex items-center gap-2"
                >
                  <span>Lanjut ke Teka-teki</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
