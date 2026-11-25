// Placeholder prices & plan contents — edit to match your real offer.

export const PLANS = [
  { key: 'starter', name: 'Starter', desc: 'For small offices getting started with AI attendance.', m: 49, y: 39, unit: '/ camera / mo', maxCams: 10, feats: ['Up to 10 cameras', 'Face-recognition attendance', 'Live view + 7-day recording', 'Email alerts', 'Monthly reports'] },
  { key: 'business', name: 'Business', desc: 'Security + workforce tracking for growing companies.', m: 89, y: 71, unit: '/ camera / mo', maxCams: 100, popular: true, feats: ['Up to 100 cameras', 'Everything in Starter', 'Employee tracking & heatmaps', 'Intrusion & zone rules', '30-day cloud recording', 'Slack / Teams / SMS alerts', 'HRMS & payroll export'] },
  { key: 'enterprise', name: 'Enterprise', desc: 'Multi-site, on-premise and custom AI models.', custom: true, feats: ['Unlimited cameras & sites', 'Everything in Business', 'On-premise / private cloud', 'Custom-trained AI models', 'SSO, audit logs, SLA', 'Dedicated success manager'] },
]

// Optional add-ons used by the calculator and the add-on cards.
// per = 'camera' (per camera / month) | 'month' (flat per month) | 'once' (one-time)
export const ADDONS = [
  { key: 'retention', name: 'Extended recording', desc: '90-day video retention instead of 30.', price: 8, per: 'camera' },
  { key: 'sms', name: 'SMS & voice alerts', desc: 'Unlimited SMS and automated voice calls for critical alerts.', price: 29, per: 'month' },
  { key: 'edge', name: 'Edge AI box', desc: 'On-site GPU appliance for up to 16 cameras — keeps video in your building.', price: 690, per: 'once' },
  { key: 'support', name: 'Priority support', desc: '1-hour response time and a named support engineer.', price: 149, per: 'month' },
]

// Feature comparison: value true = included, false = not included, string = detail
export const COMPARE = [
  {
    group: 'AI Security',
    rows: [
      ['Live view & video wall', true, true, true],
      ['Intrusion & virtual-fence alerts', false, true, true],
      ['Unknown / blacklisted face detection', false, true, true],
      ['Tailgating & after-hours detection', false, true, true],
      ['Fire, smoke & PPE detection', false, false, true],
      ['Smart video search', false, true, true],
      ['Video retention', '7 days', '30 days', 'Custom'],
    ],
  },
  {
    group: 'Smart Attendance',
    rows: [
      ['Face-recognition check-in', true, true, true],
      ['Liveness anti-spoofing', true, true, true],
      ['Shifts, late marks & overtime', true, true, true],
      ['Leave & holiday calendars', false, true, true],
      ['Mobile & field check-in', false, true, true],
      ['Payroll / HRMS export', 'CSV', 'CSV · API', 'CSV · API · Custom'],
    ],
  },
  {
    group: 'Employee Tracking',
    rows: [
      ['Real-time location by zone', false, true, true],
      ['Active / idle / break time', false, true, true],
      ['Heatmaps & occupancy', false, true, true],
      ['Privacy masking & aggregate views', false, true, true],
    ],
  },
  {
    group: 'Platform & support',
    rows: [
      ['Cameras', 'Up to 10', 'Up to 100', 'Unlimited'],
      ['Sites', '1', 'Up to 5', 'Unlimited'],
      ['Deployment', 'Cloud', 'Cloud · Edge', 'Cloud · Edge · On-prem'],
      ['Custom-trained AI model', false, false, true],
      ['SSO / SAML & audit logs', false, false, true],
      ['Uptime SLA', false, '99.5%', '99.9%'],
      ['Support', 'Email', 'Email · Chat', 'Dedicated manager'],
    ],
  },
]

export const PRICING_FAQS = [
  { q: 'Is there a free trial?', a: 'Yes — every plan starts with a free 14-day pilot on up to 5 cameras. No credit card required, and our engineers help you set it up.' },
  { q: 'How is pricing calculated?', a: 'You pay per connected camera per month. Employees, users and mobile apps are unlimited on every plan. Add-ons are optional.' },
  { q: 'Can I change plans later?', a: 'Any time. Upgrades apply immediately; downgrades take effect at the start of your next billing period.' },
  { q: 'What does yearly billing save?', a: 'Paying yearly saves 20% compared with monthly billing on Starter and Business plans.' },
  { q: 'Do I need to buy hardware?', a: 'No. Most IP cameras and recorders work as-is. The optional Edge AI box is only needed if you want video processed fully on-site.' },
  { q: 'What payment methods do you accept?', a: 'Card payments for monthly plans, and card or bank transfer (invoice) for yearly and Enterprise plans.' },
]
