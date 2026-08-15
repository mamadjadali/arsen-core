import type { Script } from '@/payload-types'

export type ScriptStrategy = 'afterInteractive' | 'lazyOnload' | 'beforeInteractive'
export type ScriptPlacement = 'head' | 'body'

export type NormalizedScript =
  | {
      id: string
      name: string
      kind: 'external'
      placement: ScriptPlacement
      strategy: ScriptStrategy
      src: string
    }
  | {
      id: string
      name: string
      kind: 'inline'
      placement: ScriptPlacement
      strategy: ScriptStrategy
      code: string
    }

const SCRIPT_TAG_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const SCRIPT_CLOSE_IN_JS = /<\/script/gi

/** Escape leftover </script so it cannot break out of next/script. */
export const escapeScriptClose = (code: string): string => {
  return code.replace(SCRIPT_CLOSE_IN_JS, '<\\/script')
}

/**
 * Accept pasted GA/GTM HTML or raw JS.
 * Strips <script> wrappers so next/script does not double-wrap.
 * Splits a multi-tag snippet into external (src=) + inline (body) parts.
 */
export const expandScriptSnippet = (
  input: string,
): Array<{ kind: 'external'; src: string } | { kind: 'inline'; code: string }> => {
  const trimmed = input.trim()
  if (!trimmed) return []

  if (!/<script\b/i.test(trimmed)) {
    return [{ kind: 'inline', code: escapeScriptClose(trimmed) }]
  }

  const parts: Array<{ kind: 'external'; src: string } | { kind: 'inline'; code: string }> = []
  let match: RegExpExecArray | null
  const re = new RegExp(SCRIPT_TAG_RE.source, 'gi')

  while ((match = re.exec(trimmed)) !== null) {
    const attrs = match[1] || ''
    const body = (match[2] || '').trim()
    const srcMatch = attrs.match(/\bsrc\s*=\s*(["'])(.*?)\1/i) || attrs.match(/\bsrc\s*=\s*([^\s>]+)/i)
    const src = srcMatch?.[2] || srcMatch?.[1]

    if (src) {
      parts.push({ kind: 'external', src: src.trim() })
    } else if (body) {
      parts.push({ kind: 'inline', code: escapeScriptClose(body) })
    }
  }

  return parts
}

/** @deprecated use expandScriptSnippet — kept for tests naming */
export const sanitizeInlineScript = (code: string): string => {
  const parts = expandScriptSnippet(code)
  const inline = parts.find((p) => p.kind === 'inline')
  return inline && inline.kind === 'inline' ? inline.code : escapeScriptClose(code.replace(/<\/?script\b[^>]*>/gi, ''))
}

export const isSafeScriptSrc = (src: string): boolean => {
  const trimmed = src.trim()
  if (!trimmed) return false

  const lower = trimmed.toLowerCase()
  if (lower.startsWith('javascript:') || lower.startsWith('data:')) return false

  return (
    lower.startsWith('https://') ||
    lower.startsWith('http://') ||
    lower.startsWith('//') ||
    trimmed.startsWith('/')
  )
}

const toStrategy = (value: unknown): ScriptStrategy => {
  if (value === 'lazyOnload' || value === 'beforeInteractive' || value === 'afterInteractive') {
    return value
  }
  return 'afterInteractive'
}

const toPlacement = (value: unknown): ScriptPlacement => {
  return value === 'head' ? 'head' : 'body'
}

type ScriptsGlobalLike = {
  items?: Script['items']
} | null | undefined

export const getEnabledScripts = (data: ScriptsGlobalLike): NormalizedScript[] => {
  const items = data?.items
  if (!items?.length) return []

  const result: NormalizedScript[] = []

  for (const item of items) {
    if (!item || item.enabled === false) continue

    const baseId = item.id || item.name || 'script'
    const name = item.name || 'script'
    const placement = toPlacement(item.placement)

    if (item.kind === 'external') {
      const src = typeof item.src === 'string' ? item.src.trim() : ''
      if (!isSafeScriptSrc(src)) continue

      result.push({
        id: String(baseId),
        name,
        kind: 'external',
        placement,
        strategy: toStrategy(item.strategy),
        src,
      })
      continue
    }

    if (item.kind === 'inline') {
      const raw = typeof item.code === 'string' ? item.code : ''
      const parts = expandScriptSnippet(raw)

      parts.forEach((part, index) => {
        const id = parts.length === 1 ? String(baseId) : `${baseId}-${index}`

        if (part.kind === 'external') {
          if (!isSafeScriptSrc(part.src)) return
          result.push({
            id,
            name,
            kind: 'external',
            placement,
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
          placement,
          strategy: 'afterInteractive',
          code: part.code,
        })
      })
    }
  }

  return result
}
