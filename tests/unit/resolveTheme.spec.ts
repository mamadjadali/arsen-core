import { describe, expect, it } from 'vitest'

import { resolveThemeTokens, toCssVars } from '@/themes'

describe('resolveThemeTokens', () => {
  it('uses solace defaults when doc is empty', () => {
    const tokens = resolveThemeTokens(null)

    expect(tokens.preset).toBe('solace')
    expect(tokens.primary).toBe('#F97C00')
    expect(tokens.ink).toBe('#000000')
    expect(tokens.canvas).toBe('#FFFFFF')
    expect(tokens.canvasSoft).toBe('#FFFFFF')
    expect(tokens.radiusMd).toBe(0)
    expect(tokens.fontBody).toBe('yekanBakh')
    expect(tokens.colorScheme).toBe('light')
  })

  it('applies zapier radius and surfaces from preset', () => {
    const tokens = resolveThemeTokens({ preset: 'zapier' })

    expect(tokens.preset).toBe('zapier')
    expect(tokens.primary).toBe('#FF4F00')
    expect(tokens.ink).toBe('#201515')
    expect(tokens.canvas).toBe('#FFFEFB')
    expect(tokens.canvasSoft).toBe('#F8F4F0')
    expect(tokens.body).toBe('#605D52')
    expect(tokens.radiusMd).toBe(12)
    expect(tokens.colorScheme).toBe('light')
  })

  it('lets CMS primary override win over preset', () => {
    const tokens = resolveThemeTokens({
      preset: 'zapier',
      orange: '#ABCDEF',
    })

    expect(tokens.primary).toBe('#ABCDEF')
    expect(tokens.radiusMd).toBe(12)
    expect(tokens.canvas).toBe('#FFFEFB')
  })

  it('lets CMS colorScheme override win over preset', () => {
    const tokens = resolveThemeTokens({
      preset: 'solace',
      colorScheme: 'dark',
    })

    expect(tokens.colorScheme).toBe('dark')
    expect(tokens.canvas).toBe('#FFFFFF')
  })

  it('ignores invalid CMS colorScheme and keeps preset', () => {
    expect(resolveThemeTokens({ colorScheme: 'neon' }).colorScheme).toBe('light')
  })

  it('lets CMS radius and canvas overrides win', () => {
    const tokens = resolveThemeTokens({
      preset: 'solace',
      canvas: '#F0F0F0',
      radiusMd: 8,
      black: '#111111',
    })

    expect(tokens.canvas).toBe('#F0F0F0')
    expect(tokens.radiusMd).toBe(8)
    expect(tokens.ink).toBe('#111111')
  })

  it('clamps radiusMd to 0–24', () => {
    expect(resolveThemeTokens({ radiusMd: -5 }).radiusMd).toBe(0)
    expect(resolveThemeTokens({ radiusMd: 99 }).radiusMd).toBe(24)
  })

  it('falls back to solace for unknown preset keys', () => {
    expect(resolveThemeTokens({ preset: 'unknown' }).preset).toBe('solace')
  })
})

describe('toCssVars', () => {
  it('always emits the runtime CSS variable contract', () => {
    const vars = toCssVars(resolveThemeTokens({ preset: 'zapier' }))

    expect(vars['--brand-orange']).toBe('#FF4F00')
    expect(vars['--brand-black']).toBe('#201515')
    expect(vars['--color-primary']).toBe('#FF4F00')
    expect(vars['--color-on-primary']).toBe('#FFFEFB')
    expect(vars['--color-canvas']).toBe('#FFFEFB')
    expect(vars['--color-canvas-soft']).toBe('#F8F4F0')
    expect(vars['--color-ink']).toBe('#201515')
    expect(vars['--color-body']).toBe('#605D52')
    expect(vars['--radius-md']).toBe('12px')
    expect(vars['--radius']).toBe('12px')
  })
})
