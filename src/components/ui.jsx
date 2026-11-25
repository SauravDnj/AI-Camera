import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Children, Fragment, isValidElement } from 'react'
import { Link } from 'react-router-dom'

export const ease = [0.16, 1, 0.3, 1]

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

export function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

export function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-cyan">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan blink" aria-hidden="true" />
      {children}
    </span>
  )
}

/* ── Word-by-word heading reveal ─────────────────────────────
   Splits plain strings and one level of styled spans (e.g. <span className="text-gradient">)
   into words that rise out of a mask with a blur, staggered. */
const wordVariants = {
  hidden: { y: '105%', opacity: 0, filter: 'blur(8px)' },
  show: { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 0.75, ease }, transitionEnd: { filter: 'none' } },
}

function Word({ children, className = '' }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]">
      <motion.span className={`inline-block ${className}`} variants={wordVariants}>{children}</motion.span>
    </span>
  )
}

function splitWords(node, cls = '', key = 'w') {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).split(/(\s+)/).map((w, i) => (/^\s+$/.test(w) || !w ? w : <Word key={`${key}-${i}`} className={cls}>{w}</Word>))
  }
  if (Array.isArray(node)) return node.flatMap((n, i) => splitWords(n, cls, `${key}-${i}`))
  if (isValidElement(node)) {
    if (node.type === Fragment) return splitWords(node.props.children, cls, key)
    if (node.type === 'br') return node
    return splitWords(Children.toArray(node.props.children), `${cls} ${node.props.className || ''}`.trim(), key)
  }
  return node
}

export function SplitHeading({ as = 'h2', children, className = '', delay = 0 }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
    >
      {splitWords(children)}
    </M>
  )
}

export function SectionHeader({ eyebrow, title, sub, center = true }) {
  return (
    <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
      <SplitHeading className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl" delay={0.08}>{title}</SplitHeading>
      {sub && (
        <Reveal delay={0.25}>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}

/* ── Card with cursor spotlight, glowing border and optional 3D tilt ── */
export function SpotlightCard({ children, className = '', tilt = true, rgb = '59,130,246', as = 'div', ...rest }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(-500)
  const my = useMotionValue(-500)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 })
  const fill = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(${rgb},.14), transparent 65%)`
  const ring = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(${rgb},.9), transparent 70%)`
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left); my.set(e.clientY - r.top)
    px.set((e.clientX - r.left) / r.width); py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => { px.set(0.5); py.set(0.5) }
  const M = motion[as]
  return (
    <M
      {...rest}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ '--glow': `rgba(${rgb},.55)`, ...(tilt && !reduce ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : {}) }}
      className={`group relative isolate overflow-hidden rounded-2xl border border-line bg-card transition-[border-color,box-shadow] duration-300 hover:shadow-[0_24px_70px_-30px_var(--glow)] ${className}`}
    >
      <motion.div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: fill }} aria-hidden="true" />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: ring, padding: 1, WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
        aria-hidden="true"
      />
      {children}
    </M>
  )
}

/* ── Rotating light beam around a rounded border ── */
export function BeamBorder({ children, className = '', radius = 'rounded-2xl', speed = '6s', colors = '#22D3EE, #3B82F6' }) {
  return (
    <div className={`relative overflow-hidden p-px ${radius} ${className}`}>
      <span
        className="absolute inset-[-150%] animate-[spin_linear_infinite]"
        style={{ animationDuration: speed, background: `conic-gradient(from 0deg, transparent 0 65%, ${colors}, transparent)` }}
        aria-hidden="true"
      />
      <div className={`relative h-full ${radius}`}>{children}</div>
    </div>
  )
}

export function Button({ href = '#', to, variant = 'primary', children, className = '', icon = true, ...rest }) {
  const base =
    'group relative inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-sm font-semibold transition-all duration-300'
  const styles = {
    primary:
      'bg-accent text-white shadow-[0_0_0_1px_rgba(255,255,255,.12)_inset,0_10px_40px_-10px_rgba(59,130,246,.8)] hover:bg-blue-500 hover:shadow-[0_0_0_1px_rgba(255,255,255,.2)_inset,0_14px_50px_-8px_rgba(59,130,246,.95)]',
    ghost: 'glass text-fg hover:border-cyan/40 hover:bg-white/5',
  }
  const inner = (
    <>
      {variant === 'primary' && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
      )}
      <span className="relative">{children}</span>
      {icon && <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />}
    </>
  )
  const cls = `${base} ${styles[variant]} ${className}`
  // `to` = route link (React Router); `href` = in-page anchor or external link
  return to
    ? <Link to={to} className={cls} {...rest}>{inner}</Link>
    : <a href={href} className={cls} {...rest}>{inner}</a>
}

export function LogoMark() {
  return (
    <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-accent/40 bg-accent/10" aria-hidden="true">
      <span className="absolute inset-1.5 rounded-full border-2 border-accent" />
      <span className="h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_#22D3EE]" />
    </span>
  )
}
