import { describe, expect, it } from 'vitest'

import type { Product } from '@/payload-types'
import {
  formatBundleColorLabel,
  resolveBundleColorDots,
  toBundleTableRows,
} from '@/utilities/liveBundleDisplay'

function product(overrides: Partial<Product> & Pick<Product, 'id' | 'title'>): Product {
  return {
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  } as Product
}

describe('formatBundleColorLabel', () => {
  it('shows Mix only without parenthetical list', () => {
    expect(
      formatBundleColorLabel('Mix', [
        'سفید - گارانتی یاراون | 6 ماهه',
        'مشکی - گارانتی یاراون | 6 ماهه',
      ]),
    ).toBe('Mix')
  })

  it('returns single color name as-is', () => {
    expect(formatBundleColorLabel('مشکی')).toBe('مشکی')
  })
})

describe('resolveBundleColorDots', () => {
  const swatched = product({
    id: 'p1',
    title: 'Phone',
    colorSwatches: [
      { label: 'سفید - گارانتی یاراون | 6 ماهه', hex: '#FFFFFF' },
      { label: 'مشکی', hex: '#111111' },
      { label: 'آبی روشن', hex: '#88CCFF' },
    ],
  })

  it('resolves Mix selections by warranty-stripped label match', () => {
    expect(
      resolveBundleColorDots(swatched, 'Mix', [
        'سفید - گارانتی یاراون | 6 ماهه',
        'مشکی - گارانتی یاراون | 6 ماهه',
        'آبی روشن - گارانتی یاراون | 6 ماهه',
      ]),
    ).toEqual([
      { label: 'سفید - گارانتی یاراون | 6 ماهه', hex: '#FFFFFF' },
      { label: 'مشکی - گارانتی یاراون | 6 ماهه', hex: '#111111' },
      { label: 'آبی روشن - گارانتی یاراون | 6 ماهه', hex: '#88CCFF' },
    ])
  })

  it('omits colors without a swatch hex', () => {
    expect(resolveBundleColorDots(swatched, 'Mix', ['مشکی', 'ناموجود'])).toEqual([
      { label: 'مشکی', hex: '#111111' },
    ])
  })

  it('resolves a single non-Mix color', () => {
    expect(resolveBundleColorDots(swatched, 'مشکی')).toEqual([{ label: 'مشکی', hex: '#111111' }])
  })
})

describe('toBundleTableRows', () => {
  it('attaches Mix label and colorDots on rows', () => {
    const rows = toBundleTableRows({
      id: 'b1',
      name: 'bundle',
      slug: 'bundle',
      lines: [
        {
          product: product({
            id: 'p1',
            title: 'Cable',
            printName: 'کابل',
            colorSwatches: [
              { label: 'سفید', hex: '#FFFFFF' },
              { label: 'مشکی', hex: '#000000' },
            ],
          }),
          colorName: 'Mix',
          mixColorNames: ['سفید', 'مشکی'],
          quantity: 1,
          unitPriceToman: 1000,
        },
      ],
    })

    expect(rows[0]?.colorLabel).toBe('Mix')
    expect(rows[0]?.colorDots).toEqual([
      { label: 'سفید', hex: '#FFFFFF' },
      { label: 'مشکی', hex: '#000000' },
    ])
  })
})
