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

const hasCmsHex = (value: string | null | undefined): boolean =>
  typeof value === 'string' && HEX_RE.test(value.trim())

/** Relative luminance per WCAG (sRGB). */
export const hexLuminance = (hex: string): number => {
  const match = HEX_RE.exec(hex.trim())
  if (!match) return 1

  const int = parseInt(match[1], 16)
  const channels = [int >> 16, (int >> 8) & 0xff, int & 0xff].map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
}

export const isDarkHex = (hex: string, threshold = 0.45): boolean => hexLuminance(hex) < threshold

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const match = HEX_RE.exec(hex.trim())
  if (!match) return null
  const int = parseInt(match[1], 16)
  return { r: int >> 16, g: (int >> 8) & 0xff, b: int & 0xff }
}

/** Muted text color derived from ink (~72% opacity). */
export const bodyFromInk = (ink: string): string => {
  const rgb = hexToRgb(ink)
  if (!rgb) return ink
  return `rgba(${rgb.r},${rgb.g},${rgb.b},0.72)`
}

/** Slightly lift a dark canvas for soft surfaces. */
const liftHex = (hex: string, amount = 18): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const lift = (c: number) => Math.min(255, c + amount)
  const toHex = (c: number) => lift(c).toString(16).padStart(2, '0')
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase()
}

export const resolveThemeTokens = (doc?: ThemeDocLike): ResolvedThemeTokens => {
  const presetKey = isThemePresetKey(doc?.preset) ? doc.preset : defaultThemePreset
  const preset = themePresets[presetKey]

  const inkFromCms = hasCmsHex(doc?.black)
  const schemeFromCms = isColorScheme(doc?.colorScheme)
  const canvas = pickHex(doc?.canvas, preset.canvas)

  let ink = pickHex(doc?.black, preset.ink)
  let colorScheme: ColorScheme = schemeFromCms ? (doc!.colorScheme as ColorScheme) : preset.colorScheme
  let body: string = preset.body
  let canvasSoft: string = preset.canvasSoft

  const darkCanvas = isDarkHex(canvas)
  let inkDerived = inkFromCms

  // Dark surfaces need light ink. Prefer CMS ink when it already contrasts;
  // otherwise flip to white so text stays readable on dark canvas.
  if (darkCanvas && isDarkHex(ink)) {
    ink = '#FFFFFF'
    inkDerived = true
  }

  if (darkCanvas && !schemeFromCms) {
    colorScheme = 'dark'
  }

  if (inkDerived || inkFromCms) {
    body = bodyFromInk(ink)
  }

  if (darkCanvas) {
    canvasSoft = liftHex(canvas)
  }

  // Primary must stay a visible accent. If CMS orange matches/near canvas (common
  // copy-paste), fall back to the preset primary so accents stay readable.
  let primary = pickHex(doc?.orange, preset.primary)
  if (Math.abs(hexLuminance(primary) - hexLuminance(canvas)) < 0.12) {
    primary = preset.primary
  }

  const tokens: ResolvedThemeTokens = {
    ...preset,
    preset: presetKey,
    colorScheme,
    primary,
    ink,
    canvas,
    canvasSoft,
    body,
    radiusMd: pickRadius(doc?.radiusMd, preset.radiusMd),
    fontBody: typeof doc?.font === 'string' && doc.font ? doc.font : preset.fontBody,
  }

  return tokens
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
    '--theme-accent': tokens.primary,
    '--radius-md': radius,
    '--radius': radius,
  }
}
