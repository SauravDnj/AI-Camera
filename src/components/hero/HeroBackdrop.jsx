import { motion } from 'framer-motion'
import NeuralCanvas from './NeuralCanvas'

/* Shared animated hero background: aurora glows, neural-network canvas,
   moving perspective grid floor, horizon line, cursor spotlight and vignette.
   `rgb` tints the second aurora so each page can have its own accent. */
export default function HeroBackdrop({ y, spotlight, rgb = '34,211,238' }) {
  return (
    <>
      <motion.div style={y ? { y } : undefined} className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-[10%] -top-[20%] h-[70vh] w-[60vw] rounded-full bg-accent/25 blur-[140px] animate-[aurora_18s_ease-in-out_infinite]" />
        <div className="absolute -right-[10%] top-[10%] h-[60vh] w-[45vw] rounded-full blur-[140px] animate-[aurora_22s_ease-in-out_infinite_reverse]" style={{ background: `rgba(${rgb},.16)` }} />
        <div className="absolute bottom-[-20%] left-[30%] h-[50vh] w-[50vw] rounded-full bg-indigo-500/15 blur-[150px] animate-[aurora_26s_ease-in-out_infinite]" />
        <NeuralCanvas className="absolute inset-0 opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden [perspective:700px] [mask-image:linear-gradient(to_top,#000_10%,transparent_90%)]">
          <div className="absolute inset-x-[-50%] -top-[56px] bottom-0 origin-bottom [transform:rotateX(62deg)]">
            <div className="bg-grid h-[calc(100%+56px)] w-full animate-[gridmove_3s_linear_infinite] [background-size:56px_56px] opacity-90" />
          </div>
        </div>
        <div className="absolute inset-x-0 top-[45%] h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${rgb},.4), transparent)` }} />
      </motion.div>
      {spotlight && <motion.div className="pointer-events-none absolute inset-0 -z-10" style={{ background: spotlight }} aria-hidden="true" />}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,#07080D_100%)]" aria-hidden="true" />
    </>
  )
}
