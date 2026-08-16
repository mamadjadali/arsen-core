import React from 'react'

type Props = {
  values: number[]
  width?: number
  height?: number
  className?: string
}

/** Mini column bars — readable for sparse daily traffic. */
export function Sparkline({ values, width = 100, height = 40, className }: Props) {
  const series = values.length ? values : [0]
  const padX = 2
  const padY = 3
  const max = Math.max(...series, 1)
  const n = series.length
  const gap = 1.5
  const innerW = width - padX * 2
  const barW = Math.max(2, (innerW - gap * (n - 1)) / n)
  const innerH = height - padY * 2
  const stubH = 2

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {series.map((v, i) => {
        const h = v > 0 ? Math.max(stubH + 2, (v / max) * innerH) : stubH
        const x = padX + i * (barW + gap)
        const y = height - padY - h
        return (
          <rect
            key={i}
            className={v > 0 ? 'analytics-spark__bar' : 'analytics-spark__bar analytics-spark__bar--zero'}
            x={x}
            y={y}
            width={barW}
            height={h}
            rx={1.25}
          />
        )
      })}
    </svg>
  )
}
