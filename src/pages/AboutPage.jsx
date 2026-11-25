import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Briefcase, MapPin, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import HeroBackdrop from '../components/hero/HeroBackdrop'
import Magnetic from '../components/Magnetic'
import { BeamBorder, Button, Container, Eyebrow, Reveal, SectionHeader, SpotlightCard, ease } from '../components/ui'
import { BRAND } from '../config'
import { ABOUT_STATS, MISSION, OFFICES, OPEN_ROLES, TEAM, TIMELINE, VALUES } from '../data/about'
import Contact from '../sections/Contact'
import { CountUp } from '../sections/TrustBar'

/* ── Hero ── */
function Hero() {
  const sx = useMotionValue(-1000)
  const sy = useMotionValue(-1000)
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(34,211,238,.12), transparent 65%)`
  const lines = [['We’re', 'giving', 'every'], ['camera', 'a', 'brain.']]
  let k = 0
  return (
    <section
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); sx.set(e.clientX - r.left); sy.set(e.clientY - r.top) }}
      className="relative isolate flex min-h-[86svh] items-center overflow-hidden pb-20 pt-32"
    >
      <HeroBackdrop spotlight={spotlight} />
      <Container className="relative text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}><Eyebrow>About {BRAND.name} {BRAND.suffix}</Eyebrow></motion.div>
        <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-bold leading-[1.02] sm:text-7xl lg:text-8xl">
          <span className="sr-only">We’re giving every camera a brain.</span>
          {lines.map((line, li) => (
            <span key={li} className="block" aria-hidden="true">
              {line.map((w) => {
                const i = k++
                return (
                  <span key={w + i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <motion.span
                      className={`inline-block ${li === 1 ? 'text-gradient' : ''}`}
                      initial={{ y: '110%', rotateX: -70, opacity: 0, filter: 'blur(10px)' }}
                      animate={{ y: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                      transition={{ duration: 1, ease, delay: 0.15 + i * 0.09 }}
                    >
                      {w}&nbsp;
                    </motion.span>
                  </span>
                )
              })}
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.8 }} className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          We build the AI that turns ordinary CCTV into a security guard, an attendance system and a workplace analyst — for companies that care about safety and about their people.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.95 }} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Magnetic><Button href="#story">Read our story</Button></Magnetic>
          <Button href="#careers" variant="ghost">We're hiring</Button>
        </motion.div>
      </Container>
    </section>
  )
}

/* ── Mission: words light up as you scroll ── */
function MissionWord({ w, i, n, progress }) {
  const opacity = useTransform(progress, [i / n, (i + 1) / n], [0.14, 1])
  const y = useTransform(progress, [i / n, (i + 1) / n], [6, 0])
  return <motion.span style={{ opacity, y }} className="inline-block">{w}&nbsp;</motion.span>
}

function Mission() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 45%'] })
  const words = MISSION.split(' ')
  return (
    <section className="relative py-28 lg:py-40">
      <Container>
        <Reveal><Eyebrow>Our mission</Eyebrow></Reveal>
        <p ref={ref} className="mt-8 max-w-5xl font-display text-3xl font-semibold leading-[1.25] sm:text-4xl lg:text-5xl">
          {reduce ? MISSION : words.map((w, i) => <MissionWord key={i} w={w} i={i} n={words.length} progress={scrollYProgress} />)}
        </p>
      </Container>
    </section>
  )
}

/* ── Stats ── */
function Stats() {
  return (
    <section className="py-6">
      <Container className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {ABOUT_STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <SpotlightCard className="h-full p-6">
              <p className="font-display text-3xl font-semibold sm:text-4xl">{s.plain ? s.value : <CountUp value={s.value} suffix={s.suffix || ''} />}</p>
              <p className="mt-1.5 text-sm text-muted">{s.label}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </Container>
    </section>
  )
}

/* ── Story timeline ── */
function Story() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 55%'] })
  return (
    <section id="story" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[140px]" aria-hidden="true" />
      <Container className="relative">
        <SectionHeader eyebrow="Our story" title={<>From a frustrating queue <span className="text-gradient">to Vision Model v3.</span></>} />
        <div ref={ref} className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute bottom-0 left-5 top-0 w-px bg-line lg:left-1/2" aria-hidden="true" />
          <motion.div className="absolute bottom-0 left-5 top-0 w-px origin-top bg-gradient-to-b from-accent to-cyan shadow-[0_0_10px_#22D3EE] lg:left-1/2" style={{ scaleY: scrollYProgress }} aria-hidden="true" />
          <ol className="space-y-10 lg:space-y-14">
            {TIMELINE.map((t, i) => {
              const left = i % 2 === 0
              return (
                <li key={t.year} className={`relative pl-14 lg:flex lg:pl-0 ${left ? '' : 'lg:flex-row-reverse'}`}>
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-40% 0px -40% 0px' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="absolute left-5 top-6 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-cyan bg-bg shadow-[0_0_16px_#22D3EE] lg:left-1/2"
                    aria-hidden="true"
                  />
                  <div className={`lg:w-1/2 ${left ? 'lg:pr-14 lg:text-right' : 'lg:pl-14'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: left ? -60 : 60, filter: 'blur(6px)' }}
                      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.85, ease }}
                    >
                      <SpotlightCard tilt={false} className="p-6">
                        <p className="font-display text-4xl font-bold text-accent/40">{t.year}</p>
                        <h3 className="mt-2 text-xl font-semibold">{t.title}</h3>
                        <p className="mt-2 leading-relaxed text-muted">{t.text}</p>
                      </SpotlightCard>
                    </motion.div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </section>
  )
}

/* ── Values ── */
function Values() {
  return (
    <section className="relative border-y border-line/70 bg-surface/60 py-24 lg:py-32">
      <Container>
        <SectionHeader eyebrow="What we value" title={<>Principles we <span className="text-gradient">won't compromise.</span></>} />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <motion.div key={v.t} className="[perspective:1200px]" initial={{ opacity: 0, y: 50, rotateX: 18 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.85, ease, delay: (i % 3) * 0.1 }}>
              <SpotlightCard rgb={v.rgb} className="h-full p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110" style={{ background: `rgba(${v.rgb},.12)`, color: `rgb(${v.rgb})` }}>
                  <v.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.d}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ── Team: flip cards ── */
function TeamCard({ p, i }) {
  const [flipped, setFlipped] = useState(false)
  const initials = p.n.split(' ').map((x) => x[0]).join('')
  return (
    <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, ease, delay: (i % 4) * 0.08 }} className="[perspective:1200px]">
      <button
        onClick={() => setFlipped((f) => !f)}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setFlipped(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setFlipped(false)}
        aria-pressed={flipped}
        aria-label={`${p.n}, ${p.r}. ${flipped ? 'Showing bio' : 'Show bio'}`}
        className="relative block h-72 w-full cursor-pointer text-left"
      >
        <motion.div className="absolute inset-0 [transform-style:preserve-3d]" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: 'spring', stiffness: 140, damping: 18 }}>
          {/* front */}
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-line bg-card p-6 text-center [backface-visibility:hidden]">
            <div className="absolute inset-x-0 top-0 h-24 opacity-60" style={{ background: `radial-gradient(circle at 50% 0%, rgba(${p.rgb},.35), transparent 70%)` }} />
            <span className="relative grid h-24 w-24 place-items-center rounded-full font-display text-2xl font-semibold" style={{ background: `linear-gradient(135deg, rgba(${p.rgb},.35), rgba(${p.rgb},.08))`, color: `rgb(${p.rgb})`, boxShadow: `0 0 0 1px rgba(${p.rgb},.4), 0 0 40px -8px rgba(${p.rgb},.8)` }}>
              {initials}
              <span className="absolute inset-[-6px] rounded-full border border-dashed animate-[spin_20s_linear_infinite]" style={{ borderColor: `rgba(${p.rgb},.35)` }} />
            </span>
            <p className="relative mt-5 text-lg font-semibold">{p.n}</p>
            <p className="relative text-sm text-muted">{p.r}</p>
            <span className="relative mt-4 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted/70"><RotateCcw className="h-3 w-3" aria-hidden="true" />Hover or tap</span>
          </div>
          {/* back */}
          <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ borderColor: `rgba(${p.rgb},.5)`, background: `linear-gradient(160deg, rgba(${p.rgb},.18), #0E1220 60%)` }}>
            <div>
              <p className="font-semibold">{p.n}</p>
              <p className="text-xs" style={{ color: `rgb(${p.rgb})` }}>{p.r}</p>
              <p className="mt-4 text-sm leading-relaxed text-fg/85">{p.b}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => <span key={t} className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] text-fg/80">{t}</span>)}
            </div>
          </div>
        </motion.div>
      </button>
    </motion.div>
  )
}

function Team() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionHeader eyebrow="The team" title={<>The people <span className="text-gradient">behind the vision.</span></>} sub="Engineers, researchers, designers and privacy experts building AI that's useful and fair." />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((p, i) => <TeamCard key={p.n} p={p} i={i} />)}
        </div>
      </Container>
    </section>
  )
}

/* ── Offices with live local time ── */
function useNow() {
  const [d, setD] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setD(new Date()), 1000); return () => clearInterval(t) }, [])
  return d
}

function Offices() {
  const now = useNow()
  return (
    <section className="relative border-y border-line/70 bg-surface/60 py-24 lg:py-32">
      <Container>
        <SectionHeader eyebrow="Around the world" title={<>Four offices. <span className="text-gradient">One always awake.</span></>} />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFICES.map((o, i) => {
            const time = now.toLocaleTimeString('en-GB', { timeZone: o.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })
            const hour = +now.toLocaleString('en-GB', { timeZone: o.tz, hour: '2-digit', hour12: false })
            const open = hour >= 9 && hour < 18
            const [hh, mm, ss] = time.split(':')
            return (
              <Reveal key={o.city} delay={i * 0.08}>
                <SpotlightCard rgb={open ? '52,211,153' : '59,130,246'} className="h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-muted"><MapPin className="h-4 w-4" aria-hidden="true" />{o.country}</span>
                    <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] ${open ? 'bg-ok/15 text-ok' : 'bg-white/5 text-muted'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-ok blink' : 'bg-muted'}`} />{open ? 'Open now' : 'After hours'}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold">{o.city}</h3>
                  <p className="text-sm text-muted">{o.role}</p>
                  <p className="mt-6 font-mono text-3xl tabular-nums" aria-label={`Local time ${hh}:${mm}`}>
                    {hh}<span className="blink">:</span>{mm}
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={ss} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.25 }} className="ml-1 inline-block text-base text-muted">{ss}</motion.span>
                    </AnimatePresence>
                  </p>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

/* ── Careers ── */
function Careers() {
  return (
    <section id="careers" className="py-24 lg:py-32">
      <Container>
        <Reveal y={50}>
          <BeamBorder radius="rounded-3xl" speed="7s" className="shadow-[0_40px_120px_-40px_rgba(59,130,246,.5)]">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111C38] to-[#0B0F1B] p-8 sm:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" aria-hidden="true" />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <Eyebrow>Careers</Eyebrow>
                  <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">Help us build <span className="text-gradient">the eyes of the workplace.</span></h2>
                  <p className="mt-5 max-w-xl text-muted">Remote-friendly, research-driven and serious about privacy. If you love computer vision, great UX or happy customers, we'd love to talk.</p>
                  <div className="mt-8"><Magnetic><Button href={`mailto:${BRAND.email}?subject=Careers`}>See open roles</Button></Magnetic></div>
                </div>
                <motion.ul initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="space-y-2">
                  {OPEN_ROLES.map((r) => (
                    <motion.li key={r} variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { ease } } }}>
                      <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent(r)}`} className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm transition-all hover:border-cyan/40 hover:bg-cyan/5">
                        <span className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-cyan" aria-hidden="true" />{r}</span>
                        <ArrowRight className="h-4 w-4 text-muted transition-all group-hover:translate-x-1 group-hover:text-fg" aria-hidden="true" />
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </BeamBorder>
        </Reveal>
      </Container>
    </section>
  )
}

export default function AboutPage() {
  useEffect(() => {
    document.title = `About — ${BRAND.name} ${BRAND.suffix}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${BRAND.name} ${BRAND.suffix} builds AI that turns CCTV into security, attendance and workforce intelligence. Meet the team and our story.`)
  }, [])
  return (
    <>
      <Hero />
      <Mission />
      <Stats />
      <Story />
      <Values />
      <Team />
      <Offices />
      <Careers />
      <Contact />
    </>
  )
}
