import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Cctv, ScanFace, ShieldCheck, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Container, Reveal, ease } from '../components/ui'

// Replace these figures with your own verified product numbers.
const STATS = [
  { icon: ScanFace, value: 99.3, decimals: 1, suffix: '%', label: 'Face recognition accuracy', meter: 0.993, rgb: '52,211,153', tone: 'text-ok' },
  { icon: Zap, value: 200, suffix: 'ms', prefix: '<', label: 'Alert latency, camera to phone', meter: 0.85, rgb: '34,211,238', tone: 'text-cyan' },
  { icon: Cctv, value: 500, suffix: '+', label: 'Cameras per site supported', meter: 0.7, rgb: '59,130,246', tone: 'text-accent' },
  { icon: ShieldCheck, value: 24, suffix: '/7', label: 'Autonomous monitoring', meter: 1, rgb: '167,139,250', tone: 'text-violet-400' },
]

export function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) { setN(value); return }
    const c = animate(0, value, { duration, ease, onUpdate: setN })
    return () => c.stop()
  }, [inView, value, reduce, duration])
  return <span ref={ref} className="tabular-nums">{prefix}{n.toFixed(decimals)}{suffix}</span>
}

export default function TrustBar() {
  return (
    <section className="relative py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.label} delay={i * 0.08} className={`border-white/[.08] px-5 sm:px-8 ${i % 2 ? 'border-l' : ''} ${i === 2 ? 'lg:border-l' : ''} ${i === 0 ? 'pl-0 sm:pl-0' : ''}`}>
                <div className="group h-full">
                  <p className="flex items-center gap-2 text-[15px] font-medium text-fg"><Icon className="h-4 w-4 text-muted transition-colors group-hover:text-fg" aria-hidden="true" />{s.label}</p>
                  <p className="mt-3 font-display text-4xl font-medium tracking-[-0.03em] text-fg sm:text-5xl"><CountUp {...s} /></p>
                  <div className="mt-5 h-px overflow-hidden bg-white/[.08]" aria-hidden="true">
                    <motion.div
                      className="h-full origin-left rounded-full"
                      style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.15), rgba(255,255,255,.7))' }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: s.meter }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease, delay: 0.2 + i * 0.1 }}
                    />
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
