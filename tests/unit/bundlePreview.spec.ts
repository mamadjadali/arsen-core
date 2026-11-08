import { describe, expect, it } from 'vitest'

import {
  BUNDLE_PREVIEW_SLOTS_DESKTOP,
  BUNDLE_PREVIEW_SLOTS_MOBILE,
  formatBundleThumbBadge,
  getBundlePreviewLimits,
} from '@/utilities/bundlePreview'

describe('getBundlePreviewLimits', () => {
  it('fits within slots without a +more chip', () => {
    expect(getBundlePreviewLimits(7)).toMatchObject({
      moreCountMobile: 0,
      moreCountDesktop: 0,
      mobileThumbLimit: BUNDLE_PREVIEW_SLOTS_MOBILE,
      desktopThumbLimit: BUNDLE_PREVIEW_SLOTS_DESKTOP,
      thumbSliceCount: BUNDLE_PREVIEW_SLOTS_DESKTOP,
    })
  })

  it('reserves one mobile slot for +more when overflowing', () => {
    const limits = getBundlePreviewLimits(10)
    expect(limits.moreCountMobile).toBe(10 - (BUNDLE_PREVIEW_SLOTS_MOBILE - 1))
    expect(limits.mobileThumbLimit).toBe(BUNDLE_PREVIEW_SLOTS_MOBILE - 1)
    expect(limits.moreCountDesktop).toBe(0)
    expect(limits.desktopThumbLimit).toBe(BUNDLE_PREVIEW_SLOTS_DESKTOP)
  })

  it('reserves one desktop slot for +more when overflowing', () => {
    const limits = getBundlePreviewLimits(20)
    expect(limits.moreCountDesktop).toBe(20 - (BUNDLE_PREVIEW_SLOTS_DESKTOP - 1))
    expect(limits.desktopThumbLimit).toBe(BUNDLE_PREVIEW_SLOTS_DESKTOP - 1)
    expect(limits.thumbSliceCount).toBe(BUNDLE_PREVIEW_SLOTS_DESKTOP - 1)
  })
})

describe('formatBundleThumbBadge', () => {
  it('returns quantity labels and maps optional to ∗', () => {
    expect(formatBundleThumbBadge('۱۲')).toBe('۱۲')
    expect(formatBundleThumbBadge('انتخابی')).toBe('∗')
    expect(formatBundleThumbBadge('—')).toBeNull()
    expect(formatBundleThumbBadge(null)).toBeNull()
  })
})
