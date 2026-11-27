import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Magnetic from '../components/Magnetic'
import CameraTile from '../components/hero/CameraWall'
import FeedModal from '../components/hero/FeedModal'
import LiveTicker from '../components/hero/LiveTicker'
import { LiveTime } from '../lib/clock'
import ScrambleWord from '../components/hero/ScrambleWord'
import { Button } from '../components/ui'

const ease = [0.16, 1, 0.3, 1]
const LINE1 = 'See everything.'
const WORDS = ['everyone.', 'every door.', 'every shift.', 'every camera.']

/* The live camera wall — real clips in /public/videos (see CREDITS.md there to swap in your own footage). */
const CAMS = [
  { id: '01', name: 'Main entrance', src: '/videos/cam-01-entrance.mp4', status: 'Check-in · 5 recognised', people: 5 },
  { id: '02', name: 'Lobby', src: '/videos/cam-02-lobby.mp4', status: 'Visitor verified', people: 3 },
  { id: '03', name: 'Reception', src: '/videos/cam-03-reception.mp4', status: 'On time · 08:57', people: 1 },
  { id: '04', name: 'Corridor B', src: '/videos/cam-04-corridor.mp4', status: 'Motion · tracked', people: 2 },
  { id: '05', name: 'Warehouse A', src: '/videos/cam-05-warehouse-a.mp4', status: 'PPE detected', people: 3 },
  { id: '06', name: 'Warehouse B', src: '/videos/cam-06-warehouse-b.mp4', status: 'Aisle 4 · clear', people: 1 },
  { id: '07', name: 'Parking P2', src: '/videos/cam-07-parking.mp4', status: 'Vehicle · KA-01 8842', people: 0 },
  { id: '08', name: 'Atrium', src: '/videos/cam-08-atrium.mp4', status: 'Crowd density · normal', people: 38 },
  { id: '09', name: 'Hall · Floor 1', src: '/videos/cam-09-hall.mp4', status: 'Zone rules · active', people: 6 },
  { id: '10', name: 'Skybridge', src: '/videos/cam-10-skybridge.mp4', status: 'Badge scan · ok', people: 2 },
]
// order in which the "unknown face" alert hops around the wall
// the 8 feeds shown on the wall (first 4 also on phones)
const WALL = ['01', '02', '05', '08', '04', '07', '03', '09'].map((id) => CAMS.find((c) => c.id === id))
const ALERT_ORDER = [6, 1, 3, 5, 2, 7, 0, 4]

function useHoppingAlert(ms = 3200) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((v) => (v + 1) % ALERT_ORDER.length), ms)
    return () => clearInterval(t)
  }, [reduce, ms])
  return ALERT_ORDER[i]
}

export default function Hero({ ready = true }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  // The hero sits at the very top of the page, so its scroll progress is simply scrollY / heroHeight.
  // (useScroll({ target }) would re-measure the element on every scroll frame and force layout.)
  const { scrollY } = useScroll()
  const heroH = useRef(900)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => { heroH.current = e.contentRect.height || 900 })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const scrollYProgress = useTransform(scrollY, (y) => Math.min(1, Math.max(0, y / heroH.current)))
  // the tilted wall flattens toward the viewer as the page scrolls
  const tilt = useTransform(scrollYProgress, [0, 0.45], [32, 0])
  const wallScale = useTransform(scrollYProgress, [0, 0.45], [0.94, 1])
  const fade = useTransform(scrollYProgress, [0, 0.35], [1, 0])
  const alertIdx = useHoppingAlert()
  const alertCam = WALL[alertIdx]

  // pop-up live view: which wall tile is open, where it opened from, and the playback time to resume at
  const [feed, setFeed] = useState({ index: null, origin: null, startAt: 0, alertId: null })
  // the alert keeps hopping on the wall; freeze it while the pop-up is open
  const alertRef = useRef(alertCam.id)
  alertRef.current = alertCam.id
  const openFeed = useCallback((cam, origin, startAt) => setFeed({ index: WALL.indexOf(cam), origin, startAt, alertId: alertRef.current }), [])
  const closeFeed = useCallback(() => setFeed((f) => {
    // shrink back into wherever that tile is now
    const el = document.querySelector(`[data-cam="${WALL[f.index]?.id}"]`)
    return { ...f, index: null, origin: el?.getBoundingClientRect() || f.origin }
  }), [])
  // while the pop-up covers the wall, pause the wall's videos (they are hidden anyway) and resume after
  useEffect(() => {
    const vids = [...document.querySelectorAll('[data-cam] video')]
    if (feed.index != null) vids.forEach((v) => v.pause())
    else vids.forEach((v) => { if (v.preload === 'auto' && v.getBoundingClientRect().bottom > 0) v.play().catch(() => {}) })
  }, [feed.index])
  const navFeed = useCallback((d) => setFeed((f) => {
    const index = (f.index + d + WALL.length) % WALL.length
    const v = document.querySelector(`[data-cam="${WALL[index].id}"] video`)
    return { ...f, index, startAt: v?.currentTime || 0 }
  }), [])

  const show = ready || reduce ? 'show' : 'hidden'
  const item = (delay) => ({
    hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease, delay } },
  })

  return (
    <section id="top" ref={ref} className="relative isolate overflow-hidden bg-bg pt-16 lg:pt-[72px]">
      {/* soft light from the top */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[620px] w-[1100px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,.07),transparent)]" aria-hidden="true" />

      <motion.div initial={reduce ? false : 'hidden'} animate={show} style={{ opacity: fade }} className="relative z-10 mx-auto max-w-4xl px-4 pt-14 text-center sm:pt-20 lg:pt-20">
        <motion.a variants={item(0)} href="#features" className="group inline-flex items-center gap-2.5 rounded-full border border-white/[.08] bg-white/[.03] py-1 pl-1 pr-3.5 text-[13px] transition-colors hover:border-white/15">
          <span className="rounded-full bg-white/[.08] px-2 py-0.5 font-medium text-fg">New</span>
          <span className="text-muted transition-colors group-hover:text-fg">Vision Model v3 — 2× faster recognition <span aria-hidden="true">→</span></span>
        </motion.a>

        <h1 className="mt-7 font-display text-[2.6rem] leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]">
          <span className="sr-only">See everything. Secure everyone.</span>
          <span className="block" aria-hidden="true">
            {LINE1.split('').map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, y: '0.4em', filter: 'blur(8px)' },
                  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease, delay: 0.1 + i * 0.022 } },
                }}
              >
                {ch === ' ' ? '\u00a0' : ch}
              </motion.span>
            ))}
          </span>
          <motion.span variants={item(0.45)} className="block" aria-hidden="true">
            Secure <ScrambleWord words={WORDS} start={ready} reserve={false} className="text-gradient" />
          </motion.span>
        </h1>

        <motion.p variants={item(0.6)} className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-lg">
          Turn the cameras you already own into a security guard, a touchless attendance system and a live workforce tracker.
        </motion.p>

        <motion.div variants={item(0.75)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Magnetic><Button href="#contact" className="min-h-11 px-6">Book a live demo</Button></Magnetic>
          <Button href="#dashboard" variant="ghost" className="min-h-11 px-5">
            <span className="flex items-center gap-2"><Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />See it in action</span>
          </Button>
        </motion.div>

        <motion.p variants={item(0.9)} className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-ok" />48 / 48 cameras online</span>
          <span className="text-dim" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-danger blink" />
            <span className="text-fg/80">Unknown face</span> · CAM-{alertCam.id} {alertCam.name} · <LiveTime />
          </span>
        </motion.p>
      </motion.div>

      {/* ── 3D video wall ─────────────────────────────── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 80 }}
        animate={ready || reduce ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.2, ease, delay: 0.5 }}
        className="relative mt-12 [perspective:1800px] sm:mt-14 [mask-image:linear-gradient(to_bottom,#000_62%,transparent)]"
      >
        <div className="pointer-events-none absolute left-1/2 top-10 h-[360px] w-[900px] max-w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,.06),transparent)]" aria-hidden="true" />
        <motion.div
          style={reduce ? undefined : { rotateX: tilt, scale: wallScale, transformOrigin: '50% 0%' }}
          className="mx-auto grid max-w-[1320px] grid-cols-2 gap-2 px-3 pb-24 will-change-transform sm:gap-2.5 sm:px-6 lg:grid-cols-4 lg:gap-3"
        >
          {WALL.map((cam, k) => (
            <CameraTile
              key={cam.id}
              cam={cam}
              index={k}
              ready={ready}
              alert={alertIdx === k}
              onOpen={openFeed}
              className={`rounded-lg border transition-[border-color,box-shadow] duration-500 ${k >= 4 ? 'hidden lg:block' : ''} ${alertIdx === k ? 'border-danger/70 shadow-[0_0_44px_-6px_rgba(248,113,113,.55)]' : 'border-white/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,.9)]'}`}
            />
          ))}
        </motion.div>
      </motion.div>

      <LiveTicker />

      <FeedModal
        cams={WALL}
        index={feed.index}
        origin={feed.origin}
        startAt={feed.startAt}
        alertId={feed.alertId}
        onClose={closeFeed}
        onNavigate={navFeed}
      />
    </section>
  )
}
