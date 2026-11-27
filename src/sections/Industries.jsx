import { motion, useReducedMotion } from 'framer-motion'
import { Building, Cpu, EyeOff, Factory, GraduationCap, Hospital, KeyRound, Lock, Server, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Container, Reveal, SectionHeader, SpotlightCard, ease } from '../components/ui'

const INDUSTRIES = [
  { icon: Cpu, t: 'IT & Software companies', d: 'Hybrid-office attendance, desk occupancy and secure server-room access.', rgb: '59,130,246' },
  { icon: Factory, t: 'Manufacturing', d: 'Shift attendance, PPE detection and restricted machine zones.', rgb: '251,191,36' },
  { icon: Hospital, t: 'Healthcare', d: 'Staff rostering, visitor control and ward access monitoring.', rgb: '248,113,113' },
  { icon: ShoppingBag, t: 'Retail', d: 'Store staff attendance, footfall counts and theft alerts.', rgb: '167,139,250' },
  { icon: GraduationCap, t: 'Education', d: 'Faculty & student attendance with campus perimeter security.', rgb: '52,211,153' },
  { icon: Building, t: 'Offices & co-working', d: 'Touchless entry, visitor management and after-hours security.', rgb: '34,211,238' },
]

const PRIVACY = [
  { icon: Lock, t: 'Encrypted end-to-end', d: 'AES-256 at rest, TLS 1.3 in transit. Face data stored as encrypted embeddings, never raw photos.' },
  { icon: EyeOff, t: 'Privacy masking', d: 'Blur faces of non-employees, mask private zones and set automatic retention limits.' },
  { icon: Server, t: 'Your data, your location', d: 'Run fully on-premise, in your private cloud or in our region-locked cloud.' },
  { icon: ShieldCheck, t: 'Consent & compliance', d: 'Built-in employee consent flows, audit logs and tools to support GDPR-style data requests.' },
]

export function Industries() {
  return (
    <section className="relative py-24 lg:py-32">
      <Container>
        <SectionHeader eyebrow="Industries" title={<>Built for teams of <span className="text-gradient">every shape.</span></>} sub="Start with security, attendance or tracking — and switch on the rest whenever you're ready." />
        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-white/[.08] bg-white/[.08] sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((x, i) => {
            const Icon = x.icon
            return (
              <div key={x.t} className="bg-bg">
              <motion.div
                className="h-full"
                initial={{ opacity: 0, x: i % 2 ? 24 : -24, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
              >
                <SpotlightCard flat className="flex h-full gap-4 p-7">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[.08] bg-white/[.03] text-fg/80 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-medium">{x.t}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{x.d}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

/* Stream of scrambled "ciphertext" characters */
function CipherColumn({ x, delay }) {
  const reduce = useReducedMotion()
  const make = () => Array.from({ length: 14 }, () => '0123456789ABCDEF'[(Math.random() * 16) | 0]).join('')
  const [txt, setTxt] = useState(make)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setTxt(make()), 900)
    return () => clearInterval(t)
  }, [reduce])
  return (
    <motion.span
      className="absolute top-0 font-mono text-[10px] leading-[14px] text-ok/40 [writing-mode:vertical-rl]"
      style={{ left: x }}
      animate={reduce ? undefined : { y: ['-20%', '120%'], opacity: [0, 1, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: 'linear' }}
    >
      {txt}
    </motion.span>
  )
}

function ShieldVisual() {
  const orbit = [Lock, KeyRound, EyeOff, Server]
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]" aria-hidden="true">
      <div className="absolute inset-0 overflow-hidden rounded-full [mask-image:radial-gradient(circle,#000_40%,transparent_70%)]">
        {['12%', '24%', '70%', '82%', '90%'].map((x, i) => <CipherColumn key={x} x={x} delay={i * 0.9} />)}
      </div>
      <div className="absolute inset-[4%] rounded-full border border-dashed border-ok/25 animate-[spin_50s_linear_infinite]" />
      <div className="absolute inset-[16%] rounded-full border border-ok/15" />
      {/* orbiting icons */}
      <div className="absolute inset-[4%] animate-[spin_24s_linear_infinite]">
        {orbit.map((I, i) => (
          // each wrapper is the full circle rotated by 90°; the icon sits on its top edge
          <span key={i} className="absolute inset-0" style={{ transform: `rotate(${i * 90 + 45}deg)` }}>
            <span className="absolute left-1/2 top-0 -ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-xl border border-ok/30 bg-[#0B1512] text-ok shadow-[0_0_20px_-4px_rgba(52,211,153,.6)]" style={{ transform: `rotate(-${i * 90 + 45}deg)` }}>
              <I className="h-4 w-4 animate-[spin_24s_linear_infinite_reverse]" />
            </span>
          </span>
        ))}
      </div>
      <div className="absolute inset-[28%] rounded-full bg-ok/15 blur-3xl" />
      {/* shield drawing itself */}
      <svg viewBox="0 0 100 100" className="absolute inset-[26%]">
        <motion.path
          d="M50 6 L86 20 V48 C86 70 70 86 50 94 C30 86 14 70 14 48 V20 Z"
          fill="rgba(52,211,153,.08)" stroke="#34D399" strokeWidth="1.6" strokeLinejoin="round"
          initial={{ pathLength: 0, fillOpacity: 0 }} whileInView={{ pathLength: 1, fillOpacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease }}
        />
        <motion.path
          d="M35 50 L46 61 L67 39" fill="none" stroke="#34D399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 1.5, ease }}
        />
      </svg>
      <motion.div
        className="absolute inset-[26%] rounded-full border-2 border-ok/40"
        animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
      />
    </div>
  )
}

export function Privacy() {
  return (
    <section className="relative overflow-hidden border-y border-line/70 bg-surface/60 py-24 lg:py-32">
      <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-ok/10 blur-[140px]" aria-hidden="true" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHeader
            center={false}
            eyebrow="Privacy & trust"
            title={<>Powerful AI. <span className="text-gradient">Responsible by default.</span></>}
            sub="Employee monitoring only works when people trust it. Every feature ships with controls for transparency, consent and data protection."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {PRIVACY.map((p, i) => {
              const Icon = p.icon
              return (
                <Reveal key={p.t} delay={i * 0.08}>
                  <SpotlightCard rgb="52,211,153" tilt={false} className="h-full p-5">
                    <Icon className="h-5 w-5 text-ok transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    <h3 className="mt-3 font-semibold">{p.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.d}</p>
                  </SpotlightCard>
                </Reveal>
              )
            })}
          </div>
        </div>
        <Reveal className="hidden sm:block"><ShieldVisual /></Reveal>
      </Container>
    </section>
  )
}
