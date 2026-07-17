'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  ArrowUpDown,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SeverityBadge } from '@/components/severity-badge'
import {
  reports,
  formatDateTime,
  type FloodReport,
  type Severity,
  type ReportStatus,
} from '@/lib/data'

const SEV_RANK: Record<Severity, number> = {
  Critical: 4,
  High: 3,
  Moderate: 2,
  Low: 1,
}

const STATUS_STYLES: Record<ReportStatus, string> = {
  Pending: 'bg-muted text-muted-foreground',
  Verified: 'bg-secondary text-secondary-foreground',
  Responding: 'bg-accent text-accent-foreground',
  Resolved: 'bg-muted text-muted-foreground',
}

type SortKey = 'severity' | 'createdAt' | 'region'

export default function AdminPage() {
  const router = useRouter()
  const [sortKey, setSortKey] = useState<SortKey>('severity')
  const [asc, setAsc] = useState(false)
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'All'>('All')

  const sorted = useMemo(() => {
    const list = reports.filter(
      (r) => statusFilter === 'All' || r.status === statusFilter,
    )
    const cmp = (a: FloodReport, b: FloodReport) => {
      let res = 0
      if (sortKey === 'severity') res = SEV_RANK[a.severity] - SEV_RANK[b.severity]
      else if (sortKey === 'createdAt')
        res = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      else res = a.region.localeCompare(b.region)
      return asc ? res : -res
    }
    return [...list].sort(cmp)
  }, [sortKey, asc, statusFilter])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setAsc((v) => !v)
    else {
      setSortKey(key)
      setAsc(false)
    }
  }

  const stats = useMemo(
    () => ({
      critical: reports.filter((r) => r.severity === 'Critical').length,
      responding: reports.filter((r) => r.status === 'Responding').length,
      pending: reports.filter((r) => r.status === 'Pending').length,
      resolved: reports.filter((r) => r.status === 'Resolved').length,
    }),
    [],
  )

  const statCards = [
    {
      label: 'Critical reports',
      value: stats.critical,
      icon: AlertTriangle,
      color: 'var(--sev-critical)',
    },
    {
      label: 'Responding',
      value: stats.responding,
      icon: Activity,
      color: 'var(--primary)',
    },
    {
      label: 'Awaiting review',
      value: stats.pending,
      icon: Clock,
      color: 'var(--sev-moderate)',
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'var(--teal)',
    },
  ]

  const STATUSES: (ReportStatus | 'All')[] = [
    'All',
    'Pending',
    'Verified',
    'Responding',
    'Resolved',
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-teal">
        <ShieldCheck className="size-4" /> NADMO officer dashboard
      </div>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">
        Flood reports overview
      </h1>
      <p className="mt-1 text-muted-foreground">
        Monitor, sort and triage every incoming flood report by severity and
        status.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <span
              className="grid size-11 place-items-center rounded-xl"
              style={{ backgroundColor: `${s.color}1f`, color: s.color }}
            >
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Filter status:
        </span>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Report</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort('region')}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    Region <ArrowUpDown className="size-3.5" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort('severity')}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    Severity <ArrowUpDown className="size-3.5" />
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort('createdAt')}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    Reported <ArrowUpDown className="size-3.5" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/report/${r.id}`)}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {r.id}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.area}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.region}
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={r.severity} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        STATUS_STYLES[r.status]
                      }`}
                    >
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDateTime(r.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )
}
