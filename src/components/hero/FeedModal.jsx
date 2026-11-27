import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Camera, ChevronLeft, ChevronRight, Download, Maximize2, ScanFace, Share2, ShieldAlert, Users, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LiveTime } from '../../lib/clock'
import { lenisRef } from '../../lib/scroll'

const ease = [0.16, 1, 0.3, 1]

// A few plausible AI events per feed (times are relative "ago" labels)
function eventsFor(cam, alert) {
  const base = [
    { t: 'now', k: 'ok', m: cam.status },
    { t: '12s', k: 'info', m: `${cam.people} ${cam.people === 1 ? 'person' : 'people'} in view` },
    { t: '48s', k: 'ok', m: 'Face match · EMP-0142 · 98.7%' },
    { t: '2m', k: 'info', m: 'Motion detected · zone A' },
    { t: '6m', k: 'ok', m: 'Model health check passed' },
  ]
  return alert ? [{ t: 'now', k: 'alert', m: 'Unknown face · 61.4% · not enrolled' }, ...base] : base
}

const DOT = { ok: 'bg-ok', info: 'bg-white/40', alert: 'bg-danger' }

/* Pop-up live view for one camera. Opens from the clicked tile's position (`origin` rect)
   and resumes the clip at the tile's current playback time (`startAt`). */
export default function FeedModal({ cams, index, origin, startAt = 0, alertId, onClose, onNavigate }) {
  const reduce = useReducedMotion()
  const cam = index == null ? null : cams[index]
  const video = useRef(null)
  const closeBtn = useRef(null)
  const [progress, setProgress] = useState(0)
  const alert = cam && cam.id === alertId

  // lock page scroll, keyboard controls, focus
  useEffect(() => {
    if (!cam) return
    lenisRef.current?.stop()
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate(1)
      if (e.key === 'ArrowLeft') onNavigate(-1)
    }
    window.addEventListener('keydown', onKey)
    closeBtn.current?.focus({ preventScroll: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prevOverflow
      lenisRef.current?.start()
    }
  }, [cam, onClose, onNavigate])

  // resume where the tile was (see onLoadedMetadata on the <video>)
  const resume = (e) => { const v = e.currentTarget; try { v.currentTime = Math.min(startAt, (v.duration || 1) - 0.2) } catch { /* not seekable */ } v.play().catch(() => {}) }

  // where the panel flies in from: the clicked tile
  const from = (() => {
    if (!origin || reduce || typeof window === 'undefined') return { opacity: 0, scale: 0.96, y: 20 }
    const w = Math.min(window.innerWidth - 32, 1180)
    return {
      opacity: 0,
      x: origin.left + origin.width / 2 - window.innerWidth / 2,
      y: origin.top + origin.height / 2 - window.innerHeight / 2,
      scale: Math.max(origin.width / w, 0.15),
    }
  })()

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return createPortal(
    <AnimatePresence>
      {cam && (
        <motion.div
          key="feed-modal"
          className="fixed inset-0 z-[90] grid place-items-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.1 } }}
          role="dialog"
          aria-modal="true"
          aria-label={`Live feed CAM-${cam.id} ${cam.name}`}
        >
          {/* backdrop */}
          <motion.button
            type="button"
            aria-label="Close live feed"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-[3px]"
            tabIndex={-1}
          />

          <motion.div
            initial={from}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ ...from, transition: { duration: 0.4, ease } }}
            transition={{ duration: 0.55, ease }}
            className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-[1180px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0F1011] shadow-[0_40px_140px_-20px_rgba(0,0,0,.95)]"
          >
            {/* header */}
            <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-white/[.07] px-3 sm:px-4">
              <div className="flex min-w-0 items-center gap-2.5 text-[13px]">
                <span className="flex items-center gap-1.5 rounded bg-danger/15 px-1.5 py-0.5 font-mono text-[11px] font-medium text-danger">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger blink" />LIVE
                </span>
                <span className="truncate font-medium text-fg">CAM-{cam.id} · {cam.name}</span>
                <span className="hidden text-dim sm:inline">HQ campus</span>
              </div>
              <div className="flex items-center gap-1">
                <LiveTime className="mr-2 hidden font-mono text-[12px] text-muted sm:inline" />
                <button type="button" onClick={() => onNavigate(-1)} className="grid h-8 w-8 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-white/[.06] hover:text-fg" aria-label="Previous camera"><ChevronLeft className="h-4 w-4" /></button>
                <span className="font-mono text-[11px] text-dim">{index + 1}/{cams.length}</span>
                <button type="button" onClick={() => onNavigate(1)} className="grid h-8 w-8 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-white/[.06] hover:text-fg" aria-label="Next camera"><ChevronRight className="h-4 w-4" /></button>
                <span className="mx-1 h-4 w-px bg-white/10" aria-hidden="true" />
                <button ref={closeBtn} type="button" onClick={onClose} className="grid h-8 w-8 cursor-pointer place-items-center rounded-md text-muted transition-colors hover:bg-white/[.06] hover:text-fg" aria-label="Close"><X className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1fr_300px]" data-lenis-prevent>
              {/* video stage */}
              <div className="relative bg-black">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={cam.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="relative aspect-video">
                    <video
                      ref={video}
                      src={cam.src}
                      poster={cam.src.replace(/\.mp4$/, '.jpg')}
                      muted
                      loop
                      playsInline
                      autoPlay
                      onLoadedMetadata={resume}
                      onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.12)_0_1px,transparent_1px_3px)]" aria-hidden="true" />

                    {/* AI scan line */}
                    {!reduce && (
                      <motion.div
                        className="pointer-events-none absolute inset-x-0 bottom-[4%] top-[4%]"
                        animate={{ y: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        aria-hidden="true"
                      >
                        <div className={`h-px ${alert ? 'bg-danger shadow-[0_0_16px_3px_rgba(248,113,113,.6)]' : 'bg-white/70 shadow-[0_0_16px_3px_rgba(255,255,255,.35)]'}`} />
                      </motion.div>
                    )}

                    {/* monitored zone (a floor region — realistic on any clip, unlike a fixed "person" box) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease, delay: 0.35 }}
                      className={`pointer-events-none absolute bottom-[12%] left-[18%] right-[18%] top-[58%] rounded-[3px] border-[1.5px] border-dashed ${alert ? 'border-danger bg-danger/[.08]' : 'border-ok/80 bg-ok/[.05]'}`}
                      aria-hidden="true"
                    >
                      <span className={`absolute -left-[1.5px] -top-[1.5px] -translate-y-full whitespace-nowrap rounded-t-[3px] px-1.5 py-0.5 font-mono text-[10px] font-medium text-black ${alert ? 'bg-danger' : 'bg-ok'}`}>
                        {alert ? 'ZONE A · UNKNOWN FACE' : 'ZONE A · MONITORED'}
                      </span>
                    </motion.div>

                    {/* overlay chrome */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-[linear-gradient(180deg,rgba(0,0,0,.45),transparent_22%,transparent_75%,rgba(0,0,0,.6))] p-3 font-mono text-[11px] text-white/85">
                      <div className="flex justify-between"><span>REC · 1920×1080 · 30 FPS</span><LiveTime /></div>
                      <div className="flex justify-between"><span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{cam.people} in view</span><span>AI · Vision v3</span></div>
                    </div>

                    {alert && (
                      <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease, delay: 0.2 }} className="absolute left-1/2 top-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-danger px-3 py-1.5 text-[12px] font-medium text-black shadow-lg">
                        <ShieldAlert className="h-4 w-4" />Unknown face detected
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* timeline */}
                <div className="border-t border-white/[.07] bg-[#0F1011] px-3 py-3 sm:px-4">
                  <div className="relative h-1.5 rounded-full bg-white/[.08]">
                    <div className="absolute inset-y-0 left-0 rounded-full bg-white/80" style={{ width: `${progress * 100}%` }} />
                    {[0.18, 0.42, 0.71].map((p, i) => (
                      <span key={p} className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0F1011] ${alert && i === 2 ? 'bg-danger' : 'bg-ok'}`} style={{ left: `${p * 100}%` }} />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[11px] text-dim">
                    <span>{fmt((video.current?.currentTime) || 0)}</span><span>Live</span>
                  </div>
                </div>
              </div>

              {/* side panel */}
              <aside className="border-t border-white/[.07] p-4 text-[13px] lg:border-l lg:border-t-0">
                {alert && (
                  <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3">
                    <p className="flex items-center gap-2 font-medium text-danger"><ScanFace className="h-4 w-4" />Unknown face · 61.4%</p>
                    <p className="mt-1 text-muted">Not enrolled. Security team notified with clip.</p>
                    <div className="mt-3 flex gap-2">
                      <button type="button" className="cursor-pointer rounded-full bg-[#E5E5E6] px-3 py-1 text-[12px] font-medium text-[#08090A] hover:bg-white">Acknowledge</button>
                      <button type="button" className="cursor-pointer rounded-full border border-white/10 px-3 py-1 text-[12px] text-fg hover:bg-white/[.06]">Add to watchlist</button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-dim">Details</p>
                <dl className="mt-2 space-y-2.5">
                  {[['Status', alert ? 'Alert' : 'Normal'], ['People in view', cam.people], ['Resolution', '1080p · 30 FPS'], ['Retention', '30 days'], ['Model', 'Vision v3']].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><dt className="text-muted">{k}</dt><dd className={k === 'Status' && alert ? 'text-danger' : 'text-fg/90'}>{v}</dd></div>
                  ))}
                </dl>
                <p className="mt-6 text-xs text-dim">AI events</p>
                <ul className="mt-2 space-y-2.5">
                  {eventsFor(cam, alert).map((e, i) => (
                    <motion.li key={cam.id + i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease, delay: 0.25 + i * 0.05 }} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT[e.k]}`} />
                      <span className={`flex-1 ${e.k === 'alert' ? 'text-danger' : 'text-fg/85'}`}>{e.m}</span>
                      <span className="shrink-0 font-mono text-[11px] text-dim">{e.t}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {[[Camera, 'Snapshot'], [Download, 'Export clip'], [Share2, 'Share'], [Maximize2, 'Full screen']].map(([I, l]) => (
                    <button
                      key={l}
                      type="button"
                      onClick={l === 'Full screen' ? () => video.current?.requestFullscreen?.() : undefined}
                      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/[.08] bg-white/[.02] py-2 text-[12px] text-fg/85 transition-colors hover:border-white/15 hover:bg-white/[.06]"
                    >
                      <I className="h-3.5 w-3.5" />{l}
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
