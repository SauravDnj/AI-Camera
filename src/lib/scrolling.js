/* Tiny global "is the page scrolling right now?" signal.
   Heavy media (e.g. the 8-video hero wall) can pause while the user scrolls and resume right after,
   so the GPU spends every frame on smooth scrolling instead of decoding video. */
const subs = new Set()
let scrolling = false
let timer = null
let bound = false

function onScroll() {
  if (!scrolling) { scrolling = true; subs.forEach((f) => f(true)) }
  clearTimeout(timer)
  timer = setTimeout(() => { scrolling = false; subs.forEach((f) => f(false)) }, 220)
}

export function onScrollState(fn) {
  if (!bound && typeof window !== 'undefined') { window.addEventListener('scroll', onScroll, { passive: true }); bound = true }
  subs.add(fn)
  return () => subs.delete(fn)
}
