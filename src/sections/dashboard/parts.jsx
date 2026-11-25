import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const ease = [0.16, 1, 0.3, 1]

/* ── Lightweight camera tile with a simple scene and moving detection boxes ── */
const SCENES = {
  gate: (
    <>
      <rect width="160" height="100" fill="#0D1422" />
      <rect x="0" y="62" width="160" height="38" fill="#111A2B" />
      <rect x="20" y="20" width="10" height="44" fill="#1E2A40" /><rect x="130" y="20" width="10" height="44" fill="#1E2A40" />
      <rect x="30" y="26" width="100" height="3" fill="#24324D" />
      {[40, 60, 80, 100, 120].map((x) => <rect key={x} x={x} y="29" width="2" height="34" fill="#1A253A" />)}
    </>
  ),
  lobby: (
    <>
      <rect width="160" height="100" fill="#0E1524" />
      <rect y="58" width="160" height="42" fill="#121B2D" />
      <rect x="55" y="48" width="50" height="14" rx="2" fill="#22304A" />
      <rect x="10" y="14" width="30" height="30" fill="#14213A" /><rect x="120" y="14" width="30" height="30" fill="#14213A" />
    </>
  ),
  office: (
    <>
      <rect width="160" height="100" fill="#0D1320" />
      <rect y="45" width="160" height="55" fill="#0F1828" />
      {[10, 50, 90, 130].map((x) => <rect key={x} x={x} y="8" width="22" height="26" fill="#14213A" />)}
      <rect x="16" y="70" width="44" height="5" fill="#1C2536" /><rect x="96" y="66" width="44" height="5" fill="#1C2536" />
    </>
  ),
  server: (
    <>
      <rect width="160" height="100" fill="#0B111D" />
      {[12, 44, 104, 136].map((x) => (
        <g key={x}>
          <rect x={x} y="12" width="20" height="70" fill="#151F33" />
          {[18, 28, 38, 48, 58, 68].map((y) => <rect key={y} x={x + 3} y={y} width="3" height="2" fill={y % 20 ? '#34D399' : '#22D3EE'} opacity=".7" />)}
        </g>
      ))}
    </>
  ),
  parking: (
    <>
      <rect width="160" height="100" fill="#0C121E" />
      {[20, 60, 100, 140].map((x) => <line key={x} x1={x} y1="40" x2={x - 10} y2="100" stroke="#2A3650" strokeWidth="1" />)}
      <rect x="24" y="56" width="30" height="16" rx="3" fill="#1E2A40" /><rect x="104" y="60" width="30" height="16" rx="3" fill="#1E2A40" />
    </>
  ),
}

export function MiniCam({ cam, big = false, alert = false }) {
  const reduce = useReducedMotion()
  const boxes = Array.from({ length: cam.people }, (_, i) => ({
    x: 18 + ((i * 29 + cam.id.charCodeAt(5) * 7) % 60),
    y: 30 + ((i * 13) % 20),
    d: 5 + i * 1.3,
    c: alert && i === 0 ? '#F87171' : i % 2 ? '#22D3EE' : '#34D399',
  }))
  return (
    <div className={`noise relative aspect-video w-full overflow-hidden rounded-lg border bg-[#0A0D14] transition-colors ${alert ? 'border-danger shadow-[0_0_0_1px_#F87171,0_0_30px_-6px_#F87171]' : 'border-line'}`}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">{SCENES[cam.scene]}</svg>
      {boxes.map((b, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute inset-0"
          initial={{ x: `${b.x}%`, y: `${b.y}%` }}
          animate={reduce ? undefined : { x: [`${b.x}%`, `${b.x + 12}%`, `${b.x - 6}%`, `${b.x}%`], y: [`${b.y}%`, `${b.y + 4}%`, `${b.y - 2}%`, `${b.y}%`] }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="absolute left-0 top-0 h-[34%] w-[9%] rounded-[2px] border" style={{ borderColor: b.c, boxShadow: `0 0 10px -2px ${b.c}` }}>
            {big && <span className="absolute -top-4 left-0 whitespace-nowrap px-1 font-mono text-[9px] text-black" style={{ background: b.c }}>{alert && i === 0 ? 'UNKNOWN' : `EMP-0${140 + i * 7}`}</span>}
          </span>
        </motion.div>
      ))}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-1.5 font-mono text-[9px] text-white/80 sm:text-[10px]">
        <span className="flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5"><span className="h-1.5 w-1.5 rounded-full bg-danger blink" />{cam.id}</span>
        {big && <span className="rounded bg-black/60 px-1.5 py-0.5">{cam.name}</span>}
      </div>
      {alert && <span className="absolute bottom-1.5 left-1.5 rounded bg-danger px-1.5 py-0.5 font-mono text-[9px] font-medium text-black">ALERT</span>}
    </div>
  )
}

/* ── Animated bar chart with hover / focus tooltips ── */
export function BarChart({ data, max, unit = '', rgb = '59,130,246', height = 'h-44', animKey }) {
  const [hover, setHover] = useState(null)
  return (
    <div className={`flex ${height} items-end gap-2 sm:gap-3`} role="list" onMouseLeave={() => setHover(null)}>
      {data.map(([label, v], i) => {
        const on = hover === i
        return (
          <div
            key={label}
            role="listitem"
            tabIndex={0}
            aria-label={`${label}: ${v}${unit}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end gap-2 outline-none"
          >
            <AnimatePresence>
              {on && (
                <motion.span
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, transition: { duration: 0.1 } }}
                  className="absolute z-10 whitespace-nowrap rounded-md border border-white/10 bg-[#111827] px-2 py-1 font-mono text-[11px] text-fg shadow-xl"
                  style={{ bottom: `calc(${(v / max) * 78}% + 30px)` }}
                >
                  {label} · <span style={{ color: `rgb(${rgb})` }}>{v}{unit}</span>
                </motion.span>
              )}
            </AnimatePresence>
            <motion.div
              key={`${animKey}-${label}`}
              className="w-full origin-bottom rounded-t-md transition-[filter] duration-200"
              style={{
                height: `${Math.max(2, (v / max) * 78)}%`,
                background: `linear-gradient(to top, rgba(${rgb},.35), rgb(${rgb}))`,
                filter: hover !== null && !on ? 'saturate(.4) brightness(.6)' : 'none',
                boxShadow: on ? `0 0 24px -4px rgb(${rgb})` : 'none',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7, ease, delay: i * 0.05 }}
            />
            <span className={`text-[11px] transition-colors ${on ? 'text-fg' : 'text-muted'}`}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Slide-in drawer inside the app window ── */
export function Drawer({ open, onClose, title, children }) {
  const closeRef = useRef(null)
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="absolute inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-line bg-[#0B0F1A] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%', transition: { duration: 0.22 } }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="font-semibold">{title}</p>
              <button ref={closeRef} onClick={onClose} aria-label="Close panel" className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line hover:bg-white/5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5" data-lenis-prevent>{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Segmented control with sliding pill ── */
export function Segmented({ options, value, onChange, id, size = 'sm' }) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-surface p-0.5" role="group">
      {options.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={`relative cursor-pointer rounded-md font-medium transition-colors ${size === 'sm' ? 'min-h-8 px-3 text-xs' : 'min-h-9 px-3.5 text-sm'} ${value === v ? 'text-white' : 'text-muted hover:text-fg'}`}
        >
          {value === v && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-md bg-accent/80" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  )
}

export function Avatar({ name, rgb = '59,130,246', size = 'h-8 w-8 text-[11px]' }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-mono ${size}`} style={{ background: `rgba(${rgb},.15)`, color: `rgb(${rgb})` }}>
      {name.split(' ').map((x) => x[0]).join('')}
    </span>
  )
}
