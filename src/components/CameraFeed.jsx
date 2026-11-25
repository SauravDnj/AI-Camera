import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

/* Simulated AI-annotated CCTV feed: people move through an office while
   bounding boxes follow them with identity + confidence labels. */

const PEOPLE = [
  { id: 'EMP-0142', name: 'Priya S.', dept: 'Engineering', conf: 98.7, color: '#34D399', x: [8, 34, 54, 34, 8], y: [44, 40, 44, 48, 44], dur: 16, scale: 1 },
  { id: 'EMP-0087', name: 'Daniel K.', dept: 'Design', conf: 97.2, color: '#22D3EE', x: [64, 52, 66, 72, 64], y: [26, 30, 33, 27, 26], dur: 13, scale: 0.78 },
  { id: 'UNKNOWN', name: 'Unregistered', dept: 'Restricted zone', conf: 61.4, color: '#F87171', x: [84, 78, 82, 84], y: [50, 48, 52, 50], dur: 10, scale: 1.05, alert: true },
]

function Person({ p, still }) {
  const w = 8 * p.scale
  const h = 30 * p.scale
  // A full-size wrapper is translated (GPU transform, % of the feed size) instead of animating left/top.
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ x: `${p.x[0]}%`, y: `${p.y[0]}%` }}
      animate={still ? undefined : { x: p.x.map((v) => `${v}%`), y: p.y.map((v) => `${v}%`) }}
      transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
    >
    <div className="absolute left-0 top-0" style={{ width: `${w}%`, height: `${h}%` }}>
      <svg viewBox="0 0 40 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="20" cy="14" r="10" fill="#5B6B85" />
        <path d="M6 34c0-6 6-9 14-9s14 3 14 9v40H6z" fill="#3B4A63" />
        <path d="M9 74h9v44H9zM22 74h9v44h-9z" fill="#26324A" />
      </svg>
      <div
        className="absolute -inset-x-[22%] -inset-y-[6%] rounded-[3px] border"
        style={{ borderColor: p.color, boxShadow: `0 0 18px -4px ${p.color}, inset 0 0 18px -10px ${p.color}` }}
      >
        <div className="absolute left-1/2 top-[3%] h-[20%] w-[64%] -translate-x-1/2 border border-dashed" style={{ borderColor: p.color }} />
        <div
          className="absolute -left-px -top-px -translate-y-full whitespace-nowrap rounded-t-[3px] px-1.5 py-0.5 font-mono text-[8px] font-medium leading-tight text-black sm:text-[10px]"
          style={{ background: p.color }}
        >
          {p.id} · {p.conf}%
        </div>
        <div className="absolute -bottom-px -left-px translate-y-full whitespace-nowrap bg-black/75 px-1.5 py-0.5 font-mono text-[8px] text-white/85 sm:text-[10px]">
          {p.name} · {p.dept}
        </div>
      </div>
    </div>
    </motion.div>
  )
}

function useClock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(i)
  }, [])
  return t
}

export default function CameraFeed({ label = 'CAM-04 · Floor 2 · Open Office' }) {
  const still = useReducedMotion()
  const t = useClock()
  const stamp = t.toLocaleString('en-GB', { hour12: false }).replace(',', '')

  return (
    <div
      className="hud-corners scanline noise relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-[#0A0D14]"
      role="img"
      aria-label="Simulated AI camera feed identifying two employees and flagging an unregistered person in a restricted zone"
    >
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="cf-floor" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#111827" />
            <stop offset="1" stopColor="#0B1220" />
          </linearGradient>
        </defs>
        <rect width="160" height="45" fill="#0D1320" />
        <rect y="45" width="160" height="55" fill="url(#cf-floor)" />
        {[10, 42, 74, 106, 138].map((x) => (
          <rect key={x} x={x} y="6" width="18" height="26" fill="#14213A" stroke="#1E2C47" strokeWidth=".5" />
        ))}
        {[-40, 0, 40, 80, 120, 160, 200].map((x) => (
          <line key={x} x1="80" y1="45" x2={x} y2="100" stroke="#1A2335" strokeWidth=".4" />
        ))}
        <rect x="18" y="72" width="40" height="5" fill="#1C2536" />
        <rect x="96" y="66" width="30" height="5" fill="#1C2536" />
        <rect x="26" y="64" width="10" height="8" fill="#22304A" />
        <rect x="104" y="58" width="10" height="8" fill="#22304A" />
        <polygon points="128,74 160,72 160,100 120,100" fill="rgba(248,113,113,.10)" stroke="#F87171" strokeWidth=".4" strokeDasharray="2 1.5" />
      </svg>

      {PEOPLE.map((p) => <Person key={p.id} p={p} still={still} />)}

      <div className="pointer-events-none absolute inset-0 p-2.5 font-mono text-[9px] text-white/85 sm:p-3.5 sm:text-[11px]">
        <div className="flex items-start justify-between gap-2">
          <span className="flex items-center gap-1.5 rounded bg-black/60 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-danger blink" /> REC · {label}
          </span>
          <span className="hidden rounded bg-black/60 px-2 py-1 sm:block">{stamp}</span>
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2 sm:bottom-3.5 sm:left-3.5 sm:right-3.5">
          <span className="hidden rounded bg-black/60 px-2 py-1 sm:inline">AI · 3 tracked · 30 FPS</span><span className="sm:hidden" />
          <span className="rounded bg-danger/90 px-2 py-1 font-medium text-black">ZONE B · INTRUSION</span>
        </div>
      </div>
    </div>
  )
}
