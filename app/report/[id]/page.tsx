import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Clock,
  User,
  ArrowLeft,
  Droplets,
  CloudRain,
  Mountain,
  Map as MapIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MapView } from '@/components/map-view'
import { SeverityBadge } from '@/components/severity-badge'
import { getReport, formatDateTime, SEVERITY_META } from '@/lib/data'

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-muted text-muted-foreground',
  Verified: 'bg-secondary text-secondary-foreground',
  Responding: 'bg-accent text-accent-foreground',
  Resolved: 'bg-muted text-muted-foreground',
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const report = getReport(id)
  if (!report) notFound()

  const meta = SEVERITY_META[report.severity]
  const center: [number, number] = [report.lat, report.lng]

  const facts = [
    { icon: Droplets, label: 'Water depth', value: `${report.waterDepthCm} cm` },
    { icon: CloudRain, label: 'Rainfall (3 hr)', value: `${report.rainfallMm} mm` },
    { icon: Mountain, label: 'Terrain', value: report.areaType },
    { icon: MapIcon, label: 'Spread radius', value: `~${report.affectedRadiusM} m` },
  ]

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/map">
          <ArrowLeft className="size-4" /> Back to map
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <SeverityBadge severity={report.severity} size="lg" />
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                STATUS_STYLES[report.status]
              }`}
            >
              {report.status}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            {report.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {report.area}, {report.region}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" /> {formatDateTime(report.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="size-4" /> {report.reporter}
            </span>
          </div>
        </div>
        <span className="rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-sm text-muted-foreground">
          {report.id}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-border">
            <Image
              src={report.photo || '/placeholder.svg'}
              alt={`Flooding at ${report.area}`}
              width={900}
              height={520}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Description</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {report.description}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map((f) => (
              <div
                key={f.label}
                className="rounded-xl border border-border bg-card p-3"
              >
                <f.icon className="size-4 text-primary" />
                <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </p>
                <p className="text-sm font-semibold">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: meta.bg, borderColor: meta.ring }}
          >
            <p className="text-sm font-medium" style={{ color: meta.color }}>
              Severity prediction
            </p>
            <p
              className="mt-1 text-3xl font-bold"
              style={{ color: meta.color }}
            >
              {meta.label}
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              {meta.description}
            </p>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <div className="border-b border-border bg-card px-4 py-2.5 text-sm font-medium">
              Predicted spread zone
            </div>
            <div className="h-[300px]">
              <MapView
                center={center}
                zoom={14}
                picked={center}
                spread={{
                  center,
                  radiusM: report.affectedRadiusM,
                  severity: report.severity,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
