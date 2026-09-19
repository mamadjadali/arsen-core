/**
 * Lightweight sanitizers for Custom Code block HTML/CSS.
 * Dedicated `js` / `scripts` fields inject via next/script — not the HTML field.
 */

import {
  expandScriptSnippet,
  isSafeScriptSrc,
  type NormalizedScript,
  type ScriptStrategy,
} from '@/utilities/customScripts'

const SCRIPT_BLOCK_RE = /<script\b[^>]*>[\s\S]*?<\/script>/gi
const EVENT_ATTR_RE = /\s+on[a-z]+\s*=\s*(["'])[\s\S]*?\1/gi
const EVENT_ATTR_UNQUOTED_RE = /\s+on[a-z]+\s*=\s*[^\s>]+/gi
const JS_URL_ATTR_RE = /\s(href|src|xlink:href)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi

export const sanitizeCustomHtml = (html: string): string => {
  if (!html) return ''

  return html
    .replace(SCRIPT_BLOCK_RE, '')
    .replace(EVENT_ATTR_RE, '')
    .replace(EVENT_ATTR_UNQUOTED_RE, '')
    .replace(JS_URL_ATTR_RE, '')
}

const CSS_IMPORT_RE = /@import\b[^;]*;?/gi
const CSS_EXPRESSION_RE = /expression\s*\([^)]*\)/gi
const CSS_MOZ_BINDING_RE = /-moz-binding\s*:[^;}]*/gi
const CSS_BEHAVIOR_RE = /behavior\s*:[^;}]*/gi
const CSS_JS_URL_RE = /url\s*\(\s*(['"]?)\s*javascript:[^)]*\)/gi

export const sanitizeCustomCss = (css: string): string => {
  if (!css) return ''

  return css
    .replace(CSS_IMPORT_RE, '')
    .replace(CSS_EXPRESSION_RE, '')
    .replace(CSS_MOZ_BINDING_RE, '')
    .replace(CSS_BEHAVIOR_RE, '')
    .replace(CSS_JS_URL_RE, '')
}

export const hasHtmlContent = (html: string | null | undefined): boolean => {
  if (!html) return false
  const sanitized = sanitizeCustomHtml(html).replace(/<!--[\s\S]*?-->/g, '').trim()
  return sanitized.length > 0
}

export type CustomCodeScriptItem = {
  id?: string | null
  name?: string | null
  enabled?: boolean | null
  kind?: ('inline' | 'external') | null
  src?: string | null
  code?: string | null
  strategy?: ('afterInteractive' | 'lazyOnload' | 'beforeInteractive') | null
}

const toStrategy = (value: unknown): ScriptStrategy => {
  if (value === 'lazyOnload' || value === 'beforeInteractive' || value === 'afterInteractive') {
    return value
  }
  return 'afterInteractive'
}

/**
 * Normalize Custom Code `js` textarea + `scripts` array into next/script payloads.
 * Block scripts always inject at render site (no head/body placement).
 */
export const getCustomCodeScripts = (args: {
  blockId?: string | null
  js?: string | null
  scripts?: CustomCodeScriptItem[] | null
}): NormalizedScript[] => {
  const prefix = args.blockId?.trim() || 'custom-code'
  const result: NormalizedScript[] = []

  const jsRaw = typeof args.js === 'string' ? args.js.trim() : ''
  if (jsRaw) {
    const parts = expandScriptSnippet(jsRaw)
    parts.forEach((part, index) => {
      const id = parts.length === 1 ? `${prefix}-js` : `${prefix}-js-${index}`

      if (part.kind === 'external') {
        if (!isSafeScriptSrc(part.src)) return
        result.push({
          id,
          name: 'js',
          kind: 'external',
          placement: 'body',
          strategy: 'afterInteractive',
          src: part.src,
        })
        return
      }

      if (!part.code.trim()) return
      result.push({
        id,
        name: 'js',
        kind: 'inline',
        placement: 'body',
        strategy: 'afterInteractive',
        code: part.code,
      })
    })
  }

  const items = args.scripts
  if (!items?.length) return result

  for (const item of items) {
    if (!item || item.enabled === false) continue

    const baseId = item.id || item.name || 'script'
    const name = item.name || 'script'

    if (item.kind === 'external') {
      const src = typeof item.src === 'string' ? item.src.trim() : ''
      if (!isSafeScriptSrc(src)) continue

      result.push({
        id: `${prefix}-${baseId}`,
        name,
        kind: 'external',
        placement: 'body',
        strategy: toStrategy(item.strategy),
        src,
      })
      continue
    }

    if (item.kind === 'inline' || !item.kind) {
      const raw = typeof item.code === 'string' ? item.code : ''
      const parts = expandScriptSnippet(raw)

      parts.forEach((part, index) => {
        const id =
          parts.length === 1 ? `${prefix}-${baseId}` : `${prefix}-${baseId}-${index}`

        if (part.kind === 'external') {
          if (!isSafeScriptSrc(part.src)) return
          result.push({
            id,
            name,
            kind: 'external',
            placement: 'body',
            strategy: toStrategy(item.strategy),
            src: part.src,
          })
          return
        }

        if (!part.code.trim()) return
        result.push({
          id,
          name,
          kind: 'inline',
          placement: 'body',
          strategy: 'afterInteractive',
          code: part.code,
        })
      })
    }
  }

  return result
}
