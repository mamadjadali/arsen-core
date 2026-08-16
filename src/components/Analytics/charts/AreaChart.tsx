import React from 'react'

import { pointsToSmoothAreaPath, pointsToSmoothPath, seriesToPoints } from './chartMath'

type Props = {
  values: number[]
  secondaryValues?: number[]
  labels?: string[]
  height?: number
  className?: string
}

export function AreaChart({
  values,
  secondaryValues,
  labels = [],
  height = 200,
  className,
}: Props) {
  const width = 640
  const padX = 10
  const padY = 14
  const series = values.length ? values : [0, 0]
  const secondary = secondaryValues?.length ? secondaryValues : undefined
  const sharedMax = Math.max(...series, ...(secondary || []), 1)

  const mapSeries = (vals: number[]) => {
    const pts = seriesToPoints(vals, width, height, padY, sharedMax)
    return pts.map((p, i) => ({
      x:
        vals.length === 1
          ? width / 2
          : padX + (i / (vals.length - 1)) * (width - padX * 2),
      y: p.y,
    }))
  }

  const primary = mapSeries(series)
  const secondaryPts = secondary ? mapSeries(secondary) : null
  const line = pointsToSmoothPath(primary)
  const area = pointsToSmoothAreaPath(primary, height, padY)
  const secondaryLine = secondaryPts ? pointsToSmoothPath(secondaryPts) : null
  const max = sharedMax
  const gridYs = [0.25, 0.5, 0.75].map((t) => padY + (height - padY * 2) * t)

  const midLabel =
    labels.length > 2 ? labels[Math.floor(labels.length / 2)] : labels[0] || ''
  const endLabel = labels[labels.length - 1] || ''

  return (
    <div className={className}>
      <svg
        className="analytics-area-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Traffic over time"
      >
        <defs>
          <linearGradient id="analyticsAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--analytics-views)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--analytics-views)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {gridYs.map((y) => (
          <line
            key={y}
            x1={padX}
            x2={width - padX}
            y1={y}
            y2={y}
            stroke="var(--theme-elevation-150)"
            strokeDasharray="4 6"
            strokeWidth={1}
          />
        ))}
        <path d={area} fill="url(#analyticsAreaFill)" />
        <path
          className="analytics-area__primary"
          d={line}
          fill="none"
          stroke="var(--analytics-views)"
          strokeWidth={2.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {secondaryLine ? (
          <path
            className="analytics-area__secondary"
            d={secondaryLine}
            fill="none"
            stroke="var(--analytics-uniques)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5 4"
          />
        ) : null}
        {primary.map((p, i) => (
          <circle
            key={`p-${i}`}
            className="analytics-area__dot"
            cx={p.x}
            cy={p.y}
            r={series[i] > 0 ? 4 : 2.5}
            fill="var(--analytics-views)"
            stroke="var(--theme-elevation-0)"
            strokeWidth={series[i] > 0 ? 2 : 1}
            opacity={series[i] > 0 ? 1 : 0.45}
          />
        ))}
        {secondaryPts
          ? secondaryPts.map((p, i) => (
              <circle
                key={`s-${i}`}
                cx={p.x}
                cy={p.y}
                r={secondary![i] > 0 ? 3.5 : 2}
                fill="var(--analytics-uniques)"
                stroke="var(--theme-elevation-0)"
                strokeWidth={1.5}
                opacity={secondary![i] > 0 ? 1 : 0.4}
              />
            ))
          : null}
      </svg>
      {(midLabel || endLabel) && (
        <div className="analytics-area-axis">
          <span>{labels[0] || ''}</span>
          <span>{midLabel}</span>
          <span>
            {endLabel}
            {max > 0 ? ` · max ${max}` : ''}
          </span>
        </div>
      )}
    </div>
  )
}
