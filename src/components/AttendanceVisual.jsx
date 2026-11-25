import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ScanFace } from 'lucide-react'
import { useEffect, useState } from 'react'

/* Face check-in kiosk: scans, verifies, and adds each employee to the live log. */

const STAFF = [
  { n: 'Priya Sharma', d: 'Engineering', t: '09:02', s: 'On time', c: 'text-ok' },
  { n: 'Daniel Kim', d: 'Design', t: '09:06', s: 'On time', c: 'text-ok' },
  { n: 'Aisha Khan', d: 'HR', t: '09:09', s: 'On time', c: 'text-ok' },
  { n: 'Rahul Mehta', d: 'QA', t: '09:34', s: 'Late · 4 min', c: 'text-warn' },
  { n: 'Sara Lopez', d: 'Sales', t: '09:41', s: 'On time', c: 'text-ok' },
]
const initials = (n) => n.split(' ').map((x) => x[0]).join('')

export default function AttendanceVisual() {
  const still = useReducedMotion()
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState('scan') // scan | ok

  useEffect(() => {
    if (still) { setPhase('ok'); return }
    const a = setTimeout(() => setPhase('ok'), 1600)
    const b = setTimeout(() => { setPhase('scan'); setI((v) => (v + 1) % STAFF.length) }, 3200)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [i, still])

  const cur = STAFF[i]
  const log = Array.from({ length: 3 }, (_, k) => STAFF[(i - k - (phase === 'ok' ? 0 : 1) + STAFF.length * 2) % STAFF.length])

  return (
    <div className="hud-corners relative grid w-full gap-3 overflow-hidden rounded-xl border border-line bg-[#0A0D14] p-3 sm:grid-cols-[1.1fr_1fr] sm:p-4" role="img" aria-label="Face recognition check-in kiosk verifying employees and logging attendance">
      {/* camera */}
      <div className="scanline relative aspect-square overflow-hidden rounded-lg border border-line bg-gradient-to-b from-[#121a2b] to-[#0B1220]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50" cy="40" r="17" fill="#3B4A63" />
          <path d="M18 100c3-22 17-32 32-32s29 10 32 32z" fill="#2B3850" />
          {[[44, 37], [56, 37], [50, 43], [45, 48], [55, 48], [50, 30], [38, 41], [62, 41]].map(([x, y], k) => (
            <motion.circle key={k} cx={x} cy={y} r="1.1" fill="#22D3EE" animate={{ opacity: phase === 'scan' ? [0.2, 1, 0.2] : 1 }} transition={{ duration: 1, repeat: phase === 'scan' ? Infinity : 0, delay: k * 0.08 }} />
          ))}
        </svg>
        <motion.div
          className="absolute left-[26%] top-[14%] h-[52%] w-[48%] rounded-md border-2"
          animate={{ borderColor: phase === 'ok' ? '#34D399' : '#22D3EE', scale: phase === 'ok' ? 1 : [1, 1.04, 1] }}
          transition={{ duration: 0.8, repeat: phase === 'scan' ? Infinity : 0 }}
        />
        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 font-mono text-[9px] text-white/85 sm:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-danger blink" /> ENTRANCE · CAM-01
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase + i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium ${phase === 'ok' ? 'bg-ok text-black' : 'bg-black/70 text-cyan'}`}
          >
            {phase === 'ok' ? <Check className="h-4 w-4" aria-hidden="true" /> : <ScanFace className="h-4 w-4" aria-hidden="true" />}
            <span className="truncate">{phase === 'ok' ? `${cur.n} · verified` : 'Scanning · liveness check…'}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* log */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted sm:text-[11px]">Check-in log</p>
          <span className="font-mono text-[10px] text-ok sm:text-[11px]">142 / 150</span>
        </div>
        <ul className="mt-3 flex-1 space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {log.map((p) => (
              <motion.li
                key={p.n}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="flex items-center gap-2.5 rounded-lg border border-line bg-card px-2.5 py-2"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/15 font-mono text-[10px] text-accent">{initials(p.n)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium sm:text-sm">{p.n}</p>
                  <p className={`truncate font-mono text-[10px] ${p.c}`}>{p.s}</p>
                </div>
                <span className="font-mono text-[10px] text-muted sm:text-xs">{p.t}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[['Present', '142', 'text-ok'], ['Late', '6', 'text-warn'], ['Leave', '2', 'text-cyan']].map(([l, v, c]) => (
            <div key={l} className="rounded-lg border border-line bg-card py-1.5">
              <p className={`font-display text-base font-semibold ${c}`}>{v}</p>
              <p className="text-[10px] text-muted">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
