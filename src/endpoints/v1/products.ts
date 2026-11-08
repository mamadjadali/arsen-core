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

type ColorInput = {
  name: string
  sku?: string
  gtin?: string
  variantId?: string
  b2bPrice?: number
  remains?: number
}

type ColorSwatchInput = {
  label?: string | null
  hex: string
}

const HEX6_RE = /^#([0-9A-Fa-f]{6})$/

function parseColors(value: unknown): ColorInput[] | undefined {
  if (value === undefined) return undefined
  if (!Array.isArray(value)) return undefined
  const colors: ColorInput[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const name = asTrimmedString(row.name)
    if (!name) continue
    const color: ColorInput = { name }
    const sku = asTrimmedString(row.sku)
    const gtin = asTrimmedString(row.gtin)
    const variantId = asTrimmedString(row.variantId)
    const b2bPrice = asOptionalNumber(row.b2bPrice)
    const remains = asOptionalNumber(row.remains)
    if (sku) color.sku = sku
    if (gtin) color.gtin = gtin
    if (variantId) color.variantId = variantId
    if (b2bPrice !== undefined) color.b2bPrice = b2bPrice
    if (remains !== undefined) color.remains = remains
    colors.push(color)
  }
  return colors
}

function parseColorSwatches(
  value: unknown,
): ColorSwatchInput[] | { error: Response } | undefined {
  if (value === undefined) return undefined
  if (!Array.isArray(value)) {
    return { error: jsonError(400, 'validation_error', 'colorSwatches must be an array') }
  }

  const swatches: ColorSwatchInput[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const hexRaw = asTrimmedString(row.hex)
    if (!hexRaw || !HEX6_RE.test(hexRaw)) {
      return {
        error: jsonError(
          400,
          'validation_error',
          'each colorSwatches entry requires hex like #C4A574',
        ),
      }
    }
    const label = asTrimmedString(row.label)
    const swatch: ColorSwatchInput = { hex: hexRaw }
    if (label) swatch.label = label
    else swatch.label = null
    swatches.push(swatch)
  }
  return swatches
}

function productDataFromBody(body: Record<string, unknown>, { requireTitle }: { requireTitle: boolean }) {
  const title = asTrimmedString(body.title)
  if (requireTitle && !title) {
    return { error: jsonError(400, 'validation_error', 'title is required') }
  }

  const data: Record<string, unknown> = {}
  if (title) data.title = title

  const productId = asTrimmedString(body.productId)
  if (productId) data.productId = productId

  if (body.printName !== undefined) data.printName = asTrimmedString(body.printName) ?? null
  if (body.brandKey !== undefined) data.brandKey = asTrimmedString(body.brandKey) ?? null
  if (body.categoryKey !== undefined) data.categoryKey = asTrimmedString(body.categoryKey) ?? null
  if (body.imageUrl !== undefined) data.imageUrl = asTrimmedString(body.imageUrl) ?? null
  if (body.summary !== undefined) data.summary = asTrimmedString(body.summary) ?? null

  const slug = asTrimmedString(body.slug)
  if (slug) data.slug = slug

  const active = asOptionalBoolean(body.active)
  if (active !== undefined) data.active = active

  const price = asOptionalNumber(body.price)
  if (body.price !== undefined) data.price = price ?? null

  const colors = parseColors(body.colors)
  if (body.colors !== undefined) {
    if (!Array.isArray(body.colors)) {
      return { error: jsonError(400, 'validation_error', 'colors must be an array') }
    }
    data.colors = colors || []
  }

  if (body.colorSwatches !== undefined) {
    const swatches = parseColorSwatches(body.colorSwatches)
    if (swatches && 'error' in swatches) return { error: swatches.error }
    data.colorSwatches = swatches || []
  }

  return { data }
}

async function findProductByExternalId(req: PayloadRequest, productId: string) {
  const result = await req.payload.find({
    collection: 'products',
    where: { productId: { equals: productId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  return result.docs[0] || null
}

function routeProductId(req: PayloadRequest): string | null {
  const raw = req.routeParams?.productId
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].trim()) return raw[0].trim()
  return null
}

async function withProductsAuth(
  req: PayloadRequest,
  handler: (req: PayloadRequest) => Promise<Response>,
): Promise<Response> {
  const auth = await requireApiKey(req, 'products')
  if (auth instanceof Response) return auth
  return handler(req)
}

export const v1CreateProduct: Endpoint = {
  path: '/v1/products',
  method: 'post',
  handler: async (req) =>
    withProductsAuth(req, async (req) => {
      const body = (await readJsonBody(req)) as Record<string, unknown> | null
      if (!body || typeof body !== 'object') {
        return jsonError(400, 'validation_error', 'JSON body required')
      }

      const productId = asTrimmedString(body.productId)
      if (!productId) {
        return jsonError(400, 'validation_error', 'productId is required')
      }

      const parsed = productDataFromBody(body, { requireTitle: true })
      if ('error' in parsed && parsed.error) return parsed.error

      const existing = await findProductByExternalId(req, productId)
      if (existing) {
        const doc = await req.payload.update({
          collection: 'products',
          id: existing.id,
          data: { ...parsed.data, productId },
          depth: 0,
          overrideAccess: true,
          req,
        })
        return jsonOk(doc)
      }

      const doc = await req.payload.create({
        collection: 'products',
        data: {
          ...parsed.data,
          productId,
          title: parsed.data!.title as string,
        } as never,
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc, 201)
    }),
}

export const v1PatchProduct: Endpoint = {
  path: '/v1/products/:productId',
  method: 'patch',
  handler: async (req) =>
    withProductsAuth(req, async (req) => {
      const productId = routeProductId(req)
      if (!productId) return jsonError(400, 'validation_error', 'productId required')

      const existing = await findProductByExternalId(req, productId)
      if (!existing) return jsonError(404, 'not_found', `Product not found: ${productId}`)

      const body = (await readJsonBody(req)) as Record<string, unknown> | null
      if (!body || typeof body !== 'object') {
        return jsonError(400, 'validation_error', 'JSON body required')
      }

      const parsed = productDataFromBody(body, { requireTitle: false })
      if ('error' in parsed && parsed.error) return parsed.error

      const data = { ...parsed.data }
      // Keep path productId as source of truth; ignore body override mismatches
      delete data.productId

      const doc = await req.payload.update({
        collection: 'products',
        id: existing.id,
        data,
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc)
    }),
}

export const v1GetProduct: Endpoint = {
  path: '/v1/products/:productId',
  method: 'get',
  handler: async (req) =>
    withProductsAuth(req, async (req) => {
      const productId = routeProductId(req)
      if (!productId) return jsonError(400, 'validation_error', 'productId required')

      const doc = await findProductByExternalId(req, productId)
      if (!doc) return jsonError(404, 'not_found', `Product not found: ${productId}`)
      return jsonOk(doc)
    }),
}

export const v1PublishProduct: Endpoint = {
  path: '/v1/products/:productId/publish',
  method: 'post',
  handler: async (req) =>
    withProductsAuth(req, async (req) => {
      const productId = routeProductId(req)
      if (!productId) return jsonError(400, 'validation_error', 'productId required')

      const existing = await findProductByExternalId(req, productId)
      if (!existing) return jsonError(404, 'not_found', `Product not found: ${productId}`)

      const doc = await req.payload.update({
        collection: 'products',
        id: existing.id,
        data: {
          _status: 'published',
          publishedAt: existing.publishedAt || new Date().toISOString(),
        },
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc)
    }),
}

export const v1UnpublishProduct: Endpoint = {
  path: '/v1/products/:productId/unpublish',
  method: 'post',
  handler: async (req) =>
    withProductsAuth(req, async (req) => {
      const productId = routeProductId(req)
      if (!productId) return jsonError(400, 'validation_error', 'productId required')

      const existing = await findProductByExternalId(req, productId)
      if (!existing) return jsonError(404, 'not_found', `Product not found: ${productId}`)

      const doc = await req.payload.update({
        collection: 'products',
        id: existing.id,
        data: { _status: 'draft' },
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc)
    }),
}

export const v1DisableProduct: Endpoint = {
  path: '/v1/products/:productId/disable',
  method: 'post',
  handler: async (req) =>
    withProductsAuth(req, async (req) => {
      const productId = routeProductId(req)
      if (!productId) return jsonError(400, 'validation_error', 'productId required')

      const existing = await findProductByExternalId(req, productId)
      if (!existing) return jsonError(404, 'not_found', `Product not found: ${productId}`)

      const doc = await req.payload.update({
        collection: 'products',
        id: existing.id,
        data: { active: false },
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc)
    }),
}

export const v1EnableProduct: Endpoint = {
  path: '/v1/products/:productId/enable',
  method: 'post',
  handler: async (req) =>
    withProductsAuth(req, async (req) => {
      const productId = routeProductId(req)
      if (!productId) return jsonError(400, 'validation_error', 'productId required')

      const existing = await findProductByExternalId(req, productId)
      if (!existing) return jsonError(404, 'not_found', `Product not found: ${productId}`)

      const doc = await req.payload.update({
        collection: 'products',
        id: existing.id,
        data: { active: true },
        depth: 0,
        overrideAccess: true,
        req,
      })
      return jsonOk(doc)
    }),
}

export const v1ProductEndpoints: Endpoint[] = [
  v1CreateProduct,
  v1PatchProduct,
  v1GetProduct,
  v1PublishProduct,
  v1UnpublishProduct,
  v1DisableProduct,
  v1EnableProduct,
]
