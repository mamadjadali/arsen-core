import { describe, expect, it } from 'vitest'

import { hasHtmlContent, sanitizeCustomCss, sanitizeCustomHtml } from '@/utilities/customCode'

describe('customCode helpers', () => {
  it('strips script tags and event handlers from HTML', () => {
    expect(sanitizeCustomHtml('<div>ok</div><script>alert(1)</script>')).toBe('<div>ok</div>')
    expect(sanitizeCustomHtml('<button onclick="alert(1)">Go</button>')).toBe('<button>Go</button>')
    expect(sanitizeCustomHtml('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>')
  })

  it('strips dangerous CSS constructs', () => {
    const css = `
@import url('https://evil.test/x.css');
#cta .btn { color: red; }
body { behavior: url(evil.htc); }
div { background: url(javascript:alert(1)); }
span { width: expression(alert(1)); }
`
    const sanitized = sanitizeCustomCss(css)
    expect(sanitized).not.toMatch(/@import/i)
    expect(sanitized).not.toMatch(/behavior\s*:/i)
    expect(sanitized).not.toMatch(/javascript:/i)
    expect(sanitized).not.toMatch(/expression\s*\(/i)
    expect(sanitized).toContain('#cta .btn { color: red; }')
  })

  it('detects empty HTML as no content', () => {
    expect(hasHtmlContent('')).toBe(false)
    expect(hasHtmlContent('   \n\t  ')).toBe(false)
    expect(hasHtmlContent('<!-- comment only -->')).toBe(false)
    expect(hasHtmlContent('<script>alert(1)</script>')).toBe(false)
    expect(hasHtmlContent('<p>Hello</p>')).toBe(true)
  })

  it('allows normal page-wide selectors', () => {
    expect(sanitizeCustomCss('#cta .btn { color: red; }')).toBe('#cta .btn { color: red; }')
  })
})
