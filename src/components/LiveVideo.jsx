import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { LiveTime } from '../lib/clock'
import { onScrollState } from '../lib/scrolling'

/* Real CCTV-style video panel used on the solution pages.
   - Loads lazily: nothing is downloaded until the panel scrolls into view, and it pauses off-screen.
   - `tag` = AI overlay label, `tone` = 'alert' | 'ok' | 'warn' | 'info'
   - `blur` = privacy-mode demo (video blurred, faces masked)
   - `big` = larger chrome (live clock, scan line) for hero panels */

const TONES = {
  alert: { chip: 'bg-danger text-black', ring: 'shadow-[inset_0_0_0_1.5px_rgba(248,113,113,.8),inset_0_0_40px_-10px_rgba(248,113,113,.45)]', line: 'bg-danger shadow-[0_0_14px_2px_rgba(248,113,113,.6)]' },
  ok: { chip: 'bg-ok text-black', ring: '', line: 'bg-white/60 shadow-[0_0_14px_2px_rgba(255,255,255,.3)]' },
  warn: { chip: 'bg-warn text-black', ring: 'shadow-[inset_0_0_0_1.5px_rgba(251,191,36,.6)]', line: 'bg-warn shadow-[0_0_14px_2px_rgba(251,191,36,.5)]' },
  info: { chip: 'bg-white text-black', ring: '', line: 'bg-white/60 shadow-[0_0_14px_2px_rgba(255,255,255,.3)]' },
}

export default function LiveVideo({ src, label, tag, tone = 'ok', blur = false, big = false, eager = false, className = '', hover = true }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const t = TONES[tone] || TONES.ok

  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    // download + play only while actually visible; pause as soon as it leaves the screen
    let visible = false
    let scrolling = false
    const sync = () => { if (visible && !scrolling) v.play().catch(() => {}); else if (!v.paused) v.pause() }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && v.preload !== 'auto') v.preload = 'auto'
      sync()
    }, { rootMargin: '100px 0px', threshold: 0.15 })
    io.observe(v)
    // small panels (grids of clips) hold their frame while the page scrolls, then resume
    const unsub = big ? null : onScrollState((on) => { scrolling = on; sync() })
    return () => { io.disconnect(); unsub?.() }
  }, [reduce, src, big])

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {blur ? (
        // privacy demo: a still, pre-blurred frame — blurring a playing video every frame is very expensive
        <img src={src.replace(/\.mp4$/, '.jpg')} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-110 object-cover [filter:blur(8px)_saturate(.6)]" />
      ) : (
        <video
          ref={ref}
          src={src}
          poster={src.replace(/\.mp4$/, '.jpg')}
          muted
          loop
          playsInline
          preload={eager ? 'auto' : 'none'}
          aria-hidden="true"
          tabIndex={-1}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${!big && hover ? 'group-hover:scale-[1.05]' : ''}`}
        />
      )}
      {/* CCTV tint as a cheap overlay (fades on hover) instead of a CSS filter on the video */}
      {!big && <div className={`pointer-events-none absolute inset-0 bg-[#0B1220]/40 transition-opacity duration-500 ${hover ? 'group-hover:opacity-0' : ''}`} aria-hidden="true" />}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.15)_0_1px,transparent_1px_3px)] opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.5),transparent_30%,transparent_66%,rgba(0,0,0,.6))]" aria-hidden="true" />
      {t.ring && <div className={`pointer-events-none absolute inset-0 ${t.ring}`} aria-hidden="true" />}

      {blur && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1 font-mono text-[10px] text-white/90">Faces masked · aggregate view</span>
        </div>
      )}

      {big && !reduce && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[4%] top-[4%]"
          animate={{ y: ['0%', '100%', '0%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className={`h-px ${t.line}`} />
        </motion.div>
      )}

      <div className={`pointer-events-none absolute inset-0 flex flex-col justify-between font-mono text-white/85 ${big ? 'p-3 text-[11px]' : 'p-2 text-[10px]'}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 truncate">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger blink" />
            <span className="truncate">REC{label ? ` · ${label}` : ''}</span>
          </span>
          {big && <LiveTime className="shrink-0 text-white/70" />}
        </div>
        <div className="flex items-end justify-between gap-2">
          {tag ? <span className={`truncate rounded px-1.5 py-0.5 font-medium ${t.chip}`}>{tag}</span> : <span />}
          {big && <span className="shrink-0 text-white/65">AI · Vision v3 · 30 FPS</span>}
        </div>
      </div>
    </div>
  )
}
