// Shared handle to the Lenis smooth-scroll instance (null when reduced motion is on).
export const lenisRef = { current: null }

export function scrollToTarget(target, { immediate = false } = {}) {
  const offset = typeof target === 'number' || target === '#top' ? 0 : -72
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (target !== 0 && !el) return false
  if (lenisRef.current) {
    lenisRef.current.resize() // page height may have just changed (route change)
    lenisRef.current.scrollTo(target === 0 ? 0 : el, { offset, immediate, force: true })
  } else if (target === 0) {
    window.scrollTo(0, 0)
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: immediate ? 'auto' : 'smooth' })
  }
  return true
}
