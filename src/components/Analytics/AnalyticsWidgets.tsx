import React from 'react'
import { cookies, headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { getDashboardWidgetStats } from '@/analytics/aggregate'
import { percentDelta } from '@/components/Analytics/charts/chartMath'
import { adminUi, tLabel } from '@/i18n/adminUi'

import { KpiCard } from './cards'
import './analytics.scss'

function resolveAdminLang(
  cookieLang: string | undefined,
  acceptLanguage: string,
): string {
  if (cookieLang) {
    const code = cookieLang.toLowerCase()
    if (code.startsWith('fa')) return 'fa'
    if (code.startsWith('en')) return 'en'
  }
  const accept = acceptLanguage.toLowerCase()
  if (accept.startsWith('fa') || accept.includes('fa-')) return 'fa'
  if (accept.startsWith('en')) return 'en'
  return 'fa'
}

export default async function AnalyticsWidgets() {
  const h = await headers()
  const jar = await cookies()
  const lang = resolveAdminLang(
    jar.get('payload-lng')?.value,
    h.get('accept-language') || '',
  )

  const payload = await getPayload({ config: configPromise })
  const stats = await getDashboardWidgetStats(payload)

  return (
    <div className="analytics-widgets">
      <div className="analytics-grid">
        <KpiCard
          label={tLabel(lang, adminUi.viewsToday)}
          value={stats.todayViews}
          sparkline={stats.sparkPageviews}
          accent="views"
          lang={lang}
        />
        <KpiCard
          label={tLabel(lang, adminUi.views7d)}
          value={stats.weekViews}
          delta={percentDelta(stats.weekViews, stats.priorWeekViews)}
          sparkline={stats.sparkPageviews}
          accent="views"
          lang={lang}
        />
        <KpiCard
          label={tLabel(lang, adminUi.uniques7d)}
          value={stats.weekUniques}
          delta={percentDelta(stats.weekUniques, stats.priorWeekUniques)}
          sparkline={stats.sparkUniques}
          accent="uniques"
          lang={lang}
        />
        <KpiCard
          label={tLabel(lang, adminUi.forms7d)}
          value={stats.weekForms}
          delta={percentDelta(stats.weekForms, stats.priorWeekForms)}
          sparkline={stats.sparkPageviews}
          accent="forms"
          lang={lang}
          hint={`${tLabel(lang, adminUi.topPrefix)} ${stats.topPage}`}
        />
      </div>
    </div>
  )
}
