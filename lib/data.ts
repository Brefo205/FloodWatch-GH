export type Severity = 'Low' | 'Moderate' | 'High' | 'Critical'

export type ReportStatus = 'Pending' | 'Verified' | 'Responding' | 'Resolved'

export type FloodReport = {
  id: string
  title: string
  area: string
  region: string
  lat: number
  lng: number
  description: string
  severity: Severity
  status: ReportStatus
  reporter: string
  createdAt: string // ISO
  photo: string
  // prediction inputs
  waterDepthCm: number
  rainfallMm: number
  areaType: 'Low-lying basin' | 'Riverbank' | 'Coastal' | 'Urban drainage' | 'Hillside'
  // prediction output
  spreadCells: number
  affectedRadiusM: number
}

export const SEVERITY_META: Record<
  Severity,
  { color: string; bg: string; ring: string; label: string; description: string }
> = {
  Low: {
    color: 'var(--sev-low)',
    bg: 'rgba(22,163,74,0.12)',
    ring: 'rgba(22,163,74,0.4)',
    label: 'Low',
    description: 'Contained pooling. Minimal risk to people or property.',
  },
  Moderate: {
    color: 'var(--sev-moderate)',
    bg: 'rgba(202,138,4,0.14)',
    ring: 'rgba(202,138,4,0.4)',
    label: 'Moderate',
    description: 'Spreading into nearby streets. Caution advised for residents.',
  },
  High: {
    color: 'var(--sev-high)',
    bg: 'rgba(234,88,12,0.14)',
    ring: 'rgba(234,88,12,0.4)',
    label: 'High',
    description: 'Large spread across multiple streets. Evacuation may be needed.',
  },
  Critical: {
    color: 'var(--sev-critical)',
    bg: 'rgba(220,38,38,0.16)',
    ring: 'rgba(220,38,38,0.45)',
    label: 'Critical',
    description: 'Massive spread threatening many communities. Immediate response.',
  },
}

export const GHANA_CENTER: [number, number] = [5.6037, -0.187]

export const reports: FloodReport[] = [
  {
    id: 'FW-2041',
    title: 'Odaw River overflow at Circle',
    area: 'Kwame Nkrumah Circle',
    region: 'Greater Accra',
    lat: 5.5709,
    lng: -0.2074,
    description:
      'The Odaw drain has overtopped its banks after three hours of heavy rain. Water is knee-deep on the road below the interchange and rising. Several taxis are stranded.',
    severity: 'Critical',
    status: 'Responding',
    reporter: 'Ama Boateng',
    createdAt: '2026-06-23T01:40:00Z',
    photo: '/floods/accra-circle-flood.png',
    waterDepthCm: 78,
    rainfallMm: 64,
    areaType: 'Low-lying basin',
    spreadCells: 412,
    affectedRadiusM: 920,
  },
  {
    id: 'FW-2039',
    title: 'Kaneshie market drain blocked',
    area: 'Kaneshie',
    region: 'Greater Accra',
    lat: 5.5613,
    lng: -0.2329,
    description:
      'Storm drain in front of the market is blocked with refuse. Water is backing up into the trading stalls and onto the main road.',
    severity: 'High',
    status: 'Verified',
    reporter: 'Kofi Mensah',
    createdAt: '2026-06-23T00:55:00Z',
    photo: '/floods/market-flood.png',
    waterDepthCm: 46,
    rainfallMm: 41,
    areaType: 'Urban drainage',
    spreadCells: 214,
    affectedRadiusM: 540,
  },
  {
    id: 'FW-2036',
    title: 'Standing water near Achimota',
    area: 'Achimota',
    region: 'Greater Accra',
    lat: 5.6189,
    lng: -0.2273,
    description:
      'Water pooling at the foot of the overpass. Passable but slow, and getting deeper near the gutter.',
    severity: 'Moderate',
    status: 'Verified',
    reporter: 'Yaw Owusu',
    createdAt: '2026-06-22T23:30:00Z',
    photo: '/floods/street-flood.png',
    waterDepthCm: 24,
    rainfallMm: 28,
    areaType: 'Urban drainage',
    spreadCells: 96,
    affectedRadiusM: 300,
  },
  {
    id: 'FW-2035',
    title: 'Street flooding in Adenta',
    area: 'Adenta',
    region: 'Greater Accra',
    lat: 5.7075,
    lng: -0.1647,
    description:
      'Our street is flooding fast after the downpour. Water is mid-shin and creeping toward the houses — the gutters cannot take it. A parked car is already half submerged.',
    severity: 'High',
    status: 'Verified',
    reporter: 'Nana Asante',
    createdAt: '2026-06-22T23:05:00Z',
    photo: '/floods/adenta-flood.png',
    waterDepthCm: 41,
    rainfallMm: 44,
    areaType: 'Low-lying basin',
    spreadCells: 232,
    affectedRadiusM: 580,
  },
  {
    id: 'FW-2032',
    title: 'Weija spillage spreading inland',
    area: 'Weija',
    region: 'Greater Accra',
    lat: 5.5667,
    lng: -0.3333,
    description:
      'Water released from the Weija dam is spreading across the low ground below the spillway and onto the road near the houses. It keeps rising.',
    severity: 'Critical',
    status: 'Responding',
    reporter: 'Mensah Tetteh',
    createdAt: '2026-06-22T22:40:00Z',
    photo: '/floods/weija-flood.png',
    waterDepthCm: 71,
    rainfallMm: 58,
    areaType: 'Riverbank',
    spreadCells: 388,
    affectedRadiusM: 880,
  },
  {
    id: 'FW-2034',
    title: 'Subin River rising in Kumasi',
    area: 'Asafo',
    region: 'Ashanti',
    lat: 6.6885,
    lng: -1.6244,
    description:
      'The Subin is climbing fast near the Asafo market bridge. Lower stalls are already taking water.',
    severity: 'High',
    status: 'Pending',
    reporter: 'Akosua Adjei',
    createdAt: '2026-06-22T22:10:00Z',
    photo: '/floods/river-flood.png',
    waterDepthCm: 52,
    rainfallMm: 47,
    areaType: 'Riverbank',
    spreadCells: 248,
    affectedRadiusM: 610,
  },
  {
    id: 'FW-2030',
    title: 'Coastal surge at Sekondi shore',
    area: 'Sekondi',
    region: 'Western',
    lat: 4.9344,
    lng: -1.7044,
    description:
      'High tide combined with rain has pushed seawater over the low wall along the shore road.',
    severity: 'Moderate',
    status: 'Resolved',
    reporter: 'Esi Quaye',
    createdAt: '2026-06-22T19:05:00Z',
    photo: '/floods/coastal-flood.png',
    waterDepthCm: 18,
    rainfallMm: 22,
    areaType: 'Coastal',
    spreadCells: 74,
    affectedRadiusM: 260,
  },
  {
    id: 'FW-2028',
    title: 'Minor pooling in Tamale',
    area: 'Lamashegu',
    region: 'Northern',
    lat: 9.3886,
    lng: -0.8639,
    description:
      'Shallow water collecting at a road junction after an afternoon downpour. Draining slowly.',
    severity: 'Low',
    status: 'Resolved',
    reporter: 'Abdul Razak',
    createdAt: '2026-06-22T16:20:00Z',
    photo: '/floods/puddle-flood.png',
    waterDepthCm: 9,
    rainfallMm: 14,
    areaType: 'Urban drainage',
    spreadCells: 28,
    affectedRadiusM: 130,
  },
]

export function getReport(id: string): FloodReport | undefined {
  return reports.find((r) => r.id === id)
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const mins = Math.max(1, Math.round((now - then) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
