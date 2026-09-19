import { describe, expect, it } from 'vitest'

import { bodyFromInk, resolveThemeTokens, toCssVars } from '@/themes'

describe('resolveThemeTokens', () => {
  it('uses solace defaults when doc is empty', () => {
    const tokens = resolveThemeTokens(null)

    expect(tokens.preset).toBe('solace')
    expect(tokens.primary).toBe('#F97C00')
    expect(tokens.ink).toBe('#000000')
    expect(tokens.canvas).toBe('#FFFFFF')
    expect(tokens.canvasSoft).toBe('#FFFFFF')
    expect(tokens.body).toBe('rgba(0,0,0,0.7)')
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
    expect(tokens.body).toBe(bodyFromInk('#111111'))
  })

  it('auto-flips ink and scheme for dark canvas when ink is empty', () => {
    const tokens = resolveThemeTokens({
      preset: 'solace',
      canvas: '#121212',
    })

    expect(tokens.ink).toBe('#FFFFFF')
    expect(tokens.body).toBe(bodyFromInk('#FFFFFF'))
    expect(tokens.colorScheme).toBe('dark')
    expect(tokens.canvasSoft).toBe('#242424')
  })

  it('keeps explicit light ink on dark canvas and derives body from it', () => {
    const tokens = resolveThemeTokens({
      preset: 'solace',
      canvas: '#0A0A0A',
      black: '#FFEEDD',
    })

    expect(tokens.ink).toBe('#FFEEDD')
    expect(tokens.body).toBe(bodyFromInk('#FFEEDD'))
    expect(tokens.colorScheme).toBe('dark')
  })

  it('flips dark CMS ink to white when canvas is dark for contrast', () => {
    const tokens = resolveThemeTokens({
      preset: 'solace',
      canvas: '#121212',
      black: '#111111',
    })

    expect(tokens.ink).toBe('#FFFFFF')
    expect(tokens.body).toBe(bodyFromInk('#FFFFFF'))
  })

  it('keeps explicit light scheme on dark canvas but still auto-flips ink', () => {
    const tokens = resolveThemeTokens({
      preset: 'solace',
      canvas: '#111111',
      colorScheme: 'light',
    })

    expect(tokens.colorScheme).toBe('light')
    expect(tokens.ink).toBe('#FFFFFF')
    expect(tokens.body).toBe(bodyFromInk('#FFFFFF'))
  })

  it('derives body from CMS ink on a light canvas', () => {
    const tokens = resolveThemeTokens({
      preset: 'solace',
      black: '#223344',
    })

    expect(tokens.ink).toBe('#223344')
    expect(tokens.body).toBe(bodyFromInk('#223344'))
    expect(tokens.colorScheme).toBe('light')
    expect(tokens.canvasSoft).toBe('#FFFFFF')
  })

  it('falls back to preset primary when CMS orange matches canvas', () => {
    const tokens = resolveThemeTokens({
      preset: 'solace',
      canvas: '#19120e',
      orange: '#19120e',
      black: '#f6e9d3',
    })

    expect(tokens.primary).toBe('#F97C00')
    expect(tokens.canvas).toBe('#19120e')
    expect(tokens.ink).toBe('#f6e9d3')
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
    expect(vars['--theme-accent']).toBe('#FF4F00')
    expect(vars['--color-on-primary']).toBe('#FFFEFB')
    expect(vars['--color-canvas']).toBe('#FFFEFB')
    expect(vars['--color-canvas-soft']).toBe('#F8F4F0')
    expect(vars['--color-ink']).toBe('#201515')
    expect(vars['--color-body']).toBe('#605D52')
    expect(vars['--radius-md']).toBe('12px')
    expect(vars['--radius']).toBe('12px')
  })

  it('emits derived body when ink is overridden', () => {
    const vars = toCssVars(resolveThemeTokens({ black: '#ABCDEF' }))

    expect(vars['--color-ink']).toBe('#ABCDEF')
    expect(vars['--color-body']).toBe(bodyFromInk('#ABCDEF'))
  })
})
