'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

const VISITOR_KEY = 'ranjbar_vid'
const SESSION_KEY = 'ranjbar_sid'

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getOrCreate(storage: Storage, key: string): string {
  try {
    const existing = storage.getItem(key)
    if (existing) return existing
    const id = uuid()
    storage.setItem(key, id)
    return id
  } catch {
    return uuid()
  }
}

function deviceBucket(): 'mobile' | 'tablet' | 'desktop' {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1024
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

function referrerHost(): string {
  try {
    if (!document.referrer) return '(direct)'
    const url = new URL(document.referrer)
    if (url.hostname === window.location.hostname) return '(direct)'
    return url.hostname
  } catch {
    return '(direct)'
  }
}

export type TrackEventPayload = {
  type: 'pageview' | 'event'
  name?: string
  path?: string
  title?: string
  meta?: Record<string, unknown>
}

function pageTitle(): string | undefined {
  try {
    const t = document.title?.trim().slice(0, 120)
    return t || undefined
  } catch {
    return undefined
  }
}

export function trackAnalytics(payload: TrackEventPayload): void {
  if (typeof window === 'undefined') return

  const path = payload.path || window.location.pathname
  if (path.startsWith('/admin') || path.startsWith('/api')) return

  const params = new URLSearchParams(window.location.search)
  const body = {
    type: payload.type,
    name: payload.name,
    path,
    title: payload.title || pageTitle(),
    referrer: referrerHost(),
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    device: deviceBucket(),
    visitorId: getOrCreate(window.localStorage, VISITOR_KEY),
    sessionId: getOrCreate(window.sessionStorage, SESSION_KEY),
    meta: payload.meta,
  }

  const json = JSON.stringify(body)
  const url = '/api/analytics/collect'

  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: json,
    keepalive: true,
  }).catch(() => {
    // ignore network errors
  })
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    const key = `${pathname}?${searchParams?.toString() || ''}`
    if (lastPath.current === key) return
    lastPath.current = key
    trackAnalytics({ type: 'pageview', path: pathname })
  }, [pathname, searchParams])

  return null
}
