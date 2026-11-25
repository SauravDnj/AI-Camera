import { MotionConfig } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { lenisRef, scrollToTarget } from './lib/scroll'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PricingPage from './pages/PricingPage'
import SolutionPage from './pages/SolutionPage'
import Footer from './sections/Footer'
import Navbar from './sections/Navbar'

gsap.registerPlugin(ScrollTrigger)

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // smooth scrolling for same-page anchors like href="#contact"
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (id.length < 2 || !document.querySelector(id)) return
      e.preventDefault()
      scrollToTarget(id)
      history.replaceState(history.state, '', id)
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])
}

/* On route change: jump to top (or to the #hash target), then refresh ScrollTrigger. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    const changedPage = prevPath.current !== pathname
    prevPath.current = pathname
    if (changedPage) scrollToTarget(0, { immediate: true })
    const timers = [
      setTimeout(() => {
        ScrollTrigger.refresh()
        if (hash) scrollToTarget(hash, { immediate: changedPage })
      }, changedPage ? 80 : 0),
    ]
    // After a page change, layout (pinned sections, fonts) can still shift — correct once more.
    if (changedPage && hash) timers.push(setTimeout(() => scrollToTarget(hash, { immediate: true }), 450))
    return () => timers.forEach(clearTimeout)
  }, [pathname, hash, key])

  return null
}

function Layout() {
  useSmoothScroll()
  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions/:slug" element={<SolutionPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </MotionConfig>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
