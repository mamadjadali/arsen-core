/**
 * Allow only safe CMS-authored links for next/link.
 * - Relative app paths: `/…` (not protocol-relative `//…`)
 * - Absolute http(s) URLs
 * Rejects javascript:, data:, vbscript:, and other schemes.
 */
export function sanitizeCmsHref(href: string | null | undefined): string | null {
  if (typeof href !== 'string') return null
  const trimmed = href.trim()
  if (!trimmed) return null

  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('blob:')
  ) {
    return null
  }

  if (trimmed.startsWith('/')) {
    // Protocol-relative URLs (`//evil.com`) must not pass as "relative".
    if (trimmed.startsWith('//')) return null
    return trimmed
  }

  try {
    const url = new URL(trimmed)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return trimmed
    }
  } catch {
    return null
  }

  return null
}
