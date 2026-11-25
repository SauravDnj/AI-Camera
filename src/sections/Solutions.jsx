import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Activity, Check, ShieldCheck, UserCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BeamBorder, Button, Container, Reveal, SectionHeader, ease } from '../components/ui'

const TABS = [
  {
    key: 'security',
    slug: 'ai-security',
    icon: ShieldCheck,
    label: 'AI Security',
    title: 'A security guard that never blinks',
    desc: 'Every camera becomes an intelligent sensor. Detect intruders, tailgating, loitering and unknown faces the moment they appear — and get the video clip on your phone in under a second.',
    points: ['Intrusion & restricted-zone alerts', 'Unknown / blacklisted face detection', 'Tailgating and after-hours entry', 'Fire, smoke & unattended-object detection', 'Smart search: "red jacket, Gate 2, yesterday"'],
    panel: [
      { k: 'Zone B intrusion', v: 'Critical', c: 'text-danger bg-danger/10' },
      { k: 'Tailgating · Server room', v: 'High', c: 'text-warn bg-warn/10' },
      { k: 'Loitering · Parking P2', v: 'Medium', c: 'text-warn bg-warn/10' },
      { k: 'Visitor badge verified', v: 'Resolved', c: 'text-ok bg-ok/10' },
    ],
  },
  {
    key: 'tracking',
    slug: 'employee-tracking',
    icon: Activity,
    label: 'Employee Tracking',
    title: 'Understand how your workplace really works',
    desc: 'See where teams spend time, how long desks are occupied and how breaks add up — measured by the AI model trained on your own staff, not by manual timesheets.',
    points: ['Live location by floor, zone and desk', 'Active time vs. idle & break time', 'Movement heatmaps and occupancy', 'Productivity trends per team', 'Configurable privacy masking'],
    panel: [
      { k: 'Engineering · Floor 2', v: '92% active', c: 'text-ok bg-ok/10' },
      { k: 'Design · Floor 3', v: '87% active', c: 'text-ok bg-ok/10' },
      { k: 'Support · Floor 1', v: '78% active', c: 'text-warn bg-warn/10' },
      { k: 'Average break', v: '41 min', c: 'text-cyan bg-cyan/10' },
    ],
  },
  {
    key: 'attendance',
    slug: 'smart-attendance',
    icon: UserCheck,
    label: 'Smart Attendance',
    title: 'Attendance that marks itself',
    desc: 'Walk in, get recognised, done. No cards, no queues at a biometric scanner, no buddy punching. Check-in, check-out, late arrivals and overtime are calculated automatically.',
    points: ['Touchless face-recognition check-in', 'Anti-spoofing (photo / video / mask)', 'Shifts, late marks & overtime rules', 'Leave & holiday calendar', 'One-click export to payroll & HRMS'],
    panel: [
      { k: 'Present today', v: '142', c: 'text-ok bg-ok/10' },
      { k: 'Late arrivals', v: '6', c: 'text-warn bg-warn/10' },
      { k: 'On leave', v: '2', c: 'text-cyan bg-cyan/10' },
      { k: 'Absent', v: '0', c: 'text-muted bg-white/5' },
    ],
  },
]

// Per-tab colour theme (r,g,b)
const THEME = { security: '59,130,246', tracking: '34,211,238', attendance: '52,211,153' }
const CYCLE_MS = 7000

export default function Solutions() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true) // auto-advance until the user picks a tab
  const [hovering, setHovering] = useState(false)
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-20%' })
  const tab = TABS[active]
  const rgb = THEME[tab.key]
  const running = auto && !hovering && inView && !reduce

  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => setActive((a) => (a + 1) % TABS.length), CYCLE_MS)
    return () => clearTimeout(t)
  }, [running, active])

  const pick = (i) => { setActive(i); setAuto(false) }

  return (
    <section id="solutions" ref={ref} className="relative overflow-hidden py-24 lg:py-32" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      {/* colour glow that follows the active tab */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[620px] w-[1000px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[150px]"
        animate={{ backgroundColor: `rgba(${rgb},0.13)` }}
        transition={{ duration: 1 }}
        aria-hidden="true"
      />
      <Container>
        <SectionHeader
          eyebrow="One platform · Three solutions"
          title={<>Not just security. <span className="text-gradient">Your whole workforce.</span></>}
          sub="The same cameras that protect your office also run attendance and employee tracking for IT companies, factories, hospitals and retail — no extra hardware."
        />

        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-2 rounded-2xl border border-line bg-surface/80 p-1.5 backdrop-blur" role="tablist" aria-label="Solutions">
            {TABS.map((t, i) => {
              const Icon = t.icon
              const on = i === active
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={on}
                  aria-controls={`panel-${t.key}`}
                  onClick={() => pick(i)}
                  className={`relative flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-4 text-sm font-medium transition-colors duration-200 ${on ? 'text-black/85' : 'text-muted hover:text-fg'}`}
                >
                  {on && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: `rgb(${THEME[t.key]})`, boxShadow: `0 8px 30px -8px rgba(${THEME[t.key]},.7)` }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {on && running && (
                    <motion.span
                      key={`p-${active}`}
                      className="absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-black/40"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                      aria-hidden="true"
                    />
                  )}
                  <Icon className="relative h-4 w-4" aria-hidden="true" />
                  <span className="relative">{t.label}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-12 min-h-[460px] [perspective:1400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.key}
              id={`panel-${tab.key}`}
              role="tabpanel"
              initial={{ opacity: 0, rotateX: -12, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              exit={{ opacity: 0, rotateX: 8, y: -20, filter: 'blur(6px)', transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div>
                <h3 className="text-2xl font-semibold sm:text-3xl">{tab.title}</h3>
                <p className="mt-4 leading-relaxed text-muted">{tab.desc}</p>
                <ul className="mt-7 space-y-3">
                  {tab.points.map((p, i) => (
                    <motion.li key={p} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07, ease }} className="flex items-start gap-3">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.2 + i * 0.07 }}
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                        style={{ background: `rgba(${rgb},.15)`, color: `rgb(${rgb})` }}
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </motion.span>
                      <span className="text-fg/90">{p}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button to={`/solutions/${tab.slug}`} variant="ghost" className="mt-8">Explore {tab.label}</Button>
              </div>

              <BeamBorder colors={`rgb(${rgb}), transparent`} speed="5s">
                <div className="hud-corners relative overflow-hidden rounded-2xl bg-[#0D1120] p-6">
                  <motion.div
                    className="pointer-events-none absolute inset-x-0 top-0 h-24"
                    style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(${rgb},.09), transparent)` }}
                    animate={{ y: ['-100%', '500%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center justify-between border-b border-line pb-4">
                    <p className="font-mono text-xs uppercase tracking-wider text-muted">{tab.label} · live</p>
                    <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: `rgb(${rgb})` }}><span className="h-1.5 w-1.5 rounded-full bg-current blink" />Streaming</span>
                  </div>
                  <ul className="relative mt-4 space-y-3">
                    {tab.panel.map((r, i) => (
                      <motion.li
                        key={r.k}
                        initial={{ opacity: 0, x: 30, scale: 0.97 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.09, type: 'spring', stiffness: 260, damping: 26 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3.5"
                      >
                        <span className="text-sm">{r.k}</span>
                        <span className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium ${r.c}`}>{r.v}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="relative mt-5 flex h-16 items-end gap-1.5" aria-hidden="true">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="flex-1 origin-bottom rounded-sm"
                        style={{ height: `${20 + ((i * 37 + active * 23) % 80)}%`, background: `linear-gradient(to top, rgba(${rgb},.25), rgb(${rgb}))` }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.018, ease }}
                      />
                    ))}
                  </div>
                </div>
              </BeamBorder>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}
