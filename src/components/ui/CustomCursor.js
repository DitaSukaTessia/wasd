'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      setTimeout(() => setTrail({ x: e.clientX, y: e.clientY }), 80)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      <div
        className="custom-cursor"
        style={{ left: pos.x, top: pos.y }}
      />
      <div
        className="cursor-trail"
        style={{ left: trail.x, top: trail.y }}
      />
    </>
  )
}
