'use client'

import { useMemo } from 'react'

function generateStars(count, maxSize, layer) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${layer}-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * maxSize + 0.5,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.7 + 0.3,
  }))
}

function generateShootingStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `shoot-${i}`,
    top: Math.random() * 60,
    left: Math.random() * 60,
    width: Math.random() * 150 + 80,
    delay: Math.random() * 8,
    duration: Math.random() * 3 + 2,
  }))
}

export default function StarsBackground() {
  const smallStars = useMemo(() => generateStars(120, 1.5, 'sm'), [])
  const medStars = useMemo(() => generateStars(60, 2.5, 'md'), [])
  const bigStars = useMemo(() => generateStars(25, 4, 'lg'), [])
  const shootingStars = useMemo(() => generateShootingStars(5), [])

  return (
    <div className="stars-container">
      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(26,10,62,0.8) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(7,7,32,0.9) 0%, transparent 60%), radial-gradient(ellipse at center, #0a0a2e 0%, #02020f 100%)',
        }}
      />

      {/* Nebula clouds */}
      <div
        className="nebula-bg"
        style={{
          width: '600px', height: '400px',
          top: '10%', left: '5%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="nebula-bg"
        style={{
          width: '500px', height: '500px',
          top: '50%', right: '5%',
          background: 'radial-gradient(ellipse, rgba(236,72,153,0.12) 0%, transparent 70%)',
          animationDelay: '3s',
        }}
      />
      <div
        className="nebula-bg"
        style={{
          width: '400px', height: '300px',
          bottom: '10%', left: '30%',
          background: 'radial-gradient(ellipse, rgba(14,165,233,0.1) 0%, transparent 70%)',
          animationDelay: '5s',
        }}
      />

      {/* Stars */}
      {[...smallStars, ...medStars, ...bigStars].map(star => (
        <div
          key={star.id}
          className="star-dot"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map(s => (
        <div
          key={s.id}
          className="shooting-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.width}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
