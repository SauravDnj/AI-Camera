import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowRight, ArrowUpDown, Bell, BellOff, Cctv, CheckCheck, Clock, Maximize2, Search, ShieldCheck, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import CameraFeed from '../../components/CameraFeed'
import { CountUp } from '../TrustBar'
import { CAMS, DEPTS, EMPLOYEES, HEAT, LVL, SERIES, STATUS } from './data'
import { Avatar, BarChart, MiniCam, Segmented } from './parts'

const ease = [0.16, 1, 0.3, 1]
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const rise = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }

/* ── Shared: one alert row ── */
function AlertRow({ a, onOpen, compact }) {
  const L = LVL[a.resolved ? 'ok' : a.lvl]
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 30, scale: 0.97 }}
      animate={{ opacity: a.ack && !a.resolved ? 0.6 : 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <button onClick={() => onOpen(a)} className="group flex w-full cursor-pointer items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-left transition-colors hover:border-white/20 hover:bg-white/[.03]">
        <span className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-md ${L.cls}`}>
          <Bell className="h-4 w-4" aria-hidden="true" />
          {a.fresh && !a.ack && <span className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ${L.dot}`}><span className={`absolute inset-0 animate-ping rounded-full ${L.dot}`} /></span>}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm">{a.t}</span>
          <span className="block truncate font-mono text-[11px] text-muted">{a.z} · {a.cam}</span>
        </span>
        {!compact && <span className={`hidden rounded px-1.5 py-0.5 font-mono text-[10px] sm:inline ${L.cls}`}>{a.resolved ? 'Resolved' : a.ack ? 'Ack' : L.label}</span>}
        <span className="font-mono text-[11px] text-muted">{a.time}</span>
      </button>
    </motion.li>
  )
}

/* ═════════════ OVERVIEW ═════════════ */
export function OverviewView({ alerts, openCount, go, openAlert }) {
  const [metric, setMetric] = useState('attendance')
  const [range, setRange] = useState('week')
  const S = SERIES[metric]
  const max = typeof S.max === 'object' ? S.max[range] : S.max
  const kpis = [
    { icon: Users, label: 'Present today', value: <><CountUp value={142} /> / 150</>, delta: '+3 vs yesterday', tone: 'text-ok', to: 'people' },
    { icon: Clock, label: 'Avg. check-in', value: '09:07', delta: '−4 min this week', tone: 'text-accent', to: 'analytics' },
    { icon: ShieldCheck, label: 'Open alerts', value: openCount, delta: openCount ? `${openCount} need attention` : 'All clear', tone: openCount ? 'text-danger' : 'text-ok', to: 'alerts' },
    { icon: Cctv, label: 'Cameras online', value: <><CountUp value={48} /> / 48</>, delta: 'All healthy', tone: 'text-cyan', to: 'cameras' },
  ]
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <motion.button
            key={k.label}
            variants={rise}
            onClick={() => go(k.to)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer rounded-xl border border-line bg-card p-4 text-left transition-colors hover:border-accent/40"
          >
            <span className="flex items-center justify-between">
              <span className="text-xs text-muted">{k.label}</span>
              <k.icon className={`h-4 w-4 ${k.tone}`} aria-hidden="true" />
            </span>
            <motion.span key={String(k.value)} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="mt-2 block font-display text-2xl font-semibold tabular-nums">{k.value}</motion.span>
            <span className="mt-0.5 flex items-center justify-between font-mono text-[11px] text-muted">
              {k.delta}
              <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
            </span>
          </motion.button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <motion.div variants={rise} className="rounded-xl border border-line bg-card p-3">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-sm font-medium">Live · CAM-04</p>
            <button onClick={() => go('cameras')} className="flex cursor-pointer items-center gap-1 font-mono text-[11px] text-muted hover:text-fg">
              <Maximize2 className="h-3 w-3" aria-hidden="true" /> All 48 cameras
            </button>
          </div>
          <CameraFeed label="CAM-04 · Floor 2" />
        </motion.div>

        <motion.div variants={rise} className="flex flex-col rounded-xl border border-line bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Live alerts</p>
            <button onClick={() => go('alerts')} className="cursor-pointer font-mono text-[11px] text-muted hover:text-fg">View all →</button>
          </div>
          <ul className="mt-3 space-y-2" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              {alerts.filter((a) => !a.resolved).slice(0, 4).map((a) => <AlertRow key={a.id} a={a} onOpen={openAlert} compact />)}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>

      <motion.div variants={rise} className="rounded-xl border border-line bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">{S.label}</p>
          <div className="flex flex-wrap gap-2">
            <Segmented id="ov-metric" value={metric} onChange={setMetric} options={[['attendance', 'Attendance'], ['checkin', 'Check-in'], ['alerts', 'Alerts']]} />
            <Segmented id="ov-range" value={range} onChange={setRange} options={[['week', 'Week'], ['month', 'Month']]} />
          </div>
        </div>
        <div className="mt-4">
          <BarChart data={S[range]} max={max} unit={S.unit} animKey={`${metric}-${range}`} rgb={metric === 'alerts' ? '248,113,113' : metric === 'checkin' ? '251,191,36' : '59,130,246'} height="h-36" />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═════════════ CAMERAS ═════════════ */
export function CamerasView({ alertCams }) {
  const [floor, setFloor] = useState('All')
  const [open, setOpen] = useState(null)
  const cams = CAMS.filter((c) => floor === 'All' || c.floor === floor)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <LayoutGroup>
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented id="floors" value={floor} onChange={setFloor} options={['All', 'Ground', 'Floor 2', 'Floor 3'].map((f) => [f, f])} />
          <span className="font-mono text-[11px] text-muted">Showing {cams.length} of 48 · click a camera to expand</span>
        </div>
        <motion.ul layout className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {cams.map((c) => (
              <motion.li key={c.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35, ease }}>
                <motion.button layoutId={`cam-${c.id}`} onClick={() => setOpen(c)} className="group block w-full cursor-pointer rounded-xl border border-line bg-card p-2 text-left transition-colors hover:border-accent/50" aria-label={`Expand ${c.id} ${c.name}`}>
                  <MiniCam cam={c} alert={alertCams.has(c.id)} />
                  <span className="mt-2 flex items-center justify-between px-1">
                    <span className="text-xs font-medium">{c.name}</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted"><Users className="h-3 w-3" aria-hidden="true" />{c.people}</span>
                  </span>
                </motion.button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <AnimatePresence>
          {open && (
            <>
              <motion.div className="absolute -inset-2 z-20 rounded-xl bg-[#0B0E18]/85 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} />
              <motion.div layoutId={`cam-${open.id}`} className="absolute inset-x-0 top-0 z-30 rounded-xl border border-accent/40 bg-card p-3 shadow-2xl" role="dialog" aria-label={`${open.id} expanded`}>
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-sm font-medium">{open.id} · {open.name} <span className="ml-2 font-mono text-[11px] text-muted">{open.floor}</span></p>
                  <button onClick={() => setOpen(null)} aria-label="Close camera" className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-line hover:bg-white/5"><X className="h-4 w-4" /></button>
                </div>
                <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
                  {open.live ? <CameraFeed label={`${open.id} · ${open.name}`} /> : <MiniCam cam={open} big alert={alertCams.has(open.id)} />}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-2 text-sm">
                    {[['People detected', open.people], ['Recognised', `${open.people - (alertCams.has(open.id) ? 1 : 0)} / ${open.people}`], ['Resolution', '1080p · 30 FPS'], ['AI model', 'Vision v3 · edge'], ['Recording', 'Continuous · 30 days']].map(([k, v]) => (
                      <div key={k} className="flex justify-between rounded-lg border border-line bg-surface px-3 py-2"><span className="text-muted">{k}</span><span className="font-mono text-xs">{v}</span></div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}

/* ═════════════ PEOPLE ═════════════ */
export function PeopleView({ query, setQuery, openEmployee }) {
  const [dept, setDept] = useState('All')
  const [sort, setSort] = useState({ key: 'in', dir: 1 })
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return EMPLOYEES
      .filter((e) => (dept === 'All' || e.d === dept) && (!q || e.n.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)))
      .sort((a, b) => {
        const va = sort.key === 'in' ? (a.in === '—' ? '99' : a.in) : a[sort.key]
        const vb = sort.key === 'in' ? (b.in === '—' ? '99' : b.in) : b[sort.key]
        return (va > vb ? 1 : va < vb ? -1 : 0) * sort.dir
      })
  }, [query, dept, sort])
  const toggleSort = (key) => setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }))
  const counts = EMPLOYEES.reduce((m, e) => ({ ...m, [e.status]: (m[e.status] || 0) + 1 }), {})

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(STATUS).map(([k, s], i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-lg border border-line bg-card px-3 py-2">
            <p className={`font-display text-xl font-semibold ${s.cls.split(' ')[0]}`}>{counts[k] || 0}</p>
            <p className="text-[11px] text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:w-64">
          <span className="sr-only">Search employees</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or ID…" className="min-h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
        </label>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" data-lenis-prevent>
          {DEPTS.map((d) => (
            <button key={d} onClick={() => setDept(d)} aria-pressed={dept === d} className={`min-h-8 shrink-0 cursor-pointer rounded-full border px-3 text-xs transition-colors ${dept === d ? 'border-accent bg-accent/15 text-fg' : 'border-line text-muted hover:text-fg'}`}>{d}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-card" data-lenis-prevent>
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-muted">
            <tr>
              {[['n', 'Employee'], ['d', 'Dept.'], ['in', 'Check-in'], ['active', 'Active']].map(([k, l]) => (
                <th key={k} className="px-4 py-2.5 font-normal" aria-sort={sort.key === k ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'}>
                  <button onClick={() => toggleSort(k)} className={`flex cursor-pointer items-center gap-1 uppercase hover:text-fg ${sort.key === k ? 'text-fg' : ''}`}>
                    {l}<ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                  </button>
                </th>
              ))}
              <th className="px-4 py-2.5 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((e) => (
                <motion.tr
                  key={e.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => openEmployee(e)}
                  onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), openEmployee(e))}
                  tabIndex={0}
                  className="cursor-pointer border-t border-line/60 outline-none transition-colors hover:bg-white/[.03] focus-visible:bg-accent/10"
                >
                  <td className="px-4 py-2.5"><span className="flex items-center gap-2.5"><Avatar name={e.n} />{e.n}</span></td>
                  <td className="px-4 text-muted">{e.d}</td>
                  <td className="px-4 font-mono tabular-nums">{e.in}</td>
                  <td className="px-4">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-white/10"><motion.span className="block h-full origin-left rounded-full bg-gradient-to-r from-accent to-cyan" initial={{ scaleX: 0 }} animate={{ scaleX: e.active / 100 }} transition={{ duration: 0.8, ease }} /></span>
                      <span className="font-mono text-[11px] text-muted">{e.active}%</span>
                    </span>
                  </td>
                  <td className="px-4"><span className={`rounded-md px-2 py-0.5 text-xs ${STATUS[e.status].cls}`}>{STATUS[e.status].label}</span></td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {!rows.length && <p className="px-4 py-8 text-center text-sm text-muted">No employees match “{query}”.</p>}
      </div>
    </div>
  )
}

/* ═════════════ ALERTS ═════════════ */
export function AlertsView({ alerts, openAlert, ackAll }) {
  const [filter, setFilter] = useState('open')
  const list = alerts.filter((a) =>
    filter === 'open' ? !a.resolved : filter === 'critical' ? !a.resolved && a.lvl === 'critical' : filter === 'resolved' ? a.resolved : true)
  const count = (f) => alerts.filter((a) => (f === 'open' ? !a.resolved : f === 'critical' ? !a.resolved && a.lvl === 'critical' : a.resolved)).length
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented id="al-filter" value={filter} onChange={setFilter} size="md" options={[['open', `Open · ${count('open')}`], ['critical', `Critical · ${count('critical')}`], ['resolved', `Resolved · ${count('resolved')}`]]} />
        <button onClick={ackAll} className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line px-3 text-xs text-muted transition-colors hover:border-ok/40 hover:text-ok">
          <CheckCheck className="h-4 w-4" aria-hidden="true" /> Acknowledge all
        </button>
      </div>
      <ul className="space-y-2" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((a) => <AlertRow key={a.id} a={a} onOpen={openAlert} />)}
        </AnimatePresence>
      </ul>
      {!list.length && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid place-items-center rounded-xl border border-dashed border-line py-12 text-center">
          <BellOff className="h-8 w-8 text-ok" aria-hidden="true" />
          <p className="mt-3 font-medium">All clear</p>
          <p className="text-sm text-muted">No alerts in this view. Try “Simulate incident”.</p>
        </motion.div>
      )}
    </div>
  )
}

/* ═════════════ ANALYTICS ═════════════ */
export function AnalyticsView() {
  const [metric, setMetric] = useState('attendance')
  const [range, setRange] = useState('week')
  const [cell, setCell] = useState(null)
  const S = SERIES[metric]
  const max = typeof S.max === 'object' ? S.max[range] : S.max
  const vals = S[range].map(([, v]) => v)
  const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(metric === 'attendance' ? 1 : 0)
  const rgb = metric === 'alerts' ? '248,113,113' : metric === 'checkin' ? '251,191,36' : '59,130,246'
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-xl border border-line bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented id="an-metric" value={metric} onChange={setMetric} options={[['attendance', 'Attendance'], ['checkin', 'Check-in'], ['alerts', 'Alerts']]} />
          <Segmented id="an-range" value={range} onChange={setRange} options={[['week', 'Week'], ['month', 'Month']]} />
        </div>
        <div className="mt-4 flex items-end gap-3">
          <motion.p key={`${metric}-${range}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-semibold" style={{ color: `rgb(${rgb})` }}>{avg}{S.unit}</motion.p>
          <p className="pb-1 text-sm text-muted">avg. {S.label.toLowerCase()} · {range === 'week' ? 'this week' : 'last 4 weeks'}</p>
        </div>
        <div className="mt-5"><BarChart data={S[range]} max={max} unit={S.unit} animKey={`${metric}-${range}`} rgb={rgb} height="h-52" /></div>
      </div>

      <div className="rounded-xl border border-line bg-card p-4">
        <p className="text-sm font-medium">Office occupancy heatmap</p>
        <p className="mt-0.5 h-5 font-mono text-[11px] text-muted" aria-live="polite">
          {cell ? `${cell.d} ${String(8 + cell.h).padStart(2, '0')}:00 · ${Math.round(cell.v * 100)}% occupied` : 'Hover a cell'}
        </p>
        <div className="mt-3 space-y-1.5" onMouseLeave={() => setCell(null)}>
          {HEAT.map((row, ri) => (
            <div key={row.d} className="flex items-center gap-1.5">
              <span className="w-8 text-[11px] text-muted">{row.d}</span>
              {row.v.map((v, h) => (
                <motion.span
                  key={h}
                  tabIndex={0}
                  aria-label={`${row.d} ${8 + h}:00, ${Math.round(v * 100)}% occupied`}
                  onMouseEnter={() => setCell({ d: row.d, h, v })}
                  onFocus={() => setCell({ d: row.d, h, v })}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (ri * 10 + h) * 0.012 }}
                  whileHover={{ scale: 1.25 }}
                  className="aspect-square flex-1 cursor-pointer rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                  style={{ background: `rgba(34,211,238,${0.08 + v * 0.85})` }}
                />
              ))}
            </div>
          ))}
          <div className="flex justify-between pl-9 pt-1 font-mono text-[10px] text-muted"><span>08:00</span><span>12:00</span><span>17:00</span></div>
        </div>
        <div className="mt-5 space-y-2.5">
          {[['Engineering', 92], ['Design', 87], ['Support', 78], ['Sales', 84]].map(([t, v], i) => (
            <div key={t}>
              <div className="flex justify-between text-xs"><span>{t}</span><span className="font-mono text-muted">{v}% active</span></div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-cyan" initial={{ scaleX: 0 }} animate={{ scaleX: v / 100 }} transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.08 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

