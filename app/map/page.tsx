'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, MapPin, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { MapView } from '@/components/map-view'
import { SeverityBadge } from '@/components/severity-badge'
import {
  reports,
  GHANA_CENTER,
  timeAgo,
  SEVERITY_META,
  type Severity,
} from '@/lib/data'

const FILTERS: (Severity | 'All')[] = [
  'All',
  'Critical',
  'High',
  'Moderate',
  'Low',
]

export default function MapDashboardPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<Severity | 'All'>('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesSev = filter === 'All' || r.severity === filter
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q)
      return matchesSev && matchesQuery
    })
  }, [filter, query])

  const counts = useMemo(() => {
    return {
      Critical: reports.filter((r) => r.severity === 'Critical').length,
      High: reports.filter((r) => r.severity === 'High').length,
      Moderate: reports.filter((r) => r.severity === 'Moderate').length,
      Low: reports.filter((r) => r.severity === 'Low').length,
    }
  }, [])

  return (
    <main className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full flex-col border-r border-border bg-card lg:w-[400px]">
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-bold tracking-tight">
            Live flood map — Ghana
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} active report{filtered.length !== 1 && 's'} shown
          </p>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search area or region…"
              className="pl-9"
            />
          </div>

          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-secondary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {(['Critical', 'High', 'Moderate', 'Low'] as Severity[]).map(
              (s) => (
                <div
                  key={s}
                  className="rounded-lg border border-border p-2 text-center"
                >
                  <p
                    className="text-lg font-bold"
                    style={{ color: SEVERITY_META[s].color }}
                  >
                    {counts[s]}
                  </p>
                  <p className="text-[10px] uppercase text-muted-foreground">
                    {s}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => router.push(`/report/${r.id}`)}
                className="w-full rounded-xl border border-border bg-background p-3 text-left transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold leading-snug">
                    {r.title}
                  </span>
                  <SeverityBadge severity={r.severity} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" /> {r.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" /> {timeAgo(r.createdAt)}
                  </span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No reports match your filters.
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Map */}
      <div className="relative min-h-[400px] flex-1">
        <MapView
          center={GHANA_CENTER}
          zoom={7}
          reports={filtered}
          onReportClick={(id) => router.push(`/report/${id}`)}
        />
      </div>
    </main>
  )
}
