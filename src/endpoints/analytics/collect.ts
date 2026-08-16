import type { Endpoint } from 'payload'

const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|wget|curl|python-requests|headless/i

const MAX_PATH = 500
const MAX_REF = 200
const MAX_ID = 80
const MAX_META_CHARS = 500

type CollectBody = {
  type?: unknown
  name?: unknown
  path?: unknown
  title?: unknown
  referrer?: unknown
  utmSource?: unknown
  utmMedium?: unknown
  utmCampaign?: unknown
  device?: unknown
  visitorId?: unknown
  sessionId?: unknown
  meta?: unknown
}

function asTrimmedString(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().slice(0, max)
  return trimmed || undefined
}

function normalizePath(value: unknown): string | null {
  const raw = asTrimmedString(value, MAX_PATH)
  if (!raw) return null
  if (!raw.startsWith('/')) return null
  if (raw.startsWith('/admin') || raw.startsWith('/api')) return null
  return raw.split('?')[0]?.split('#')[0] || null
}

function normalizeDevice(value: unknown): 'mobile' | 'tablet' | 'desktop' | undefined {
  if (value === 'mobile' || value === 'tablet' || value === 'desktop') return value
  return undefined
}

function normalizeMeta(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  try {
    const json = JSON.stringify(value)
    if (json.length > MAX_META_CHARS) return undefined
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return undefined
  }
}

async function readJson(req: { json?: () => Promise<unknown>; data?: unknown }): Promise<unknown> {
  if (typeof req.json === 'function') {
    try {
      return await req.json()
    } catch {
      return req.data ?? null
    }
  }
  return req.data ?? null
}

export const analyticsCollectEndpoint: Endpoint = {
  path: '/analytics/collect',
  method: 'post',
  handler: async (req) => {
    const ua = req.headers.get('user-agent') || ''
    if (BOT_UA.test(ua)) {
      return new Response(null, { status: 204 })
    }

    try {
      const settings = await req.payload.findGlobal({
        slug: 'settings',
        depth: 0,
        overrideAccess: true,
        select: { analyticsEnabled: true },
      })
      if (settings.analyticsEnabled === false) {
        return new Response(null, { status: 204 })
      }
    } catch {
      // If settings missing, still accept events
    }

    const raw = await readJson(req)
    if (!raw || typeof raw !== 'object') {
      return Response.json({ error: 'Invalid body' }, { status: 400 })
    }

    const body = raw as CollectBody
    const type = body.type === 'event' ? 'event' : body.type === 'pageview' ? 'pageview' : null
    const path = normalizePath(body.path)

    if (!type || !path) {
      return Response.json({ error: 'Invalid type or path' }, { status: 400 })
    }

    const name =
      type === 'event' ? asTrimmedString(body.name, 80) || 'event' : undefined

    try {
      await req.payload.create({
        collection: 'analytics-events',
        data: {
          type,
          name,
          path,
          title: asTrimmedString(body.title, 120),
          referrer: asTrimmedString(body.referrer, MAX_REF) || '(direct)',
          utmSource: asTrimmedString(body.utmSource, 100),
          utmMedium: asTrimmedString(body.utmMedium, 100),
          utmCampaign: asTrimmedString(body.utmCampaign, 100),
          device: normalizeDevice(body.device),
          visitorId: asTrimmedString(body.visitorId, MAX_ID),
          sessionId: asTrimmedString(body.sessionId, MAX_ID),
          meta: normalizeMeta(body.meta),
        },
        overrideAccess: true,
        req,
        context: { disableRevalidate: true },
      })
    } catch (err) {
      req.payload.logger.error({ err }, 'Analytics collect failed')
      return Response.json({ error: 'Collect failed' }, { status: 500 })
    }

    return new Response(null, { status: 204 })
  },
}
