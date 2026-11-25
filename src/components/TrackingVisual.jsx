import { motion, useReducedMotion } from 'framer-motion'

/* Live floor-plan: zones with occupancy, heatmap glow and employees moving between rooms. */

const ZONES = [
  { id: 'eng', name: 'Engineering', x: 4, y: 6, w: 44, h: 50, occ: 92, heat: 0.55 },
  { id: 'design', name: 'Design', x: 52, y: 6, w: 26, h: 34, occ: 74, heat: 0.35 },
  { id: 'meet', name: 'Meet', x: 82, y: 6, w: 14, h: 34, occ: 100, heat: 0.6 },
  { id: 'cafe', name: 'Cafeteria', x: 52, y: 44, w: 44, h: 50, occ: 28, heat: 0.18 },
  { id: 'sup', name: 'Support', x: 4, y: 60, w: 44, h: 34, occ: 81, heat: 0.4 },
]

const PEOPLE = [
  { c: '#34D399', x: [14, 30, 30, 14], y: [22, 22, 40, 22], d: 12 },
  { c: '#34D399', x: [36, 40, 22, 36], y: [44, 30, 34, 44], d: 14 },
  { c: '#22D3EE', x: [60, 70, 66, 60], y: [18, 28, 16, 18], d: 11 },
  { c: '#22D3EE', x: [86, 90, 88, 86], y: [16, 28, 22, 16], d: 9 },
  { c: '#FBBF24', x: [70, 62, 84, 70], y: [62, 80, 76, 62], d: 15 },
  { c: '#34D399', x: [16, 34, 26, 16], y: [72, 78, 86, 72], d: 13 },
  { c: '#3B82F6', x: [44, 50, 58, 50, 44], y: [30, 50, 70, 50, 30], d: 10 },
]

export default function TrackingVisual() {
  const still = useReducedMotion()
  return (
    <div
      className="hud-corners scanline relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-line bg-[#0A0D14]"
      role="img"
      aria-label="Live office floor plan showing employee locations and zone occupancy"
    >
      <div className="bg-grid absolute inset-0 opacity-70" aria-hidden="true" />
      {ZONES.map((z) => (
        <div
          key={z.id}
          className="absolute rounded-lg border border-accent/30 bg-accent/[.04]"
          style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
        >
          <motion.div
            className="absolute inset-[15%] rounded-full blur-2xl"
            style={{ background: `rgba(${z.heat > 0.45 ? '248,113,113' : z.heat > 0.3 ? '251,191,36' : '34,211,238'},${z.heat})` }}
            animate={still ? undefined : { opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
            aria-hidden="true"
          />
          <div className="relative flex items-start justify-between p-1.5 font-mono text-[8px] sm:p-2 sm:text-[10px]">
            <span className="text-white/80">{z.name}</span>
            <span className={z.occ > 90 ? 'text-danger' : z.occ > 60 ? 'text-ok' : 'text-cyan'}>{z.occ}%</span>
          </div>
        </div>
      ))}

      {PEOPLE.map((p, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute inset-0"
          initial={{ x: `${p.x[0]}%`, y: `${p.y[0]}%` }}
          animate={still ? undefined : { x: p.x.map((v) => `${v}%`), y: p.y.map((v) => `${v}%`) }}
          transition={{ duration: p.d, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <span className="absolute -ml-1.5 -mt-1.5 h-3 w-3 rounded-full border-2 border-bg" style={{ background: p.c, boxShadow: `0 0 12px ${p.c}` }} />
        </motion.div>
      ))}

      <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] text-white/85 sm:text-[11px]">
        <span className="rounded bg-black/60 px-2 py-1">FLOOR 2 · 47 people</span>
        <span className="flex gap-2 rounded bg-black/60 px-2 py-1">
          <span className="text-ok">● at desk</span><span className="text-cyan">● meeting</span><span className="text-warn">● break</span>
        </span>
      </div>
    </div>
  )
}
