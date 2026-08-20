'use client'

import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { isFa, toFaDigits } from '@/i18n/adminUi'

export type TrafficPoint = {
  date: string
  pageviews: number
  uniques: number
}

type Props = {
  data: TrafficPoint[]
  pageviewsLabel: string
  uniquesLabel: string
  lang?: string
}

function formatMd(iso: string, lang?: string): string {
  const [, m, d] = iso.split('-')
  const md = m && d ? `${m}/${d}` : iso
  return isFa(lang) ? toFaDigits(md) : md
}

export function TrafficAreaChart({ data, pageviewsLabel, uniquesLabel, lang }: Props) {
  const series =
    data.length > 0
      ? data
      : [{ date: new Date().toISOString().slice(0, 10), pageviews: 0, uniques: 0 }]

  const chartConfig = {
    pageviews: {
      label: pageviewsLabel,
      color: 'var(--analytics-views)',
    },
    uniques: {
      label: uniquesLabel,
      color: 'var(--analytics-uniques)',
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="analytics-traffic__chart" dir="ltr">
      <AreaChart data={series} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="fillPageviews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-pageviews)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-pageviews)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillUniques" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-uniques)" stopOpacity={0.22} />
            <stop offset="95%" stopColor="var(--color-uniques)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--theme-elevation-150)" strokeDasharray="4 6" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          minTickGap={24}
          tickFormatter={(value) => formatMd(String(value), lang)}
          tick={{ fill: 'var(--theme-elevation-500)', fontSize: 11 }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(value) => formatMd(String(value ?? ''), lang)}
            />
          }
        />
        <Area
          dataKey="pageviews"
          type="monotone"
          fill="url(#fillPageviews)"
          stroke="var(--color-pageviews)"
          strokeWidth={2.25}
          dot={{ r: 3, strokeWidth: 1, stroke: 'var(--theme-elevation-0)' }}
          activeDot={{ r: 4 }}
        />
        <Area
          dataKey="uniques"
          type="monotone"
          fill="url(#fillUniques)"
          stroke="var(--color-uniques)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={{ r: 3, strokeWidth: 1, stroke: 'var(--theme-elevation-0)' }}
          activeDot={{ r: 4 }}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )
}
