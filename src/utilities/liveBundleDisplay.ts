import type { Media, Product } from '@/payload-types'

import { formatPrice } from '@/utilities/productDisplay'
import { resolveMediaUrl, resolveProductImageUrl } from '@/utilities/resolveMedia'

export type BundleColorDot = {
  label: string
  hex: string
}

export type BundleTableRowDto = {
  key: string
  name: string
  colorLabel: string
  /** Resolved swatches for selected color(s); empty when hex unknown. */
  colorDots: BundleColorDot[]
  quantityLabel: string
  priceLabel: string
  imageUrl: string | null
  /** Numeric qty for totals (null when optional / missing). */
  quantityValue: number | null
  /** Line total (qty × unit) for totals (null when Call / missing). */
  lineTotalValue: number | null
}

const HEX6_RE = /^#([0-9A-Fa-f]{6})$/

/** Strip warranty / suffix after ` - ` (same idea as Ara display names). */
export function colorLabelMatchKey(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return ''
  const separator = trimmed.indexOf(' - ')
  const base = separator > 0 ? trimmed.slice(0, separator).trim() : trimmed
  return base.toLowerCase()
}

export type BundleTableTotalsDto = {
  quantityLabel: string
  priceLabel: string
}

export type BundleListItemDto = {
  id: string
  name: string
  slug: string
  notes: string | null
  logoUrl: string | null
  publishedAt: string | null
  jalaliPublishedAt: string | null
  rows: BundleTableRowDto[]
  totals: BundleTableTotalsDto
}

/** Lean shape from listing `select` (not a full LiveBundle). */
export type BundleListSource = {
  id: string
  name: string
  slug: string
  notes?: string | null
  publishedAt?: string | null
  brandLogos?: (string | Media | null)[] | null
  lines?:
    | {
        id?: string | null
        lineId?: string | null
        productId?: string | null
        product?: string | Product | null
        colorName?: string | null
        mixColorNames?: unknown
        quantity?: number | null
        quantityAsOptional?: boolean | null
        unitPriceToman?: number | null
        priceAsCall?: boolean | null
      }[]
    | null
}

function asMedia(value: unknown): Media | null {
  if (value && typeof value === 'object' && 'url' in value) {
    return value as Media
  }
  return null
}

function asProduct(value: unknown): Product | null {
  if (value && typeof value === 'object' && 'id' in value) {
    return value as Product
  }
  return null
}

export function productDisplayName(
  product: Product | null,
  productId?: string | null,
): string {
  return product?.printName?.trim() || product?.title?.trim() || productId?.trim() || '—'
}

export function formatBundleColorLabel(
  colorName?: string | null,
  _mixColorNames?: unknown,
): string {
  const name = colorName?.trim() || ''
  if (name.toLowerCase() === 'mix') return 'Mix'
  return name || '—'
}

/**
 * Circles for Mix selections or a single colorName, matched against product.colorSwatches.
 * Omits entries with no resolvable hex (does not invent colors).
 */
export function resolveBundleColorDots(
  product: Product | null,
  colorName?: string | null,
  mixColorNames?: unknown,
): BundleColorDot[] {
  const byKey = new Map<string, string>()
  for (const row of product?.colorSwatches || []) {
    if (!row || typeof row !== 'object') continue
    const hex = typeof row.hex === 'string' ? row.hex.trim() : ''
    if (!HEX6_RE.test(hex)) continue
    const label = typeof row.label === 'string' ? row.label.trim() : ''
    if (label) {
      byKey.set(colorLabelMatchKey(label), hex)
    }
    // Also index bare hex-only rows under hex itself (rare)
    if (!label) byKey.set(hex.toLowerCase(), hex)
  }

  const wanted: string[] = []
  const name = colorName?.trim() || ''
  if (name.toLowerCase() === 'mix') {
    if (Array.isArray(mixColorNames)) {
      for (const entry of mixColorNames) {
        if (typeof entry === 'string' && entry.trim()) wanted.push(entry.trim())
      }
    }
  } else if (name) {
    wanted.push(name)
  }

  const dots: BundleColorDot[] = []
  for (const label of wanted) {
    const hex = byKey.get(colorLabelMatchKey(label))
    if (!hex) continue
    dots.push({ label, hex })
  }
  return dots
}

export function formatBundleQuantityLabel(
  quantity?: number | null,
  quantityAsOptional?: boolean | null,
): string {
  if (quantityAsOptional) return 'انتخابی'
  if (quantity != null) return new Intl.NumberFormat('fa-IR').format(quantity)
  return '—'
}

export function formatBundlePriceLabel(
  unitPriceToman?: number | null,
  priceAsCall?: boolean | null,
): string {
  if (priceAsCall) return 'Call'
  if (unitPriceToman != null) return formatPrice(unitPriceToman, 'تومان')
  return '—'
}

export function firstBrandLogoUrl(bundle: BundleListSource): string | null {
  const logos = bundle.brandLogos || []
  for (const logo of logos) {
    const media = asMedia(logo)
    const url = resolveMediaUrl(media)
    if (url) return url
  }
  return null
}

/** Jalali date + time via Intl Persian calendar (no extra dependency). */
export function formatJalaliDateTime(value?: string | Date | null): string | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function toBundleTableRows(bundle: BundleListSource): BundleTableRowDto[] {
  return (bundle.lines || []).map((line, index) => {
    const product = asProduct(line.product)
    const quantityValue =
      line.quantityAsOptional || typeof line.quantity !== 'number' ? null : line.quantity
    const unitPrice =
      line.priceAsCall || typeof line.unitPriceToman !== 'number' ? null : line.unitPriceToman
    const lineTotalValue =
      quantityValue != null && unitPrice != null ? quantityValue * unitPrice : null

    return {
      key: line.lineId || line.id || `${bundle.id}-${index}`,
      name: productDisplayName(product, line.productId),
      colorLabel: formatBundleColorLabel(line.colorName, line.mixColorNames),
      colorDots: resolveBundleColorDots(product, line.colorName, line.mixColorNames),
      quantityLabel: formatBundleQuantityLabel(line.quantity, line.quantityAsOptional),
      priceLabel: formatBundlePriceLabel(line.unitPriceToman, line.priceAsCall),
      imageUrl: resolveProductImageUrl(product),
      quantityValue,
      lineTotalValue,
    }
  })
}

export function toBundleTableTotals(rows: BundleTableRowDto[]): BundleTableTotalsDto {
  let quantitySum = 0
  let hasQuantity = false
  let priceSum = 0
  let hasPrice = false

  for (const row of rows) {
    if (row.quantityValue != null) {
      quantitySum += row.quantityValue
      hasQuantity = true
    }
    if (row.lineTotalValue != null) {
      priceSum += row.lineTotalValue
      hasPrice = true
    }
  }

  return {
    quantityLabel: hasQuantity ? new Intl.NumberFormat('fa-IR').format(quantitySum) : '—',
    priceLabel: hasPrice ? formatPrice(priceSum, 'تومان') : '—',
  }
}

export function toBundleListItem(bundle: BundleListSource): BundleListItemDto {
  const publishedAt = bundle.publishedAt?.trim() || null
  const rows = toBundleTableRows(bundle)
  return {
    id: String(bundle.id),
    name: bundle.name,
    slug: bundle.slug,
    notes: bundle.notes?.trim() || null,
    logoUrl: firstBrandLogoUrl(bundle),
    publishedAt,
    jalaliPublishedAt: formatJalaliDateTime(publishedAt),
    rows,
    totals: toBundleTableTotals(rows),
  }
}
