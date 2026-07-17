import Link from 'next/link'
import {
  MapPin,
  Mountain,
  Compass,
  Waves,
  Gauge,
  ArrowRight,
  Database,
  Cpu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const algoSteps = [
  {
    icon: MapPin,
    title: '1. Get the location',
    body: 'When you drop a pin and submit a report, the system reads the exact GPS coordinates (latitude and longitude) of that point.',
  },
  {
    icon: Mountain,
    title: '2. Fetch elevation data',
    body: "Those coordinates are sent to the OpenTopography API, which returns NASA's SRTM elevation data for the area as a raster grid — a grid of cells, each holding the land height in metres.",
  },
  {
    icon: Compass,
    title: '3. Analyse the terrain (D8)',
    body: 'A Python script runs the D8 flow-direction algorithm. For every cell it asks: which of my 8 neighbours is lowest? Water flows that way. Doing this across the whole grid maps how water travels over the terrain.',
  },
  {
    icon: Waves,
    title: '4. Estimate the spread zone',
    body: 'Starting from the reported point, the script traces which cells receive water flowing downhill. Together those cells form the predicted spread zone — where the water is likely to reach.',
  },
  {
    icon: Gauge,
    title: '5. Assign a severity score',
    body: 'The size and density of the spread zone sets the severity: small contained zone is Low, moderate street spread is Moderate, large multi-area spread is High, and a massive community-threatening spread is Critical.',
  },
]

const stack = [
  { name: 'rasterio', use: 'Reads and processes the elevation raster grid' },
  { name: 'numpy', use: 'Runs the D8 flow-direction calculations' },
  { name: 'requests', use: 'Calls the OpenTopography elevation API' },
]

const architecture = [
  { component: 'Frontend', tech: 'React / Next.js' },
  { component: 'Backend', tech: 'Node.js REST API' },
  { component: 'Database', tech: 'PostgreSQL + PostGIS' },
  { component: 'Mapping', tech: 'Leaflet.js' },
  { component: 'Elevation data', tech: 'SRTM via OpenTopography API' },
  { component: 'Spread estimation', tech: 'Python (NumPy + rasterio)' },
  { component: 'File storage', tech: 'Cloudinary (photo uploads)' },
  { component: 'Hosting', tech: 'Vercel + Railway' },
]

const pilotCommunities = [
  'Kwame Nkrumah Circle',
  'Kaneshie',
  'Achimota',
  'Adenta',
  'Weija',
]

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20">
          <p className="text-sm font-semibold text-teal">About the project</p>
          <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Turning community reports into flood predictions
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            FloodWatch GH is a community flood reporting platform for Ghana.
            Residents report floods from their phones, and for every report we
            predict how far the water is likely to spread and how serious it is —
            giving NADMO officers and local communities the information they need
            to respond quickly.
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Why it matters
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Seasonal floods affect communities across Ghana every year, from the
          Odaw basin in Accra to riverbanks in Kumasi and the northern plains.
          The biggest gap is often time — by the time officials know how serious
          a flood is, the water has already spread. FloodWatch GH closes that gap
          by combining on-the-ground reports with a terrain-based prediction of
          where the water is heading next.
        </p>
      </section>

      {/* Algorithm */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-teal">
            <Cpu className="size-4" /> The prediction algorithm
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            How the flood prediction works
          </h2>
          <p className="mt-3 text-muted-foreground">
            The whole process runs automatically the moment a report is
            submitted — no manual input needed. Here is what happens behind the
            scenes, in five steps.
          </p>

          <ol className="mt-10 space-y-4">
            {algoSteps.map((s) => (
              <li
                key={s.title}
                className="flex gap-4 rounded-2xl border border-border bg-background p-5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <s.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-teal">
          <Database className="size-4" /> Built with
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          The prediction pipeline
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stack.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="font-mono text-sm font-semibold text-primary">
                {t.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.use}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
          Note: this demo runs a transparent, rule-based version of the model in
          the browser so you can see severity update instantly. In production the
          D8 spread analysis runs as a Python service against live SRTM elevation
          tiles from OpenTopography.
        </p>

        <h3 className="mt-12 text-lg font-semibold">Full system architecture</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <tbody>
              {architecture.map((row, i) => (
                <tr
                  key={row.component}
                  className={i % 2 === 0 ? 'bg-card' : 'bg-background'}
                >
                  <th
                    scope="row"
                    className="border-b border-border px-4 py-3 font-medium text-foreground"
                  >
                    {row.component}
                  </th>
                  <td className="border-b border-border px-4 py-3 text-muted-foreground">
                    {row.tech}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pilot */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-teal">
            <MapPin className="size-4" /> Pilot deployment
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Five communities in Greater Accra
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            The system is being demonstrated with simulated and real reports
            across five flood-prone communities in the Greater Accra region,
            building a growing history of incidents mapped to terrain.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {pilotCommunities.map((c) => (
              <li
                key={c}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-14 text-center sm:px-6">
          <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
            Help build a flood-ready Ghana
          </h2>
          <p className="max-w-xl text-primary-foreground/80">
            Explore the live map or submit a report to see the prediction engine
            in action.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
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
              <Link href="/map">
                <MapPin className="size-4" /> View Live Map
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
