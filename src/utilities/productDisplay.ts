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
