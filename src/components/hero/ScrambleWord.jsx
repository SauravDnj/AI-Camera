import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$<>/'

/* Cycles through `words`, "decoding" each one with a scramble effect.
   Visual only — pass the readable sentence to screen readers separately. */
export default function ScrambleWord({ words, interval = 2800, className = '', start = true }) {
  const reduce = useReducedMotion()
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState(words[0])
  const frame = useRef(0)

  useEffect(() => {
    if (!start || reduce) return
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), interval)
    return () => clearInterval(t)
  }, [start, reduce, words.length, interval])

  useEffect(() => {
    const target = words[idx]
    if (reduce) { setText(target); return }
    let tick = 0
    const total = 18
    cancelAnimationFrame(frame.current)
    const run = () => {
      tick++
      const revealed = Math.floor((tick / total) * target.length)
      setText(
        target
          .split('')
          .map((ch, i) => (i < revealed || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join('')
      )
      if (tick < total) frame.current = requestAnimationFrame(run)
      else setText(target)
    }
    frame.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame.current)
  }, [idx, words, reduce])

  // Reserve width for the longest word to avoid layout shift while cycling.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')
  return (
    <span className={`relative inline-grid ${className}`} aria-hidden="true">
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">{longest}</span>
      <span className="col-start-1 row-start-1 whitespace-nowrap">{text}</span>
    </span>
  )
}
