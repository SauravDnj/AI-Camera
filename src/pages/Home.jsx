import { useEffect, useState } from 'react'
import BootIntro from '../components/hero/BootIntro'
import { BRAND } from '../config'
import Contact from '../sections/Contact'
import Dashboard from '../sections/Dashboard'
import Faq from '../sections/Faq'
import Features from '../sections/Features'
import Hero from '../sections/Hero'
import HowItWorks from '../sections/HowItWorks'
import { Industries, Privacy } from '../sections/Industries'
import Pipeline from '../sections/Pipeline'
import Pricing from '../sections/Pricing'
import Solutions from '../sections/Solutions'
import TrustBar from '../sections/TrustBar'

const DESC = 'Sentra AI turns your existing CCTV cameras into an AI system for security monitoring, face-recognition attendance and real-time employee tracking.'

export default function Home() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    document.title = `${BRAND.name} ${BRAND.suffix} — ${BRAND.tagline}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', DESC)
  }, [])
  return (
    <>
      <BootIntro onDone={() => setReady(true)} />
      <Hero ready={ready} />
      <TrustBar />
      <Pipeline />
      <Solutions />
      <Features />
      <HowItWorks />
      <Dashboard />
      <Industries />
      <Privacy />
      <Pricing />
      <Faq />
      <Contact />
    </>
  )
}
