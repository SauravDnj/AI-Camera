import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Briefcase, CalendarDays, Check, Clock, Handshake, LifeBuoy, Mail, MapPin, MessageSquare, Newspaper, Phone, Sparkles, Video,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import HeroBackdrop from '../components/hero/HeroBackdrop'
import { BeamBorder, Container, Eyebrow, Reveal, SectionHeader, SpotlightCard, ease } from '../components/ui'
import { BRAND } from '../config'
import { OFFICES } from '../data/about'
import Faq from '../sections/Faq'
import { lenisRef } from '../lib/scroll'

const TOPICS = [
  { key: 'demo', icon: Video, t: 'Book a demo', d: '30-min live demo on your cameras', rgb: '59,130,246' },
  { key: 'sales', icon: Briefcase, t: 'Sales & pricing', d: 'Quotes, plans and volume pricing', rgb: '34,211,238' },
  { key: 'support', icon: LifeBuoy, t: 'Customer support', d: 'Help with an existing account', rgb: '52,211,153' },
  { key: 'partner', icon: Handshake, t: 'Partnerships', d: 'Integrators, resellers, camera vendors', rgb: '167,139,250' },
  { key: 'careers', icon: Sparkles, t: 'Careers', d: 'Join the team', rgb: '251,191,36' },
  { key: 'press', icon: Newspaper, t: 'Press & media', d: 'Interviews and brand assets', rgb: '248,113,113' },
]
const SOLUTION_CHIPS = ['AI Security', 'Smart Attendance', 'Employee Tracking', 'Not sure yet']
const CAM_RANGES = ['1–10', '11–50', '51–100', '100+']

const CONTACT_FAQS = [
  { q: 'How fast will you reply?', a: 'Sales and demo requests get a reply within one business day — usually within a few hours. Support tickets on paid plans are answered within 4 hours (1 hour with Priority support).' },
  { q: 'What happens in a demo?', a: 'A 30-minute video call. We connect one of your cameras (or use ours), enroll a few test users and show live attendance, tracking and security alerts. No preparation needed.' },
  { q: 'Do I need to share camera footage?', a: 'No. For the demo we can use our own test cameras. If you choose to connect yours, video is processed securely and deleted after the session.' },
  { q: 'What are your support hours?', a: 'Live chat and phone support run Monday–Friday, 08:00–20:00 in your region across our four offices. Critical security incidents are handled 24/7.' },
]

/* ── helpers ── */
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '')

function nextWeekdays(n) {
  const out = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  while (out.length < n) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d))
  }
  return out
}
const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
// deterministic "already booked" slots so the picker feels real
const isBooked = (day, slot) => (day.getDate() * 7 + SLOTS.indexOf(slot) * 3) % 5 === 0

function useNow(ms = 1000) {
  const [d, setD] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setD(new Date()), ms); return () => clearInterval(t) }, [ms])
  return d
}

/* ── Hero ── */
function Hero({ pick }) {
  const sx = useMotionValue(-1000)
  const sy = useMotionValue(-1000)
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(59,130,246,.13), transparent 65%)`
  const words = ['Let’s', 'talk', 'about', 'your', 'cameras.']
  return (
    <section
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); sx.set(e.clientX - r.left); sy.set(e.clientY - r.top) }}
      className="relative isolate overflow-hidden pb-16 pt-36 lg:pb-20 lg:pt-40"
    >
      <HeroBackdrop spotlight={spotlight} />
      <Container className="relative">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}><Eyebrow>Contact us</Eyebrow></motion.div>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="sr-only">{words.join(' ')}</span>
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom" aria-hidden="true">
                <motion.span className={`inline-block ${i >= 3 ? 'text-gradient' : ''}`} initial={{ y: '110%', rotateX: -60, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }} transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.08 }}>
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.5 }} className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg">
            Pick what you need and we'll route you to the right team. Real people reply — usually within a few hours.
          </motion.p>
        </div>

        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.6 } } }}
          className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 lg:grid-cols-3"
        >
          {TOPICS.map((t) => (
            <motion.div key={t.key} variants={{ hidden: { opacity: 0, y: 24, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } } }}>
              <SpotlightCard as="button" type="button" onClick={() => pick(t.key)} rgb={t.rgb} className="h-full w-full cursor-pointer p-4 text-left sm:p-5">
                <span className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ background: `rgba(${t.rgb},.12)`, color: `rgb(${t.rgb})` }}>
                    <t.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold sm:text-base">{t.t}</span>
                    <span className="mt-0.5 block text-xs text-muted sm:text-sm">{t.d}</span>
                  </span>
                </span>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

/* ── Form pieces ── */
function Field({ id, label, error, required, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">{label}{required && <span className="text-danger"> *</span>}{hint && <span className="font-normal text-muted"> {hint}</span>}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1.5 text-sm text-danger">{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
const inputCls = (err) => `min-h-12 w-full rounded-xl border bg-card px-4 text-base text-fg outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30 ${err ? 'border-danger' : 'border-line'}`

function Chip({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className={`relative min-h-10 cursor-pointer rounded-full border px-4 text-sm transition-colors ${on ? 'border-accent bg-accent/15 text-fg' : 'border-line text-muted hover:border-white/25 hover:text-fg'}`}>
      <span className="flex items-center gap-1.5">
        <AnimatePresence initial={false}>{on && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }}><Check className="h-3.5 w-3.5 text-cyan" aria-hidden="true" /></motion.span>}</AnimatePresence>
        {children}
      </span>
    </button>
  )
}

function SlotPicker({ value, onChange, error }) {
  const days = useMemo(() => nextWeekdays(10), [])
  const [day, setDay] = useState(() => (value ? days.findIndex((d) => d.toDateString() === value.day) : 0))
  const d = days[Math.max(0, day)]
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return (
    <div>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" data-lenis-prevent role="listbox" aria-label="Choose a day">
        {days.map((x, i) => {
          const on = i === day
          return (
            <button key={i} type="button" role="option" aria-selected={on} onClick={() => setDay(i)} className={`relative flex min-w-[64px] shrink-0 cursor-pointer flex-col items-center rounded-xl border px-3 py-2.5 transition-colors ${on ? 'border-accent text-fg' : 'border-line text-muted hover:border-white/25'}`}>
              {on && <motion.span layoutId="day-pill" className="absolute inset-0 rounded-xl bg-accent/15" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="relative font-mono text-[10px] uppercase">{x.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="relative font-display text-xl font-semibold">{x.getDate()}</span>
              <span className="relative text-[10px]">{x.toLocaleDateString('en-US', { month: 'short' })}</span>
            </button>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={day} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {SLOTS.map((s, i) => {
            const booked = isBooked(d, s)
            const on = value?.day === d.toDateString() && value?.slot === s
            return (
              <motion.button
                key={s} type="button" disabled={booked}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                onClick={() => onChange({ day: d.toDateString(), slot: s, label: `${d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · ${s}` })}
                aria-pressed={on}
                className={`min-h-10 cursor-pointer rounded-lg border font-mono text-sm transition-all disabled:cursor-not-allowed disabled:line-through disabled:opacity-30 ${on ? 'border-accent bg-accent text-white shadow-[0_0_20px_-4px_rgba(59,130,246,.8)]' : 'border-line hover:border-accent/50 hover:bg-accent/10'}`}
              >
                {s}
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>
      <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted"><Clock className="h-3.5 w-3.5" aria-hidden="true" />Times shown in {tz} · 30 min</p>
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  )
}

/* ── Success burst ── */
function Burst() {
  const reduce = useReducedMotion()
  if (reduce) return null
  const parts = Array.from({ length: 18 }, (_, i) => ({ a: (i / 18) * Math.PI * 2, c: ['#3B82F6', '#22D3EE', '#34D399', '#A78BFA', '#FBBF24'][i % 5], d: 70 + (i % 4) * 18 }))
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
      {parts.map((p, i) => (
        <motion.span key={i} className="absolute h-2 w-2 rounded-full" style={{ background: p.c }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(p.a) * p.d, y: Math.sin(p.a) * p.d, opacity: 0, scale: 0.3 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }} />
      ))}
    </div>
  )
}

/* ── Multi-step form ── */
function ContactForm({ topic, setTopic }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [v, setV] = useState({ solutions: [], cams: '11–50', method: 'Email' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const top = useRef(null)

  const T = TOPICS.find((t) => t.key === topic)
  const isDemo = topic === 'demo'
  const business = ['demo', 'sales', 'partner'].includes(topic)
  const steps = ['Topic', 'Your details', isDemo ? 'Pick a time' : 'Message', 'Review']
  const set = (k, val) => { setV((s) => ({ ...s, [k]: val })); if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined })) }

  // jump straight to details when a topic is chosen from outside (hero cards / ?topic=)
  useEffect(() => { if (topic && step === 0) { setDir(1); setStep(1) } }, [topic]) // eslint-disable-line react-hooks/exhaustive-deps

  const validate = (s) => {
    const e = {}
    if (s === 0 && !topic) e.topic = 'Choose what you’d like to talk about.'
    if (s === 1) {
      if (!v.name?.trim()) e.name = 'Please enter your name.'
      if (!emailOk(v.email)) e.email = v.email ? 'That email address doesn’t look right.' : 'Please enter your email.'
      if (business && !v.company?.trim()) e.company = 'Please enter your company.'
    }
    if (s === 2) {
      if (isDemo && !v.slot) e.slot = 'Pick a time that works for you.'
      if (!isDemo && (v.message?.trim().length || 0) < 10) e.message = 'Tell us a little more (at least 10 characters).'
    }
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) setTimeout(() => document.getElementById(`cf-${first}`)?.focus(), 50)
    return !first
  }
  const go = (n) => {
    if (n > step && !validate(step)) return
    setDir(n > step ? 1 : -1)
    setStep(n)
    const el = top.current
    if (el && el.getBoundingClientRect().top < 0) (lenisRef.current ? lenisRef.current.scrollTo(el, { offset: -90 }) : el.scrollIntoView())
  }
  const submit = async () => {
    setStatus('sending')
    // TODO: send `v` + `topic` to your backend / CRM here.
    await new Promise((r) => setTimeout(r, 1300))
    setStatus('sent')
  }
  const reset = () => { setV({ solutions: [], cams: '11–50', method: 'Email' }); setTopic(null); setStep(0); setStatus('idle'); setErrors({}) }

  const slide = {
    enter: (d) => ({ opacity: 0, x: d * 40, filter: 'blur(4px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
    exit: (d) => ({ opacity: 0, x: d * -40, filter: 'blur(4px)', transition: { duration: 0.18 } }),
  }

  if (status === 'sent') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative flex flex-col items-center py-14 text-center" role="status">
        <div className="relative">
          <Burst />
          <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="relative grid h-20 w-20 place-items-center rounded-full bg-ok/15 text-ok">
            <motion.span className="absolute inset-0 rounded-full border-2 border-ok" initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 1.2, repeat: 2 }} />
            <Check className="h-10 w-10" aria-hidden="true" />
          </motion.span>
        </div>
        <h3 className="mt-7 text-2xl font-semibold sm:text-3xl">{isDemo ? 'Your demo is booked!' : 'Message sent!'}</h3>
        <p className="mt-2 max-w-md text-muted">
          Thanks, {v.name?.split(' ')[0]}. {isDemo ? <>We'll send a calendar invite for <span className="text-fg">{v.slot?.label}</span> to {v.email}.</> : <>The {T?.t.toLowerCase()} team will reply to {v.email} soon.</>}
        </p>
        <button onClick={reset} className="mt-8 min-h-11 cursor-pointer rounded-xl border border-line px-5 text-sm hover:bg-white/5">Send another message</button>
      </motion.div>
    )
  }

  return (
    <div ref={top}>
      {/* stepper */}
      <ol className="flex items-center gap-2" aria-label="Form progress">
        {steps.map((s, i) => {
          const done = i < step
          const cur = i === step
          return (
            <li key={s} className="flex flex-1 items-center gap-2">
              <button type="button" onClick={() => i < step && go(i)} disabled={i > step} aria-current={cur ? 'step' : undefined} className={`flex items-center gap-2 ${i < step ? 'cursor-pointer' : 'cursor-default'}`}>
                <motion.span animate={{ scale: cur ? 1.08 : 1 }} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors ${done ? 'border-ok bg-ok text-black' : cur ? 'border-accent bg-accent text-white shadow-[0_0_18px_-2px_rgba(59,130,246,.8)]' : 'border-line text-muted'}`}>
                  {done ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
                </motion.span>
                <span className={`hidden text-sm sm:inline ${cur ? 'text-fg' : 'text-muted'}`}>{s}</span>
              </button>
              {i < steps.length - 1 && (
                <span className="relative h-px flex-1 overflow-hidden bg-line">
                  <motion.span className="absolute inset-0 origin-left bg-gradient-to-r from-ok to-accent" animate={{ scaleX: done ? 1 : 0 }} transition={{ duration: 0.5, ease }} />
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <div className="relative mt-8 min-h-[380px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step + (topic || '')} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease }}>
            {step === 0 && (
              <div>
                <h3 className="text-xl font-semibold">What can we help with?</h3>
                <div className="mt-5 grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Topic">
                  {TOPICS.map((t) => {
                    const on = topic === t.key
                    return (
                      <button key={t.key} id={t.key === 'demo' ? 'cf-topic' : undefined} type="button" role="radio" aria-checked={on} onClick={() => { setTopic(t.key); setErrors({}) }}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${on ? 'bg-white/[.05]' : 'border-line hover:border-white/25'}`}
                        style={on ? { borderColor: `rgb(${t.rgb})`, boxShadow: `0 0 0 1px rgb(${t.rgb}), 0 10px 30px -12px rgba(${t.rgb},.7)` } : undefined}
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: `rgba(${t.rgb},.12)`, color: `rgb(${t.rgb})` }}><t.icon className="h-4 w-4" aria-hidden="true" /></span>
                        <span><span className="block text-sm font-medium">{t.t}</span><span className="block text-xs text-muted">{t.d}</span></span>
                      </button>
                    )
                  })}
                </div>
                {errors.topic && <p className="mt-3 text-sm text-danger">{errors.topic}</p>}
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="cf-name" label="Full name" required error={errors.name}>
                  <input id="cf-name" autoComplete="name" value={v.name || ''} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cf-name-err' : undefined} className={inputCls(errors.name)} />
                </Field>
                <Field id="cf-email" label="Work email" required error={errors.email}>
                  <input id="cf-email" type="email" autoComplete="email" value={v.email || ''} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cf-email-err' : undefined} className={inputCls(errors.email)} />
                </Field>
                <Field id="cf-company" label="Company" required={business} error={errors.company}>
                  <input id="cf-company" autoComplete="organization" value={v.company || ''} onChange={(e) => set('company', e.target.value)} aria-invalid={!!errors.company} className={inputCls(errors.company)} />
                </Field>
                <Field id="cf-phone" label="Phone" hint="(optional)">
                  <input id="cf-phone" type="tel" autoComplete="tel" value={v.phone || ''} onChange={(e) => set('phone', e.target.value)} className={inputCls()} />
                </Field>
                {business && (
                  <>
                    <div className="sm:col-span-2">
                      <p className="mb-2 text-sm font-medium">How many cameras?</p>
                      <div className="flex flex-wrap gap-2">{CAM_RANGES.map((c) => <Chip key={c} on={v.cams === c} onClick={() => set('cams', c)}>{c}</Chip>)}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="mb-2 text-sm font-medium">Interested in</p>
                      <div className="flex flex-wrap gap-2">
                        {SOLUTION_CHIPS.map((c) => (
                          <Chip key={c} on={v.solutions.includes(c)} onClick={() => set('solutions', v.solutions.includes(c) ? v.solutions.filter((x) => x !== c) : [...v.solutions, c])}>{c}</Chip>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 2 && (
              isDemo ? (
                <div id="cf-slot" tabIndex={-1} className="outline-none">
                  <h3 className="flex items-center gap-2 text-xl font-semibold"><CalendarDays className="h-5 w-5 text-accent" aria-hidden="true" />Pick a time for your demo</h3>
                  <div className="mt-5"><SlotPicker value={v.slot} onChange={(s) => set('slot', s)} error={errors.slot} /></div>
                  <Field id="cf-message" label="Anything we should prepare?" hint="(optional)">
                    <textarea id="cf-message" rows={3} value={v.message || ''} onChange={(e) => set('message', e.target.value)} className="mt-5 w-full rounded-xl border border-line bg-card px-4 py-3 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
                  </Field>
                </div>
              ) : (
                <div className="space-y-5">
                  <Field id="cf-message" label="Your message" required error={errors.message}>
                    <textarea id="cf-message" rows={6} value={v.message || ''} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} className={`${inputCls(errors.message)} py-3`} placeholder={topic === 'support' ? 'Describe the issue, and your account or camera ID if you have it.' : ''} />
                    <p className="mt-1 text-right font-mono text-[11px] text-muted">{(v.message || '').length} characters</p>
                  </Field>
                  <div>
                    <p className="mb-2 text-sm font-medium">Preferred reply</p>
                    <div className="flex flex-wrap gap-2">{['Email', 'Phone call', 'Video call'].map((m) => <Chip key={m} on={v.method === m} onClick={() => set('method', m)}>{m}</Chip>)}</div>
                  </div>
                </div>
              )
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-semibold">Check everything looks right</h3>
                <dl className="mt-5 divide-y divide-line rounded-xl border border-line bg-card">
                  {[
                    ['Topic', T?.t, 0],
                    ['Name', v.name, 1], ['Email', v.email, 1], ['Company', v.company || '—', 1], ['Phone', v.phone || '—', 1],
                    ...(business ? [['Cameras', v.cams, 1], ['Interested in', v.solutions.join(', ') || '—', 1]] : []),
                    ...(isDemo ? [['Demo time', v.slot?.label, 2]] : [['Reply by', v.method, 2]]),
                    ['Message', v.message || '—', 2],
                  ].map(([k, val, s], i) => (
                    <motion.div key={k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="group flex items-start justify-between gap-4 px-4 py-3">
                      <dt className="shrink-0 text-sm text-muted">{k}</dt>
                      <dd className="flex min-w-0 items-start gap-3 text-right text-sm">
                        <span className="break-words">{val}</span>
                        <button type="button" onClick={() => go(s)} className="shrink-0 cursor-pointer text-xs text-cyan opacity-70 hover:opacity-100">Edit</button>
                      </dd>
                    </motion.div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-muted">By sending you agree to be contacted about this request. We never share your details.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm text-muted transition-colors hover:text-fg disabled:invisible">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />Back
        </button>
        {step < 3 ? (
          <button type="button" onClick={() => go(step + 1)} className="group flex min-h-12 cursor-pointer items-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(59,130,246,.8)] transition-colors hover:bg-blue-500">
            Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={status === 'sending'} className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl bg-ok px-6 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(52,211,153,.8)] transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70">
            {status === 'sending' ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />Sending…</> : <>{isDemo ? 'Confirm booking' : 'Send message'} <Check className="h-4 w-4" aria-hidden="true" /></>}
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Side panel ── */
function SidePanel() {
  const now = useNow(30000)
  const h = now.getHours()
  const online = now.getDay() !== 0 && now.getDay() !== 6 && h >= 8 && h < 20
  const items = [
    { icon: Mail, t: 'Email', v: BRAND.email, href: `mailto:${BRAND.email}`, s: 'Replies within 1 business day' },
    { icon: Phone, t: 'Phone', v: BRAND.phone, href: `tel:${BRAND.phone.replace(/[^\d+]/g, '')}`, s: 'Mon–Fri · 08:00–20:00' },
    { icon: MessageSquare, t: 'Live chat', v: online ? 'Agents online now' : 'Back tomorrow 08:00', s: online ? 'Average wait < 2 min' : 'Leave a message anytime', live: online },
  ]
  return (
    <div className="space-y-3">
      {items.map((x, i) => (
        <Reveal key={x.t} delay={0.1 + i * 0.08}>
          <SpotlightCard tilt={false} className="p-5">
            <a href={x.href} className={`flex items-start gap-4 ${x.href ? '' : 'pointer-events-none'}`}>
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <x.icon className="h-5 w-5" aria-hidden="true" />
                {x.live && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-ok"><span className="absolute inset-0 animate-ping rounded-full bg-ok" /></span>}
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted">{x.t}</span>
                <span className="block truncate font-semibold">{x.v}</span>
                <span className="block font-mono text-[11px] text-muted">{x.s}</span>
              </span>
            </a>
          </SpotlightCard>
        </Reveal>
      ))}
      <Reveal delay={0.35}>
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="text-sm font-medium">Typical response time</p>
          {[['Demo requests', 2, 'h', 0.25], ['Sales questions', 4, 'h', 0.45], ['Support (paid plans)', 4, 'h', 0.45], ['Critical incidents', 15, 'min', 0.1]].map(([k, n, u, w], i) => (
            <div key={k} className="mt-3">
              <div className="flex justify-between text-xs"><span className="text-muted">{k}</span><span className="font-mono">&lt; {n} {u}</span></div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-ok to-cyan" initial={{ scaleX: 0 }} whileInView={{ scaleX: w }} viewport={{ once: true }} transition={{ duration: 1, ease, delay: 0.2 + i * 0.1 }} />
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}

/* ── Offices + status ── */
function OfficesAndStatus() {
  const now = useNow()
  const days = 60
  const bars = useMemo(() => Array.from({ length: days }, (_, i) => (i === 17 || i === 43 ? 'warn' : 'ok')), [])
  return (
    <section className="relative border-y border-line/70 bg-surface/60 py-24 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeader center={false} eyebrow="Our offices" title={<>Visit us — <span className="text-gradient">or we'll come to you.</span></>} />
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {OFFICES.map((o, i) => {
              const hour = +now.toLocaleString('en-GB', { timeZone: o.tz, hour: '2-digit', hour12: false })
              const open = hour >= 9 && hour < 18
              return (
                <Reveal key={o.city} delay={i * 0.07}>
                  <SpotlightCard rgb={open ? '52,211,153' : '59,130,246'} tilt={false} className="flex items-center justify-between gap-3 p-5">
                    <span>
                      <span className="flex items-center gap-1.5 font-semibold"><MapPin className="h-4 w-4 text-accent" aria-hidden="true" />{o.city}</span>
                      <span className="mt-0.5 block text-xs text-muted">{o.role}</span>
                    </span>
                    <span className="text-right">
                      <span className="block font-mono text-lg tabular-nums">{now.toLocaleTimeString('en-GB', { timeZone: o.tz, hour: '2-digit', minute: '2-digit' })}</span>
                      <span className={`font-mono text-[10px] ${open ? 'text-ok' : 'text-muted'}`}>{open ? '● open' : '○ closed'}</span>
                    </span>
                  </SpotlightCard>
                </Reveal>
              )
            })}
          </div>
        </div>
        <Reveal delay={0.15}>
          <div className="h-full rounded-2xl border border-line bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="font-semibold">System status</p>
              <span className="flex items-center gap-1.5 rounded-full bg-ok/15 px-2.5 py-1 font-mono text-[11px] text-ok"><span className="h-1.5 w-1.5 rounded-full bg-ok blink" />All systems operational</span>
            </div>
            {['Video processing', 'Face recognition API', 'Alerts & notifications', 'Dashboard & mobile apps'].map((s, si) => (
              <div key={s} className="mt-5">
                <div className="flex justify-between text-xs"><span>{s}</span><span className="font-mono text-muted">{(99.9 + si * 0.02).toFixed(2)}%</span></div>
                <div className="mt-2 flex h-6 gap-[2px]" aria-hidden="true">
                  {bars.map((b, i) => (
                    <motion.span key={i} className={`flex-1 origin-bottom rounded-[2px] ${b === 'warn' && si === 0 ? 'bg-warn' : 'bg-ok/70'} hover:bg-ok`}
                      initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: si * 0.1 + i * 0.008 }} />
                  ))}
                </div>
              </div>
            ))}
            <p className="mt-4 font-mono text-[11px] text-muted">Last 60 days</p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export default function ContactPage() {
  const [params, setParams] = useSearchParams()
  const initial = TOPICS.some((t) => t.key === params.get('topic')) ? params.get('topic') : null
  const [topic, setTopicState] = useState(initial)
  const setTopic = (t) => { setTopicState(t); setParams(t ? { topic: t } : {}, { replace: true }) }

  useEffect(() => {
    document.title = `Contact — ${BRAND.name} ${BRAND.suffix}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', `Book a demo, ask about pricing or get support from the ${BRAND.name} ${BRAND.suffix} team.`)
  }, [])

  const pickFromHero = (t) => {
    setTopic(t)
    const el = document.getElementById('contact')
    if (el) lenisRef.current ? lenisRef.current.scrollTo(el, { offset: -80 }) : el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Hero pick={pickFromHero} />
      <section id="contact" className="relative pb-24">
        <Container className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Reveal y={40}>
            <BeamBorder speed="9s" className="shadow-[0_40px_120px_-40px_rgba(59,130,246,.5)]">
              <div className="rounded-2xl bg-[#0B0F1B] p-6 sm:p-10">
                <ContactForm topic={topic} setTopic={setTopic} />
              </div>
            </BeamBorder>
          </Reveal>
          <SidePanel />
        </Container>
      </section>
      <OfficesAndStatus />
      <Faq items={CONTACT_FAQS} title="Before you reach out." />
    </>
  )
}
