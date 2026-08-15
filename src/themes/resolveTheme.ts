import { solacePreset } from './presets/solace'
import { zapierPreset } from './presets/zapier'

export type ColorScheme = 'light' | 'dark'

export type DesignPreset = {
  id: string
  colorScheme: ColorScheme
  primary: string
  onPrimary: string
  canvas: string
  canvasSoft: string
  ink: string
  body: string
  radiusMd: number
  fontBody: string
}

export const themePresets = {
  solace: solacePreset,
  zapier: zapierPreset,
} as const satisfies Record<string, DesignPreset>

export type ThemePresetKey = keyof typeof themePresets

export const defaultThemePreset: ThemePresetKey = 'solace'

export const isThemePresetKey = (value: unknown): value is ThemePresetKey =>
  typeof value === 'string' && value in themePresets

export const isColorScheme = (value: unknown): value is ColorScheme =>
  value === 'light' || value === 'dark'

export type ThemeDocLike = {
  preset?: string | null
  colorScheme?: string | null
  /** @deprecated semantic: primary — kept for DB compat */
  orange?: string | null
  /** @deprecated semantic: ink — kept for DB compat */
  black?: string | null
  canvas?: string | null
  radiusMd?: number | null
  font?: string | null
} | null

export type ResolvedThemeTokens = DesignPreset & {
  preset: ThemePresetKey
}

const HEX_RE = /^#([0-9A-Fa-f]{6})$/

const pickHex = (value: string | null | undefined, fallback: string): string => {
  if (typeof value === 'string' && HEX_RE.test(value.trim())) return value.trim()
  return fallback
}

const pickRadius = (value: number | null | undefined, fallback: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return Math.min(24, Math.max(0, Math.round(value)))
}

export const resolveThemeTokens = (doc?: ThemeDocLike): ResolvedThemeTokens => {
  const presetKey = isThemePresetKey(doc?.preset) ? doc.preset : defaultThemePreset
  const preset = themePresets[presetKey]

  return {
    ...preset,
    preset: presetKey,
    colorScheme: isColorScheme(doc?.colorScheme) ? doc.colorScheme : preset.colorScheme,
    primary: pickHex(doc?.orange, preset.primary),
    ink: pickHex(doc?.black, preset.ink),
    canvas: pickHex(doc?.canvas, preset.canvas),
    radiusMd: pickRadius(doc?.radiusMd, preset.radiusMd),
    fontBody: typeof doc?.font === 'string' && doc.font ? doc.font : preset.fontBody,
  }
}

export const toCssVars = (tokens: ResolvedThemeTokens): Record<string, string> => {
  const radius = `${tokens.radiusMd}px`

  return {
    '--brand-orange': tokens.primary,
    '--brand-black': tokens.ink,
    '--color-primary': tokens.primary,
    '--color-on-primary': tokens.onPrimary,
    '--color-canvas': tokens.canvas,
    '--color-canvas-soft': tokens.canvasSoft,
    '--color-ink': tokens.ink,
    '--color-body': tokens.body,
    '--radius-md': radius,
    '--radius': radius,
  }
}
