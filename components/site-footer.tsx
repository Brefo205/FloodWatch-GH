import Link from 'next/link'
import { Droplets } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Droplets className="size-4" />
          </span>
          <div>
            <p className="text-sm font-bold">
              FloodWatch <span className="text-teal">GH</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Community flood reporting for Ghana
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/map" className="hover:text-foreground">
            Live Map
          </Link>
          <Link href="/report" className="hover:text-foreground">
            Report a Flood
          </Link>
          <Link href="/admin" className="hover:text-foreground">
            NADMO Dashboard
          </Link>
          <Link href="/about" className="hover:text-foreground">
            How it works
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">
          {'\u00A9'} {new Date().getFullYear()} FloodWatch GH. Demo project.
        </p>
      </div>
    </footer>
  )
}
