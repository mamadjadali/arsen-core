import { describe, expect, it } from 'vitest'

import { parseColorSwatches } from '@/endpoints/v1/products'

describe('parseColorSwatches', () => {
  it('accepts valid swatches', () => {
    const parsed = parseColorSwatches([
      { label: 'مشکی', hex: '#111111' },
      { hex: '#FFFFFF' },
    ])
    expect(parsed).toEqual([
      { label: 'مشکی', hex: '#111111' },
      { label: null, hex: '#FFFFFF' },
    ])
  })

  it('allows explicit empty array to clear', () => {
    expect(parseColorSwatches([])).toEqual([])
  })

  it('rejects null / non-object entries with an error response', async () => {
    const parsed = parseColorSwatches([null])
    expect(parsed && 'error' in parsed).toBe(true)
    if (parsed && 'error' in parsed) {
      expect(parsed.error.status).toBe(400)
    }
  })

  it('rejects bad hex', async () => {
    const parsed = parseColorSwatches([{ label: 'x', hex: 'red' }])
    expect(parsed && 'error' in parsed).toBe(true)
    if (parsed && 'error' in parsed) {
      expect(parsed.error.status).toBe(400)
    }
  })
})
