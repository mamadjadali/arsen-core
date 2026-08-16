import type { ListViewServerProps } from 'payload'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { getAnalyticsSummary, type AnalyticsRange } from '@/analytics/aggregate'
import { percentDelta } from '@/components/Analytics/charts/chartMath'
import { adminUi, tLabel } from '@/i18n/adminUi'

import { KpiCard, SegmentCard, TopListCard, TrafficCard } from './cards'
import './analytics.scss'

function parseRange(value: string | string[] | undefined): AnalyticsRange {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === 'today' || raw === '30d' || raw === '7d') return raw
  return '7d'
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split('-')
  return m && d ? `${m}/${d}` : iso
}

function deviceLabel(key: string, lang: string | undefined): string {
  const k = key.toLowerCase()
  if (k === 'mobile') return tLabel(lang, adminUi.mobile)
  if (k === 'tablet') return tLabel(lang, adminUi.tablet)
  if (k === 'desktop') return tLabel(lang, adminUi.desktop)
  return key
}

/**
 * Replaces DefaultListView inside the admin shell (already wrapped by DefaultTemplate).
 * Do not wrap with DefaultTemplate again — visibleEntities/req are not on list props.
 */
export async function AnalyticsDashboard(props: ListViewServerProps) {
  const { payload, searchParams } = props
  const lang =
    (props as { i18n?: { language?: string } }).i18n?.language ||
    (props as { req?: { i18n?: { language?: string } } }).req?.i18n?.language ||
    'fa'
  const range = parseRange(searchParams?.range as string | string[] | undefined)
  const summary = await getAnalyticsSummary(payload, range)

  const rangeLabel =
    range === 'today'
      ? tLabel(lang, adminUi.today)
      : range === '30d'
        ? tLabel(lang, adminUi.last30Days)
        : tLabel(lang, adminUi.last7Days)

  const ranges: Array<{ id: AnalyticsRange; label: string }> = [
    { id: 'today', label: tLabel(lang, adminUi.today) },
    { id: '7d', label: tLabel(lang, adminUi.days7) },
    { id: '30d', label: tLabel(lang, adminUi.days30) },
  ]

  const spark = summary.timeseries.map((p) => p.pageviews)
  const uniqueSpark = summary.timeseries.map((p) => p.uniques)
  const labels = summary.timeseries.map((p) => shortDate(p.date))
  const devices = summary.devices.map((d) => ({
    key: deviceLabel(d.key, lang),
    count: d.count,
    colorKey: d.key,
  }))

  return (
    <Gutter className="analytics-dashboard">
      <div className="analytics-dashboard__header">
        <div>
          <h1>{tLabel(lang, adminUi.analytics)}</h1>
          <p className="analytics-muted">{rangeLabel}</p>
        </div>
        <div className="analytics-dashboard__ranges">
          {ranges.map((r) => (
            <a
              key={r.id}
              href={`/admin/collections/analytics-events?range=${r.id}`}
              className={range === r.id ? 'is-active' : undefined}
            >
              {r.label}
            </a>
          ))}
        </div>
      </div>

      <div className="analytics-grid">
        <KpiCard
          label={tLabel(lang, adminUi.pageviews)}
          value={summary.pageviews}
          delta={percentDelta(summary.pageviews, summary.priorPageviews)}
          sparkline={spark}
          accent="views"
          lang={lang}
        />
        <KpiCard
          label={tLabel(lang, adminUi.uniqueVisitors)}
          value={summary.uniques}
          delta={percentDelta(summary.uniques, summary.priorUniques)}
          sparkline={uniqueSpark}
          accent="uniques"
          lang={lang}
        />
        <KpiCard
          label={tLabel(lang, adminUi.formSubmits)}
          value={summary.formSubmits}
          delta={percentDelta(summary.formSubmits, summary.priorFormSubmits)}
          sparkline={spark}
          accent="forms"
          lang={lang}
        />
        <KpiCard
          label={tLabel(lang, adminUi.avgPerDay)}
          value={
            spark.length
              ? Math.round(summary.pageviews / spark.length).toLocaleString()
              : 0
          }
          sparkline={spark}
          hint={rangeLabel}
          accent="views"
          lang={lang}
        />
      </div>

      <div className="analytics-grid--charts">
        <TrafficCard
          title={tLabel(lang, adminUi.trafficOverTime)}
          values={spark}
          secondaryValues={uniqueSpark}
          labels={labels}
          rangeLabel={rangeLabel}
          pageviewsLabel={tLabel(lang, adminUi.pageviewsLegend)}
          uniquesLabel={tLabel(lang, adminUi.uniquesLegend)}
        />
        <SegmentCard
          title={tLabel(lang, adminUi.devices)}
          items={devices}
          totalLabel={tLabel(lang, adminUi.total)}
          emptyLabel={tLabel(lang, adminUi.noDeviceData)}
        />
      </div>

      <div className="analytics-grid--lists">
        <TopListCard
          title={tLabel(lang, adminUi.topPages)}
          items={summary.topPages}
          variant="pages"
          emptyLabel={tLabel(lang, adminUi.noDataYet)}
        />
        <TopListCard
          title={tLabel(lang, adminUi.topReferrers)}
          items={summary.topReferrers}
          variant="referrers"
          emptyLabel={tLabel(lang, adminUi.noDataYet)}
        />
      </div>
    </Gutter>
  )
}
