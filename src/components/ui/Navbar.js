'use client'

import { useApp } from '../../lib/AppContext'
import { Rocket, Mail, Puzzle, Gift, BookOpen, Star } from 'lucide-react'

const navItems = [
  { id: 'home', label: 'Home', icon: Rocket },
  { id: 'letter', label: 'Surat', icon: Mail },
  { id: 'riddle', label: 'Teka-teki', icon: Puzzle },
  { id: 'gift', label: 'Hadiah', icon: Gift, requireRiddle: true },
  { id: 'gallery', label: 'Galeri', icon: BookOpen, requireRiddle: true },
]

export default function Navbar() {
  const { currentPage, setCurrentPage, riddleSolved, launched } = useApp()

  if (!launched) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-glass">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Star size={16} className="text-yellow-400 animate-pulse" />
          <span className="font-orbitron text-sm font-bold gradient-text-gold">
            EKA 18°
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon
            const locked = item.requireRiddle && !riddleSolved
            const active = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => !locked && setCurrentPage(item.id)}
                className={`
                  relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300
                  font-exo
                  ${active
                    ? 'bg-purple-600/40 text-white border border-purple-500/40'
                    : locked
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
                title={locked ? '🔒 Selesaikan teka-teki dulu!' : item.label}
              >
                <Icon size={14} className={locked ? 'text-gray-600' : active ? 'text-purple-300' : ''} />
                <span className="hidden sm:inline">{item.label}</span>
                {locked && (
                  <span className="absolute -top-1 -right-1 text-xs">🔒</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
