import { lexicalToPlainText } from './lexicalText'
import { AI_MAX_INPUT_CHARS } from './types'

const SKIP_KEYS = new Set([
  'id',
  'blockType',
  'relationTo',
  'url',
  'filename',
  'mimeType',
  'filesize',
  'width',
  'height',
  'sizes',
  'updatedAt',
  'createdAt',
  'thumbnailURL',
  'focalX',
  'focalY',
  'prefix',
  'slug',
  '_status',
])

const USEFUL_KEYS = new Set([
  'title',
  'heading',
  'description',
  'richText',
  'content',
  'caption',
  'label',
  'tagline',
  'text',
  'subtitle',
  'summary',
  'intro',
  'body',
  'quote',
  'name',
  'value',
])

function isLexicalDoc(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: unknown }).root
  if (!root || typeof root !== 'object') return false
  return Array.isArray((root as { children?: unknown }).children)
}

function walk(value: unknown, key: string | null, parts: string[]): void {
  if (value == null) return

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return
    if (key && USEFUL_KEYS.has(key)) {
      parts.push(trimmed)
      return
    }
    if (trimmed.length >= 24) {
      parts.push(trimmed)
    }
    return
  }

  if (typeof value !== 'object') return

  if (isLexicalDoc(value)) {
    const text = lexicalToPlainText(value)
    if (text) parts.push(text)
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) walk(item, key, parts)
    return
  }

  for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
    if (SKIP_KEYS.has(childKey)) continue
    walk(childValue, childKey, parts)
  }
}

/** Recursively extract readable plain text from arbitrary CMS form values. */
export function extractAnyPlainText(value: unknown): string {
  const parts: string[] = []
  walk(value, null, parts)
  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim()
}

type FormFieldLike = { value?: unknown } | undefined

type FormFieldsLike = Record<string, FormFieldLike>

/**
 * Body text for SEO AI:
 * - Posts: Lexical `content`
 * - Pages: flattened `hero` + `layout` blocks
 */
export function getSeoSourceText(fields: FormFieldsLike): string {
  const content = fields.content?.value
  if (content) {
    const fromContent = lexicalToPlainText(content)
    if (fromContent) return fromContent.slice(0, AI_MAX_INPUT_CHARS)
  }

  const parts: string[] = []
  const heroText = extractAnyPlainText(fields.hero?.value)
  const layoutText = extractAnyPlainText(fields.layout?.value)
  if (heroText) parts.push(heroText)
  if (layoutText) parts.push(layoutText)

  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, AI_MAX_INPUT_CHARS)
}
