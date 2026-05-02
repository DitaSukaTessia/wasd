'use client'

import { useState, useEffect } from 'react'

export function useTypingAnimation(text, speed = 60, startDelay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    let timeout

    const start = () => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return interval
    }

    timeout = setTimeout(() => {
      const interval = start()
      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [text, speed, startDelay])

  return { displayed, done }
}
