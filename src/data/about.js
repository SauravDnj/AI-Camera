import { Eye, Handshake, Heart, Lightbulb, Lock, Rocket } from 'lucide-react'

// ⚠️ All company facts, people and offices below are PLACEHOLDERS — replace with your real details.

export const MISSION =
  'We believe the cameras already watching over our workplaces should do more than record. They should understand — protecting people, ending clunky attendance systems and giving teams real insight, while respecting everyone they see.'

export const ABOUT_STATS = [
  { value: 2021, label: 'Founded', plain: true },
  { value: 1200, suffix: '+', label: 'Companies using the platform' },
  { value: 85000, suffix: '+', label: 'Cameras connected' },
  { value: 24, label: 'Countries' },
]

export const TIMELINE = [
  { year: '2021', title: 'The idea', text: 'Our founders, frustrated by queues at fingerprint scanners and security teams staring at video walls, start building an AI that understands CCTV.' },
  { year: '2022', title: 'First customers', text: 'Face-recognition attendance launches with five IT companies. Check-in queues disappear overnight.' },
  { year: '2023', title: 'Security goes AI', text: 'Intrusion, tailgating and unknown-face detection ship. Alerts now reach phones in under a second.' },
  { year: '2024', title: 'Workforce insights', text: 'Employee tracking, heatmaps and privacy masking arrive — built together with HR teams and privacy experts.' },
  { year: '2025', title: 'Edge & enterprise', text: 'The Edge AI box lets video stay on-site. Multi-site enterprises and on-premise deployments follow.' },
  { year: '2026', title: 'Vision Model v3', text: 'Our third-generation model recognises people twice as fast and learns each customer’s site on its own.' },
]

export const VALUES = [
  { icon: Lock, t: 'Privacy is a feature', d: 'Encryption, masking and consent are built in from day one — never bolted on later.', rgb: '52,211,153' },
  { icon: Eye, t: 'Transparent AI', d: 'Every alert shows why it fired. Every match shows its confidence. No black boxes.', rgb: '34,211,238' },
  { icon: Rocket, t: 'Fast by default', d: 'From camera frame to phone in under a second, from sign-up to live in a day.', rgb: '59,130,246' },
  { icon: Heart, t: 'People first', d: 'We build for the employees on camera as much as for the managers watching.', rgb: '248,113,113' },
  { icon: Lightbulb, t: 'Always learning', d: 'Our models improve on every site — and so do we, with every customer conversation.', rgb: '251,191,36' },
  { icon: Handshake, t: 'Partners, not vendors', d: 'Engineers help you set up, and a real human answers when you need us.', rgb: '167,139,250' },
]

// Placeholder team — swap names, roles and bios for your real people.
export const TEAM = [
  { n: 'Alex Morgan', r: 'Co-founder & CEO', b: 'Previously led security products at a global facilities company. Believes every camera should have a brain.', tags: ['Strategy', 'Security'], rgb: '59,130,246' },
  { n: 'Riya Kapoor', r: 'Co-founder & CTO', b: 'Computer-vision researcher turned builder. Leads the Vision Engine and edge AI platform.', tags: ['Computer vision', 'Edge AI'], rgb: '34,211,238' },
  { n: 'Daniel Okafor', r: 'Head of AI Research', b: 'Trains the recognition and detection models — and obsesses over fairness across faces and lighting.', tags: ['ML', 'Fairness'], rgb: '167,139,250' },
  { n: 'Sofia Lindqvist', r: 'Head of Privacy & Trust', b: 'Data-protection lawyer who makes sure monitoring stays transparent, consensual and lawful.', tags: ['Privacy', 'Compliance'], rgb: '52,211,153' },
  { n: 'Marcus Chen', r: 'VP Engineering', b: 'Scales the platform from one camera to thousands across sites, clouds and on-prem servers.', tags: ['Platform', 'Cloud'], rgb: '251,191,36' },
  { n: 'Hana Suzuki', r: 'Head of Design', b: 'Designs dashboards security teams and HR managers actually enjoy using.', tags: ['Product', 'UX'], rgb: '248,113,113' },
  { n: 'Omar Farouk', r: 'Head of Customer Success', b: 'Gets every customer from first camera to fully live — usually in a single day.', tags: ['Onboarding', 'Support'], rgb: '59,130,246' },
  { n: 'Lucía Romero', r: 'Head of Sales', b: 'Helps IT companies, factories and hospitals find the right setup for their sites.', tags: ['Partnerships', 'Enterprise'], rgb: '34,211,238' },
]

export const OFFICES = [
  { city: 'Bengaluru', country: 'India', tz: 'Asia/Kolkata', role: 'HQ · Engineering' },
  { city: 'London', country: 'United Kingdom', tz: 'Europe/London', role: 'Europe · Privacy & Sales' },
  { city: 'Austin', country: 'United States', tz: 'America/Chicago', role: 'Americas · Customer Success' },
  { city: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', role: 'APAC · Partnerships' },
]

export const OPEN_ROLES = ['Senior Computer Vision Engineer', 'Edge Platform Engineer', 'Product Designer', 'Customer Success Manager', 'Enterprise Account Executive']
