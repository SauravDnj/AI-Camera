import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BRAND } from '../config'
import { Button, Container, LogoMark } from '../components/ui'
import { SOLUTIONS } from '../data/solutions'

// Home-page sections — route links so they work from any page.
const LINKS = [
  { to: '/#features', label: 'Features' },
  { to: '/#how', label: 'How it works' },
  { to: '/#dashboard', label: 'Dashboard' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function SolutionsMenu() {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  const closeTimer = useRef(null)
  const { pathname } = useLocation()
  const active = pathname.startsWith('/solutions')

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => !wrap.current?.contains(e.target) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown) }
  }, [open])

  const enter = () => { clearTimeout(closeTimer.current); setOpen(true) }
  const leave = () => { closeTimer.current = setTimeout(() => setOpen(false), 120) }

  return (
    <div ref={wrap} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="solutions-menu"
        className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:bg-white/5 hover:text-fg ${active ? 'text-fg' : 'text-muted'}`}
      >
        Solutions
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="solutions-menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-3"
          >
            <div className="rounded-2xl border border-line bg-surface/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
              {SOLUTIONS.map((s) => {
                const Icon = s.icon
                return (
                  <NavLink
                    key={s.slug}
                    to={`/solutions/${s.slug}`}
                    className={({ isActive }) => `group flex items-start gap-4 rounded-xl p-3.5 transition-colors hover:bg-white/5 ${isActive ? 'bg-accent/10' : ''}`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-accent transition-transform duration-200 group-hover:scale-110">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{s.name}</span>
                      <span className="mt-0.5 block text-sm leading-snug text-muted">{s.short}</span>
                    </span>
                  </NavLink>
                )
              })}
              <Link to="/#solutions" className="mt-1 flex items-center justify-between rounded-xl border-t border-line px-3.5 py-3 text-sm text-muted transition-colors hover:text-fg">
                Compare all solutions <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-accent to-cyan" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <div className={`transition-all duration-300 ${scrolled || open ? 'border-b border-line/80 bg-bg/80 backdrop-blur-xl' : 'bg-transparent'}`}>
        <Container className="flex h-16 items-center justify-between lg:h-18">
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${BRAND.name} ${BRAND.suffix} home`}>
            <LogoMark />
            <span className="font-display text-lg font-semibold">
              {BRAND.name}<span className="text-cyan"> {BRAND.suffix}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            <SolutionsMenu />
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} aria-current={pathname === l.to ? 'page' : undefined} className={`relative whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:bg-white/5 hover:text-fg ${pathname === l.to ? 'text-fg' : 'text-muted'}`}>
                {l.label}
                {pathname === l.to && <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-accent to-cyan" />}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <a href="#contact" className="whitespace-nowrap px-3 py-2 text-sm text-muted transition-colors hover:text-fg">Sign in</a>
            <Button href="#contact" className="min-h-10 whitespace-nowrap px-5">Book a demo</Button>
          </div>

          <button
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-lg border border-line xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </Container>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25 }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-bg/95 backdrop-blur-xl xl:hidden"
            aria-label="Mobile"
          >
            <Container className="flex flex-col gap-1 py-4">
              <p className="px-3 pb-1 pt-2 font-mono text-xs uppercase tracking-wider text-muted">Solutions</p>
              {SOLUTIONS.map((s) => {
                const Icon = s.icon
                return (
                  <NavLink key={s.slug} to={`/solutions/${s.slug}`} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-base hover:bg-white/5 ${isActive ? 'bg-accent/10 text-fg' : 'text-fg/90'}`}>
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />{s.name}
                  </NavLink>
                )
              })}
              <div className="my-2 h-px bg-line" />
              {LINKS.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base text-muted hover:bg-white/5 hover:text-fg">
                  {l.label}
                </Link>
              ))}
              <Button href="#contact" className="mt-2" onClick={() => setOpen(false)}>Book a demo</Button>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
