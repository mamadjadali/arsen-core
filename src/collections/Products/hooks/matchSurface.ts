import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook } from 'payload'

import type { Product } from '../../../payload-types'

type ColorRow = NonNullable<Product['colors']>[number]
type SwatchRow = NonNullable<Product['colorSwatches']>[number]

export const normalizeProductMatchFields: CollectionBeforeValidateHook<Product> = ({ data }) => {
  if (!data) return data

  if (typeof data.productId === 'string') {
    const trimmed = data.productId.trim()
    data.productId = trimmed.length > 0 ? trimmed : null
  }

  if (typeof data.printName === 'string') {
    data.printName = data.printName.trim() || null
  }

  if (typeof data.brandKey === 'string') {
    data.brandKey = data.brandKey.trim() || null
  }

  if (typeof data.categoryKey === 'string') {
    data.categoryKey = data.categoryKey.trim() || null
  }

  if (Array.isArray(data.colors)) {
    data.colors = data.colors.map((row) => {
      if (!row || typeof row !== 'object') return row
      const next = { ...row } as ColorRow
      if (typeof next.name === 'string') next.name = next.name.trim()
      if (typeof next.sku === 'string') next.sku = next.sku.trim() || null
      if (typeof next.gtin === 'string') next.gtin = next.gtin.trim() || null
      if (typeof next.variantId === 'string') next.variantId = next.variantId.trim() || null
      return next
    })
  }

  return data
}

/** When colorSwatches is empty, seed PLP dots from match-surface color names. */
export const deriveSwatchesFromColors: CollectionBeforeChangeHook<Product> = ({ data }) => {
  if (!data) return data

  const colors = data.colors
  const swatches = data.colorSwatches
  const hasSwatches = Array.isArray(swatches) && swatches.some((s) => s?.hex?.trim())
  if (hasSwatches || !Array.isArray(colors) || colors.length === 0) return data

  const derived: SwatchRow[] = colors
    .filter((c): c is ColorRow => Boolean(c?.name?.trim()))
    .map((c) => ({
      label: c.name,
      hex: '#C4A574',
    }))

  if (derived.length > 0) {
    data.colorSwatches = derived
  }

  return data
}
