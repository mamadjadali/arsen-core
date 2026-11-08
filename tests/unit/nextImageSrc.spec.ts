import { describe, expect, it } from 'vitest'

import { shouldUnoptimizeImageSrc } from '@/utilities/nextImageSrc'

describe('shouldUnoptimizeImageSrc', () => {
  it('unoptimizes absolute http(s) partner URLs', () => {
    expect(shouldUnoptimizeImageSrc('https://mobile140.com/storage/a.jpg')).toBe(true)
    expect(shouldUnoptimizeImageSrc('http://cdn.example.com/x.png')).toBe(true)
  })

  it('allows optimizer for relative same-origin paths', () => {
    expect(shouldUnoptimizeImageSrc('/api/media/file/logo.png')).toBe(false)
    expect(shouldUnoptimizeImageSrc('/media/x.webp')).toBe(false)
  })
})
