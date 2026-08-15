import { describe, expect, it } from 'vitest'

import {
  expandScriptSnippet,
  getEnabledScripts,
  isSafeScriptSrc,
  sanitizeInlineScript,
} from '@/utilities/customScripts'

describe('customScripts helpers', () => {
  it('strips script tags so snippets are not double-wrapped', () => {
    expect(expandScriptSnippet('<script>alert(1)</script>')).toEqual([
      { kind: 'inline', code: 'alert(1)' },
    ])
    expect(
      expandScriptSnippet(
        `<script async src="https://www.googletagmanager.com/gtag/js?id=G-TEST"></script>
<script>
  window.dataLayer = window.dataLayer || [];
</script>`,
      ),
    ).toEqual([
      { kind: 'external', src: 'https://www.googletagmanager.com/gtag/js?id=G-TEST' },
      { kind: 'inline', code: 'window.dataLayer = window.dataLayer || [];' },
    ])
    expect(sanitizeInlineScript('<script>x</script>')).toBe('x')
  })

  it('escapes leftover closing tags inside raw JS', () => {
    expect(sanitizeInlineScript('var s = "</script>"')).toBe('var s = "<\\/script>"')
  })

  it('rejects javascript: and data: script sources', () => {
    expect(isSafeScriptSrc('javascript:alert(1)')).toBe(false)
    expect(isSafeScriptSrc('data:text/javascript,alert(1)')).toBe(false)
    expect(isSafeScriptSrc('')).toBe(false)
  })

  it('accepts https, http, protocol-relative, and absolute-path sources', () => {
    expect(isSafeScriptSrc('https://www.googletagmanager.com/gtag/js?id=G-TEST')).toBe(true)
    expect(isSafeScriptSrc('http://example.com/a.js')).toBe(true)
    expect(isSafeScriptSrc('//cdn.example.com/a.js')).toBe(true)
    expect(isSafeScriptSrc('/scripts/local.js')).toBe(true)
  })

  it('filters disabled scripts and expands pasted snippets', () => {
    const normalized = getEnabledScripts({
      items: [
        {
          id: '1',
          name: 'Disabled',
          enabled: false,
          kind: 'external',
          src: 'https://example.com/a.js',
          placement: 'body',
          strategy: 'afterInteractive',
        },
        {
          id: '2',
          name: 'Bad src',
          enabled: true,
          kind: 'external',
          src: 'javascript:alert(1)',
          placement: 'head',
          strategy: 'afterInteractive',
        },
        {
          id: '3',
          name: 'Empty inline',
          enabled: true,
          kind: 'inline',
          code: '   ',
          placement: 'body',
        },
        {
          id: '4',
          name: 'GTM',
          enabled: true,
          kind: 'external',
          src: 'https://www.googletagmanager.com/gtag/js?id=G-TEST',
          placement: 'head',
          strategy: 'afterInteractive',
        },
        {
          id: '5',
          name: 'GA paste',
          enabled: true,
          kind: 'inline',
          code: `<script src="https://www.googletagmanager.com/gtag/js?id=G-ABC"></script>
<script>
  window.__cms = 1;
</script>`,
          placement: 'body',
        },
      ],
    })

    expect(normalized).toHaveLength(3)
    expect(normalized[0]).toMatchObject({
      kind: 'external',
      src: 'https://www.googletagmanager.com/gtag/js?id=G-TEST',
      placement: 'head',
    })
    expect(normalized[1]).toMatchObject({
      kind: 'external',
      src: 'https://www.googletagmanager.com/gtag/js?id=G-ABC',
      placement: 'body',
    })
    expect(normalized[2]).toMatchObject({
      kind: 'inline',
      placement: 'body',
      code: 'window.__cms = 1;',
    })
  })
})
