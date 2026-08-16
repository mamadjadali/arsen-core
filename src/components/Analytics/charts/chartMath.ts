export type ChartPoint = { x: number; y: number }

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/**
 * Zero-baseline normalize: y from bottom using max(values), so sparse spikes stay visible.
 * Optional secondaryMax lets dual series share one scale.
 */
export function seriesToPoints(
  values: number[],
  width: number,
  height: number,
  pad = 2,
  secondaryMax?: number,
): ChartPoint[] {
  if (!values.length) {
    return [
      { x: pad, y: height - pad },
      { x: width - pad, y: height - pad },
    ]
  }

  const dataMax = Math.max(...values, secondaryMax ?? 0, 1)
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  return values.map((v, i) => {
    const x = values.length === 1 ? width / 2 : pad + (i / (values.length - 1)) * innerW
    const y = pad + innerH - (clamp(v, 0, dataMax) / dataMax) * innerH
    return { x, y }
  })
}

export function pointsToPolyline(points: ChartPoint[]): string {
  return points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
}

/** Smooth cubic path through points (Catmull-Rom → Bezier). */
export function pointsToSmoothPath(points: ChartPoint[]): string {
  if (!points.length) return ''
  if (points.length === 1) {
    return `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  }
  if (points.length === 2) {
    return `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} L${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`
  }

  let d = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}

export function pointsToSmoothAreaPath(points: ChartPoint[], height: number, pad = 2): string {
  if (!points.length) return ''
  const line = pointsToSmoothPath(points)
  const last = points[points.length - 1]
  const first = points[0]
  const base = (height - pad).toFixed(2)
  return `${line} L${last.x.toFixed(2)} ${base} L${first.x.toFixed(2)} ${base} Z`
}

export function pointsToAreaPath(points: ChartPoint[], height: number, pad = 2): string {
  if (!points.length) return ''
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
  const last = points[points.length - 1]
  const first = points[0]
  return `${line} L${last.x.toFixed(2)} ${(height - pad).toFixed(2)} L${first.x.toFixed(2)} ${(height - pad).toFixed(2)} Z`
}

export function pointsToLinePath(points: ChartPoint[]): string {
  if (!points.length) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
}

export type DonutSegment = {
  key: string
  value: number
  color: string
}

export type DonutArc = DonutSegment & {
  dash: number
  gap: number
  offset: number
}

const DEVICE_COLORS: Record<string, string> = {
  desktop: 'var(--analytics-device-desktop)',
  mobile: 'var(--analytics-device-mobile)',
  tablet: 'var(--analytics-device-tablet)',
}

const FALLBACK_SEGMENT_COLORS = [
  'var(--analytics-views)',
  'var(--analytics-uniques)',
  'var(--analytics-forms)',
  'var(--analytics-up)',
]

export function colorForDevice(key: string, index = 0): string {
  const normalized = key.trim().toLowerCase()
  return DEVICE_COLORS[normalized] || FALLBACK_SEGMENT_COLORS[index % FALLBACK_SEGMENT_COLORS.length]
}

/** Small visual gap between donut arcs (fraction of circumference). */
export function donutArcs(
  segments: DonutSegment[],
  circumference: number,
  gapFraction = 0.018,
): DonutArc[] {
  const total = segments.reduce((s, d) => s + d.value, 0) || 1
  const gapPx = segments.length > 1 ? circumference * gapFraction : 0
  let offset = 0
  return segments.map((seg) => {
    const raw = (seg.value / total) * circumference
    const dash = Math.max(0, raw - gapPx)
    const arc: DonutArc = {
      ...seg,
      dash,
      gap: circumference - dash,
      offset: -offset,
    }
    offset += raw
    return arc
  })
}

export function percentDelta(current: number, prior: number): number | null {
  if (prior === 0) return current === 0 ? 0 : 100
  return Math.round(((current - prior) / prior) * 100)
}
