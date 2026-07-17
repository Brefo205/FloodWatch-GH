import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Droplets,
  Waves,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MapView } from '@/components/map-view'
import { ReportCard } from '@/components/report-card'
import { reports, GHANA_CENTER } from '@/lib/data'

const steps = [
  {
    icon: MapPin,
    title: 'Drop a pin & report',
    body: 'Mark the exact flood location on the map, add a photo and a short description. Takes under a minute from your phone.',
  },
  {
    icon: Cpu,
    title: 'We predict the spread',
    body: 'Our model traces the terrain downhill from your pin to estimate how far the water will spread and how serious it is.',
  },
  {
    icon: ShieldCheck,
    title: 'NADMO responds faster',
    body: 'Reports appear live on a shared map so disaster officers and your community can act before it gets worse.',
  },
]

const stats = [
  { value: '1,200+', label: 'Reports submitted' },
  { value: '38', label: 'Districts covered' },
  { value: '4 min', label: 'Avg. response time' },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0b1220] text-white">
        <Image
          src="/hero-flood-accra.png"
          alt="Aerial view of flooding across an Accra neighbourhood"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220] via-[#0b1220]/85 to-[#0b1220]/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
              <Waves className="size-3.5 text-teal" />
              Live flood intelligence for Ghana
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Report a flood. <span className="text-teal">Predict</span> its
              spread. Protect your community.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-slate-300">
              FloodWatch GH turns reports from residents into live severity
              predictions, helping NADMO and local communities respond before
              the water rises.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/report">
                  Report a Flood <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="/map">View Live Map</Link>
              </Button>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-bold text-white">{s.value}</dt>
                  <dd className="text-xs text-slate-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-teal">How it works</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Three steps from rising water to a real response
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="absolute right-5 top-5 text-5xl font-bold text-muted/60">
                {i + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                <s.icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Live map preview */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-teal">
                <Activity className="size-4" /> Live now
              </p>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                See every report on one live map
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Pins are colour-coded by predicted severity so officers and
                residents can spot the most dangerous areas at a glance. Tap any
                pin to see the photo, description and spread zone.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {(
                  [
                    ['Critical', 'Massive spread, immediate response'],
                    ['High', 'Spreading across multiple streets'],
                    ['Moderate', 'Spilling into nearby roads'],
                    ['Low', 'Contained, minimal risk'],
                  ] as const
                ).map(([sev, desc]) => (
                  <li key={sev} className="flex items-center gap-3">
                    <span
                      className="size-3 rounded-full"
                      style={{
                        backgroundColor: `var(--sev-${sev.toLowerCase()})`,
                      }}
                    />
                    <span className="font-medium">{sev}</span>
                    <span className="text-muted-foreground">{'\u2014'} {desc}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8">
                <Link href="/map">
                  Open full map <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="h-[380px] overflow-hidden rounded-2xl border border-border shadow-sm">
              <MapView center={GHANA_CENTER} zoom={11} reports={reports} />
            </div>
          </div>
        </div>
      </section>

      {/* Recent reports */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal">Latest activity</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Recent flood reports
            </h2>
          </div>
          <Button asChild variant="ghost">
            <Link href="/map">View all</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.slice(0, 6).map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/15">
            <Droplets className="size-7" />
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Spotted rising water near you?
          </h2>
          <p className="max-w-xl text-pretty text-primary-foreground/80">
            One report can give your whole community the head start it needs.
            Reporting is free and takes less than a minute.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/report">
              Report a Flood now <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
