import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BRAND } from '../../config'

const LINES = ['initializing vision engine', 'connecting 48 cameras', 'loading face model v3', 'system online']
const KEY = 'sentra-boot-seen'

function seen() {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}
function markSeen() {
  try { sessionStorage.setItem(KEY, '1') } catch { /* storage unavailable */ }
}

/* Short "system boot" overlay, shown once per browser session. Skippable; skipped for reduced motion. */
export default function BootIntro({ onDone }) {
  const [show] = useState(() => !seen() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [open, setOpen] = useState(show)
  const [line, setLine] = useState(0)

  useEffect(() => {
    if (!show) { onDone(); return }
    const timers = LINES.map((_, i) => setTimeout(() => setLine(i + 1), 280 + i * 330))
    timers.push(setTimeout(() => setOpen(false), 1850))
    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const finish = () => { markSeen(); onDone() }

  return (
    <AnimatePresence onExitComplete={finish}>
      {open && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[90] grid place-items-center bg-bg"
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          style={{ clipPath: 'inset(0 0 0% 0)' }}
          role="status"
          aria-label="Loading"
        >
          <div className="bg-grid mask-fade absolute inset-0" aria-hidden="true" />
          <div className="relative flex flex-col items-center px-6">
            <div className="relative grid h-24 w-24 place-items-center">
              <motion.span className="absolute inset-0 rounded-full border-2 border-accent/30 border-t-cyan" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              <motion.span className="absolute inset-3 rounded-full border border-accent/40 border-b-accent" animate={{ rotate: -360 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} />
              <motion.span className="h-4 w-4 rounded-full bg-cyan shadow-[0_0_24px_#22D3EE]" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
            </div>
            <p className="mt-7 font-display text-2xl font-semibold">{BRAND.name}<span className="text-cyan"> {BRAND.suffix}</span></p>
            <ul className="mt-5 h-[88px] w-64 space-y-1 font-mono text-xs text-muted">
              {LINES.slice(0, line).map((l, i) => (
                <motion.li key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={i === LINES.length - 1 ? 'text-ok' : ''}>
                  <span className="text-cyan">&gt;</span> {l}{i === LINES.length - 1 ? ' ✓' : '…'}
                </motion.li>
              ))}
            </ul>
            <div className="mt-2 h-0.5 w-64 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full bg-gradient-to-r from-accent to-cyan" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.6, ease: 'easeInOut' }} />
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="absolute bottom-8 right-8 min-h-11 cursor-pointer rounded-lg border border-line px-4 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-cyan/40 hover:text-fg">
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
