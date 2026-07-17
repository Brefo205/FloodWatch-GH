'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  MapPin,
  Waves,
  ArrowRight,
  Map as MapIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MapView } from '@/components/map-view'
import { SEVERITY_META, GHANA_CENTER, type Severity } from '@/lib/data'
import type { PredictionResult } from '@/lib/severity'

type StoredReport = {
  title: string
  description: string
  areaType: string
  lat: number
  lng: number
  photo: string | null
  result: PredictionResult
  createdAt: string
}

export default function ResultPage() {
  const [data, setData] = useState<StoredReport | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('fw_last_report')
    if (raw) setData(JSON.parse(raw))
  }, [])

  if (!data) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <Waves className="size-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">No recent report found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit a flood report to see its severity prediction here.
        </p>
        <Button asChild className="mt-6">
          <Link href="/report">Submit a report</Link>
        </Button>
      </main>
    )
  }

  const { result } = data
  const severity = result.severity as Severity
  const meta = SEVERITY_META[severity]
  const center: [number, number] = [data.lat, data.lng]

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2 text-sm font-medium text-teal">
        <CheckCircle2 className="size-5" />
        Report submitted successfully
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        {data.title}
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Severity result */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: meta.bg, borderColor: meta.ring }}
          >
            <p className="text-sm font-medium" style={{ color: meta.color }}>
              Predicted severity
            </p>
            <p
              className="mt-1 text-5xl font-bold tracking-tight"
              style={{ color: meta.color }}
            >
              {meta.label}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              {meta.description}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${result.score}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: meta.color }}
              >
                {result.score}/100
              </span>
            </div>
          </div>

          {/* Factors */}
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">What drove this score</h2>
            <ul className="mt-3 space-y-3">
              {result.factors.map((f) => (
                <li key={f.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-medium">{f.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(f.weight / 45) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Spread map + explanation */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <MapIcon className="size-4 text-primary" /> Predicted spread zone
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />
                {data.lat.toFixed(4)}, {data.lng.toFixed(4)}
              </span>
            </div>
            <div className="h-[320px]">
              <MapView
                center={center}
                zoom={14}
                picked={center}
                spread={{
                  center,
                  radiusM: result.affectedRadiusM,
                  severity,
                }}
              />
            </div>
            <div className="grid grid-cols-2 divide-x divide-border border-t border-border bg-card">
              <div className="px-4 py-3">
                <p className="text-xs text-muted-foreground">Spread zone</p>
                <p className="text-lg font-bold">
                  ~{result.spreadCells} cells
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs text-muted-foreground">Affected radius</p>
                <p className="text-lg font-bold">~{result.affectedRadiusM} m</p>
              </div>
            </div>
          </div>

          {/* How we got here */}
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">How we predicted this</h2>
            <ol className="mt-3 space-y-2">
              {result.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/map">
            View on live map <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/report">Submit another report</Link>
        </Button>
      </div>
    </main>
  )
}
