import React from 'react'

import { formatDeltaPill, isFa } from '@/i18n/adminUi'

import { AreaChart } from './charts/AreaChart'
import { percentDelta } from './charts/chartMath'
import { DonutChart } from './charts/DonutChart'
import { Sparkline } from './charts/Sparkline'
import './analytics.scss'

export type KpiAccent = 'views' | 'uniques' | 'forms' | 'neutral'

type KpiCardProps = {
  label: string
  value: number | string
  hint?: string
  current?: number
  prior?: number
  delta?: number | null
  sparkline?: number[]
  accent?: KpiAccent
  lang?: string
}

export function KpiCard({
  label,
  value,
  hint,
  current,
  prior,
  delta,
  sparkline,
  accent = 'views',
  lang,
}: KpiCardProps) {
  const resolvedDelta =
    delta !== undefined
      ? delta
      : current != null && prior != null
        ? percentDelta(current, prior)
        : null
  const deltaLabel = formatDeltaPill(resolvedDelta, lang)
  const positive = typeof resolvedDelta === 'number' && resolvedDelta > 0
  const negative = typeof resolvedDelta === 'number' && resolvedDelta < 0

  return (
    <div className={`analytics-card analytics-kpi analytics-kpi--${accent}`}>
      <div className="analytics-kpi__main">
        <p className="analytics-kpi__label">{label}</p>
        <p className="analytics-kpi__value">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {deltaLabel ? (
          <span
            dir={isFa(lang) ? 'rtl' : 'ltr'}
            className={
              positive
                ? 'analytics-kpi__pill analytics-kpi__pill--up'
                : negative
                  ? 'analytics-kpi__pill analytics-kpi__pill--down'
                  : 'analytics-kpi__pill'
            }
          >
            {deltaLabel}
          </span>
        ) : null}
        {hint ? <p className="analytics-kpi__hint">{hint}</p> : null}
      </div>
      {sparkline && sparkline.length > 0 ? (
        <Sparkline values={sparkline} className="analytics-kpi__spark" />
      ) : null}
    </div>
  )
}

/** @deprecated Prefer KpiCard */
export function StatCard(props: KpiCardProps) {
  return <KpiCard {...props} />
}

type TopListCardProps = {
  title: string
  items: Array<{ key: string; title?: string; count: number }>
  emptyLabel?: string
  variant?: 'pages' | 'referrers'
}

export function TopListCard({
  title,
  items,
  emptyLabel = 'No data yet',
  variant = 'pages',
}: TopListCardProps) {
  const max = Math.max(...items.map((i) => i.count), 1)

  return (
    <div className={`analytics-card analytics-toplist analytics-toplist--${variant}`}>
      <h3 className="analytics-card__title">{title}</h3>
      {items.length === 0 ? (
        <p className="analytics-empty">{emptyLabel}</p>
      ) : (
        <ul className="analytics-toplist__list">
          {items.map((item) => {
            const primary = item.title?.trim() || item.key
            const showPath = Boolean(item.title?.trim()) && item.title !== item.key
            return (
              <li key={item.key} className="analytics-toplist__row">
                <div className="analytics-toplist__meta">
                  <div className="analytics-toplist__label">
                    <span className="analytics-toplist__key" title={primary}>
                      {primary}
                    </span>
                    {showPath ? (
                      <span className="analytics-toplist__path" title={item.key}>
                        {item.key}
                      </span>
                    ) : null}
                  </div>
                  <span className="analytics-toplist__count">{item.count.toLocaleString()}</span>
                </div>
                <div className="analytics-toplist__bar">
                  <span style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

type SegmentCardProps = {
  title?: string
  items: Array<{ key: string; count: number; colorKey?: string }>
  totalLabel?: string
  emptyLabel?: string
}

export function SegmentCard({
  title = 'Devices',
  items,
  totalLabel,
  emptyLabel,
}: SegmentCardProps) {
  return (
    <div className="analytics-card analytics-segment">
      <h3 className="analytics-card__title">{title}</h3>
      <DonutChart
        segments={items.map((i) => ({
          key: i.key,
          value: i.count,
          colorKey: i.colorKey,
        }))}
        className="analytics-segment__chart"
        totalLabel={totalLabel}
        emptyLabel={emptyLabel}
      />
    </div>
  )
}

/** @deprecated Prefer SegmentCard */
export function DeviceBreakdownCard(props: SegmentCardProps) {
  return <SegmentCard {...props} />
}

type TrafficCardProps = {
  title?: string
  rangeLabel?: string
  values: number[]
  secondaryValues?: number[]
  labels?: string[]
  pageviewsLabel?: string
  uniquesLabel?: string
}

export function TrafficCard({
  title = 'Traffic over time',
  rangeLabel,
  values,
  secondaryValues,
  labels,
  pageviewsLabel = 'Pageviews',
  uniquesLabel = 'Uniques',
}: TrafficCardProps) {
  return (
    <div className="analytics-card analytics-traffic">
      <div className="analytics-traffic__head">
        <h3 className="analytics-card__title">{title}</h3>
        {rangeLabel ? <span className="analytics-traffic__range">{rangeLabel}</span> : null}
      </div>
      <AreaChart
        values={values}
        secondaryValues={secondaryValues}
        labels={labels}
        className="analytics-traffic__chart"
      />
      <div className="analytics-traffic__legend">
        <span className="analytics-traffic__legend-item">
          <span className="analytics-traffic__swatch" />
          {pageviewsLabel}
        </span>
        {secondaryValues ? (
          <span className="analytics-traffic__legend-item">
            <span className="analytics-traffic__swatch analytics-traffic__swatch--dashed" />
            {uniquesLabel}
          </span>
        ) : null}
      </div>
    </div>
  )
}
