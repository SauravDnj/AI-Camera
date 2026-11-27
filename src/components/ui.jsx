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
    <span className="inline-flex items-center gap-2 text-[15px] font-medium text-muted">
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
  // `center` (the default) = wide split layout; `center={false}` = stacked, for narrow columns
  if (!center) {
    return (
      <div className="max-w-xl">
        <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
        <SplitHeading className="mt-4 text-[2.25rem] leading-[1.05] sm:text-5xl" delay={0.08}>{title}</SplitHeading>
        {sub && <Reveal delay={0.2}><p className="mt-6 text-[17px] leading-relaxed text-muted">{sub}</p></Reveal>}
      </div>
    )
  }
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <div>
        <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
        <SplitHeading className="mt-4 text-[2.25rem] leading-[1.05] sm:text-5xl" delay={0.08}>{title}</SplitHeading>
      </div>
      {sub && (
        <Reveal delay={0.2} className="lg:pt-11">
          <p className="max-w-xl text-lg leading-[1.6] text-fg/80 sm:text-[21px]">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}

/* ── Card with cursor spotlight, glowing border and optional 3D tilt ── */
export function SpotlightCard({ children, className = '', tilt = false, rgb = '255,255,255', flat = false, as = 'div', ...rest }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(-500)
  const my = useMotionValue(-500)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 })
  const fill = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(255,255,255,.045), transparent 65%)`
  const ring = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(255,255,255,.35), transparent 70%)`
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
      style={{ '--glow': `rgba(${rgb},.25)`, ...(tilt && !reduce ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : {}) }}
      className={`group relative isolate overflow-hidden transition-colors duration-300 ${flat ? 'bg-bg hover:bg-[#0C0D0E]' : 'panel rounded-xl hover:border-white/[.14]'} ${className}`}
    >
      <motion.div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: fill }} aria-hidden="true" />
      <motion.div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 ${flat ? '' : 'group-hover:opacity-100'}`}
        style={{ background: ring, padding: 1, WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
        aria-hidden="true"
      />
      {children}
    </M>
  )
}

/* ── Rotating light beam around a rounded border ── */
export function BeamBorder({ children, className = '', radius = 'rounded-2xl', speed = '6s', colors = 'rgba(255,255,255,.5), rgba(255,255,255,.15)' }) {
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

export function Button({ href = '#', to, variant = 'primary', children, className = '', icon = false, ...rest }) {
  const base =
    'group relative inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-full px-5 text-[15px] font-medium transition-colors duration-200'
  const styles = {
    primary:
      'border border-[#E5E5E6] bg-[#E5E5E6] text-[#08090A] hover:border-white hover:bg-white',
    ghost: 'border border-white/10 bg-white/[.03] text-fg hover:border-white/20 hover:bg-white/[.07]',
  }
  const inner = (
    <>
      <span className="relative">{children}</span>
      {icon && <ArrowRight className="relative h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />}
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
    <span className="relative grid h-7 w-7 place-items-center rounded-full bg-fg" aria-hidden="true">
      <span className="absolute inset-[5px] rounded-full border-[2.5px] border-bg" />
      <span className="h-1.5 w-1.5 rounded-full bg-bg" />
    </span>
  )
}
