import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Maximize2, ScanFace, Users } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { LiveTime } from '../../lib/clock'
import { onScrollState } from '../../lib/scrolling'

/* One live CCTV tile for the hero camera wall: a real looping video clip
   with a security-camera colour grade and an AI overlay (labels, people count, alerts).
   Click / Enter opens the pop-up live view via `onOpen(cam, rect, currentTime)`. */

const ease = [0.16, 1, 0.3, 1]

/* Plays a muted clip only while it is actually on screen and pauses it otherwise.
   Nothing but metadata is fetched until the clip first becomes visible (preload="none" -> "auto"),
   so off-screen / hidden (display:none) videos cost no bandwidth or decoding. */
export function useAutoPlay(ref, reduce, { randomStart = true, pauseOnScroll = false } = {}) {
  useEffect(() => {
    const v = ref.current
    if (!v) return
    let seeded = !randomStart
    // start each clip at a different point so a wall of feeds never looks synchronised
    const seek = () => { if (!seeded && v.duration) { seeded = true; v.currentTime = Math.random() * v.duration * 0.8 } }
    if (reduce) return
    let visible = false
    let scrolling = false
    const sync = () => { if (visible && !scrolling) v.play().catch(() => {}); else if (!v.paused) v.pause() }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) {
        if (v.preload !== 'auto') v.preload = 'auto'
        if (v.readyState >= 1) seek(); else v.addEventListener('loadedmetadata', seek, { once: true })
      }
      sync()
    }, { threshold: 0.15 })
    io.observe(v)
    // optional: hold the current frame while the page scrolls, resume ~0.2s after scrolling stops
    const unsub = pauseOnScroll ? onScrollState((on) => { scrolling = on; sync() }) : null
    return () => { io.disconnect(); unsub?.() }
  }, [ref, reduce, randomStart, pauseOnScroll])
}

const CORNERS = ['left-2 top-2 border-l-2 border-t-2', 'right-2 top-2 border-r-2 border-t-2', 'left-2 bottom-2 border-l-2 border-b-2', 'right-2 bottom-2 border-r-2 border-b-2']

function CameraTile({ cam, alert, index, ready, onOpen, className = '' }) {
  const reduce = useReducedMotion()
  const video = useRef(null)
  const root = useRef(null)
  useAutoPlay(video, reduce, { pauseOnScroll: true })

  const open = () => onOpen?.(cam, root.current?.getBoundingClientRect(), video.current?.currentTime || 0)

  // hover-only decorations are mounted only while hovered/focused (keeps 8 tiles light while scrolling)
  const [hot, setHot] = useState(false)
  const on = () => setHot(true)
  const off = () => setHot(false)

  return (
    <motion.div
      ref={root}
      data-cam={cam.id}
      role="button"
      tabIndex={0}
      aria-label={`Open live feed CAM-${cam.id} ${cam.name}${alert ? ' — alert: unknown face' : ''}`}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }}
      onPointerEnter={on}
      onPointerLeave={off}
      onFocus={on}
      onBlur={off}
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={ready || reduce ? { opacity: 1, scale: 1 } : undefined}
      whileHover={reduce ? undefined : { y: -8, scale: 1.045, zIndex: 20, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.9, ease, delay: 0.1 + index * 0.06 }}
      className={`group relative aspect-[16/10] cursor-pointer overflow-hidden bg-[#0B0C0F] outline-none hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,.95),0_0_0_1px_rgba(255,255,255,.35)] focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,.8)] lg:aspect-[16/9] ${className}`}
    >
      <video
        ref={video}
        src={cam.src}
        poster={cam.src.replace(/\.mp4$/, '.jpg')}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      {/* ONE overlay for the whole CCTV look (tint + scanlines + top/bottom shade) instead of three stacked layers.
          It fades on hover to reveal the full-colour feed. */}
      <div className="cctv-shade pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-40 group-focus-visible:opacity-40" aria-hidden="true" />

      {/* alert state — only rendered on the tile that has the alert */}
      {alert && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 shadow-[inset_0_0_0_1.5px_rgba(248,113,113,.85),inset_0_0_40px_-10px_rgba(248,113,113,.5)]" />
          {!reduce && (
            // moves with transform (GPU) instead of animating `top` (which forces layout every frame)
            <motion.div className="absolute inset-0" animate={{ y: ['0%', '100%', '0%'] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="h-px bg-danger shadow-[0_0_12px_2px_rgba(248,113,113,.7)]" />
            </motion.div>
          )}
          {!hot && (
            <span className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded bg-danger px-1.5 py-0.5 font-mono text-[10px] font-medium text-black">
              <ScanFace className="h-3 w-3" />Unknown face · 61%
            </span>
          )}
        </div>
      )}

      {/* camera chrome */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2 font-mono text-[10px] text-white/80 sm:p-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 truncate">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger/90" />
            <span className="text-white/90">REC</span>
            <span className={`truncate ${hot ? 'text-white' : 'text-white/70'}`}>CAM-{cam.id} · {cam.name}</span>
          </span>
          <LiveTime className="hidden shrink-0 text-white/60 xl:inline" />
        </div>
        {!alert && !hot && (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-white/60">{cam.status}</span>
            <span className="flex shrink-0 items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-white/75">
              <Users className="h-3 w-3" />{cam.people}
            </span>
          </div>
        )}
      </div>

      {/* hover-only: sweep, viewfinder corners, open button, info bar */}
      <AnimatePresence>
        {hot && !reduce && (
          <motion.div key="hover" className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} aria-hidden="true">
            <motion.div
              className="absolute inset-x-0 top-0 h-1/4 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.16),transparent)]"
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: '420%', opacity: [0, 1, 0] }}
              transition={{ duration: 1.1, ease }}
            />
            {CORNERS.map((c, k) => (
              <motion.span
                key={c}
                className={`absolute h-4 w-4 border-white ${c}`}
                initial={{ x: k % 2 ? 8 : -8, y: k < 2 ? -8 : 8, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease }}
              />
            ))}
            <div className="absolute inset-0 grid place-items-center">
              <motion.span
                className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-black shadow-[0_10px_30px_-6px_rgba(0,0,0,.8)]"
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              >
                <Maximize2 className="h-3 w-3" />Open live feed
              </motion.span>
            </div>
            <motion.div
              className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/80 px-2.5 py-1.5 font-mono text-[10px] text-white/85"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-ok" />Live · 30 FPS</span>
              <span>{alert ? 'Unknown face · 61%' : `${cam.people} in view`}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// memo: the wall re-renders when the alert hops; untouched tiles skip re-rendering
export default memo(CameraTile)
