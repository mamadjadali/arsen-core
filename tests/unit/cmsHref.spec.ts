import { describe, expect, it } from 'vitest'

import { sanitizeCmsHref } from '@/utilities/cmsHref'

describe('sanitizeCmsHref', () => {
  it('allows app-relative paths', () => {
    expect(sanitizeCmsHref('/bundles')).toBe('/bundles')
    expect(sanitizeCmsHref('/products?q=1')).toBe('/products?q=1')
  })

  it('allows http(s) absolute URLs', () => {
    expect(sanitizeCmsHref('https://example.com/a')).toBe('https://example.com/a')
    expect(sanitizeCmsHref('http://example.com')).toBe('http://example.com')
  })

  it('rejects dangerous or empty values', () => {
    expect(sanitizeCmsHref(null)).toBeNull()
    expect(sanitizeCmsHref('')).toBeNull()
    expect(sanitizeCmsHref('   ')).toBeNull()
    expect(sanitizeCmsHref('javascript:alert(1)')).toBeNull()
    expect(sanitizeCmsHref('JAVASCRIPT:alert(1)')).toBeNull()
    expect(sanitizeCmsHref('data:text/html,hi')).toBeNull()
    expect(sanitizeCmsHref('vbscript:msg')).toBeNull()
    expect(sanitizeCmsHref('//evil.com')).toBeNull()
    expect(sanitizeCmsHref('ftp://files.example')).toBeNull()
    expect(sanitizeCmsHref('not a url')).toBeNull()
  })
})
