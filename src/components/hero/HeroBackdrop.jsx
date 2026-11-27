import { motion } from 'framer-motion'
import NeuralCanvas from './NeuralCanvas'

/* Shared animated hero background: aurora glows, neural-network canvas,
   moving perspective grid floor, horizon line, cursor spotlight and vignette.
   `rgb` tints the second aurora so each page can have its own accent. */
export default function HeroBackdrop({ y, spotlight, rgb = '34,211,238' }) {
  return (
    <>
      <motion.div style={y ? { y } : undefined} className="absolute inset-0 -z-10" aria-hidden="true">
        {/* soft top light (Linear-style) instead of coloured auroras */}
        <div className="absolute left-1/2 top-[-40%] h-[110vh] w-[110vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,.05),transparent)] animate-[aurora_24s_ease-in-out_infinite]" />
        <div className="absolute -right-[20%] top-[-5%] h-[80vh] w-[60vw] animate-[aurora_30s_ease-in-out_infinite_reverse]" style={{ background: `radial-gradient(closest-side, rgba(${rgb},.06), transparent)` }} />
        <NeuralCanvas className="absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden [perspective:700px] [mask-image:linear-gradient(to_top,#000_10%,transparent_90%)]">
          <div className="absolute inset-x-[-50%] -top-[56px] bottom-0 origin-bottom [transform:rotateX(62deg)]">
            <div className="bg-grid h-[calc(100%+56px)] w-full animate-[gridmove_3s_linear_infinite] [background-size:56px_56px] opacity-40" />
          </div>
        </div>
        <div className="absolute inset-x-0 top-[45%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent)' }} />
      </motion.div>
      {spotlight && <motion.div className="pointer-events-none absolute inset-0 -z-10" style={{ background: spotlight }} aria-hidden="true" />}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,#08090A_100%)]" aria-hidden="true" />
    </>
  )
}
