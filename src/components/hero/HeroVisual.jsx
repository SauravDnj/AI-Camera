import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { Bell, Cpu, ScanFace, UserCheck } from 'lucide-react'
import { createContext, useContext, useEffect, useState } from 'react'
import CameraFeed from '../CameraFeed'

const ease = [0.16, 1, 0.3, 1]
const MouseCtx = createContext(null)

/* A layer that drifts with the mouse; higher depth = moves more (feels closer). */
function Layer({ depth = 1, className = '', delay = 0, ready, children, from = { y: 24 } }) {
  const { mx, my } = useContext(MouseCtx)
  const reduce = useReducedMotion()
  const x = useTransform(mx, (v) => v * depth * 34)
  const y = useTransform(my, (v) => v * depth * 26)
  return (
    <motion.div style={{ x, y }} className={`absolute ${className}`}>
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9, ...from }}
        animate={ready ? { opacity: 1, scale: 1, x: 0, y: 0 } : undefined}
        transition={{ duration: 0.9, ease, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-[#0D1322]/80 p-3.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}

function FaceMatch() {
  return (
    <Card className="w-[210px]">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted">
        <span className="flex items-center gap-1.5"><ScanFace className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />Face match</span>
        <span className="text-ok">Live</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-cyan/40 bg-gradient-to-b from-[#1b2740] to-[#0e1626]">
          <svg viewBox="0 0 56 56" className="absolute inset-0" aria-hidden="true">
            <circle cx="28" cy="22" r="10" fill="#4B5D7A" />
            <path d="M8 56c2-12 10-18 20-18s18 6 20 18z" fill="#344560" />
            {[[24, 20], [32, 20], [28, 25], [25, 28], [31, 28]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1" fill="#22D3EE" />
            ))}
          </svg>
          <motion.span className="absolute inset-x-0 h-px bg-cyan shadow-[0_0_8px_#22D3EE]" animate={{ y: [0, 56, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Priya Sharma</p>
          <p className="font-mono text-[10px] text-muted">EMP-0142 · Eng.</p>
          <div className="mt-1.5 h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-ok to-cyan" initial={{ width: 0 }} animate={{ width: '98.7%' }} transition={{ duration: 1.6, delay: 1.2, ease }} />
          </div>
        </div>
      </div>
      <p className="mt-2 font-mono text-[10px] text-ok">98.7% · liveness passed</p>
    </Card>
  )
}

function AttendanceRing() {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? 142 : 0)
  useEffect(() => {
    if (reduce) return
    const c = animate(0, 142, { duration: 2, delay: 1.3, ease, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [reduce])
  const pct = n / 150
  const R = 30, C = 2 * Math.PI * R
  return (
    <Card className="w-[180px]">
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted"><UserCheck className="h-3.5 w-3.5 text-ok" aria-hidden="true" />Attendance</p>
      <div className="mt-2 flex items-center gap-3">
        <svg viewBox="0 0 76 76" className="h-[72px] w-[72px] -rotate-90" aria-hidden="true">
          <circle cx="38" cy="38" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="7" />
          <circle cx="38" cy="38" r={R} fill="none" stroke="url(#ring-g)" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} />
          <defs>
            <linearGradient id="ring-g" x1="0" x2="1"><stop offset="0" stopColor="#34D399" /><stop offset="1" stopColor="#22D3EE" /></linearGradient>
          </defs>
        </svg>
        <div>
          <p className="font-display text-2xl font-semibold tabular-nums">{n}</p>
          <p className="text-[11px] text-muted">of 150 present</p>
        </div>
      </div>
    </Card>
  )
}

const ALERTS = [
  { t: 'Unknown face · Zone B', s: 'CAM-04 · now', c: 'text-danger bg-danger/15' },
  { t: 'Rahul M. · late check-in', s: 'Main gate · now', c: 'text-warn bg-warn/15' },
  { t: 'Visitor verified', s: 'Reception · now', c: 'text-ok bg-ok/15' },
  { t: 'Tailgating blocked', s: 'Server room · now', c: 'text-danger bg-danger/15' },
]
function AlertStream({ ready }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!ready || reduce) return
    const t = setInterval(() => setI((v) => (v + 1) % ALERTS.length), 2600)
    return () => clearInterval(t)
  }, [ready, reduce])
  const a = ALERTS[i]
  return (
    <Card className="w-[236px] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -18, transition: { duration: 0.2 } }}
          transition={{ duration: 0.45, ease }}
          className="flex items-center gap-3"
        >
          <span className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-lg ${a.c}`}>
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-current">
              <span className="absolute inset-0 animate-ping rounded-full bg-current" />
            </span>
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{a.t}</p>
            <p className="font-mono text-[10px] text-muted">{a.s}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  )
}

function EngineStats() {
  // sparkline: a repeating path that slides left forever
  const pts = Array.from({ length: 24 }, (_, i) => `${i * 10},${14 - Math.sin(i * 0.9) * 6 - (i % 3) * 2}`).join(' ')
  return (
    <Card className="w-[200px]">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted"><Cpu className="h-3.5 w-3.5 text-accent" aria-hidden="true" />Vision engine</p>
        <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[9px] text-accent">v3</span>
      </div>
      <div className="mt-2 h-7 overflow-hidden">
        <svg viewBox="0 0 460 24" className="h-7 w-[460px] max-w-none animate-[spark_6s_linear_infinite]" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={pts} fill="none" stroke="#3B82F6" strokeWidth="1.5" />
          <polyline points={pts} fill="none" stroke="#3B82F6" strokeWidth="1.5" transform="translate(230 0)" />
        </svg>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
        <div><p className="text-fg">30</p><p className="text-muted">FPS</p></div>
        <div><p className="text-fg">42%</p><p className="text-muted">GPU</p></div>
        <div><p className="text-fg">18ms</p><p className="text-muted">Infer</p></div>
      </div>
    </Card>
  )
}

function MiniCams() {
  const cams = ['CAM-01 Gate', 'CAM-07 Lobby', 'CAM-11 Server', 'CAM-17 Lot']
  return (
    <Card className="w-[190px] p-2.5">
      <div className="grid grid-cols-2 gap-1.5">
        {cams.map((c, i) => (
          <div key={c} className="noise relative aspect-video overflow-hidden rounded-md bg-gradient-to-br from-[#16213a] to-[#0b1220]">
            <motion.span
              className="absolute h-3 w-2 rounded-[2px] border border-ok/80"
              style={{ left: `${20 + i * 15}%`, top: '35%' }}
              animate={{ x: [0, 10, -4, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="absolute bottom-0.5 left-1 font-mono text-[7px] text-white/70">{c}</span>
            <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-danger blink" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function HeroVisual({ ready: readyProp = true }) {
  const reduce = useReducedMotion()
  const ready = readyProp || reduce
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 70, damping: 18 })
  const my = useSpring(rawY, { stiffness: 70, damping: 18 })
  const rotX = useTransform(my, [-0.5, 0.5], [9, -9])
  const rotY = useTransform(mx, [-0.5, 0.5], [-12, 12])

  useEffect(() => {
    if (reduce) return
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      rawX.set(e.clientX / window.innerWidth - 0.5)
      rawY.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, rawX, rawY])

  return (
    <MouseCtx.Provider value={{ mx, my }}>
      <div className="relative mx-auto aspect-square w-full max-w-[640px] [perspective:1600px] sm:aspect-[1/0.86]">
        {/* rotating radar rings */}
        <div className="absolute inset-[-6%] grid place-items-center" aria-hidden="true">
          <div className="absolute h-full w-full rounded-full border border-dashed border-accent/20 animate-[spin_60s_linear_infinite]" />
          <div className="absolute h-[78%] w-[78%] rounded-full border border-cyan/15 animate-[spin_40s_linear_infinite_reverse]">
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_12px_#22D3EE]" />
          </div>
          <div className="absolute h-[56%] w-[56%] rounded-full" style={{ background: 'conic-gradient(from 0deg, rgba(34,211,238,.18), transparent 22%)' }}>
            <div className="h-full w-full rounded-full animate-[spin_6s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, rgba(59,130,246,.25), transparent 18%)' }} />
          </div>
        </div>

        {/* data beams between cards and the feed */}
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 640 550" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="beam" x1="0" x2="1"><stop offset="0" stopColor="#22D3EE" stopOpacity="0" /><stop offset=".5" stopColor="#22D3EE" /><stop offset="1" stopColor="#3B82F6" stopOpacity="0" /></linearGradient>
          </defs>
          {['M70 120 C 140 140, 200 190, 300 250', 'M590 330 C 520 320, 460 300, 380 270', 'M90 470 C 170 430, 240 360, 300 300', 'M560 90 C 500 140, 450 190, 380 230'].map((d, i) => (
            <g key={i}>
              <path d={d} stroke="rgba(59,130,246,.18)" strokeWidth="1" />
              <path d={d} stroke="url(#beam)" strokeWidth="1.6" strokeDasharray="40 260" className="animate-[beam_3s_linear_infinite]" style={{ animationDelay: `${i * 0.7}s` }} />
            </g>
          ))}
        </svg>

        {/* main feed, tilting in 3D */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.85, rotateX: 25 }}
          animate={ready ? { opacity: 1, scale: 1, rotateX: 0 } : undefined}
          transition={{ duration: 1.2, ease, delay: 0.15 }}
          className="absolute left-0 right-0 top-[6%] sm:left-[8%] sm:right-[8%] sm:top-[18%]"
        >
          <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }} className="relative rounded-2xl border border-white/10 bg-white/[.03] p-2 shadow-[0_40px_120px_-30px_rgba(59,130,246,.6)] backdrop-blur-sm">
            <CameraFeed />
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent" aria-hidden="true" />
          </motion.div>
        </motion.div>

        {/* floating HUD cards at different depths */}
        <Layer depth={1.6} className="left-[-6%] top-[2%] hidden sm:block" delay={0.55} ready={ready} from={{ x: -30 }}><FaceMatch /></Layer>
        <Layer depth={1.2} className="right-[-4%] top-[0%] hidden md:block" delay={0.7} ready={ready} from={{ y: -24 }}><EngineStats /></Layer>
        <Layer depth={2} className="right-[-8%] top-[54%] hidden sm:block" delay={0.85} ready={ready} from={{ x: 30 }}><AttendanceRing /></Layer>
        <Layer depth={1.8} className="bottom-[2%] left-0 sm:bottom-[0%] sm:left-[-4%]" delay={1} ready={ready} from={{ y: 30 }}><AlertStream ready={ready} /></Layer>
        <Layer depth={0.9} className="bottom-[-2%] right-[16%] hidden lg:block" delay={1.15} ready={ready} from={{ y: 30 }}><MiniCams /></Layer>
      </div>
    </MouseCtx.Provider>
  )
}
