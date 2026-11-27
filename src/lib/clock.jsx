import { useEffect, useState } from 'react'

/* One shared 1-second ticker for every live clock on the page.
   Only the tiny <LiveTime> text nodes re-render each second — not the big components around them. */
const subs = new Set()
let timer = null
let now = new Date()

function subscribe(fn) {
  subs.add(fn)
  if (!timer) timer = setInterval(() => { now = new Date(); subs.forEach((f) => f(now)) }, 1000)
  return () => { subs.delete(fn); if (!subs.size) { clearInterval(timer); timer = null } }
}

export function useNow() {
  const [t, setT] = useState(now)
  useEffect(() => subscribe(setT), [])
  return t
}

const p = (n) => String(n).padStart(2, '0')
export const fmtTime = (d) => `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`

export function LiveTime({ className = '' }) {
  const t = useNow()
  return <span className={`tabular-nums ${className}`}>{fmtTime(t)}</span>
}
