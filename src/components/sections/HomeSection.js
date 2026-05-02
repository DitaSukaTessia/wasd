'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../../lib/AppContext'
import { useTypingAnimation } from '../../hooks/useTypingAnimation'
import { Rocket, Sparkles, Star } from 'lucide-react'
import { FloatingPlanet } from '../ui/Planet'

const line1 = '✨ Selamat Ulang Tahun ke-18 ✨'
const line2 = 'Eka Meilani'
const line3 = 'Semoga semua impianmu setinggi bintang-bintang di langit, dan setiap harimu selalu bersinar seperti supernova. 🌟'

export default function HomeSection() {
  const { setCurrentPage, setLaunched } = useApp()
  const [phase, setPhase] = useState(0) // 0=line1, 1=line2, 2=line3, 3=done

  const { displayed: d1, done: done1 } = useTypingAnimation(line1, 55, 500)
  const { displayed: d2, done: done2 } = useTypingAnimation(line2, 80, done1 ? 200 : 999999)
  const { displayed: d3, done: done3 } = useTypingAnimation(line3, 30, done2 ? 400 : 999999)

  useEffect(() => {
    if (done1) setPhase(1)
    if (done2) setPhase(2)
    if (done3) setPhase(3)
  }, [done1, done2, done3])

  const handleLaunch = () => {
    setLaunched(true)
    setCurrentPage('letter')
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Floating planets decoration */}
      <FloatingPlanet size={60} color="#7c3aed" x="5%" y="15%" animDelay={0} hasRing />
      <FloatingPlanet size={40} color="#ec4899" x="88%" y="20%" animDelay={2} />
      <FloatingPlanet size={80} color="#0891b2" x="90%" y="65%" animDelay={1} hasRing />
      <FloatingPlanet size={35} color="#f59e0b" x="3%" y="75%" animDelay={3} />
      <FloatingPlanet size={25} color="#10b981" x="50%" y="8%" animDelay={1.5} />

      {/* Central glow */}
      <div
        className="absolute"
        style={{
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl">
        {/* Stars decorations */}
        <div className="flex justify-center gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={i === 2 ? 24 : 16}
              className="text-yellow-400 animate-pulse fill-yellow-400"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>

        {/* Line 1 */}
        <div className="min-h-[2rem] mb-4">
          <p
            className="font-exo text-lg md:text-xl text-purple-300 tracking-wider"
            style={{ opacity: phase >= 0 ? 1 : 0, transition: 'opacity 0.5s' }}
          >
            {d1}
            {!done1 && <span className="typing-cursor" />}
          </p>
        </div>

        {/* Line 2 — Name */}
        <div className="min-h-[5rem] mb-6">
          {phase >= 1 && (
            <h1
              className="font-cinzel font-bold text-5xl md:text-7xl lg:text-8xl gradient-text-gold text-glow-gold leading-tight"
              style={{ animation: 'pageEnter 0.8s ease forwards' }}
            >
              {d2}
              {!done2 && <span className="typing-cursor" />}
            </h1>
          )}
        </div>

        {/* Divider */}
        {phase >= 2 && (
          <div className="flex items-center justify-center gap-4 mb-6" style={{ animation: 'pageEnter 0.6s ease forwards' }}>
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-purple-500" />
            <Sparkles size={20} className="text-purple-400" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-purple-500" />
          </div>
        )}

        {/* Line 3 */}
        <div className="min-h-[5rem] mb-10">
          {phase >= 2 && (
            <p
              className="font-exo text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto"
              style={{ animation: 'pageEnter 0.6s ease forwards' }}
            >
              {d3}
              {!done3 && <span className="typing-cursor" />}
            </p>
          )}
        </div>

        {/* CTA Button */}
        {phase >= 3 && (
          <div style={{ animation: 'pageEnter 0.8s ease forwards' }}>
            <button
              onClick={handleLaunch}
              className="btn-cosmos group relative px-10 py-4 rounded-2xl font-orbitron font-semibold text-sm md:text-base tracking-widest uppercase text-white overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Rocket
                  size={20}
                  className="group-hover:animate-bounce transition-transform group-hover:rotate-45"
                />
                Jelajahi Galaksi
                <Rocket
                  size={20}
                  className="group-hover:animate-bounce transition-transform group-hover:-rotate-45"
                />
              </span>
              {/* Shimmer */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  animation: 'none',
                }}
              />
            </button>

            <p className="mt-4 text-xs text-gray-500 font-exo tracking-wider animate-pulse">
              ✦ Klik untuk memulai petualangan ✦
            </p>
          </div>
        )}
      </div>

      {/* Bottom orbit decoration */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="relative w-1 h-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 w-1 h-1 rounded-full bg-purple-400"
              style={{
                top: `${i * 20}%`,
                opacity: 1 - i * 0.2,
                animation: `twinkle ${1 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
