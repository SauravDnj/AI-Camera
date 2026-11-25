# Sentra AI — Marketing Website

Landing website for an AI camera platform: **AI security**, **face-recognition attendance** and **real-time employee tracking**.

## Stack
- React 19 + Vite
- Tailwind CSS v4 (design tokens in `src/index.css` → `@theme`)
- Framer Motion — reveals, tabs, hero word animation, 3D tilt, live alert feed
- GSAP ScrollTrigger — pinned horizontal "How it works" section
- Lenis — smooth scrolling
- lucide-react — icons

## Run
```bash
npm install
npm run dev       # development
npm run build     # production build → dist/
npm run preview   # serve the build
```

## Customise
| What | Where |
|------|-------|
| Brand name, email, phone | `src/config.js` |
| Colors / fonts | `src/index.css` (`@theme`) |
| Stats in the counter strip | `src/sections/TrustBar.jsx` (`STATS`) — replace with your verified numbers |
| Plans & prices | `src/sections/Pricing.jsx` (`PLANS`) |
| FAQ | `src/sections/Faq.jsx` |
| Demo form submission | `src/sections/Contact.jsx` → `onSubmit` (TODO: connect to your API/CRM) |

## Pages
| URL | Content |
|-----|---------|
| `/` | Home page (all sections below) |
| `/solutions/ai-security` | AI Security — live camera feed visual |
| `/solutions/employee-tracking` | Employee Tracking — live floor-plan visual |
| `/solutions/smart-attendance` | Smart Attendance — face check-in kiosk visual |
| `/pricing` | Plans, interactive cost calculator, feature comparison, add-ons, pricing FAQ — data in `src/data/pricing.js` |
| `/about` | Mission, stats, story timeline, values, team flip cards, offices with live clocks, careers — data in `src/data/about.js` (**all placeholders**) |
| `/contact` | Topic cards, 4-step contact form (demo time-slot picker or message → review → success), contact channels, offices, system status, FAQ. Deep-link a topic with `/contact?topic=demo` (`sales`, `support`, `partner`, `careers`, `press`). Submission is simulated — connect it in `ContactForm.submit` in `src/pages/ContactPage.jsx` |
| anything else | 404 page |

All solution-page text (headline, stats, capabilities, steps, roles, FAQs) lives in **`src/data/solutions.js`**. Add a new object there to create another solution page; it appears in the navbar menu automatically.

**Hosting:** the site uses client-side routing, so your host must send all paths to `index.html` (Netlify: `_redirects` with `/* /index.html 200`; Vercel: a rewrite; Nginx: `try_files $uri /index.html`).

## Home hero
Files in `src/components/hero/`:
- `BootIntro.jsx` — ~2s "system boot" overlay, once per browser session, skippable (delete `<BootIntro>` in `src/pages/Home.jsx` to remove it)
- `NeuralCanvas.jsx` — interactive particle network background (pauses off-screen)
- `HeroVisual.jsx` — 3D command-center scene: tilting live feed + floating HUD cards with mouse-depth parallax
- `ScrambleWord.jsx` — the decoding rotating word in the headline (edit `WORDS` in `src/sections/Hero.jsx`)
- `LiveTicker.jsx` — live telemetry strip at the bottom of the hero

## Interactive dashboard demo
`src/sections/Dashboard.jsx` (shell, alerts state, drawers, "Simulate incident") with views in `src/sections/dashboard/`:
- `views.jsx` — Overview, Cameras, People, Alerts, Analytics
- `parts.jsx` — camera tile, bar chart with tooltips, drawer, segmented control
- `data.js` — demo employees, cameras, alerts and chart series (fictional — edit freely)

The same component appears on each solution page (section `#demo`). Its starting view and heading come from the `demo` field of each solution in `src/data/solutions.js`; `<Dashboard initialView="people" title={…} />` works anywhere.

## Home page sections
Navbar → Hero (animated AI camera feed) → Stats + integrations marquee → Solutions tabs (Security / Tracking / Attendance) → Features bento → How it works (pinned scroll) → Dashboard preview (live alerts, attendance table, chart) → Industries → Privacy → Pricing → FAQ → Demo form → Footer.

All motion respects `prefers-reduced-motion`.
