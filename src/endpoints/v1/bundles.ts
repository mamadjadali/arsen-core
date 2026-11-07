import type { Endpoint, PayloadRequest } from 'payload'

import { requireApiKey } from './auth'
import {
  asOptionalBoolean,
  asOptionalNumber,
  asTrimmedString,
  jsonError,
  jsonOk,
  readJsonBody,
} from './http'

type LineInput = {
  lineId?: string
  productId: string
  colorName?: string
  mixColorNames?: unknown
  quantity?: number
  quantityAsOptional?: boolean
  unitPriceToman?: number
  priceAsCall?: boolean
}

function parseLines(value: unknown): LineInput[] | { error: Response } | undefined {
  if (value === undefined) return undefined
  if (!Array.isArray(value)) {
    return { error: jsonError(400, 'validation_error', 'lines must be an array') }
  }

  const lines: LineInput[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const productId = asTrimmedString(row.productId)
    if (!productId) {
      return { error: jsonError(400, 'validation_error', 'each line requires productId') }
    }
    const line: LineInput = { productId }
    const lineId = asTrimmedString(row.lineId)
    const colorName = asTrimmedString(row.colorName)
    if (lineId) line.lineId = lineId
    if (colorName) line.colorName = colorName
    if (row.mixColorNames !== undefined) line.mixColorNames = row.mixColorNames
    const quantity = asOptionalNumber(row.quantity)
    if (quantity !== undefined) line.quantity = quantity
    const quantityAsOptional = asOptionalBoolean(row.quantityAsOptional)
    if (quantityAsOptional !== undefined) line.quantityAsOptional = quantityAsOptional
    const unitPriceToman = asOptionalNumber(row.unitPriceToman)
    if (unitPriceToman !== undefined) line.unitPriceToman = unitPriceToman
    const priceAsCall = asOptionalBoolean(row.priceAsCall)
    if (priceAsCall !== undefined) line.priceAsCall = priceAsCall
    lines.push(line)
  }
  return lines
}

function bundleDataFromBody(
  body: Record<string, unknown>,
  { requireName }: { requireName: boolean },
) {
  const name = asTrimmedString(body.name)
  if (requireName && !name) {
    return { error: jsonError(400, 'validation_error', 'name is required') }
  }

  const data: Record<string, unknown> = {}
  if (name) data.name = name

  const slug = asTrimmedString(body.slug)
  if (slug) data.slug = slug

  const notes = asTrimmedString(body.notes)
  if (body.notes !== undefined) data.notes = notes ?? null

  const status = asTrimmedString(body.status)
  if (status) {
    if (status !== 'draft' && status !== 'live' && status !== 'archived') {
      return { error: jsonError(400, 'validation_error', 'status must be draft|live|archived') }
    }
    data.status = status
  }

  const lines = parseLines(body.lines)
  if (lines && 'error' in lines) return { error: lines.error }
  if (body.lines !== undefined) data.lines = lines || []

  return { data }
}

async function findBundle(req: PayloadRequest, idOrSlug: string) {
  try {
    const byId = await req.payload.findByID({
      collection: 'live-bundles',
      id: idOrSlug,
      depth: 0,
      overrideAccess: true,
      req,
    })
    if (byId) return byId
  } catch {
    // not an id — try slug
  }

  const bySlug = await req.payload.find({
    collection: 'live-bundles',
    where: { slug: { equals: idOrSlug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  return bySlug.docs[0] || null
}

function routeIdOrSlug(req: PayloadRequest): string | null {
  const raw = req.routeParams?.idOrSlug
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].trim()) return raw[0].trim()
  return null
}

async function withBundlesAuth(
  req: PayloadRequest,
  handler: (req: PayloadRequest) => Promise<Response>,
): Promise<Response> {
  const auth = await requireApiKey(req, 'bundles')
  if (auth instanceof Response) return auth
  return handler(req)
}

export const v1CreateBundle: Endpoint = {
  path: '/v1/bundles',
  method: 'post',
  handler: async (req) =>
    withBundlesAuth(req, async (req) => {
      const body = (await readJsonBody(req)) as Record<string, unknown> | null
      if (!body || typeof body !== 'object') {
        return jsonError(400, 'validation_error', 'JSON body required')
      }

      const parsed = bundleDataFromBody(body, { requireName: true })
      if ('error' in parsed && parsed.error) return parsed.error

      const doc = await req.payload.create({
        collection: 'live-bundles',
        data: {
          ...parsed.data,
          name: parsed.data!.name as string,
          status: (parsed.data!.status as 'draft' | 'live' | 'archived') || 'draft',
        } as never,
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc, 201)
    }),
}

export const v1PatchBundle: Endpoint = {
  path: '/v1/bundles/:idOrSlug',
  method: 'patch',
  handler: async (req) =>
    withBundlesAuth(req, async (req) => {
      const idOrSlug = routeIdOrSlug(req)
      if (!idOrSlug) return jsonError(400, 'validation_error', 'idOrSlug required')

      const existing = await findBundle(req, idOrSlug)
      if (!existing) return jsonError(404, 'not_found', `Bundle not found: ${idOrSlug}`)

      const body = (await readJsonBody(req)) as Record<string, unknown> | null
      if (!body || typeof body !== 'object') {
        return jsonError(400, 'validation_error', 'JSON body required')
      }

      const parsed = bundleDataFromBody(body, { requireName: false })
      if ('error' in parsed && parsed.error) return parsed.error

      const doc = await req.payload.update({
        collection: 'live-bundles',
        id: existing.id,
        data: parsed.data || {},
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc)
    }),
}

export const v1GetBundle: Endpoint = {
  path: '/v1/bundles/:idOrSlug',
  method: 'get',
  handler: async (req) =>
    withBundlesAuth(req, async (req) => {
      const idOrSlug = routeIdOrSlug(req)
      if (!idOrSlug) return jsonError(400, 'validation_error', 'idOrSlug required')

      const doc = await findBundle(req, idOrSlug)
      if (!doc) return jsonError(404, 'not_found', `Bundle not found: ${idOrSlug}`)
      return jsonOk(doc)
    }),
}

export const v1PublishBundle: Endpoint = {
  path: '/v1/bundles/:idOrSlug/publish',
  method: 'post',
  handler: async (req) =>
    withBundlesAuth(req, async (req) => {
      const idOrSlug = routeIdOrSlug(req)
      if (!idOrSlug) return jsonError(400, 'validation_error', 'idOrSlug required')

      const existing = await findBundle(req, idOrSlug)
      if (!existing) return jsonError(404, 'not_found', `Bundle not found: ${idOrSlug}`)

      const doc = await req.payload.update({
        collection: 'live-bundles',
        id: existing.id,
        data: {
          status: 'live',
          publishedAt: existing.publishedAt || new Date().toISOString(),
        },
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc)
    }),
}

export const v1DisableBundle: Endpoint = {
  path: '/v1/bundles/:idOrSlug/disable',
  method: 'post',
  handler: async (req) =>
    withBundlesAuth(req, async (req) => {
      const idOrSlug = routeIdOrSlug(req)
      if (!idOrSlug) return jsonError(400, 'validation_error', 'idOrSlug required')

      const existing = await findBundle(req, idOrSlug)
      if (!existing) return jsonError(404, 'not_found', `Bundle not found: ${idOrSlug}`)

      const doc = await req.payload.update({
        collection: 'live-bundles',
        id: existing.id,
        data: { status: 'archived' },
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc)
    }),
}

export const v1BundleEndpoints: Endpoint[] = [
  v1CreateBundle,
  v1PatchBundle,
  v1GetBundle,
  v1PublishBundle,
  v1DisableBundle,
]
