/**
 * Solace design preset — square radius, pure white/black, orange primary.
 * Map from design MD: colors.primary → primary, rounded.md → radiusMd (0).
 */
export const solacePreset = {
  id: 'solace',
  colorScheme: 'light',
  primary: '#F97C00',
  onPrimary: '#FFFFFF',
  canvas: '#FFFFFF',
  canvasSoft: '#FFFFFF',
  ink: '#000000',
  body: 'rgba(0,0,0,0.7)',
  radiusMd: 0,
  fontBody: 'yekanBakh',
} as const

export type ThemePresetId = typeof solacePreset.id
