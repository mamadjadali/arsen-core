import type { Payload } from 'payload'

export type AnalyticsRange = '7d' | '30d' | 'today'

export type TimeseriesPoint = {
  date: string
  pageviews: number
  uniques: number
}

export type TopPageItem = {
  key: string
  title?: string
  count: number
}

export type AnalyticsSummary = {
  pageviews: number
  uniques: number
  formSubmits: number
  priorPageviews: number
  priorUniques: number
  priorFormSubmits: number
  topPages: TopPageItem[]
  topReferrers: Array<{ key: string; count: number }>
  devices: Array<{ key: string; count: number }>
  timeseries: TimeseriesPoint[]
  rangeLabel: string
}

const DEVICE_ORDER = ['mobile', 'tablet', 'desktop'] as const

function rangeMs(range: AnalyticsRange): {
  start: Date
  end: Date
  priorStart: Date
  priorEnd: Date
  label: string
  dayCount: number
} {
  const end = new Date()
  const start = new Date(end)
  const priorEnd = new Date(end)
  const priorStart = new Date(end)

  if (range === 'today') {
    // UTC midnight for "today" so day buckets match $dateToString
    const y = end.getUTCFullYear()
    const m = end.getUTCMonth()
    const d = end.getUTCDate()
    start.setTime(Date.UTC(y, m, d, 0, 0, 0, 0))
    priorEnd.setTime(start.getTime())
    priorStart.setTime(start.getTime() - 24 * 60 * 60 * 1000)
    return { start, end, priorStart, priorEnd, label: 'Today', dayCount: 1 }
  }

  const days = range === '30d' ? 30 : 7
  start.setTime(end.getTime() - days * 24 * 60 * 60 * 1000)
  priorEnd.setTime(start.getTime())
  priorStart.setTime(start.getTime() - days * 24 * 60 * 60 * 1000)
  return {
    start,
    end,
    priorStart,
    priorEnd,
    label: range === '30d' ? 'Last 30 days' : 'Last 7 days',
    dayCount: days,
  }
}

function formatDayUTC(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Day keys in UTC to match Mongo `$dateToString` without timezone. */
function buildDayKeys(start: Date, end: Date): string[] {
  const keys: string[] = []
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()))
  const endDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()))
  while (cursor <= endDay) {
    keys.push(formatDayUTC(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return keys
}

function padDevices(rows: Array<{ key: string; count: number }>) {
  const byKey = new Map(rows.map((r) => [r.key.toLowerCase(), r.count]))
  return DEVICE_ORDER.map((key) => ({
    key,
    count: byKey.get(key) || 0,
  }))
}

type AggRow = {
  _id: string | null
  count: number
  uniques?: string[]
  title?: string | null
}

async function getModel(payload: Payload) {
  const collections = payload.db.collections as Record<
    string,
    { aggregate: (pipeline: unknown[]) => { exec: () => Promise<unknown> } | Promise<unknown> }
  >
  return collections['analytics-events']
}

async function runAggregate(payload: Payload, pipeline: unknown[]): Promise<AggRow[]> {
  const model = await getModel(payload)
  if (!model?.aggregate) return []
  const cursor = model.aggregate(pipeline)
  const result =
    typeof (cursor as { exec?: () => Promise<unknown> }).exec === 'function'
      ? await (cursor as { exec: () => Promise<unknown> }).exec()
      : await cursor
  return (result as AggRow[]) || []
}

async function countPageviews(payload: Payload, start: Date, end: Date) {
  const rows = await runAggregate(payload, [
    {
      $match: {
        type: 'pageview',
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        uniques: { $addToSet: '$visitorId' },
      },
    },
  ])
  const row = rows[0]
  return {
    pageviews: row?.count || 0,
    uniques: Array.isArray(row?.uniques) ? row.uniques.filter(Boolean).length : 0,
  }
}

async function countEvents(payload: Payload, name: string, start: Date, end: Date) {
  const rows = await runAggregate(payload, [
    {
      $match: {
        type: 'event',
        name,
        createdAt: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: null, count: { $sum: 1 } } },
  ])
  return rows[0]?.count || 0
}

async function topField(
  payload: Payload,
  field: 'referrer' | 'device',
  start: Date,
  end: Date,
  limit = 8,
) {
  const rows = await runAggregate(payload, [
    {
      $match: {
        type: 'pageview',
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: `$${field}`,
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
  ])
  return rows.filter((r) => r._id).map((r) => ({ key: String(r._id), count: r.count }))
}

async function topPages(
  payload: Payload,
  start: Date,
  end: Date,
  limit = 8,
): Promise<TopPageItem[]> {
  const rows = await runAggregate(payload, [
    {
      $match: {
        type: 'pageview',
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: '$path',
        count: { $sum: 1 },
        title: { $last: '$title' },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
  ])
  return rows
    .filter((r) => r._id)
    .map((r) => ({
      key: String(r._id),
      title: typeof r.title === 'string' && r.title.trim() ? r.title.trim() : undefined,
      count: r.count,
    }))
}

async function dailyTimeseries(
  payload: Payload,
  start: Date,
  end: Date,
): Promise<TimeseriesPoint[]> {
  const rows = await runAggregate(payload, [
    {
      $match: {
        type: 'pageview',
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
        uniques: { $addToSet: '$visitorId' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const byDay = new Map(
    rows
      .filter((r) => r._id)
      .map((r) => [
        String(r._id),
        {
          pageviews: r.count,
          uniques: Array.isArray(r.uniques) ? r.uniques.filter(Boolean).length : 0,
        },
      ]),
  )

  return buildDayKeys(start, end).map((date) => {
    const hit = byDay.get(date)
    return {
      date,
      pageviews: hit?.pageviews || 0,
      uniques: hit?.uniques || 0,
    }
  })
}

export async function getAnalyticsSummary(
  payload: Payload,
  range: AnalyticsRange = '7d',
): Promise<AnalyticsSummary> {
  const { start, end, priorStart, priorEnd, label } = rangeMs(range)

  const [current, prior, formSubmits, priorFormSubmits, pages, topReferrers, deviceRows, timeseries] =
    await Promise.all([
      countPageviews(payload, start, end),
      countPageviews(payload, priorStart, priorEnd),
      countEvents(payload, 'form_submit', start, end),
      countEvents(payload, 'form_submit', priorStart, priorEnd),
      topPages(payload, start, end),
      topField(payload, 'referrer', start, end),
      topField(payload, 'device', start, end, 3),
      dailyTimeseries(payload, start, end),
    ])

  return {
    pageviews: current.pageviews,
    uniques: current.uniques,
    formSubmits,
    priorPageviews: prior.pageviews,
    priorUniques: prior.uniques,
    priorFormSubmits,
    topPages: pages,
    topReferrers,
    devices: padDevices(deviceRows),
    timeseries,
    rangeLabel: label,
  }
}

export async function getDashboardWidgetStats(payload: Payload) {
  const [today, week] = await Promise.all([
    getAnalyticsSummary(payload, 'today'),
    getAnalyticsSummary(payload, '7d'),
  ])

  const spark = week.timeseries.map((p) => p.pageviews)
  const top = week.topPages[0]

  return {
    todayViews: today.pageviews,
    weekViews: week.pageviews,
    weekUniques: week.uniques,
    weekForms: week.formSubmits,
    topPage: top?.title || top?.key || '—',
    priorWeekViews: week.priorPageviews,
    priorWeekUniques: week.priorUniques,
    priorWeekForms: week.priorFormSubmits,
    sparkPageviews: spark,
    sparkUniques: week.timeseries.map((p) => p.uniques),
  }
}
