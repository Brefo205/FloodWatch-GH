import type { Severity } from './data'

export type PredictionInput = {
  waterDepthCm: number
  rainfallMm: number
  areaType:
    | 'Low-lying basin'
    | 'Riverbank'
    | 'Coastal'
    | 'Urban drainage'
    | 'Hillside'
}

export type PredictionResult = {
  severity: Severity
  score: number // 0-100
  spreadCells: number
  affectedRadiusM: number
  factors: { label: string; value: string; weight: number }[]
  steps: string[]
}

// Terrain susceptibility multiplier — how readily water spreads downhill
// across this kind of ground (a stand-in for the D8 flow-accumulation result).
const AREA_FACTOR: Record<PredictionInput['areaType'], number> = {
  'Low-lying basin': 1.0,
  Riverbank: 0.9,
  Coastal: 0.7,
  'Urban drainage': 0.6,
  Hillside: 0.4,
}

/**
 * Simulated flood-spread model.
 *
 * In production this is a Python pipeline: SRTM elevation tiles from the
 * OpenTopography API are processed with rasterio + numpy, the D8 flow-direction
 * algorithm traces which downhill cells receive water from the reported point,
 * and the size of that spread zone sets the severity. Here we approximate that
 * output deterministically from the reported conditions so the UI behaves the
 * same way without a backend.
 */
export function predict(input: PredictionInput): PredictionResult {
  const depth = Math.max(0, input.waterDepthCm)
  const rain = Math.max(0, input.rainfallMm)
  const terrain = AREA_FACTOR[input.areaType]

  // Weighted drivers (sum of weights = 100)
  const depthScore = Math.min(depth / 80, 1) * 45 // depth dominates
  const rainScore = Math.min(rain / 70, 1) * 30
  const terrainScore = terrain * 25

  const score = Math.round(depthScore + rainScore + terrainScore)

  // Spread zone grows non-linearly with the score and terrain.
  const spreadCells = Math.round((score / 100) ** 1.6 * 600 * (0.6 + terrain))
  const affectedRadiusM = Math.round(Math.sqrt(spreadCells) * 45)

  let severity: Severity = 'Low'
  if (score >= 75) severity = 'Critical'
  else if (score >= 55) severity = 'High'
  else if (score >= 32) severity = 'Moderate'

  return {
    severity,
    score,
    spreadCells,
    affectedRadiusM,
    factors: [
      {
        label: 'Water depth',
        value: `${depth} cm`,
        weight: Math.round(depthScore),
      },
      {
        label: 'Rainfall (3 hr)',
        value: `${rain} mm`,
        weight: Math.round(rainScore),
      },
      {
        label: 'Terrain type',
        value: input.areaType,
        weight: Math.round(terrainScore),
      },
    ],
    steps: [
      'Read GPS coordinates from the dropped pin',
      'Fetch SRTM elevation grid for the area (OpenTopography)',
      'Run D8 flow-direction across every cell',
      `Trace the downhill spread zone (~${spreadCells} cells)`,
      `Assign severity from spread size → ${severity}`,
    ],
  }
}
