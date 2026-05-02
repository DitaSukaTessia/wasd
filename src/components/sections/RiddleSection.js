'use client'

import { useState } from 'react'
import { useApp } from '../../lib/AppContext'
import { FloatingPlanet } from '../ui/Planet'
import { Puzzle, CheckCircle, XCircle, Rocket, Lock, Unlock, Star, Telescope } from 'lucide-react'

const RIDDLES = [
  {
    id: 1,
    icon: '🌍',
    question: 'Aku berputar mengelilingi Matahari, punya satu satelit yang setia, dan merupakan satu-satunya tempat yang diketahui manusia memiliki kehidupan. Siapakah aku?',
    hint: 'Rumahmu, rumahku, dan rumah semua makhluk hidup.',
    answers: ['bumi', 'earth', 'planet bumi'],
    category: 'Planet',
  },
  {
    id: 2,
    icon: '⭐',
    question: 'Aku bukan bintang, bukan bulan. Di malam hari aku bersinar dengan cahaya yang aku pinjam. Aku mengelilingi planet seperti penari balet yang setia. Apakah aku?',
    hint: 'Bumi punya satu dariku, Saturnus punya puluhan.',
    answers: ['bulan', 'satelit', 'moon', 'satelit alami'],
    category: 'Satelit',
  },
  {
    id: 3,
    icon: '🪐',
    question: 'Aku planet terbesar di tata surya, punya badai yang sudah berlangsung selama ratusan tahun, dan terkenal dengan cincin raksasaku yang indah. Tapi tunggu — aku bukan yang punya cincin paling tebal... Planet manakah aku?',
    hint: 'Aku raja dari semua planet, tapi bukan yang punya cincin terindah.',
    answers: ['jupiter', 'yupiter'],
    category: 'Planet Raksasa',
  },
]

function RiddleCard({ riddle, index, solved, onAnswer }) {
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalized = input.trim().toLowerCase()
    if (riddle.answers.includes(normalized)) {
      onAnswer(riddle.id)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
    setInput('')
  }

  return (
    <div
      className={`glass-card p-5 md:p-6 transition-all duration-500 ${solved ? 'border-green-500/30 bg-green-500/5' : 'hover:border-purple-500/20'}`}
      style={{
        animation: `pageEnter 0.6s ease ${index * 0.15}s both`,
        borderColor: solved ? 'rgba(34,197,94,0.3)' : undefined,
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{riddle.icon}</span>
          <div>
            <span className="text-xs font-exo text-purple-400 tracking-wider uppercase">{riddle.category}</span>
            <p className="text-xs text-gray-500 font-exo">Soal #{index + 1}</p>
          </div>
        </div>
        {solved ? (
          <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
        ) : (
          <div
            className="w-6 h-6 rounded-full border-2 border-purple-500/40 flex items-center justify-center"
          >
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
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Jawaban kamu..."
              className={`riddle-input flex-1 px-4 py-2 rounded-xl font-exo text-sm ${shake ? 'border-red-500/60' : ''}`}
              style={{ transition: 'all 0.3s ease' }}
            />
            <button
              type="submit"
              className="btn-cosmos px-4 py-2 rounded-xl font-exo text-sm text-white flex items-center gap-1"
            >
              <span>Coba!</span>
            </button>
          </form>

          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-2 text-xs text-gray-500 hover:text-purple-400 font-exo transition-colors"
          >
            {showHint ? '▲ Sembunyikan petunjuk' : '▼ Butuh petunjuk?'}
          </button>

          {showHint && (
            <p className="mt-2 text-xs text-purple-300 font-exo italic bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/20">
              💡 {riddle.hint}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function RiddleSection() {
  const { setRiddleSolved, setCurrentPage, riddleSolved } = useApp()
  const [solvedIds, setSolvedIds] = useState([])
  const [unlocking, setUnlocking] = useState(false)

  const handleAnswer = (id) => {
    if (solvedIds.includes(id)) return
    const newSolved = [...solvedIds, id]
    setSolvedIds(newSolved)

    if (newSolved.length === RIDDLES.length) {
      setUnlocking(true)
      setTimeout(() => {
        setRiddleSolved(true)
      }, 2000)
    }
  }

  const allSolved = solvedIds.length === RIDDLES.length

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 overflow-hidden">
      {/* Planets */}
      <FloatingPlanet size={55} color="#0891b2" x="6%" y="8%" animDelay={0.5} hasRing />
      <FloatingPlanet size={45} color="#f59e0b" x="87%" y="15%" animDelay={1.5} />
      <FloatingPlanet size={65} color="#ec4899" x="88%" y="60%" animDelay={2} hasRing />

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
            Selesaikan semua teka-teki ini untuk membuka hadiah & galeri spesial yang menantimu! 🔓
          </p>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex-1 max-w-48 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${(solvedIds.length / RIDDLES.length) * 100}%` }}
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
              ? 'bg-green-500/15 border border-green-500/30'
              : 'bg-purple-500/10 border border-purple-500/20'
          }`}
        >
          {allSolved ? (
            <>
              <Unlock size={18} className="text-green-400" />
              <span className="font-exo text-sm text-green-300">
                {unlocking ? '🌟 Membuka hadiah...' : '✅ Semua terjawab! Hadiah & Galeri terbuka!'}
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

        {/* Unlock success animation */}
        {riddleSolved && (
          <div className="text-center page-enter">
            <div className="glass-card-strong p-6 border-green-500/30">
              <div className="text-4xl mb-3">🎉🌟🎊</div>
              <h3 className="font-cinzel text-xl text-green-300 mb-2">Luar Biasa!</h3>
              <p className="font-exo text-sm text-gray-400 mb-4">
                Kamu berhasil! Hadiah & Galeri sudah terbuka di navbar atas.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setCurrentPage('gift')}
                  className="btn-cosmos px-6 py-2 rounded-xl font-exo text-sm text-white"
                >
                  🎁 Buka Hadiah
                </button>
                <button
                  onClick={() => setCurrentPage('gallery')}
                  className="btn-cosmos px-6 py-2 rounded-xl font-exo text-sm text-white"
                >
                  📸 Galeri
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
