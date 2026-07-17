'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  MapPin,
  Upload,
  Crosshair,
  Loader2,
  ImageIcon,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MapView } from '@/components/map-view'
import { GHANA_CENTER } from '@/lib/data'
import { predict, type PredictionInput } from '@/lib/severity'

type AreaType = PredictionInput['areaType']

export default function ReportPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [picked, setPicked] = useState<[number, number] | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [areaType, setAreaType] = useState<AreaType>('Urban drainage')
  const [depth, setDepth] = useState(30)
  const [rainfall, setRainfall] = useState(35)
  const [submitting, setSubmitting] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  const useMyLocation = () => {
    // Demo: drop near central Accra with slight jitter
    setPicked([
      GHANA_CENTER[0] + (Math.random() - 0.5) * 0.04,
      GHANA_CENTER[1] + (Math.random() - 0.5) * 0.04,
    ])
  }

  const submit = () => {
    if (!picked) return
    setSubmitting(true)
    const result = predict({ waterDepthCm: depth, rainfallMm: rainfall, areaType })
    const payload = {
      title: title || 'Flood report',
      description,
      areaType,
      depth,
      rainfall,
      lat: picked[0],
      lng: picked[1],
      photo,
      result,
      createdAt: new Date().toISOString(),
    }
    sessionStorage.setItem('fw_last_report', JSON.stringify(payload))
    setTimeout(() => router.push('/report/result'), 1100)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold text-teal">New report</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Submit a flood report
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Drop a pin at the flood location, add a photo and describe what you
          see. We will predict the severity and spread instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="size-4 text-primary" />
                {picked
                  ? `${picked[0].toFixed(4)}, ${picked[1].toFixed(4)}`
                  : 'Tap the map to drop a pin'}
              </span>
              <Button variant="outline" size="sm" onClick={useMyLocation}>
                <Crosshair className="size-4" /> Use my location
              </Button>
            </div>
            <div className="h-[440px]">
              <MapView
                center={GHANA_CENTER}
                zoom={12}
                pickable
                picked={picked}
                onPick={(la, lo) => setPicked([la, lo])}
              />
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="size-3.5" />
            Click anywhere on the dark map to place the flood location.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5 lg:col-span-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Report title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Drain overflow near the market"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Photo</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-card p-3 text-left transition-colors hover:border-primary/50"
            >
              {photo ? (
                <Image
                  src={photo || '/placeholder.svg'}
                  alt="Uploaded flood preview"
                  width={56}
                  height={56}
                  className="size-14 rounded-lg object-cover"
                  unoptimized
                />
              ) : (
                <span className="grid size-14 place-items-center rounded-lg bg-secondary text-primary">
                  <ImageIcon className="size-6" />
                </span>
              )}
              <span className="text-sm">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Upload className="size-3.5" />
                  {photo ? 'Change photo' : 'Upload a photo'}
                </span>
                <span className="text-muted-foreground">
                  JPG or PNG, taken at the scene
                </span>
              </span>
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="areaType">Area type</Label>
            <Select
              value={areaType}
              onValueChange={(v) => setAreaType(v as AreaType)}
            >
              <SelectTrigger id="areaType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low-lying basin">Low-lying basin</SelectItem>
                <SelectItem value="Riverbank">Riverbank</SelectItem>
                <SelectItem value="Coastal">Coastal</SelectItem>
                <SelectItem value="Urban drainage">Urban drainage</SelectItem>
                <SelectItem value="Hillside">Hillside</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="depth">
                Water depth: <span className="text-primary">{depth} cm</span>
              </Label>
              <input
                id="depth"
                type="range"
                min={0}
                max={100}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rain">
                Rainfall: <span className="text-primary">{rainfall} mm</span>
              </Label>
              <input
                id="rain"
                type="range"
                min={0}
                max={80}
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the flooding — how deep, what is affected, is it rising?"
            />
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!picked || submitting}
            onClick={submit}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Predicting spread…
              </>
            ) : (
              'Submit & predict severity'
            )}
          </Button>
          {!picked && (
            <p className="text-center text-xs text-muted-foreground">
              Drop a pin on the map to enable submission.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
