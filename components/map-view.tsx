'use client'

import dynamic from 'next/dynamic'
import type { FloodMapProps } from './flood-map'

const FloodMap = dynamic(() => import('./flood-map'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#0b1220] text-sm text-slate-400">
      Loading map…
    </div>
  ),
})

export function MapView(props: FloodMapProps) {
  return <FloodMap {...props} />
}
