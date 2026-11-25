import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Cctv, Play, ScanFace, ShieldCheck, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import Magnetic from '../components/Magnetic'
import HeroVisual from '../components/hero/HeroVisual'
import LiveTicker from '../components/hero/LiveTicker'
import HeroBackdrop from '../components/hero/HeroBackdrop'
import ScrambleWord from '../components/hero/ScrambleWord'
import { Button, Container } from '../components/ui'

const ease = [0.16, 1, 0.3, 1]
const LINE1 = 'See everything.'
const WORDS = ['everyone.', 'every door.', 'every shift.', 'every camera.']

const CHIPS = [
  { icon: ScanFace, t: 'Face ID in <300 ms' },
  { icon: Cctv, t: 'Any ONVIF / RTSP camera' },
  { icon: ShieldCheck, t: 'Edge or cloud · encrypted' },
]

export default function Hero({ ready = true }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Parallax only on decorative background layers (small deltas).
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  // Cursor spotlight
  const sx = useMotionValue(-1000)
  const sy = useMotionValue(-1000)
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(59,130,246,.13), transparent 65%)`
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    sx.set(e.clientX - r.left); sy.set(e.clientY - r.top)
  }

  const show = ready || reduce ? 'show' : 'hidden'
  const item = (delay) => ({
    hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease, delay } },
  })

  return (
    <section id="top" ref={ref} onPointerMove={onMove} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16 lg:pt-18">
      {/* ── Background stack ───────────────────────────── */}
      <HeroBackdrop y={bgY} spotlight={spotlight} />

      {/* ── Content ─────────────────────────────────────── */}
      <Container className="relative flex flex-1 items-center py-12 lg:py-16">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_1.08fr] lg:gap-10">
          {/* reduced motion: render the final state immediately */}
          <motion.div initial={reduce ? false : 'hidden'} animate={show} style={{ opacity: fade }} className="relative z-10 text-center lg:text-left">
            {/* announcement pill with rotating border */}
            <motion.a variants={item(0)} href="#features" className="group relative inline-flex overflow-hidden rounded-full p-px">
              <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_70%,#22D3EE_85%,#3B82F6_100%)]" aria-hidden="true" />
              <span className="relative flex items-center gap-2 rounded-full bg-[#0B0F1A] px-3.5 py-1.5 text-xs sm:text-sm">
                <span className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-cyan">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />New
                </span>
                <span className="text-fg/90">Vision Model v3 — 2× faster recognition</span>
                <span className="text-muted transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </span>
            </motion.a>

            <h1 className="mt-7 font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
              <span className="sr-only">See everything. Secure everyone.</span>
              <span className="block" aria-hidden="true">
                {LINE1.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    variants={{
                      hidden: { opacity: 0, y: '0.5em', rotateX: -80 },
                      show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease, delay: 0.15 + i * 0.025 } },
                    }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </motion.span>
                ))}
              </span>
              <motion.span variants={item(0.5)} className="block" aria-hidden="true">
                Secure
                <span className="relative block w-fit lg:mx-0 mx-auto">
                  <ScrambleWord words={WORDS} start={ready} className="text-gradient" />
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-accent via-cyan to-transparent"
                    variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, ease, delay: 1 } } }}
                  />
                </span>
              </motion.span>
            </h1>

            <motion.p variants={item(0.7)} className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
              One AI platform that turns your existing CCTV into a <span className="text-fg">24/7 security guard</span>, a
              <span className="text-fg"> touchless attendance system</span> and a <span className="text-fg">live workforce tracker</span> — with
              recordings, alerts and reports in a single dashboard.
            </motion.p>

            <motion.div variants={item(0.85)} className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Magnetic><Button href="#contact" className="min-h-13 px-7 text-base">Book a live demo</Button></Magnetic>
              <a href="#dashboard" className="group flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm font-semibold text-fg">
                <span className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-cyan/50 group-hover:bg-cyan/10">
                  <span className="absolute inset-0 animate-ping rounded-full border border-cyan/40 [animation-duration:2.2s]" aria-hidden="true" />
                  <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
                </span>
                See it in action
              </a>
            </motion.div>

            <motion.ul variants={item(1)} className="mt-10 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              {CHIPS.map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-fg/85 backdrop-blur">
                  <Icon className="h-4 w-4 text-cyan" aria-hidden="true" />{t}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div style={{ y: visualY }} className="relative">
            <HeroVisual ready={ready} />
          </motion.div>
        </div>
      </Container>

      {/* scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ delay: 1.6 }} className="pointer-events-none absolute bottom-20 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 [@media(min-width:1280px)_and_(min-height:860px)]:flex" aria-hidden="true">
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/20 pt-1.5">
          <motion.span className="h-1.5 w-1 rounded-full bg-cyan" animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
        </span>
      </motion.div>

      <LiveTicker />
    </section>
  )
}
