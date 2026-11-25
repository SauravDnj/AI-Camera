import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Brain, Cctv, ChartBar, Check, Users } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Container, SectionHeader } from '../components/ui'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { icon: Cctv, n: '01', title: 'Connect your cameras', desc: 'Add existing IP cameras, NVRs or DVRs with an RTSP link or ONVIF auto-discovery. A small edge box or our cloud processes the streams.', meta: 'Setup in ~15 minutes' },
  { icon: Users, n: '02', title: 'Enroll your employees', desc: 'Upload 3–5 photos per employee or let them self-enroll from the mobile app. Import departments and shifts from your HRMS.', meta: 'Bulk CSV / HRMS import' },
  { icon: Brain, n: '03', title: 'AI model trains on your site', desc: 'The recognition model fine-tunes on your people, lighting and camera angles. Accuracy keeps improving with every verified match.', meta: 'Private model per company' },
  { icon: ChartBar, n: '04', title: 'Track, alert & report — live', desc: 'Attendance marks itself, security alerts fire in real time and managers get live dashboards, recordings and automated reports.', meta: 'Web · iOS · Android' },
]

export default function HowItWorks() {
  const section = useRef(null)
  const track = useRef(null)
  const bar = useRef(null)
  const dot = useRef(null)
  const activeRef = useRef(-1)
  const [active, setActive] = useState(-1) // -1 = all steps lit (mobile / reduced motion)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current
        const distance = () => el.scrollWidth - el.parentElement.clientWidth
        const setStep = (p) => {
          const a = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))
          if (a !== activeRef.current) { activeRef.current = a; setActive(a) }
        }
        setStep(0)
        const st = { trigger: section.current, start: 'top top', end: () => `+=${distance()}`, scrub: 0.8 }
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { ...st, pin: true, invalidateOnRefresh: true, onUpdate: (self) => setStep(self.progress) },
        })
        gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: st })
        gsap.fromTo(dot.current, { xPercent: 0 }, { xPercent: 100, ease: 'none', scrollTrigger: st })
        return () => { activeRef.current = -1; setActive(-1) }
      })
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.step-card').forEach((c) => {
          gsap.from(c, { opacity: 0, y: 50, rotateX: 20, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%' } })
        })
      })
    }, section)
    return () => { ctx.revert(); mm.revert() }
  }, [])

  return (
    <section id="how" ref={section} className="relative overflow-hidden py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      {/* giant background step number */}
      <div className="pointer-events-none absolute bottom-[-4rem] right-[-1rem] hidden select-none lg:block" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="block font-display text-[18rem] font-bold leading-none text-white/[.03]"
          >
            {active >= 0 ? STEPS[active].n : ''}
          </motion.span>
        </AnimatePresence>
      </div>

      <Container>
        <SectionHeader
          eyebrow="How it works"
          title={<>Live in a day. <span className="text-gradient">Smarter every week.</span></>}
          sub="Four steps from ordinary CCTV to an AI-powered security and workforce system."
        />
      </Container>

      <div className="mt-14 lg:mt-16">
        {/* progress line with travelling glow dot */}
        <div className="relative mx-auto hidden h-px max-w-7xl px-8 lg:block" aria-hidden="true">
          <div className="relative h-px bg-line">
            <div ref={bar} className="absolute inset-0 origin-left bg-gradient-to-r from-accent to-cyan shadow-[0_0_10px_#22D3EE]" />
            <div ref={dot} className="absolute inset-0">
              <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-cyan shadow-[0_0_16px_4px_rgba(34,211,238,.7)]" />
            </div>
            {STEPS.map((s, i) => (
              <span
                key={s.n}
                className={`absolute -top-[5px] h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${active === -1 || i <= active ? 'border-cyan bg-cyan' : 'border-line bg-bg'}`}
                style={{ left: `${(i / (STEPS.length - 1)) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="lg:mt-10">
          <div ref={track} className="mx-auto flex max-w-7xl flex-col gap-5 px-4 [perspective:1200px] sm:px-6 lg:w-max lg:max-w-none lg:flex-row lg:gap-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-[20vw]">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const current = active === i
              const done = active > i
              const lit = active === -1 || current
              return (
                <article
                  key={s.n}
                  className={`step-card hud-corners relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 lg:w-[440px] lg:shrink-0 ${
                    lit ? 'border-accent/50 bg-[#0F1526] shadow-[0_30px_80px_-30px_rgba(59,130,246,.6)]' : 'glass'
                  } ${active !== -1 && !current ? 'lg:scale-[.96] lg:opacity-55' : ''}`}
                >
                  {current && <motion.span layoutId="step-glow" className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />}
                  <div className="relative flex items-start justify-between">
                    <span className={`grid h-14 w-14 place-items-center rounded-2xl border transition-colors duration-500 ${lit ? 'border-accent bg-accent text-white shadow-[0_0_30px_-4px_rgba(59,130,246,.8)]' : 'border-accent/30 bg-accent/10 text-accent'}`}>
                      {done ? <Check className="h-6 w-6" aria-hidden="true" /> : <Icon className="h-6 w-6" aria-hidden="true" />}
                    </span>
                    <span className={`font-display text-6xl font-bold transition-colors duration-500 ${lit ? 'text-accent/30' : 'text-white/[.06]'}`}>{s.n}</span>
                  </div>
                  <h3 className="relative mt-8 text-xl font-semibold">{s.title}</h3>
                  <p className="relative mt-3 leading-relaxed text-muted">{s.desc}</p>
                  <p className="relative mt-6 inline-block rounded-md bg-cyan/10 px-2.5 py-1 font-mono text-xs text-cyan">{s.meta}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
