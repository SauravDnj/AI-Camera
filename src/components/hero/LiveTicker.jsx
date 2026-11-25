import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

/* Bottom-of-hero live telemetry strip with numbers that tick up. */
export default function LiveTicker() {
  const reduce = useReducedMotion()
  const [faces, setFaces] = useState(1284)
  const [events, setEvents] = useState(9312)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => {
      setFaces((v) => v + 1 + ((Math.random() * 3) | 0))
      setEvents((v) => v + 3 + ((Math.random() * 6) | 0))
    }, 1400)
    return () => clearInterval(t)
  }, [reduce])

  const items = [
    ['Faces recognised today', faces.toLocaleString('en-US'), 'text-ok'],
    ['AI events processed', events.toLocaleString('en-US'), 'text-cyan'],
    ['Cameras online', '48 / 48', 'text-fg'],
    ['Avg. alert latency', '0.8s', 'text-fg'],
    ['Open incidents', '1', 'text-danger'],
    ['On-time check-ins', '96%', 'text-ok'],
  ]
  const row = (hidden) => (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
      {items.map(([k, v, c]) => (
        <span key={k} className="flex items-center gap-2.5 whitespace-nowrap font-mono text-xs">
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span className="uppercase tracking-wider text-muted">{k}</span>
          <span className={`tabular-nums ${c}`}>{v}</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="relative border-y border-line/80 bg-surface/70 backdrop-blur">
      <div className="flex items-center">
        <span className="z-10 flex shrink-0 items-center gap-2 border-r border-line/80 bg-surface px-4 py-3 font-mono text-xs font-medium text-danger sm:px-6">
          <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-danger" /><span className="relative h-2 w-2 rounded-full bg-danger" /></span>
          LIVE
        </span>
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
          <div className="marquee flex w-max py-3">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </div>
  )
}
