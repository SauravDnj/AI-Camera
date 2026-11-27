import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  Activity, Bell, Cctv, ChartBar, Check, Clock, Coffee, LayoutGrid, LogIn, LogOut, MousePointerClick, Search, ShieldX, Siren, Users,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BeamBorder, Container, SectionHeader } from '../components/ui'
import { ALERT_POOL, CAMS, LVL, STATUS } from './dashboard/data'
import { Avatar, Drawer, MiniCam } from './dashboard/parts'
import { AlertsView, AnalyticsView, CamerasView, OverviewView, PeopleView } from './dashboard/views'

const NAV = [
  { key: 'overview', icon: LayoutGrid, label: 'Overview' },
  { key: 'cameras', icon: Cctv, label: 'Cameras' },
  { key: 'people', icon: Users, label: 'People' },
  { key: 'alerts', icon: Bell, label: 'Alerts' },
  { key: 'analytics', icon: ChartBar, label: 'Analytics' },
]
const ease = [0.16, 1, 0.3, 1]
const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

function useClock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i) }, [])
  return t.toLocaleTimeString('en-GB')
}

/* ── Drawer bodies ── */
function AlertDetail({ a, onAck, onResolve, onViewCam }) {
  const L = LVL[a.resolved ? 'ok' : a.lvl]
  const cam = CAMS.find((c) => c.id === a.cam) || CAMS[0]
  const steps = [
    { t: 'Detected by Vision Engine', s: a.time, done: true },
    { t: 'Security team notified', s: 'Push · Slack · SMS', done: true },
    { t: 'Acknowledged', s: a.ack ? 'by You' : 'Waiting…', done: a.ack },
    { t: 'Resolved', s: a.resolved ? 'by You' : 'Open', done: a.resolved },
  ]
  return (
    <div className="space-y-5">
      <MiniCam cam={cam} big alert={!a.resolved && a.lvl === 'critical'} />
      <div>
        <span className={`rounded px-2 py-0.5 font-mono text-[11px] ${L.cls}`}>{a.resolved ? 'Resolved' : L.label}</span>
        <h4 className="mt-2 text-lg font-semibold">{a.t}</h4>
        <p className="font-mono text-xs text-muted">{a.z} · {a.cam} · {a.time}</p>
      </div>
      <ol className="relative space-y-4 border-l border-line pl-5">
        {steps.map((st, i) => (
          <motion.li key={st.t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative">
            <span className={`absolute -left-[27px] top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full border transition-colors ${st.done ? 'border-ok bg-ok' : 'border-line bg-bg'}`}>
              {st.done && <Check className="h-2.5 w-2.5 text-black" aria-hidden="true" />}
            </span>
            <p className="text-sm">{st.t}</p>
            <p className="font-mono text-[11px] text-muted">{st.s}</p>
          </motion.li>
        ))}
      </ol>
      <div className="grid grid-cols-2 gap-2">
        <button disabled={a.ack} onClick={onAck} className="min-h-10 cursor-pointer rounded-lg border border-line text-sm transition-colors hover:bg-white/5 disabled:cursor-default disabled:opacity-40">{a.ack ? 'Acknowledged' : 'Acknowledge'}</button>
        <button disabled={a.resolved} onClick={onResolve} className="min-h-10 cursor-pointer rounded-lg bg-ok text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40">{a.resolved ? 'Resolved' : 'Resolve'}</button>
        <button onClick={onViewCam} className="col-span-2 min-h-10 cursor-pointer rounded-lg border border-accent/40 text-sm text-accent transition-colors hover:bg-accent/10">Open camera wall</button>
      </div>
    </div>
  )
}

function EmployeeDetail({ e }) {
  const S = STATUS[e.status]
  const here = e.in !== '—'
  const week = Array.from({ length: 5 }, (_, i) => 70 + ((e.id.charCodeAt(5 + (i % 3)) * (i + 3)) % 28))
  const timeline = here
    ? [
        { icon: LogIn, t: 'Checked in', s: `${e.in} · Main gate · CAM-01`, c: 'text-ok' },
        { icon: Coffee, t: 'Break', s: '12:31 – 13:04 · Cafeteria', c: 'text-warn' },
        { icon: Activity, t: 'Active at desk', s: `${e.active}% of working time`, c: 'text-cyan' },
        { icon: LogOut, t: 'Expected check-out', s: e.out, c: 'text-muted' },
      ]
    : [{ icon: Clock, t: S.label, s: 'No check-in recorded today', c: 'text-muted' }]
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Avatar name={e.n} size="h-14 w-14 text-base" />
        <div>
          <p className="text-lg font-semibold">{e.n}</p>
          <p className="font-mono text-xs text-muted">{e.id} · {e.d}</p>
          <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${S.cls}`}>{S.label}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[['Check-in', e.in], ['Active', here ? `${e.active}%` : '—'], ['Breaks', here ? `${e.breaks}m` : '—']].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-line bg-surface py-2"><p className="font-display text-lg font-semibold">{v}</p><p className="text-[11px] text-muted">{k}</p></div>
        ))}
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Today</p>
        <ul className="space-y-2">
          {timeline.map((x, i) => (
            <motion.li key={x.t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2">
              <x.icon className={`h-4 w-4 ${x.c}`} aria-hidden="true" />
              <span><span className="block text-sm">{x.t}</span><span className="block font-mono text-[11px] text-muted">{x.s}</span></span>
            </motion.li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Activity this week</p>
        <div className="flex h-20 items-end gap-2">
          {week.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <motion.div className="w-full origin-bottom rounded-t bg-gradient-to-t from-accent/40 to-cyan" style={{ height: `${v}%` }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.6, ease, delay: i * 0.06 }} />
              <span className="text-[10px] text-muted">{['M', 'T', 'W', 'T', 'F'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Section ── */
const DEFAULT_TITLE = <>One dashboard for <span className="text-gradient">security and people.</span></>
const DEFAULT_SUB = "Don't just look — try it. Switch views, open cameras, search employees, resolve alerts or trigger a simulated incident."

/* Reusable on any page: `initialView` picks the starting tab; heading props are optional. */
export default function Dashboard({ id = 'dashboard', initialView = 'overview', eyebrow = 'Command center', title = DEFAULT_TITLE, sub = DEFAULT_SUB }) {
  const reduce = useReducedMotion()
  const win = useRef(null)
  const inView = useInView(win, { margin: '-10%' })
  const { scrollYProgress } = useScroll({ target: win, offset: ['start end', 'start 25%'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [28, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  const y = useTransform(scrollYProgress, [0, 1], [80, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])

  const [view, setView] = useState(initialView)
  const [explored, setExplored] = useState(false)
  const [query, setQuery] = useState('')
  const [alerts, setAlerts] = useState(() => ALERT_POOL.slice(0, 5).map((a, i) => ({ ...a, id: i, time: `09:${String(40 - i * 7).padStart(2, '0')}` })))
  const [drawer, setDrawer] = useState(null) // { type: 'alert', id } | { type: 'employee', e }
  const [incident, setIncident] = useState(false)
  const [toast, setToast] = useState(null)
  const nextId = useRef(100)
  const clock = useClock()

  const go = (v) => { setView(v); setExplored(true) }
  const openCount = alerts.filter((a) => !a.resolved).length
  const unread = alerts.filter((a) => !a.resolved && !a.ack).length
  const alertCams = new Set(alerts.filter((a) => !a.resolved && a.lvl === 'critical').map((a) => a.cam))

  const push = useCallback((a, fresh = true) => {
    const id = nextId.current++
    setAlerts((l) => [{ ...a, id, time: now(), fresh }, ...l].slice(0, 14))
    return id
  }, [])

  // live stream of new events while the dashboard is on screen
  useEffect(() => {
    if (!inView || reduce || drawer) return
    let n = 5
    const t = setInterval(() => { push(ALERT_POOL[n % ALERT_POOL.length]); n++ }, 8000)
    return () => clearInterval(t)
  }, [inView, reduce, drawer, push])

  const simulate = () => {
    const id = push({ t: 'Intrusion detected · after hours', cam: 'CAM-11', z: 'Warehouse A · Floor 2', lvl: 'critical' })
    setIncident(true)
    setToast({ id, t: 'Intrusion detected in Warehouse A', s: 'CAM-11 · security team notified' })
    setTimeout(() => setIncident(false), 2600)
    setTimeout(() => setToast((x) => (x?.id === id ? null : x)), 6000)
  }
  const update = (id, patch) => setAlerts((l) => l.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  const openAlert = (a) => { setDrawer({ type: 'alert', id: a.id }); update(a.id, { fresh: false }) }
  const current = drawer?.type === 'alert' ? alerts.find((a) => a.id === drawer.id) : null

  const viewTitle = NAV.find((n) => n.key === view).label

  return (
    <section id={id} className="relative overflow-x-clip py-24 lg:py-32">
      <div className="absolute left-1/2 top-1/3 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" aria-hidden="true" />
      <Container className="relative">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          sub={sub}
        />

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 flex justify-center">
          <span className="flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-3.5 py-1.5 text-xs text-cyan">
            <MousePointerClick className="h-4 w-4" aria-hidden="true" /> Interactive demo — everything below is clickable
          </span>
        </motion.div>

        <div ref={win} className="mt-6 [perspective:1600px]">
          <motion.div style={reduce ? undefined : { rotateX, scale, y, opacity, transformOrigin: 'center top' }}>
            <BeamBorder speed={incident ? '1.2s' : '8s'} colors={incident ? '#F87171, #F87171' : '#22D3EE, #3B82F6'} className="shadow-[0_40px_120px_-30px_rgba(59,130,246,.45)]">
              <div className="relative overflow-hidden rounded-2xl bg-[#0B0E18]">
                {/* incident flash */}
                <AnimatePresence>
                  {incident && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-50 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.3, 1, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.4 }}
                      style={{ boxShadow: 'inset 0 0 0 2px #F87171, inset 0 0 120px rgba(248,113,113,.35)' }}
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>

                {/* window chrome */}
                <div className="flex items-center gap-2 border-b border-line bg-surface/80 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-danger/70" /><span className="h-3 w-3 rounded-full bg-warn/70" /><span className="h-3 w-3 rounded-full bg-ok/70" />
                  <span className="ml-4 hidden items-center rounded-md bg-card px-3 py-1 font-mono text-xs text-muted sm:flex">
                    app.sentra.ai/
                    <AnimatePresence mode="wait">
                      <motion.span key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="text-fg">{view}</motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="ml-auto font-mono text-xs tabular-nums text-muted">{clock}</span>
                </div>

                <div className="relative flex min-h-[560px] lg:min-h-[680px]">
                  {/* sidebar (desktop) */}
                  <nav className="hidden w-16 shrink-0 flex-col items-center gap-2 border-r border-line bg-surface/60 py-5 md:flex" aria-label="Dashboard views">
                    {NAV.map((n) => {
                      const on = view === n.key
                      return (
                        <button key={n.key} onClick={() => go(n.key)} aria-label={n.label} aria-current={on ? 'page' : undefined} className={`group relative grid h-11 w-11 cursor-pointer place-items-center rounded-lg transition-colors ${on ? 'text-accent' : 'text-muted hover:bg-white/5 hover:text-fg'}`}>
                          {on && <motion.span layoutId="dash-nav" className="absolute inset-0 rounded-lg bg-accent/15 ring-1 ring-accent/40" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                          <n.icon className="relative h-5 w-5" aria-hidden="true" />
                          {n.key === 'alerts' && unread > 0 && (
                            <motion.span key={unread} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 font-mono text-[9px] text-black">{unread}</motion.span>
                          )}
                          {n.key === 'cameras' && !explored && <span className="absolute inset-0 animate-ping rounded-lg ring-2 ring-cyan/60" aria-hidden="true" />}
                          <span className="pointer-events-none absolute left-full z-20 ml-3 whitespace-nowrap rounded-md border border-line bg-[#111827] px-2 py-1 text-xs text-fg opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{n.label}</span>
                        </button>
                      )
                    })}
                  </nav>

                  <div className="min-w-0 flex-1">
                    {/* mobile tabs */}
                    <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 md:hidden" aria-label="Dashboard views" data-lenis-prevent>
                      {NAV.map((n) => (
                        <button key={n.key} onClick={() => go(n.key)} aria-current={view === n.key ? 'page' : undefined} className={`relative flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs ${view === n.key ? 'text-fg' : 'text-muted'}`}>
                          {view === n.key && <motion.span layoutId="dash-nav-m" className="absolute inset-0 rounded-lg bg-accent/15 ring-1 ring-accent/40" />}
                          <n.icon className="relative h-4 w-4" aria-hidden="true" /><span className="relative">{n.label}</span>
                          {n.key === 'alerts' && unread > 0 && <span className="relative rounded-full bg-danger px-1.5 font-mono text-[9px] text-black">{unread}</span>}
                        </button>
                      ))}
                    </nav>

                    {/* app header */}
                    <div className="flex flex-wrap items-center gap-3 border-b border-line/70 px-4 py-3 sm:px-6">
                      <AnimatePresence mode="wait">
                        <motion.h3 key={view} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }} className="mr-auto font-display text-lg font-semibold">{viewTitle}</motion.h3>
                      </AnimatePresence>
                      <label className="relative hidden lg:block">
                        <span className="sr-only">Search employees</span>
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                        <input value={query} onChange={(e) => { setQuery(e.target.value); if (view !== 'people') go('people') }} placeholder="Search people…" className="min-h-9 w-52 rounded-lg border border-line bg-surface pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
                      </label>
                      <button onClick={() => go('alerts')} aria-label={`${unread} unread alerts`} className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line text-muted hover:text-fg">
                        <motion.span key={unread} animate={unread ? { rotate: [0, 18, -18, 10, 0] } : {}} transition={{ duration: 0.6 }}><Bell className="h-4 w-4" aria-hidden="true" /></motion.span>
                        {unread > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 font-mono text-[9px] text-black">{unread}</span>}
                      </button>
                      <button onClick={simulate} className="group flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-3 text-xs font-medium text-danger transition-colors hover:bg-danger/20">
                        <Siren className="h-4 w-4 group-hover:animate-[ring_0.5s_ease-in-out_2]" aria-hidden="true" /> Simulate incident
                      </button>
                    </div>

                    {/* view */}
                    <div className="p-4 sm:p-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={view}
                          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                          exit={{ opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.18 } }}
                          transition={{ duration: 0.4, ease }}
                        >
                          {view === 'overview' && <OverviewView alerts={alerts} openCount={openCount} go={go} openAlert={openAlert} />}
                          {view === 'cameras' && <CamerasView alertCams={alertCams} />}
                          {view === 'people' && <PeopleView query={query} setQuery={setQuery} openEmployee={(e) => setDrawer({ type: 'employee', e })} />}
                          {view === 'alerts' && <AlertsView alerts={alerts} openAlert={openAlert} ackAll={() => setAlerts((l) => l.map((a) => ({ ...a, ack: true, fresh: false })))} />}
                          {view === 'analytics' && <AnalyticsView />}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* drawers */}
                  <Drawer open={!!current} onClose={() => setDrawer(null)} title="Alert details">
                    {current && (
                      <AlertDetail
                        a={current}
                        onAck={() => update(current.id, { ack: true })}
                        onResolve={() => update(current.id, { ack: true, resolved: true })}
                        onViewCam={() => { setDrawer(null); go('cameras') }}
                      />
                    )}
                  </Drawer>
                  <Drawer open={drawer?.type === 'employee'} onClose={() => setDrawer(null)} title="Employee">
                    {drawer?.type === 'employee' && <EmployeeDetail e={drawer.e} />}
                  </Drawer>

                  {/* incident toast */}
                  <AnimatePresence>
                    {toast && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                        className="absolute bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-danger/50 bg-[#1A0F14]/95 p-3 shadow-[0_20px_60px_-10px_rgba(248,113,113,.5)] backdrop-blur"
                      >
                        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-danger/20 text-danger">
                          <ShieldX className="h-5 w-5" aria-hidden="true" />
                          <span className="absolute inset-0 animate-ping rounded-lg border border-danger" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{toast.t}</span>
                          <span className="block truncate font-mono text-[11px] text-muted">{toast.s}</span>
                        </span>
                        <button onClick={() => { const a = alerts.find((x) => x.id === toast.id); if (a) openAlert(a); setToast(null) }} className="min-h-9 shrink-0 cursor-pointer rounded-lg bg-danger px-3 text-xs font-semibold text-black hover:opacity-90">Investigate</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </BeamBorder>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
