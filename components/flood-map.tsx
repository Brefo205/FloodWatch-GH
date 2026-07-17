'use client'

import { useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import { SEVERITY_META, type FloodReport, type Severity } from '@/lib/data'

const DARK_TILES =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const ATTRIB =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

function severityIcon(severity: Severity, big = false) {
  const meta = SEVERITY_META[severity]
  const size = big ? 30 : 22
  return L.divIcon({
    className: '',
    html: `<span class="fw-pin" style="width:${size}px;height:${size}px;background:${meta.color}"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function dropIcon() {
  return L.divIcon({
    className: '',
    html: `<span class="fw-pin" style="width:28px;height:28px;background:var(--primary)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function ClickCapture({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export type FloodMapProps = {
  center: [number, number]
  zoom?: number
  reports?: FloodReport[]
  onReportClick?: (id: string) => void
  // pin-drop mode
  pickable?: boolean
  picked?: [number, number] | null
  onPick?: (lat: number, lng: number) => void
  // spread zone
  spread?: {
    center: [number, number]
    radiusM: number
    severity: Severity
  } | null
  className?: string
}

export default function FloodMap({
  center,
  zoom = 12,
  reports = [],
  onReportClick,
  pickable = false,
  picked = null,
  onPick,
  spread = null,
  className,
}: FloodMapProps) {
  const icons = useMemo(
    () => ({
      Low: severityIcon('Low'),
      Moderate: severityIcon('Moderate'),
      High: severityIcon('High'),
      Critical: severityIcon('Critical'),
    }),
    [],
  )

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className={className}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url={DARK_TILES} attribution={ATTRIB} />

      {spread && (
        <>
          <Circle
            center={spread.center}
            radius={spread.radiusM}
            pathOptions={{
              color: SEVERITY_META[spread.severity].color,
              fillColor: SEVERITY_META[spread.severity].color,
              fillOpacity: 0.22,
              weight: 2,
            }}
          />
          <Circle
            center={spread.center}
            radius={spread.radiusM * 0.55}
            pathOptions={{
              color: SEVERITY_META[spread.severity].color,
              fillColor: SEVERITY_META[spread.severity].color,
              fillOpacity: 0.28,
              weight: 0,
            }}
          />
        </>
      )}

      {reports.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={icons[r.severity]}
          eventHandlers={
            onReportClick ? { click: () => onReportClick(r.id) } : undefined
          }
        >
          <Popup>
            <div style={{ minWidth: 160 }}>
              <strong>{r.title}</strong>
              <br />
              <span style={{ color: SEVERITY_META[r.severity].color }}>
                {r.severity}
              </span>{' '}
              · {r.area}
            </div>
          </Popup>
        </Marker>
      ))}

      {pickable && <ClickCapture onPick={(la, lo) => onPick?.(la, lo)} />}
      {picked && <Marker position={picked} icon={dropIcon()} />}
    </MapContainer>
  )
}
