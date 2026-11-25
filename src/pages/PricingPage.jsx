import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { BadgeCheck, Calculator, Check, ChevronDown, CreditCard, Minus, Plus, ShieldCheck, Sparkles, X } from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import HeroBackdrop from '../components/hero/HeroBackdrop'
import { BeamBorder, Button, Container, Eyebrow, Reveal, SectionHeader, SpotlightCard, ease } from '../components/ui'
import { BRAND } from '../config'
import { ADDONS, COMPARE, PLANS, PRICING_FAQS } from '../data/pricing'
import Contact from '../sections/Contact'
import Faq from '../sections/Faq'
import Pricing from '../sections/Pricing'

const money = (n) => '$' + Math.round(n).toLocaleString('en-US')

/* Number that springs to its new value whenever it changes */
function AnimatedNumber({ value, format = money, className = '' }) {
  const mv = useMotionValue(value)
  const spring = useSpring(mv, { stiffness: 120, damping: 20 })
  const text = useTransform(spring, (v) => format(v))
  useEffect(() => { mv.set(value) }, [value, mv])
  return <motion.span className={`tabular-nums ${className}`}>{text}</motion.span>
}

/* ── Hero ── */
function Hero() {
  const sx = useMotionValue(-1000)
  const sy = useMotionValue(-1000)
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(59,130,246,.13), transparent 65%)`
  const words = ['Pricing', 'that', 'scales', 'with', 'every', 'camera.']
  return (
    <section
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); sx.set(e.clientX - r.left); sy.set(e.clientY - r.top) }}
      className="relative isolate overflow-hidden pb-16 pt-36 lg:pb-20 lg:pt-44"
    >
      <HeroBackdrop spotlight={spotlight} />
      <Container className="relative text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}><Eyebrow>Pricing</Eyebrow></motion.div>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
          <span className="sr-only">{words.join(' ')}</span>
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom" aria-hidden="true">
              <motion.span
                className={`inline-block ${i >= 4 ? 'text-gradient' : ''}`}
                initial={{ y: '110%', rotateX: -60, opacity: 0 }}
                animate={{ y: 0, rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.07 }}
              >
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.5 }} className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg">
          Pay only for the cameras you connect. Unlimited employees, users and mobile apps on every plan — and a free pilot to prove it works.
        </motion.p>
        <motion.ul initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } } }} className="mt-9 flex flex-wrap justify-center gap-2.5">
          {[[BadgeCheck, '14-day free pilot'], [CreditCard, 'No credit card'], [ShieldCheck, 'Cancel anytime'], [Calculator, 'Instant cost estimate']].map(([Icon, t]) => (
            <motion.li key={t} variants={{ hidden: { opacity: 0, y: 10, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-fg/85 backdrop-blur">
              <Icon className="h-4 w-4 text-cyan" aria-hidden="true" />{t}
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  )
}

/* ── Interactive cost calculator ── */
function CostCalculator() {
  const [cams, setCams] = useState(24)
  const [yearly, setYearly] = useState(true)
  const [manualPlan, setManualPlan] = useState(null)
  const [addons, setAddons] = useState({ retention: false, sms: true, edge: false, support: false })

  const autoPlan = cams <= 10 ? 'starter' : cams <= 100 ? 'business' : 'enterprise'
  // a manual choice only sticks while it can still hold this many cameras
  const planKey = manualPlan && !(manualPlan === 'starter' && cams > 10) && !(manualPlan === 'business' && cams > 100) ? manualPlan : autoPlan
  const plan = PLANS.find((p) => p.key === planKey)

  const calc = useMemo(() => {
    if (plan.custom) return null
    const rate = yearly ? plan.y : plan.m
    const base = rate * cams
    const items = [{ k: `${plan.name} · ${cams} × $${rate}`, v: base, c: '#3B82F6' }]
    if (addons.retention) items.push({ k: `Extended recording · ${cams} × $8`, v: cams * 8, c: '#22D3EE' })
    if (addons.sms) items.push({ k: 'SMS & voice alerts', v: 29, c: '#A78BFA' })
    if (addons.support) items.push({ k: 'Priority support', v: 149, c: '#34D399' })
    const monthly = items.reduce((a, b) => a + b.v, 0)
    const boxes = Math.ceil(cams / 16)
    const oneTime = addons.edge ? boxes * 690 : 0
    const savings = yearly ? (plan.m - plan.y) * cams * 12 : 0
    return { items, monthly, yearlyTotal: monthly * 12, oneTime, boxes, savings, perCam: monthly / cams }
  }, [plan, cams, yearly, addons])

  const step = (d) => setCams((c) => Math.min(150, Math.max(1, c + d)))
  const pct = ((cams - 1) / 149) * 100

  return (
    <section id="calculator" className="relative py-24 lg:py-32">
      <div className="absolute left-1/2 top-1/3 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" aria-hidden="true" />
      <Container className="relative">
        <SectionHeader eyebrow="Cost calculator" title={<>Estimate your cost <span className="text-gradient">in seconds.</span></>} sub="Move the slider, pick add-ons and see exactly what you'd pay. No sales call needed." />

        <Reveal y={50} className="mt-14">
          <BeamBorder speed="9s" className="shadow-[0_40px_120px_-40px_rgba(59,130,246,.5)]">
            <div className="grid overflow-hidden rounded-2xl bg-[#0B0F1B] lg:grid-cols-[1.2fr_1fr]">
              {/* inputs */}
              <div className="space-y-8 p-6 sm:p-10">
                <div>
                  <div className="flex items-end justify-between">
                    <label htmlFor="cams" className="text-sm font-medium">Number of cameras</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => step(-1)} aria-label="One camera fewer" className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line hover:bg-white/5"><Minus className="h-4 w-4" /></button>
                      <motion.span key={cams} initial={{ scale: 1.25, color: '#22D3EE' }} animate={{ scale: 1, color: '#F8FAFC' }} className="w-14 text-center font-display text-3xl font-semibold tabular-nums">{cams}</motion.span>
                      <button onClick={() => step(1)} aria-label="One camera more" className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line hover:bg-white/5"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <input
                    id="cams" type="range" min="1" max="150" value={cams}
                    onChange={(e) => setCams(+e.target.value)}
                    className="range mt-5 w-full"
                    style={{ '--pct': `${pct}%` }}
                  />
                  <div className="mt-2 flex justify-between font-mono text-[11px] text-muted"><span>1</span><span>10 · Starter</span><span>100 · Business</span><span>150+</span></div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Plan</p>
                    <div className="inline-flex rounded-lg border border-line bg-surface p-0.5" role="group" aria-label="Plan">
                      {PLANS.map((p) => {
                        const disabled = (p.key === 'starter' && cams > 10) || (p.key === 'business' && cams > 100)
                        const on = planKey === p.key
                        return (
                          <button key={p.key} disabled={disabled} aria-pressed={on} onClick={() => setManualPlan(p.key)} className={`relative min-h-9 cursor-pointer rounded-md px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${on ? 'text-white' : 'text-muted hover:text-fg'}`}>
                            {on && <motion.span layoutId="calc-plan" className="absolute inset-0 rounded-md bg-accent" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                            <span className="relative">{p.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Billing</p>
                    <div className="inline-flex rounded-lg border border-line bg-surface p-0.5" role="group" aria-label="Billing">
                      {[['Monthly', false], ['Yearly −20%', true]].map(([l, v]) => (
                        <button key={l} aria-pressed={yearly === v} onClick={() => setYearly(v)} className={`relative min-h-9 cursor-pointer rounded-md px-3.5 text-sm font-medium transition-colors ${yearly === v ? 'text-white' : 'text-muted hover:text-fg'}`}>
                          {yearly === v && <motion.span layoutId="calc-bill" className="absolute inset-0 rounded-md bg-accent" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                          <span className="relative">{l}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-3 text-sm font-medium">Add-ons</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ADDONS.map((a) => {
                      const on = addons[a.key]
                      return (
                        <label key={a.key} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all duration-300 ${on ? 'border-accent/60 bg-accent/10' : 'border-line bg-card hover:border-white/20'}`}>
                          <input type="checkbox" checked={on} onChange={() => setAddons((s) => ({ ...s, [a.key]: !s[a.key] }))} className="sr-only" />
                          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${on ? 'border-accent bg-accent' : 'border-line'}`}>
                            <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="h-3.5 w-3.5 text-white" /></motion.span>}</AnimatePresence>
                          </span>
                          <span>
                            <span className="block text-sm font-medium">{a.name}</span>
                            <span className="block font-mono text-[11px] text-muted">${a.price} {a.per === 'camera' ? '/ camera / mo' : a.per === 'month' ? '/ mo' : 'one-time / box'}</span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              </div>

              {/* result */}
              <div className="relative border-t border-line bg-gradient-to-b from-[#101A33] to-[#0B0F1B] p-6 sm:p-10 lg:border-l lg:border-t-0">
                <AnimatePresence mode="wait">
                  {calc ? (
                    <motion.div key="calc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <p className="font-mono text-xs uppercase tracking-wider text-muted">Estimated {yearly ? 'monthly (billed yearly)' : 'monthly'}</p>
                      <p className="mt-2 font-display text-5xl font-bold sm:text-6xl"><AnimatedNumber value={calc.monthly} /><span className="text-lg font-medium text-muted">/mo</span></p>
                      <p className="mt-2 text-sm text-muted">≈ <AnimatedNumber value={calc.perCam} format={(v) => `$${v.toFixed(2)}`} className="text-fg" /> per camera · <AnimatedNumber value={calc.yearlyTotal} className="text-fg" /> per year</p>

                      {/* stacked breakdown bar */}
                      <div className="mt-7 flex h-3 overflow-hidden rounded-full bg-white/10">
                        {calc.items.map((it) => (
                          <motion.span key={it.k.split('·')[0]} layout className="h-full" style={{ background: it.c, width: `${(it.v / calc.monthly) * 100}%` }} transition={{ duration: 0.5, ease }} />
                        ))}
                      </div>
                      <ul className="mt-5 space-y-2.5">
                        <AnimatePresence initial={false}>
                          {calc.items.map((it) => (
                            <motion.li key={it.k.split('·')[0]} layout initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex items-center justify-between gap-3 text-sm">
                              <span className="flex min-w-0 items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: it.c }} /><span className="truncate text-muted">{it.k}</span></span>
                              <AnimatedNumber value={it.v} className="font-mono" />
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>

                      <AnimatePresence>
                        {calc.oneTime > 0 && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden rounded-lg border border-line bg-white/[.03] px-3 py-2 text-sm text-muted">
                            + one-time <span className="text-fg">{money(calc.oneTime)}</span> for {calc.boxes} Edge AI box{calc.boxes > 1 ? 'es' : ''}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <AnimatePresence>
                        {calc.savings > 0 && (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mt-4 flex items-center gap-2 rounded-lg bg-ok/10 px-3 py-2 text-sm text-ok">
                            <Sparkles className="h-4 w-4" aria-hidden="true" /> You save <AnimatedNumber value={calc.savings} className="font-semibold" /> a year with yearly billing
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Button href="#contact" className="mt-7 w-full">Start free 14-day pilot</Button>
                    </motion.div>
                  ) : (
                    <motion.div key="ent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex h-full flex-col justify-center">
                      <p className="font-mono text-xs uppercase tracking-wider text-muted">{cams}+ cameras</p>
                      <p className="mt-2 font-display text-4xl font-bold">Enterprise pricing</p>
                      <p className="mt-3 text-muted">At this size you get volume discounts, on-premise options and a custom AI model. We'll prepare a tailored quote within one business day.</p>
                      <Button href="#contact" className="mt-7 w-full">Get a custom quote</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="mt-4 text-center text-xs text-muted">Estimates exclude taxes. Final pricing confirmed in your quote.</p>
              </div>
            </div>
          </BeamBorder>
        </Reveal>
      </Container>
    </section>
  )
}

/* ── Feature comparison table ── */
function Cell({ v }) {
  if (v === true) return <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-ok/15 text-ok"><Check className="h-3.5 w-3.5" aria-label="Included" /></span>
  if (v === false) return <span className="mx-auto grid h-6 w-6 place-items-center text-white/20"><X className="h-3.5 w-3.5" aria-label="Not included" /></span>
  return <span className="font-mono text-xs text-fg/90">{v}</span>
}

function CompareTable() {
  const [closed, setClosed] = useState({})
  const [diffOnly, setDiffOnly] = useState(false)
  const toggle = (g) => setClosed((c) => ({ ...c, [g]: !c[g] }))
  const differs = (r) => !(r[1] === r[2] && r[2] === r[3])

  return (
    <section id="compare" className="relative border-y border-line/70 bg-surface/60 py-24 lg:py-32">
      <Container>
        <SectionHeader eyebrow="Compare plans" title={<>Every feature, <span className="text-gradient">side by side.</span></>} />
        <Reveal className="mt-10 flex justify-center">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-muted">
            <button
              role="switch"
              aria-checked={diffOnly}
              onClick={() => setDiffOnly((d) => !d)}
              className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${diffOnly ? 'bg-accent' : 'bg-white/15'}`}
            >
              <motion.span layout className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${diffOnly ? 'right-0.5' : 'left-0.5'}`} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </button>
            Show only differences
          </label>
        </Reveal>

        <Reveal className="mt-8">
          <div className="overflow-x-auto rounded-2xl border border-line bg-card lg:overflow-visible" data-lenis-prevent>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="lg:sticky lg:top-16 lg:z-10">
                <tr className="bg-[#0F131F]/95 backdrop-blur">
                  <th className="w-[40%] rounded-tl-2xl px-5 py-4 font-normal text-muted">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.key} className={`px-4 py-4 text-center ${p.popular ? 'bg-accent/10' : ''} ${p.key === 'enterprise' ? 'rounded-tr-2xl' : ''}`}>
                      <span className="block font-display text-base font-semibold">{p.name}</span>
                      <span className="block font-mono text-[11px] font-normal text-muted">{p.custom ? 'Custom' : `from $${p.y}/cam`}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((g) => {
                  const rows = diffOnly ? g.rows.filter(differs) : g.rows
                  const open = !closed[g.group]
                  return (
                    <Fragment key={g.group}>
                      <tr className="border-t border-line">
                        <td colSpan={4} className="p-0">
                          <button onClick={() => toggle(g.group)} aria-expanded={open} className="flex w-full cursor-pointer items-center gap-2 px-5 py-3.5 text-left font-mono text-xs uppercase tracking-wider text-cyan hover:bg-white/[.02]">
                            <motion.span animate={{ rotate: open ? 0 : -90 }}><ChevronDown className="h-4 w-4" aria-hidden="true" /></motion.span>
                            {g.group} <span className="text-muted">· {rows.length}</span>
                          </button>
                        </td>
                      </tr>
                      <AnimatePresence initial={false}>
                        {open && rows.map((r) => (
                          <motion.tr
                            key={r[0]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="group border-t border-line/50 transition-colors hover:bg-white/[.03]"
                          >
                            <td className="px-5 py-3 text-fg/90">{r[0]}</td>
                            {[1, 2, 3].map((i) => (
                              <td key={i} className={`px-4 py-3 text-center ${i === 2 ? 'bg-accent/[.06] group-hover:bg-accent/10' : ''}`}><Cell v={r[i]} /></td>
                            ))}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ── Add-ons ── */
function Addons() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <SectionHeader eyebrow="Add-ons" title={<>Extend any plan <span className="text-gradient">when you need it.</span></>} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADDONS.map((a, i) => (
            <motion.div key={a.key} initial={{ opacity: 0, y: 50, rotateX: 15 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease, delay: i * 0.08 }} className="[perspective:1200px]">
              <SpotlightCard className="flex h-full flex-col p-6">
                <p className="font-display text-3xl font-semibold">${a.price}</p>
                <p className="font-mono text-[11px] text-muted">{a.per === 'camera' ? 'per camera / month' : a.per === 'month' ? 'per month' : 'one-time, per box'}</p>
                <h3 className="mt-5 font-semibold">{a.name}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{a.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default function PricingPage() {
  useEffect(() => {
    document.title = `Pricing — ${BRAND.name} ${BRAND.suffix}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Simple per-camera pricing for AI security, face-recognition attendance and employee tracking. Estimate your cost and compare plans.')
  }, [])
  return (
    <>
      <Hero />
      <Pricing id="plans" header={false} compareLink={false} />
      <CostCalculator />
      <CompareTable />
      <Addons />
      <Faq items={PRICING_FAQS} title="Pricing questions, answered." />
      <Contact />
    </>
  )
}
