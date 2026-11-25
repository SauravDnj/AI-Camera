import { motion } from 'framer-motion'
import { Bell, Brain, Cctv, FileText, Lock, MapPin, Radar, ScanFace, Video } from 'lucide-react'
import { Container, SectionHeader, SpotlightCard, ease } from '../components/ui'

// `hover` = icon micro-animation played when the card is hovered (CSS group-hover)
const FEATURES = [
  { icon: ScanFace, title: 'Face recognition attendance', desc: 'Recognises enrolled employees in under 300 ms — even with glasses, masks or changing hairstyles — with liveness anti-spoofing.', span: 'lg:col-span-2', visual: 'face', rgb: '34,211,238' },
  { icon: Brain, title: 'Custom-trained AI model', desc: 'The model fine-tunes on your own employee photos and camera angles, so accuracy improves every week.', visual: 'neural', rgb: '167,139,250' },
  { icon: Video, title: 'Live video & recording', desc: 'Watch every camera live in a video wall, with 30-day+ cloud or on-prem recording and instant clip export.', hover: 'group-hover:text-danger', rgb: '248,113,113' },
  { icon: MapPin, title: 'Real-time employee tracking', desc: 'Follow movement across floors and zones, with desk occupancy, dwell time and heatmaps.', hover: 'group-hover:animate-bounce', rgb: '52,211,153' },
  { icon: Bell, title: 'Instant smart alerts', desc: 'Push, email, SMS, Slack or Teams alerts with the video clip attached. Escalation rules per zone.', hover: 'group-hover:animate-[ring_0.6s_ease-in-out_2]', rgb: '251,191,36' },
  { icon: Radar, title: 'Intrusion & zone rules', desc: 'Draw virtual fences on any camera. Get alerts for after-hours entry, tailgating or loitering.', span: 'lg:col-span-2', visual: 'radar', rgb: '248,113,113' },
  { icon: FileText, title: 'Reports & payroll export', desc: 'Daily, weekly and monthly attendance, overtime and activity reports exported to CSV, Excel or your HRMS.', hover: 'group-hover:-rotate-6', rgb: '59,130,246' },
  { icon: Cctv, title: 'Works with any camera', desc: 'Connect existing IP cameras, NVRs and DVRs via RTSP / ONVIF. No rip-and-replace.', hover: 'group-hover:animate-[pan_1.2s_ease-in-out]', rgb: '34,211,238' },
  { icon: Lock, title: 'Enterprise-grade security', desc: 'End-to-end encryption, role-based access, audit logs and data residency of your choice.', hover: 'group-hover:scale-110', rgb: '52,211,153' },
]

function FaceVisual() {
  return (
    <div className="relative mx-auto mt-6 h-36 w-36 shrink-0 sm:mt-0" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle cx="50" cy="40" r="20" fill="none" stroke="#3B82F6" strokeOpacity=".5" />
        <path d="M18 92c4-18 18-26 32-26s28 8 32 26" fill="none" stroke="#3B82F6" strokeOpacity=".5" />
        {/* mesh lines between landmarks draw themselves in */}
        <motion.path
          d="M42 36 L58 36 L50 46 Z M44 52 L56 52 L50 46 M36 44 L42 36 M64 44 L58 36 M50 28 L42 36 M50 28 L58 36"
          fill="none" stroke="#22D3EE" strokeOpacity=".55" strokeWidth=".6"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease }}
        />
        {[[42, 36], [58, 36], [50, 46], [44, 52], [56, 52], [50, 28], [36, 44], [64, 44]].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="1.6" fill="#22D3EE" initial={{ opacity: 0 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ delay: i * 0.12, duration: 1.6, repeat: Infinity }} />
        ))}
      </svg>
      <div className="absolute inset-0 rounded-lg border border-cyan/50" />
      {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'left-0 bottom-0 border-l-2 border-b-2', 'right-0 bottom-0 border-r-2 border-b-2'].map((c) => (
        <span key={c} className={`absolute h-4 w-4 border-cyan ${c}`} />
      ))}
      <motion.div className="absolute inset-x-0 h-0.5 bg-cyan shadow-[0_0_12px_#22D3EE]" animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ok/15 px-2 py-0.5 font-mono text-[10px] text-ok">MATCH 98.7%</span>
    </div>
  )
}

function RadarVisual() {
  return (
    <div className="relative mx-auto mt-6 h-36 w-36 shrink-0 sm:mt-0" aria-hidden="true">
      {[1, 0.7, 0.4].map((s) => (
        <div key={s} className="absolute inset-0 m-auto rounded-full border border-accent/30" style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
      ))}
      <div className="absolute inset-x-0 top-1/2 h-px bg-accent/20" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-accent/20" />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'conic-gradient(from 0deg, rgba(34,211,238,.5), transparent 25%)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <span className="absolute left-[68%] top-[30%] h-2.5 w-2.5 rounded-full bg-danger shadow-[0_0_10px_#F87171]">
        <span className="absolute inset-0 animate-ping rounded-full bg-danger" />
      </span>
      <span className="absolute left-[30%] top-[62%] h-2 w-2 rounded-full bg-ok shadow-[0_0_10px_#34D399]" />
      <span className="absolute left-[55%] top-[70%] h-2 w-2 rounded-full bg-ok shadow-[0_0_10px_#34D399]" />
    </div>
  )
}

/* Tiny animated neural net for the AI-model card */
function NeuralVisual() {
  const L = [[10, [20, 50, 80]], [50, [12, 37, 63, 88]], [90, [35, 65]]]
  const edges = []
  for (let l = 0; l < L.length - 1; l++)
    for (const a of L[l][1]) for (const b of L[l + 1][1]) edges.push([L[l][0], a, L[l + 1][0], b])
  return (
    <svg viewBox="0 0 100 100" className="mt-5 h-20 w-full" preserveAspectRatio="none" aria-hidden="true">
      {edges.map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A78BFA" strokeWidth=".5" vectorEffect="non-scaling-stroke"
          animate={{ opacity: [0.15, 0.8, 0.15] }} transition={{ duration: 2.4, repeat: Infinity, delay: (i % 7) * 0.25 }} />
      ))}
      {L.flatMap(([x, ys]) => ys.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill="#0D1120" stroke="#A78BFA" strokeWidth="1" vectorEffect="non-scaling-stroke" />))}
    </svg>
  )
}

function Card({ f, i }) {
  const Icon = f.icon
  return (
    <motion.div
      className={`[perspective:1200px] ${f.span || ''}`}
      initial={{ opacity: 0, y: 60, rotateX: 18, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease, delay: (i % 3) * 0.1 }}
    >
      <SpotlightCard rgb={f.rgb} className="h-full p-7">
        <div className={`relative ${f.visual === 'face' || f.visual === 'radar' ? 'grid items-center gap-6 sm:grid-cols-[1fr_auto]' : ''}`}>
          <div>
            <span
              className="relative grid h-11 w-11 place-items-center rounded-xl border transition-all duration-300 group-hover:shadow-[0_0_24px_-4px_var(--glow)]"
              style={{ borderColor: `rgba(${f.rgb},.35)`, background: `rgba(${f.rgb},.1)`, color: `rgb(${f.rgb})` }}
            >
              <Icon className={`h-5 w-5 transition-all duration-300 ${f.hover || ''}`} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
            {f.visual === 'neural' && <NeuralVisual />}
          </div>
          {f.visual === 'face' && <FaceVisual />}
          {f.visual === 'radar' && <RadarVisual />}
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="bg-grid mask-fade absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" aria-hidden="true" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Features"
          title={<>Everything your cameras <span className="text-gradient">could have been doing.</span></>}
          sub="A complete AI vision stack — from recognition and tracking to alerts, recording and reports."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => <Card key={f.title} f={f} i={i} />)}
        </div>
      </Container>
    </section>
  )
}
