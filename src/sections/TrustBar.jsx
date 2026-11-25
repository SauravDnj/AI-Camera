import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Cctv, ScanFace, ShieldCheck, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Container, Reveal, SpotlightCard, ease } from '../components/ui'

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
    <section className="relative py-14">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.label} delay={i * 0.08}>
                <SpotlightCard rgb={s.rgb} className="h-full p-5 sm:p-6">
                  <span className={`relative grid h-10 w-10 place-items-center rounded-xl bg-white/5 ${s.tone}`}>
                    <span className="absolute inset-0 animate-ping rounded-xl border border-current opacity-20 [animation-duration:2.6s]" aria-hidden="true" />
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  </span>
                  <p className="mt-5 font-display text-3xl font-semibold text-fg sm:text-4xl"><CountUp {...s} /></p>
                  <p className="mt-1 text-sm text-muted">{s.label}</p>
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[.06]" aria-hidden="true">
                    <motion.div
                      className="h-full origin-left rounded-full"
                      style={{ background: `linear-gradient(90deg, rgba(${s.rgb},.3), rgb(${s.rgb}))` }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: s.meter }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease, delay: 0.2 + i * 0.1 }}
                    />
                  </div>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
