import { describe, expect, it } from 'vitest'

import {
  getCustomCodeScripts,
  hasHtmlContent,
  sanitizeCustomCss,
  sanitizeCustomHtml,
} from '@/utilities/customCode'

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

describe('getCustomCodeScripts', () => {
  it('returns empty when js and scripts are empty', () => {
    expect(getCustomCodeScripts({})).toEqual([])
    expect(getCustomCodeScripts({ js: '  ', scripts: [] })).toEqual([])
  })

  it('expands the js textarea into an inline script', () => {
    const scripts = getCustomCodeScripts({
      blockId: 'abc',
      js: 'console.log("hi")',
    })

    expect(scripts).toHaveLength(1)
    expect(scripts[0]).toMatchObject({
      id: 'abc-js',
      kind: 'inline',
      code: 'console.log("hi")',
      strategy: 'afterInteractive',
      placement: 'body',
    })
  })

  it('strips script wrappers from the js textarea', () => {
    const scripts = getCustomCodeScripts({
      blockId: 'b1',
      js: '<script>window.ready=true</script>',
    })

    expect(scripts).toHaveLength(1)
    expect(scripts[0]).toMatchObject({
      kind: 'inline',
      code: 'window.ready=true',
    })
  })

  it('turns src= script tags in js into external loads', () => {
    const scripts = getCustomCodeScripts({
      blockId: 'b2',
      js: '<script src="https://cdn.example.com/w.js"></script>',
    })

    expect(scripts).toEqual([
      expect.objectContaining({
        kind: 'external',
        src: 'https://cdn.example.com/w.js',
        strategy: 'afterInteractive',
      }),
    ])
  })

  it('skips disabled scripts and unsafe external urls', () => {
    const scripts = getCustomCodeScripts({
      blockId: 'b3',
      scripts: [
        {
          id: 'off',
          name: 'Off',
          enabled: false,
          kind: 'inline',
          code: 'alert(1)',
        },
        {
          id: 'bad',
          name: 'Bad',
          enabled: true,
          kind: 'external',
          src: 'javascript:alert(1)',
        },
        {
          id: 'ok',
          name: 'Ok',
          enabled: true,
          kind: 'external',
          src: 'https://cdn.example.com/ok.js',
          strategy: 'lazyOnload',
        },
      ],
    })

    expect(scripts).toHaveLength(1)
    expect(scripts[0]).toMatchObject({
      id: 'b3-ok',
      kind: 'external',
      src: 'https://cdn.example.com/ok.js',
      strategy: 'lazyOnload',
    })
  })

  it('normalizes inline scripts array items', () => {
    const scripts = getCustomCodeScripts({
      blockId: 'b4',
      scripts: [
        {
          name: 'Widget',
          enabled: true,
          kind: 'inline',
          code: 'init()',
        },
      ],
    })

    expect(scripts).toEqual([
      expect.objectContaining({
        id: 'b4-Widget',
        name: 'Widget',
        kind: 'inline',
        code: 'init()',
        strategy: 'afterInteractive',
      }),
    ])
  })
})
