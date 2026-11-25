import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BeamBorder, Button, Container, Reveal, SectionHeader, SpotlightCard, ease } from '../components/ui'
import { PLANS } from '../data/pricing'

/* Plan cards. On the home page it shows its own header + a link to /pricing;
   the pricing page renders it with `header={false}` and `compareLink={false}`. */
export default function Pricing({ id = 'pricing', header = true, compareLink = true }) {
  const [yearly, setYearly] = useState(true)
  return (
    <section id={id} className={`relative ${header ? 'py-24 lg:py-32' : 'pb-24 pt-4'}`}>
      <Container>
        {header && <SectionHeader eyebrow="Pricing" title={<>Simple pricing. <span className="text-gradient">Pay per camera.</span></>} sub="Every plan includes unlimited employees, mobile apps and free onboarding." />}

        <Reveal className={`${header ? 'mt-10' : ''} flex justify-center`}>
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1" role="group" aria-label="Billing period">
            {[['Monthly', false], ['Yearly', true]].map(([l, v]) => (
              <button
                key={l}
                onClick={() => setYearly(v)}
                aria-pressed={yearly === v}
                className={`relative min-h-10 cursor-pointer rounded-full px-5 text-sm font-medium transition-colors ${yearly === v ? 'text-white' : 'text-muted hover:text-fg'}`}
              >
                {yearly === v && <motion.span layoutId="bill-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative">{l}{v && <span className={`ml-1.5 rounded px-1 text-xs ${yearly ? 'bg-white/20 text-white' : 'text-ok'}`}>−20%</span>}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-5 [perspective:1400px] lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const body = (
              <div className={`relative flex h-full flex-col rounded-2xl p-8 ${p.popular ? 'bg-gradient-to-b from-[#132147] to-[#0E1220]' : ''}`}>
                {p.popular && <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />}
                <div className="relative flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  {p.popular && (
                    <span className="relative flex items-center gap-1 overflow-hidden rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                      <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine_2.8s_ease-in-out_infinite]" aria-hidden="true" />
                      <Sparkles className="relative h-3.5 w-3.5" aria-hidden="true" /> <span className="relative">Most popular</span>
                    </span>
                  )}
                </div>
                <p className="relative mt-2 text-sm text-muted">{p.desc}</p>
                <div className="relative mt-6 flex h-14 items-end gap-1.5">
                  {p.custom ? (
                    <span className="font-display text-4xl font-bold">Custom</span>
                  ) : (
                    <>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={yearly ? 'y' : 'm'}
                          initial={{ y: 24, opacity: 0, filter: 'blur(4px)' }}
                          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                          exit={{ y: -24, opacity: 0, filter: 'blur(4px)' }}
                          transition={{ duration: 0.35, ease }}
                          className="font-display text-5xl font-bold tabular-nums"
                        >
                          ${yearly ? p.y : p.m}
                        </motion.span>
                      </AnimatePresence>
                      <span className="pb-1.5 text-sm text-muted">{p.unit}</span>
                    </>
                  )}
                </div>
                <div className="relative my-7 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
                <motion.ul
                  className="relative flex-1 space-y-3"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 + i * 0.1 } } }}
                >
                  {p.feats.map((f) => (
                    <motion.li
                      key={f}
                      variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { ease } } }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <motion.span
                        variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { type: 'spring', stiffness: 500, damping: 15 } } }}
                        className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-ok/15"
                      >
                        <Check className="h-3 w-3 text-ok" aria-hidden="true" />
                      </motion.span>
                      {f}
                    </motion.li>
                  ))}
                </motion.ul>
                <Button href="#contact" variant={p.popular ? 'primary' : 'ghost'} className="relative mt-8 w-full">
                  {p.custom ? 'Talk to sales' : 'Start free trial'}
                </Button>
              </div>
            )
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 70, rotateX: 22 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, ease, delay: i * 0.12 }}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className={p.popular ? 'lg:-my-3' : ''}
              >
                {p.popular ? (
                  <BeamBorder speed="4s" className="h-full shadow-[0_30px_90px_-30px_rgba(59,130,246,.75)]">{body}</BeamBorder>
                ) : (
                  <SpotlightCard tilt={false} className="h-full">{body}</SpotlightCard>
                )}
              </motion.div>
            )
          })}
        </div>
        {compareLink && (
          <Reveal className="mt-10 flex justify-center">
            <Link to="/pricing" className="group flex items-center gap-2 text-sm font-medium text-cyan hover:text-fg">
              Compare every feature & estimate your cost
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
