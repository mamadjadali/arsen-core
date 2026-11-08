/** Desktop: 6 cols × 2 rows. Mobile: 4 cols × 2 rows. */
export const BUNDLE_PREVIEW_SLOTS_DESKTOP = 12
export const BUNDLE_PREVIEW_SLOTS_MOBILE = 8

export type BundlePreviewLimits = {
  total: number
  moreCountMobile: number
  moreCountDesktop: number
  mobileThumbLimit: number
  desktopThumbLimit: number
  thumbSliceCount: number
}

export function getBundlePreviewLimits(
  total: number,
  mobileSlots = BUNDLE_PREVIEW_SLOTS_MOBILE,
  desktopSlots = BUNDLE_PREVIEW_SLOTS_DESKTOP,
): BundlePreviewLimits {
  const moreCountMobile = total > mobileSlots ? total - (mobileSlots - 1) : 0
  const moreCountDesktop = total > desktopSlots ? total - (desktopSlots - 1) : 0
  const mobileThumbLimit = moreCountMobile > 0 ? mobileSlots - 1 : mobileSlots
  const desktopThumbLimit = moreCountDesktop > 0 ? desktopSlots - 1 : desktopSlots

  return {
    total,
    moreCountMobile,
    moreCountDesktop,
    mobileThumbLimit,
    desktopThumbLimit,
    thumbSliceCount: Math.max(mobileThumbLimit, desktopThumbLimit),
  }
}

/** Compact quantity for the thumb notification badge. */
export function formatBundleThumbBadge(quantityLabel: string | null | undefined): string | null {
  if (!quantityLabel || quantityLabel === '—') return null
  if (quantityLabel === 'انتخابی') return '∗'
  return quantityLabel
}
