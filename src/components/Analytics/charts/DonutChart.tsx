import React from 'react'

import { colorForDevice, donutArcs, type DonutSegment } from './chartMath'

type Props = {
  segments: Array<{ key: string; value: number; colorKey?: string }>
  className?: string
  size?: number
  totalLabel?: string
  emptyLabel?: string
}

export function DonutChart({
  segments,
  className,
  size = 140,
  totalLabel = 'total',
  emptyLabel = 'No device data',
}: Props) {
  const colored: DonutSegment[] = segments.map((s, i) => ({
    key: s.key,
    value: s.value,
    color: colorForDevice(s.colorKey || s.key, i),
  }))
  const total = colored.reduce((sum, s) => sum + s.value, 0)
  const stroke = 18
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const arcs = donutArcs(colored, c)

  return (
    <div className={className}>
      <div className="analytics-donut">
        <svg
          className="analytics-donut__svg"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--theme-elevation-100)"
            strokeWidth={stroke}
          />
          {total > 0 &&
            arcs
              .filter((arc) => arc.value > 0)
              .map((arc) => (
                <circle
                  key={arc.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${arc.dash} ${arc.gap}`}
                  strokeDashoffset={arc.offset}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              ))}
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="analytics-donut__total"
            fill="var(--theme-text)"
            fontSize="22"
            fontWeight="700"
          >
            {total}
          </text>
          <text
            x="50%"
            y="62%"
            textAnchor="middle"
            fill="var(--theme-elevation-500)"
            fontSize="10"
          >
            {totalLabel}
          </text>
        </svg>
        <ul className="analytics-donut__legend">
          {colored.map((seg) => {
            const pct = total ? Math.round((seg.value / total) * 100) : 0
            return (
              <li key={seg.key} className={seg.value === 0 ? 'is-empty' : undefined}>
                <span className="analytics-donut__swatch" style={{ background: seg.color }} />
                <span className="analytics-donut__label">{seg.key}</span>
                <span className="analytics-donut__meta">
                  {seg.value} · {pct}%
                </span>
              </li>
            )
          })}
          {!colored.length && <li className="analytics-muted">{emptyLabel}</li>}
        </ul>
      </div>
    </div>
  )
}
