/**
 * Lightweight sanitizers for Custom Code block HTML/CSS.
 * Scripts belong in Globals → Scripts — not this block.
 */

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
