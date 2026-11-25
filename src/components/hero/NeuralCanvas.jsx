import { useEffect, useRef } from 'react'

/* Interactive "neural network" background: drifting nodes linked by lines,
   gently attracted to the cursor. Pauses when off-screen or the tab is hidden;
   draws a single static frame when the user prefers reduced motion. */
export default function NeuralCanvas({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0, h = 0, nodes = [], raf = 0, visible = true
    const mouse = { x: -9999, y: -9999 }

    const init = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, Math.max(28, (w * h) / 16000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.6, hue: Math.random() < 0.25 ? 'c' : 'b',
      }))
    }

    const LINK = 130
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const n of nodes) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y
        const d = Math.hypot(dx, dy)
        if (d < 180) { n.vx += dx * 0.00004; n.vy += dy * 0.00004 }
        n.vx *= 0.995; n.vy *= 0.995
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < LINK) {
            ctx.strokeStyle = `rgba(59,130,246,${(1 - d / LINK) * 0.28})`
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        if (md < 180) {
          ctx.strokeStyle = `rgba(34,211,238,${(1 - md / 180) * 0.5})`
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke()
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.hue === 'c' ? 'rgba(34,211,238,.9)' : 'rgba(147,197,253,.75)'
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill()
      }
    }

    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }
    const start = () => { if (!raf && visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    init(); draw(); start()

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop() })
    io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : start())
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    let rt
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { init(); draw() }, 150) }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    return () => {
      stop(); io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} className={`pointer-events-none h-full w-full ${className}`} aria-hidden="true" />
}
