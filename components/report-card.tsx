import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import { SeverityBadge } from '@/components/severity-badge'
import { timeAgo, type FloodReport } from '@/lib/data'

export function ReportCard({ report }: { report: FloodReport }) {
  return (
    <Link
      href={`/report/${report.id}`}
      className="group block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
          {report.title}
        </h3>
        <SeverityBadge severity={report.severity} />
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {report.description}
      </p>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" />
          {report.area}, {report.region}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" />
          {timeAgo(report.createdAt)}
        </span>
      </div>
    </Link>
  )
}
