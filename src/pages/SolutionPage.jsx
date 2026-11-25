import {
  motion, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform,
} from 'framer-motion'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AttendanceVisual from '../components/AttendanceVisual'
import CameraFeed from '../components/CameraFeed'
import Magnetic from '../components/Magnetic'
import TrackingVisual from '../components/TrackingVisual'
import HeroBackdrop from '../components/hero/HeroBackdrop'
import { BeamBorder, Button, Container, Eyebrow, Reveal, SectionHeader, SpotlightCard, ease } from '../components/ui'
import { BRAND } from '../config'
import { SOLUTIONS, getSolution } from '../data/solutions'
import Contact from '../sections/Contact'
import Dashboard from '../sections/Dashboard'
import Faq from '../sections/Faq'
import { CountUp } from '../sections/TrustBar'
import NotFound from './NotFound'

const VISUALS = { security: CameraFeed, tracking: TrackingVisual, attendance: AttendanceVisual }

/* ── Hero ─────────────────────────────────────────────── */

function FloatChip({ c, className, delay, depth, mx, my }) {
  const Icon = c.icon
  const x = useTransform(mx, (v) => v * depth * 34)
  const y = useTransform(my, (v) => v * depth * 26)
  return (
    <motion.div style={{ x, y }} className={`absolute z-10 hidden sm:block ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay }}
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0D1322]/85 px-3.5 py-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl"
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-lg" style={{ background: `rgba(${c.tone},.15)`, color: `rgb(${c.tone})` }}>
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-current"><span className="absolute inset-0 animate-ping rounded-full bg-current" /></span>
        </span>
        <div>
          <p className="whitespace-nowrap text-sm font-semibold">{c.t}</p>
          <p className="whitespace-nowrap font-mono text-[10px] text-muted">{c.s}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Hero({ s }) {
  const Visual = VISUALS[s.visual]
  const reduce = useReducedMotion()
  const ref = useRef(null)

  // scroll parallax on background only
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  // cursor spotlight + mouse-driven 3D tilt for the visual
  const sx = useMotionValue(-1000)
  const sy = useMotionValue(-1000)
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(${s.rgb},.13), transparent 65%)`
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 70, damping: 18 })
  const my = useSpring(rawY, { stiffness: 70, damping: 18 })
  const rotX = useTransform(my, [-0.5, 0.5], [8, -8])
  const rotY = useTransform(mx, [-0.5, 0.5], [-10, 10])
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    sx.set(e.clientX - r.left); sy.set(e.clientY - r.top)
    if (reduce || e.pointerType !== 'mouse') return
    rawX.set(e.clientX / window.innerWidth - 0.5)
    rawY.set(e.clientY / window.innerHeight - 0.5)
  }

  const words = s.title.join(' ').split(' ')
  const firstLineWords = s.title[0].split(' ').length

  return (
    <section ref={ref} onPointerMove={onMove} className="relative isolate overflow-hidden pb-20 pt-28 sm:pt-32 lg:flex lg:min-h-[92svh] lg:items-center lg:pb-24 lg:pt-32">
      <HeroBackdrop y={bgY} spotlight={spotlight} rgb={s.rgb} />
      <Container className="relative">
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm text-muted">
          <Link to="/" className="hover:text-fg">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link to="/#solutions" className="hover:text-fg">Solutions</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-fg" aria-current="page">{s.name}</span>
        </motion.nav>

        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
              <Eyebrow>{s.eyebrow}</Eyebrow>
            </motion.div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              <span className="sr-only">{s.title.join(' ')}</span>
              {[s.title[0], s.title[1]].map((line, li) => (
                <span key={li} className="block" aria-hidden="true">
                  {line.split(' ').map((w, wi) => {
                    const i = (li ? firstLineWords : 0) + wi
                    return (
                      <span key={wi} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                        <motion.span
                          className={`inline-block ${li === 1 ? 'text-gradient' : ''}`}
                          initial={{ y: '110%', rotateX: -60, opacity: 0, filter: 'blur(8px)' }}
                          animate={{ y: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                          transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.07 }}
                        >
                          {w}&nbsp;
                        </motion.span>
                      </span>
                    )
                  })}
                </span>
              ))}
            </h1>
            {/* underline sweep */}
            <motion.div
              className="mt-3 h-[3px] w-40 origin-left rounded-full"
              style={{ background: `linear-gradient(90deg, rgb(${s.rgb}), transparent)` }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease, delay: 0.2 + words.length * 0.07 }}
            />
            <motion.p initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.8, ease, delay: 0.45 }} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {s.sub}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.6 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Magnetic><Button href="#contact" className="w-full sm:w-auto">See {s.name} live</Button></Magnetic>
              <Button href="#demo" variant="ghost">Try the live demo</Button>
            </motion.div>
          </div>

          <div className="relative [perspective:1600px]">
            {/* rotating rings behind the visual */}
            <div className="pointer-events-none absolute inset-[-10%] grid place-items-center" aria-hidden="true">
              <div className="absolute aspect-square w-full rounded-full border border-dashed animate-[spin_60s_linear_infinite]" style={{ borderColor: `rgba(${s.rgb},.2)` }} />
              <div className="absolute aspect-square w-[75%] rounded-full border animate-[spin_40s_linear_infinite_reverse]" style={{ borderColor: `rgba(${s.rgb},.15)` }}>
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: `rgb(${s.rgb})`, boxShadow: `0 0 12px rgb(${s.rgb})` }} />
              </div>
            </div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.9, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ duration: 1.1, ease, delay: 0.25 }}
            >
              <motion.div style={reduce ? undefined : { rotateX: rotX, rotateY: rotY }}>
                <BeamBorder colors={`rgb(${s.rgb}), transparent`} speed="6s" className="shadow-[0_40px_120px_-30px_rgba(0,0,0,.8)]">
                  <div className="rounded-2xl bg-[#0B0F1B]/90 p-2 backdrop-blur sm:p-3"><Visual /></div>
                </BeamBorder>
              </motion.div>
            </motion.div>
            {s.chips?.[0] && <FloatChip c={s.chips[0]} className="-left-8 -top-12 lg:-left-12" delay={0.9} depth={1.6} mx={mx} my={my} />}
            {s.chips?.[1] && <FloatChip c={s.chips[1]} className="-bottom-14 -right-4 lg:-right-8" delay={1.1} depth={2} mx={mx} my={my} />}
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ── Stats: animated cards with count-up ───────────────── */

function StatValue({ v }) {
  const m = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/.exec(v)
  if (!m) return <>{v}</>
  const decimals = m[2].includes('.') ? m[2].split('.')[1].length : 0
  return <CountUp prefix={m[1]} value={parseFloat(m[2])} suffix={m[3]} decimals={decimals} />
}

function Stats({ s }) {
  return (
    <section className="relative py-14">
      <Container className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {s.stats.map((x, i) => (
          <Reveal key={x.l} delay={i * 0.08}>
            <SpotlightCard rgb={s.rgb} className="h-full p-5 sm:p-6">
              <p className="font-display text-3xl font-semibold sm:text-4xl"><StatValue v={x.v} /></p>
              <p className="mt-1.5 text-sm text-muted">{x.l}</p>
              <motion.div
                className="mt-4 h-0.5 origin-left rounded-full"
                style={{ background: `linear-gradient(90deg, rgb(${s.rgb}), transparent)` }}
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease, delay: 0.2 + i * 0.1 }}
                aria-hidden="true"
              />
            </SpotlightCard>
          </Reveal>
        ))}
      </Container>
    </section>
  )
}

/* ── Capabilities: 3D cascade + spotlight/tilt cards ───── */

function Capabilities({ s }) {
  return (
    <section id="capabilities" className="relative py-24 lg:py-32">
      <div className="bg-grid mask-fade absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/3 h-[480px] w-[800px] -translate-x-1/2 rounded-full blur-[140px]" style={{ background: `rgba(${s.rgb},.09)` }} aria-hidden="true" />
      <Container className="relative">
        <SectionHeader eyebrow="Capabilities" title={<>What {s.name} <span className="text-gradient">does for you.</span></>} />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.capabilities.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.t}
                className="[perspective:1200px]"
                initial={{ opacity: 0, y: 60, rotateX: 18, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, ease, delay: (i % 3) * 0.1 }}
              >
                <SpotlightCard rgb={s.rgb} className="h-full p-7">
                  <span
                    className="relative grid h-11 w-11 place-items-center rounded-xl border transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-110 group-hover:shadow-[0_0_24px_-4px_var(--glow)]"
                    style={{ borderColor: `rgba(${s.rgb},.35)`, background: `rgba(${s.rgb},.1)`, color: `rgb(${s.rgb})` }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="absolute right-6 top-6 font-mono text-xs text-white/15 transition-colors duration-300 group-hover:text-white/40">0{i + 1}</span>
                  <h3 className="mt-5 text-lg font-semibold">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.d}</p>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

/* ── Workflow: scroll-driven timeline with active step ─── */

function Workflow({ s }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const [active, setActive] = useState(reduce ? s.steps.length - 1 : 0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return
    const a = Math.min(s.steps.length - 1, Math.max(0, Math.floor(p * s.steps.length)))
    setActive((cur) => (cur === a ? cur : a))
  })

  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-surface/60 py-24 lg:py-32">
      <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full blur-[140px]" style={{ background: `rgba(${s.rgb},.1)` }} aria-hidden="true" />
      <Container className="relative grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader center={false} eyebrow="How it works" title={<>Up and running <span className="text-gradient">in a day.</span></>} sub="No rip-and-replace. Our engineers help with setup and you keep full control of your data." />
          {/* big live step counter */}
          <div className="mt-10 hidden items-end gap-3 lg:flex" aria-hidden="true">
            <motion.span key={active} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease }} className="font-display text-8xl font-bold leading-none" style={{ color: `rgba(${s.rgb},.35)` }}>
              0{active + 1}
            </motion.span>
            <span className="pb-3 font-mono text-sm text-muted">/ 0{s.steps.length}</span>
          </div>
        </div>
        <div ref={ref} className="relative pl-14">
          <div className="absolute bottom-2 left-[19px] top-2 w-px bg-line" aria-hidden="true" />
          <motion.div className="absolute bottom-2 left-[19px] top-2 w-px origin-top" style={{ scaleY: scrollYProgress, background: `linear-gradient(to bottom, rgb(${s.rgb}), #22D3EE)`, boxShadow: `0 0 10px rgb(${s.rgb})` }} aria-hidden="true" />
          <ol className="space-y-6">
            {s.steps.map((st, i) => {
              const current = i === active
              const done = i < active
              return (
                <Reveal key={st.t} delay={0.05}>
                  <li className="relative">
                    <span
                      className="absolute -left-14 top-5 grid h-10 w-10 place-items-center rounded-full border font-mono text-sm transition-all duration-500"
                      style={current || done
                        ? { borderColor: `rgb(${s.rgb})`, background: `rgb(${s.rgb})`, color: '#07080D', boxShadow: current ? `0 0 24px rgba(${s.rgb},.8)` : 'none' }
                        : { borderColor: `rgba(${s.rgb},.35)`, background: '#07080D', color: `rgb(${s.rgb})` }}
                    >
                      {done ? <Check className="h-4 w-4" aria-hidden="true" /> : `0${i + 1}`}
                    </span>
                    <div
                      className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 ${current ? 'bg-[#0F1526]' : 'glass'} ${!current && !done ? 'opacity-60' : ''}`}
                      style={current ? { borderColor: `rgba(${s.rgb},.5)`, boxShadow: `0 24px 70px -30px rgba(${s.rgb},.6)` } : undefined}
                    >
                      {current && <motion.span layoutId={`wf-glow-${s.slug}`} className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl" style={{ background: `rgba(${s.rgb},.25)` }} aria-hidden="true" />}
                      <h3 className="relative text-lg font-semibold">{st.t}</h3>
                      <p className="relative mt-2 leading-relaxed text-muted">{st.d}</p>
                    </div>
                  </li>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </Container>
    </section>
  )
}

/* ── Roles ──────────────────────────────────────────────── */

function Roles({ s }) {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionHeader eyebrow="Who it's for" title={<>Built for the people <span className="text-gradient">who run your workplace.</span></>} />
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {s.roles.map((r, i) => {
            const Icon = r.icon
            return (
              <motion.div
                key={r.t}
                initial={{ opacity: 0, x: (i - 1) * 60, y: 30, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.85, ease, delay: i * 0.08 }}
              >
                <SpotlightCard rgb={s.rgb} className="hud-corners h-full p-7">
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl" style={{ background: `rgba(${s.rgb},.1)`, color: `rgb(${s.rgb})` }}>
                    <span className="absolute inset-0 animate-ping rounded-2xl border border-current opacity-20 [animation-duration:2.8s]" aria-hidden="true" />
                    <Icon className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{r.t}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{r.d}</p>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

/* ── Cross-links ───────────────────────────────────────── */

function OtherSolutions({ s }) {
  const others = SOLUTIONS.filter((x) => x.slug !== s.slug)
  return (
    <section className="pb-8 pt-4">
      <Container>
        <Reveal><h2 className="text-2xl font-semibold sm:text-3xl">Works even better together</h2></Reveal>
        <Reveal delay={0.05}><p className="mt-2 text-muted">All solutions run on the same cameras and dashboard. Turn on more whenever you're ready.</p></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {others.map((o, i) => {
            const Icon = o.icon
            return (
              <Reveal key={o.slug} delay={i * 0.08}>
                <SpotlightCard rgb={o.rgb} tilt={false} className="h-full">
                  <Link to={`/solutions/${o.slug}`} className="flex items-center gap-5 p-6">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-transform duration-500 group-hover:rotate-[360deg]" style={{ background: `rgba(${o.rgb},.12)`, color: `rgb(${o.rgb})` }}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg font-semibold">{o.name}</span>
                      <span className="mt-0.5 block text-sm text-muted">{o.short}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-fg" aria-hidden="true" />
                  </Link>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default function SolutionPage() {
  const { slug } = useParams()
  const s = getSolution(slug)

  useEffect(() => {
    if (!s) return
    document.title = `${s.metaTitle} — ${BRAND.name} ${BRAND.suffix}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', s.sub)
  }, [s])

  if (!s) return <NotFound />

  return (
    // key forces a fresh mount (and fresh entrance animations) when switching between solutions
    <div key={s.slug}>
      <Hero s={s} />
      <Stats s={s} />
      <Capabilities s={s} />
      <Workflow s={s} />
      {s.demo && (
        <Dashboard
          id="demo"
          initialView={s.demo.view}
          eyebrow={`Live demo · ${s.name}`}
          title={<>{s.demo.title[0]} <span className="text-gradient">{s.demo.title[1]}</span></>}
          sub={s.demo.sub}
        />
      )}
      <Roles s={s} />
      <Faq items={s.faqs} title={`${s.name} — questions, answered.`} />
      <OtherSolutions s={s} />
      <Contact defaultInterest={s.interest} />
    </div>
  )
}
