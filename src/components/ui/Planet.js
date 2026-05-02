'use client'

export function Planet({ size = 80, color = '#7c3aed', ringColor = 'rgba(255,255,255,0.15)', style = {}, className = '', hasRing = false, children }) {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center ${className}`}
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color}66 60%, ${color}22)`,
        boxShadow: `0 0 ${size * 0.4}px ${color}44, inset -${size * 0.15}px -${size * 0.15}px ${size * 0.3}px rgba(0,0,0,0.5)`,
        ...style,
      }}
    >
      {hasRing && (
        <div
          className="absolute"
          style={{
            width: size * 1.8,
            height: size * 0.35,
            border: `2px solid ${ringColor}`,
            borderRadius: '50%',
            transform: 'rotateX(70deg)',
            top: '50%',
            left: '50%',
            marginLeft: `-${size * 0.9}px`,
            marginTop: `-${size * 0.175}px`,
          }}
        />
      )}
      {children}
    </div>
  )
}

export function FloatingPlanet({ size, color, ringColor, x, y, animDelay = 0, hasRing }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        animation: `float ${6 + animDelay}s ease-in-out infinite`,
        animationDelay: `${animDelay}s`,
      }}
    >
      <Planet size={size} color={color} ringColor={ringColor} hasRing={hasRing} />
    </div>
  )
}
