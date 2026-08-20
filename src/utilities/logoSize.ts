import type { CSSProperties } from 'react'

const MIN = 16
const MAX = 160
const DEFAULT_MOBILE = 40
const DEFAULT_DESKTOP = 56

function clampLogoHeight(value: number | null | undefined, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return Math.min(MAX, Math.max(MIN, Math.round(value)))
}

export function logoSizeStyle(
  mobile?: number | null,
  desktop?: number | null,
): CSSProperties {
  const m = clampLogoHeight(mobile, DEFAULT_MOBILE)
  const d = clampLogoHeight(desktop, DEFAULT_DESKTOP)
  return {
    '--logo-h-m': `${m}px`,
    '--logo-h-d': `${d}px`,
  } as CSSProperties
}

export function logoIntrinsicSize(desktop?: number | null): { width: number; height: number } {
  const h = clampLogoHeight(desktop, DEFAULT_DESKTOP)
  return { width: h, height: h }
}

export const logoSizeClassName = 'h-[var(--logo-h-m)] w-auto object-contain md:h-[var(--logo-h-d)]'
