import type { CollectionBeforeChangeHook } from 'payload'
import { randomUUID } from 'crypto'

import type { LiveBundle, Product } from '../../../payload-types'

type Line = NonNullable<LiveBundle['lines']>[number]

function resolveProductId(product: string | Product | null | undefined): string | null {
  if (!product) return null
  if (typeof product === 'string') return null
  const id = product.productId?.trim()
  return id || null
}

function productDocId(product: string | Product | null | undefined): string | null {
  if (!product) return null
  if (typeof product === 'string') return product
  return product.id ?? null
}

export const syncLiveBundleLines: CollectionBeforeChangeHook<LiveBundle> = async ({
  data,
  req,
}) => {
  if (!data) return data

  if (data.status === 'live' && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }

  if (!Array.isArray(data.lines) || data.lines.length === 0) return data

  const payload = req.payload
  const nextLines: Line[] = []

  for (const line of data.lines) {
    if (!line || typeof line !== 'object') {
      nextLines.push(line as Line)
      continue
    }

    const next: Line = { ...line }

    if (!next.lineId?.trim()) {
      next.lineId = randomUUID()
    } else {
      next.lineId = next.lineId.trim()
    }

    let productId = typeof next.productId === 'string' ? next.productId.trim() : ''
    const relatedId = productDocId(next.product)

    // Prefer productId (API-first). Resolve / re-resolve relation from it.
    if (productId) {
      next.productId = productId
      const matched = await payload.find({
        collection: 'products',
        where: {
          and: [{ productId: { equals: productId } }, { active: { not_equals: false } }],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })
      const doc = matched.docs[0]
      if (doc) {
        next.product = doc.id
      } else if (relatedId) {
        // Keep relation only if it still matches; otherwise clear
        const related = await payload.findByID({
          collection: 'products',
          id: relatedId,
          depth: 0,
          overrideAccess: true,
          req,
        })
        const relatedProductId = resolveProductId(related)
        if (relatedProductId !== productId) {
          next.product = null
        }
      }
    } else if (relatedId) {
      const related = await payload.findByID({
        collection: 'products',
        id: relatedId,
        depth: 0,
        overrideAccess: true,
        req,
      })
      const fromRelation = resolveProductId(related)
      if (fromRelation) {
        next.productId = fromRelation
        productId = fromRelation
      }
    }

    if (typeof next.colorName === 'string') {
      next.colorName = next.colorName.trim() || null
    }

    nextLines.push(next)
  }

  data.lines = nextLines
  return data
}
