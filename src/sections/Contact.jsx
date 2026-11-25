import { AnimatePresence, motion } from 'framer-motion'
import { Check, Mail, Phone } from 'lucide-react'
import { useState } from 'react'
import { BRAND } from '../config'
import { BeamBorder, Container, Eyebrow, Reveal } from '../components/ui'

const FIELDS = [
  { id: 'name', label: 'Full name', type: 'text', auto: 'name', required: true },
  { id: 'email', label: 'Work email', type: 'email', auto: 'email', required: true },
  { id: 'company', label: 'Company', type: 'text', auto: 'organization', required: true },
  { id: 'cameras', label: 'Number of cameras', type: 'number', auto: 'off', required: false },
]

function validate(v) {
  const e = {}
  if (!v.name?.trim()) e.name = 'Please enter your name.'
  if (!v.email?.trim()) e.email = 'Please enter your work email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'That email address doesn’t look right.'
  if (!v.company?.trim()) e.company = 'Please enter your company name.'
  return e
}

export default function Contact({ defaultInterest = 'Security + Attendance' }) {
  const [values, setValues] = useState({ interest: defaultInterest })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent

  const onSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate(values)
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(Object.keys(e)[0])?.focus()
      return
    }
    setStatus('sending')
    // TODO: connect to your backend / CRM endpoint here.
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('sent')
  }

  const set = (k) => (ev) => {
    setValues((v) => ({ ...v, [k]: ev.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 lg:py-32">
      <div className="bg-grid mask-fade absolute inset-0" aria-hidden="true" />
      <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[140px]" aria-hidden="true" />
      <Container className="relative">
        <Reveal y={50}>
        <BeamBorder radius="rounded-3xl" speed="7s" className="shadow-[0_40px_120px_-40px_rgba(59,130,246,.5)]">
        <div className="grid overflow-hidden rounded-3xl bg-[#0B0F1B]/95 lg:grid-cols-2">
          <div className="relative isolate overflow-hidden p-8 sm:p-12">
            {/* radar glow behind the pitch */}
            <div className="pointer-events-none absolute -bottom-40 -left-40 -z-10 h-[420px] w-[420px]" aria-hidden="true">
              {[1, 0.75, 0.5].map((k) => (
                <span key={k} className="absolute inset-0 m-auto rounded-full border border-accent/15" style={{ width: `${k * 100}%`, height: `${k * 100}%` }} />
              ))}
              <span className="absolute inset-[12%] rounded-full border border-dashed border-cyan/25 animate-[spin_30s_linear_infinite]" />
              <span className="absolute inset-[36%] rounded-full bg-accent/20 blur-3xl" />
            </div>
            <Reveal><Eyebrow>Book a demo</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                See it running on <span className="text-gradient">your own cameras.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 leading-relaxed text-muted">
                In a 30-minute call we connect one of your cameras, enroll a few test users and show live attendance, tracking and security alerts.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-8 space-y-3 text-sm">
                {['Free 14-day pilot on up to 5 cameras', 'Setup assistance from our engineers', 'No credit card required'].map((t) => (
                  <li key={t} className="flex items-center gap-3"><Check className="h-4 w-4 text-ok" aria-hidden="true" />{t}</li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:gap-8">
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 hover:text-fg"><Mail className="h-4 w-4" aria-hidden="true" />{BRAND.email}</a>
                <a href={`tel:${BRAND.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 hover:text-fg"><Phone className="h-4 w-4" aria-hidden="true" />{BRAND.phone}</a>
              </div>
            </Reveal>
          </div>

          <div className="border-t border-line bg-surface/70 p-8 sm:p-12 lg:border-l lg:border-t-0">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col items-center justify-center py-16 text-center" role="status">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }} className="relative grid h-16 w-16 place-items-center rounded-full bg-ok/15 text-ok">
                    <motion.span className="absolute inset-0 rounded-full border-2 border-ok" initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 1.2, repeat: 2, ease: 'easeOut' }} aria-hidden="true" />
                    <Check className="h-8 w-8" aria-hidden="true" />
                  </motion.span>
                  <h3 className="mt-6 text-2xl font-semibold">Request received</h3>
                  <p className="mt-2 max-w-sm text-muted">Thanks, {values.name?.split(' ')[0]}. We'll email {values.email} within one business day to schedule your demo.</p>
                </motion.div>
              ) : (
                <motion.form key="form" exit={{ opacity: 0, y: -10 }} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                  {FIELDS.map((f) => (
                    <div key={f.id} className={f.id === 'email' || f.id === 'company' ? 'sm:col-span-1' : ''}>
                      <label htmlFor={f.id} className="mb-2 block text-sm font-medium">
                        {f.label}{f.required && <span className="text-danger"> *</span>}
                      </label>
                      <input
                        id={f.id}
                        name={f.id}
                        type={f.type}
                        autoComplete={f.auto}
                        min={f.type === 'number' ? 1 : undefined}
                        value={values[f.id] || ''}
                        onChange={set(f.id)}
                        aria-invalid={!!errors[f.id]}
                        aria-describedby={errors[f.id] ? `${f.id}-err` : undefined}
                        className={`min-h-12 w-full rounded-xl border bg-card px-4 text-base text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/30 ${errors[f.id] ? 'border-danger' : 'border-line'}`}
                      />
                      {errors[f.id] && <p id={`${f.id}-err`} className="mt-1.5 text-sm text-danger">{errors[f.id]}</p>}
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label htmlFor="interest" className="mb-2 block text-sm font-medium">I'm interested in</label>
                    <select id="interest" value={values.interest} onChange={set('interest')} className="min-h-12 w-full cursor-pointer rounded-xl border border-line bg-card px-4 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/30">
                      <option>Security + Attendance</option>
                      <option>AI Security only</option>
                      <option>Attendance only</option>
                      <option>Employee tracking</option>
                      <option>Everything</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="msg" className="mb-2 block text-sm font-medium">Anything else? <span className="font-normal text-muted">(optional)</span></label>
                    <textarea id="msg" rows={3} value={values.msg || ''} onChange={set('msg')} className="w-full rounded-xl border border-line bg-card px-4 py-3 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="min-h-12 cursor-pointer rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(59,130,246,.8)] transition-all hover:bg-blue-500 disabled:cursor-wait disabled:opacity-70 sm:col-span-2"
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Sending…</span>
                    ) : 'Request my demo'}
                  </button>
                  <p className="text-xs text-muted sm:col-span-2">By submitting you agree to be contacted about this request. We never share your details.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
        </BeamBorder>
        </Reveal>
      </Container>
    </section>
  )
}
