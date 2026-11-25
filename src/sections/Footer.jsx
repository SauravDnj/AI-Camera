import { Link } from 'react-router-dom'
import { BRAND } from '../config'
import { Container, LogoMark } from '../components/ui'

const COLS = [
  { h: 'Product', l: [['AI Security', '/solutions/ai-security'], ['Smart Attendance', '/solutions/smart-attendance'], ['Employee Tracking', '/solutions/employee-tracking'], ['Dashboard', '/#dashboard'], ['Pricing', '/pricing']] },
  { h: 'Company', l: [['About', '/about'], ['Careers', '/about#careers'], ['Partners', '#'], ['Contact', '/contact']] },
  { h: 'Resources', l: [['Documentation', '#'], ['API reference', '#'], ['Camera compatibility', '#'], ['FAQ', '/#faq']] },
  { h: 'Legal', l: [['Privacy policy', '#'], ['Terms of service', '#'], ['Security', '#'], ['DPA', '#']] },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/60 pb-10 pt-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-display text-lg font-semibold">{BRAND.name}<span className="text-cyan"> {BRAND.suffix}</span></span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{BRAND.tagline}. Turn every camera into an intelligent security and workforce sensor.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLS.map((c) => (
              <div key={c.h}>
                <h4 className="text-sm font-semibold">{c.h}</h4>
                <ul className="mt-4 space-y-2.5">
                  {c.l.map(([t, h]) => (
                    <li key={t}>
                      {h.startsWith('/')
                        ? <Link to={h} className="text-sm text-muted transition-colors hover:text-fg">{t}</Link>
                        : <a href={h} className="text-sm text-muted transition-colors hover:text-fg">{t}</a>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name} {BRAND.suffix}. All rights reserved.</p>
          <p className="flex items-center gap-2 font-mono text-xs"><span className="h-1.5 w-1.5 rounded-full bg-ok blink" />All systems operational</p>
        </div>
      </Container>
    </footer>
  )
}
