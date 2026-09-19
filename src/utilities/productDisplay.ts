import type { AvailabilityValue } from '@/fields/availability'
import type { Product, Variant } from '@/payload-types'

const availabilityLabels: Record<AvailabilityValue, { en: string; fa: string }> = {
  available: { en: 'Available', fa: 'موجود' },
  unavailable: { en: 'Unavailable', fa: 'ناموجود' },
  limited: { en: 'Limited', fa: 'محدود' },
  coming_soon: { en: 'Coming soon', fa: 'به‌زودی' },
}

export function getAvailabilityLabel(
  value?: AvailabilityValue | null,
  locale: 'fa' | 'en' = 'fa',
): string | null {
  if (!value) return null
  return availabilityLabels[value]?.[locale] ?? null
}

export function resolveDisplayPrice(
  product: Pick<Product, 'price' | 'compareAtPrice' | 'currencyLabel'>,
  variant?: Pick<Variant, 'price' | 'compareAtPrice'> | null,
): {
  price: number | null
  compareAtPrice: number | null
  currencyLabel: string | null
} {
  const price =
    typeof variant?.price === 'number'
      ? variant.price
      : typeof product.price === 'number'
        ? product.price
        : null

  const compareAtPrice =
    typeof variant?.compareAtPrice === 'number'
      ? variant.compareAtPrice
      : typeof product.compareAtPrice === 'number'
        ? product.compareAtPrice
        : null

  return {
    price,
    compareAtPrice,
    currencyLabel: product.currencyLabel?.trim() || null,
  }
}

export function isEffectivelyAvailable(
  productAvailability?: AvailabilityValue | null,
  variantAvailability?: AvailabilityValue | null,
): boolean {
  if (productAvailability === 'unavailable') return false
  if (variantAvailability === 'unavailable') return false
  return true
}

export function formatPrice(amount: number, currencyLabel?: string | null): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(amount)
  return currencyLabel ? `${formatted} ${currencyLabel}` : formatted
}

const HEX_RE = /^#([0-9A-Fa-f]{6})$/

export type ColorSwatch = { label: string | null; hex: string }

/** Prefer product swatches; else unique color option hexes from variants. */
export function resolveColorSwatches(
  product?: {
    colorSwatches?: ({ label?: string | null; hex?: string | null } | null)[] | null
  } | null,
  variants?:
    | {
        options?:
          | ({ name?: string | null; value?: string | null; hex?: string | null } | null)[]
          | null
      }[]
    | null,
): ColorSwatch[] {
  const fromProduct: ColorSwatch[] = []
  for (const row of product?.colorSwatches || []) {
    const hex = row?.hex?.trim()
    if (!hex || !HEX_RE.test(hex)) continue
    fromProduct.push({ label: row?.label?.trim() || null, hex })
  }

  if (fromProduct.length) return fromProduct

  const seen = new Set<string>()
  const fromVariants: ColorSwatch[] = []

  for (const variant of variants || []) {
    for (const option of variant.options || []) {
      if (!option) continue
      const name = option.name || ''
      if (!/رنگ|color|colour/i.test(name)) continue
      const hex = option.hex?.trim()
      if (!hex || !HEX_RE.test(hex) || seen.has(hex.toLowerCase())) continue
      seen.add(hex.toLowerCase())
      fromVariants.push({ label: option.value || null, hex })
    }
  }

  return fromVariants
}
