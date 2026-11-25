import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Container, Reveal, SectionHeader } from '../components/ui'

const FAQS = [
  { q: 'Do I need to buy new cameras?', a: 'No. The platform works with most existing IP cameras, NVRs and DVRs that support RTSP or ONVIF. For best face-recognition results at entrances we recommend 1080p or higher.' },
  { q: 'How is the AI model trained for my employees?', a: 'You upload 3–5 photos per employee (or they self-enroll from the mobile app). The model creates an encrypted face embedding for each person and keeps fine-tuning on verified matches from your own cameras, lighting and angles.' },
  { q: 'Can it be fooled with a photo or a video on a phone?', a: 'Liveness detection checks depth, texture and micro-movement to reject printed photos, screens and masks before marking attendance.' },
  { q: 'Is employee tracking legal and privacy-safe?', a: 'Rules differ by country, so check local labour and data-protection law. The platform gives you consent flows, privacy masking, configurable retention and audit logs to help you run monitoring transparently.' },
  { q: 'Does it run in the cloud or on-premise?', a: 'Both. Process video on a small edge device on-site, in your private cloud, or in our hosted cloud — and mix them across sites.' },
  { q: 'Which systems does it integrate with?', a: 'Attendance and activity data can be exported to payroll and HRMS tools via CSV, Excel, REST API or webhooks. Alerts can go to email, SMS, Slack, Microsoft Teams and the mobile app.' },
]

function Item({ f, open, onToggle, i }) {
  return (
    <div className={`relative border-b border-line transition-colors duration-300 ${open ? 'bg-gradient-to-r from-accent/[.07] to-transparent' : ''}`}>
      {open && (
        <motion.span
          layoutId="faq-active"
          className="absolute -left-px bottom-0 top-0 w-0.5 rounded-full bg-gradient-to-b from-accent to-cyan shadow-[0_0_12px_#22D3EE]"
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          aria-hidden="true"
        />
      )}
      <h3 className="pl-5">
        <button
          id={`faq-q-${i}`}
          aria-expanded={open}
          aria-controls={`faq-a-${i}`}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-base font-medium transition-colors hover:text-cyan sm:text-lg"
        >
          {f.q}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className={`mr-3 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${open ? 'border-cyan/60 bg-cyan/10 text-cyan' : 'border-line'}`}>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-a-${i}`}
            role="region"
            aria-labelledby={`faq-q-${i}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pl-5 pr-12 leading-relaxed text-muted">{f.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq({ items = FAQS, title = 'Questions, answered.' }) {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeader center={false} eyebrow="FAQ" title={title} sub="Can't find what you need? Our team replies within one business day." />
        <Reveal>
          <div className="border-t border-line">
            {items.map((f, i) => <Item key={f.q} f={f} i={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
