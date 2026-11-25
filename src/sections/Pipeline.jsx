import { motion, useReducedMotion } from 'framer-motion'
import { Bell, Cctv, Cpu, MapPin, Server, Smartphone, UserCheck } from 'lucide-react'
import { Container, Reveal, SectionHeader } from '../components/ui'

const INPUTS = [
  { icon: Cctv, t: 'IP cameras', d: 'RTSP · ONVIF' },
  { icon: Server, t: 'NVR / DVR', d: 'Existing recorders' },
  { icon: Smartphone, t: 'Mobile app', d: 'Field check-ins' },
]
const OUTPUTS = [
  { icon: Bell, t: 'Security alerts', d: 'Push · SMS · Slack', c: 'text-danger bg-danger/10 border-danger/30' },
  { icon: UserCheck, t: 'Attendance', d: 'Payroll · HRMS', c: 'text-ok bg-ok/10 border-ok/30' },
  { icon: MapPin, t: 'Workforce analytics', d: 'Live · Reports', c: 'text-cyan bg-cyan/10 border-cyan/30' },
]

// Connector geometry in a 1000×480 box: node rows sit at y = 80 / 240 / 400.
const ROWS = [80, 240, 400]
const IN_PATHS = ROWS.map((y) => `M265 ${y} C 320 ${y}, 330 240, 385 240`)
const OUT_PATHS = ROWS.map((y) => `M615 240 C 670 240, 680 ${y}, 735 ${y}`)

function Node({ icon: Icon, t, d, c = 'text-accent bg-accent/10 border-accent/30', delay }) {
  return (
    <Reveal delay={delay}>
      <div className="glass flex items-center gap-4 rounded-2xl p-4 transition-colors duration-300 hover:border-cyan/40">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${c}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <div>
          <p className="font-semibold">{t}</p>
          <p className="font-mono text-xs text-muted">{d}</p>
        </div>
      </div>
    </Reveal>
  )
}

function Engine() {
  return (
    <Reveal>
      <div className="relative mx-auto grid aspect-square w-full max-w-[260px] place-items-center">
        <div className="absolute inset-0 rounded-full border border-dashed border-accent/30 animate-[spin_30s_linear_infinite]" aria-hidden="true" />
        <div className="absolute inset-[9%] rounded-full border border-cyan/25 animate-[spin_18s_linear_infinite_reverse]" aria-hidden="true">
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_12px_#22D3EE]" />
        </div>
        <div className="absolute inset-[20%] rounded-full bg-accent/20 blur-2xl" aria-hidden="true" />
        <div className="hud-corners relative grid w-[70%] place-items-center rounded-2xl border border-accent/40 bg-[#0D1322]/90 px-3 py-5 text-center shadow-[0_0_60px_-10px_rgba(59,130,246,.7)]">
          <Cpu className="h-8 w-8 text-accent" aria-hidden="true" />
          <p className="mt-2 font-display text-sm font-semibold leading-tight">Vision Engine</p>
          <p className="mt-1 font-mono text-[10px] text-muted">detect · identify</p>
          <div className="mt-2.5 flex gap-1" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span key={i} className="w-1 rounded-full bg-cyan" animate={{ height: [6, 16, 6] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }} />
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default function Pipeline() {
  const reduce = useReducedMotion()
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Under the hood"
          title={<>From camera frame to action <span className="text-gradient">in milliseconds.</span></>}
          sub="Every stream flows through one AI engine that detects people, recognises faces and tracks movement — then routes the result to the right team."
        />

        <div className="relative mt-16 lg:h-[480px]">
          {/* connectors (desktop) */}
          <svg viewBox="0 0 1000 480" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full lg:block" fill="none" aria-hidden="true">
            {[...IN_PATHS, ...OUT_PATHS].map((d, i) => (
              <g key={i}>
                <path id={`pp-${i}`} d={d} stroke="rgba(59,130,246,.25)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <path d={d} stroke={i < 3 ? '#3B82F6' : '#22D3EE'} strokeWidth="1.5" strokeDasharray="2 10" vectorEffect="non-scaling-stroke" className="animate-[flow_1s_linear_infinite]" opacity=".8" />
                {!reduce && [0, 1].map((k) => (
                  <circle key={k} r="4" fill={i < 3 ? '#93C5FD' : '#22D3EE'}>
                    <animateMotion dur="2.4s" begin={`${k * 1.2 + i * 0.25}s`} repeatCount="indefinite">
                      <mpath href={`#pp-${i}`} />
                    </animateMotion>
                  </circle>
                ))}
              </g>
            ))}
          </svg>

          <div className="relative grid h-full gap-6 lg:grid-cols-[26.5%_1fr_26.5%] lg:gap-0">
            <div className="flex flex-col justify-around gap-4">
              <p className="font-mono text-xs uppercase tracking-wider text-muted lg:hidden">Inputs</p>
              {INPUTS.map((n, i) => <Node key={n.t} {...n} delay={i * 0.08} />)}
            </div>
            <div className="flex items-center justify-center py-4 lg:py-0">
              <Engine />
            </div>
            <div className="flex flex-col justify-around gap-4">
              <p className="font-mono text-xs uppercase tracking-wider text-muted lg:hidden">Outputs</p>
              {OUTPUTS.map((n, i) => <Node key={n.t} {...n} delay={0.2 + i * 0.08} />)}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
