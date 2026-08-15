export type AiTarget = 'content' | 'seoTitle' | 'seoDescription'

export type AiChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type AiTransformRequest = {
  presetId: string
  target: AiTarget
  text: string
  title?: string
}

export type AiTransformResponse = {
  text: string
  lexical?: Record<string, unknown>
}

export type AiSettingsResolved = {
  enabled: boolean
  apiBaseUrl: string
  apiKey: string
  model: string
}

export const AI_MAX_INPUT_CHARS = 12_000
