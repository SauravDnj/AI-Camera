// Demo data for the interactive dashboard preview (all fictional).

export const LVL = {
  critical: { label: 'Critical', cls: 'bg-danger/15 text-danger', dot: 'bg-danger', rgb: '248,113,113' },
  warning: { label: 'Warning', cls: 'bg-warn/15 text-warn', dot: 'bg-warn', rgb: '251,191,36' },
  info: { label: 'Info', cls: 'bg-cyan/15 text-cyan', dot: 'bg-cyan', rgb: '34,211,238' },
  ok: { label: 'Resolved', cls: 'bg-ok/15 text-ok', dot: 'bg-ok', rgb: '52,211,153' },
}

export const CAMS = [
  { id: 'CAM-01', name: 'Main gate', floor: 'Ground', scene: 'gate', people: 2 },
  { id: 'CAM-02', name: 'Reception', floor: 'Ground', scene: 'lobby', people: 3 },
  { id: 'CAM-04', name: 'Open office', floor: 'Floor 2', scene: 'office', people: 3, live: true },
  { id: 'CAM-11', name: 'Server room', floor: 'Floor 2', scene: 'server', people: 1 },
  { id: 'CAM-14', name: 'Design studio', floor: 'Floor 3', scene: 'office', people: 2 },
  { id: 'CAM-17', name: 'Parking P2', floor: 'Ground', scene: 'parking', people: 1 },
]

export const ALERT_POOL = [
  { t: 'Unknown face detected', cam: 'CAM-04', z: 'Zone B · Floor 2', lvl: 'critical' },
  { t: 'Tailgating at server room', cam: 'CAM-11', z: 'Door 3 · Floor 2', lvl: 'critical' },
  { t: 'Rahul M. checked in late', cam: 'CAM-01', z: 'Main gate', lvl: 'warning' },
  { t: 'Loitering near parking', cam: 'CAM-17', z: 'Parking P2', lvl: 'warning' },
  { t: 'Visitor badge verified', cam: 'CAM-02', z: 'Reception', lvl: 'info' },
  { t: 'Desk idle > 45 min', cam: 'CAM-14', z: 'Desk 3-14', lvl: 'info' },
  { t: 'After-hours motion', cam: 'CAM-17', z: 'Parking P2', lvl: 'critical' },
]

export const DEPTS = ['All', 'Engineering', 'Design', 'QA', 'HR', 'Sales', 'DevOps']

// status: present | late | leave | absent
export const EMPLOYEES = [
  { id: 'EMP-0142', n: 'Priya Sharma', d: 'Engineering', in: '09:02', out: '18:10', status: 'present', active: 92, breaks: 38 },
  { id: 'EMP-0087', n: 'Daniel Kim', d: 'Design', in: '09:11', out: '18:02', status: 'present', active: 88, breaks: 45 },
  { id: 'EMP-0203', n: 'Rahul Mehta', d: 'QA', in: '09:38', out: '18:41', status: 'late', active: 81, breaks: 52 },
  { id: 'EMP-0019', n: 'Aisha Khan', d: 'HR', in: '08:54', out: '17:30', status: 'present', active: 90, breaks: 35 },
  { id: 'EMP-0311', n: 'Tom Becker', d: 'DevOps', in: '—', out: '—', status: 'leave', active: 0, breaks: 0 },
  { id: 'EMP-0156', n: 'Sara Lopez', d: 'Sales', in: '09:41', out: '18:20', status: 'present', active: 84, breaks: 40 },
  { id: 'EMP-0077', n: 'Kenji Watanabe', d: 'Engineering', in: '08:47', out: '17:55', status: 'present', active: 95, breaks: 30 },
  { id: 'EMP-0240', n: 'Maria Rossi', d: 'Design', in: '09:52', out: '18:58', status: 'late', active: 79, breaks: 48 },
  { id: 'EMP-0118', n: 'Omar Haddad', d: 'Engineering', in: '09:05', out: '18:15', status: 'present', active: 91, breaks: 41 },
  { id: 'EMP-0265', n: 'Lena Fischer', d: 'QA', in: '—', out: '—', status: 'absent', active: 0, breaks: 0 },
  { id: 'EMP-0090', n: 'Arjun Patel', d: 'DevOps', in: '08:58', out: '18:05', status: 'present', active: 87, breaks: 37 },
  { id: 'EMP-0188', n: 'Chloe Martin', d: 'Sales', in: '09:14', out: '18:00', status: 'present', active: 83, breaks: 44 },
]

export const STATUS = {
  present: { label: 'On time', cls: 'text-ok bg-ok/10' },
  late: { label: 'Late', cls: 'text-warn bg-warn/10' },
  leave: { label: 'On leave', cls: 'text-cyan bg-cyan/10' },
  absent: { label: 'Absent', cls: 'text-danger bg-danger/10' },
}

export const SERIES = {
  attendance: {
    label: 'Attendance rate', unit: '%',
    week: [['Mon', 96], ['Tue', 94], ['Wed', 98], ['Thu', 91], ['Fri', 95], ['Sat', 62], ['Sun', 18]],
    month: [['W1', 93], ['W2', 95], ['W3', 91], ['W4', 96]],
    max: 100,
  },
  checkin: {
    label: 'Avg. check-in delay', unit: ' min',
    week: [['Mon', 6], ['Tue', 4], ['Wed', 3], ['Thu', 9], ['Fri', 5], ['Sat', 2], ['Sun', 1]],
    month: [['W1', 7], ['W2', 5], ['W3', 6], ['W4', 4]],
    max: 12,
  },
  alerts: {
    label: 'Security alerts', unit: '',
    week: [['Mon', 4], ['Tue', 2], ['Wed', 6], ['Thu', 3], ['Fri', 5], ['Sat', 8], ['Sun', 7]],
    month: [['W1', 24], ['W2', 31], ['W3', 19], ['W4', 27]],
    max: { week: 10, month: 35 },
  },
}

// Occupancy heatmap: 5 days × 10 hours (08:00–17:00), values 0–1
export const HEAT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, di) => ({
  d,
  v: Array.from({ length: 10 }, (_, h) => {
    const base = h < 1 ? 0.25 : h === 4 ? 0.45 : h > 8 ? 0.3 : 0.75
    return Math.max(0.05, Math.min(1, base + Math.sin((h + 1) * (di + 2)) * 0.18))
  }),
}))
