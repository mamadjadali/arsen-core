import type { Payload } from 'payload'

import type { AiSettingsResolved } from './types'

export class AiSettingsError extends Error {
  status: number

  constructor(message: string, status = 503) {
    super(message)
    this.name = 'AiSettingsError'
    this.status = status
  }
}

export async function getAiSettings(payload: Payload): Promise<AiSettingsResolved> {
  const settings = await payload.findGlobal({
    slug: 'settings',
    depth: 0,
    overrideAccess: true,
  })

  const enabled = Boolean(settings.aiEnabled)
  const apiBaseUrl = typeof settings.aiApiBaseUrl === 'string' ? settings.aiApiBaseUrl.trim() : ''
  const apiKey = typeof settings.aiApiKey === 'string' ? settings.aiApiKey.trim() : ''
  const model = typeof settings.aiModel === 'string' ? settings.aiModel.trim() : ''

  if (!enabled) {
    throw new AiSettingsError('AI features are disabled in Settings.', 503)
  }
  if (!apiBaseUrl) {
    throw new AiSettingsError('AI API base URL is not configured.', 503)
  }
  if (!apiKey) {
    throw new AiSettingsError('AI API key is not configured.', 503)
  }
  if (!model) {
    throw new AiSettingsError('AI model is not configured.', 503)
  }

  return { enabled, apiBaseUrl, apiKey, model }
}

export async function isAiEnabled(payload: Payload): Promise<boolean> {
  try {
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
      overrideAccess: true,
      select: {
        aiEnabled: true,
        aiApiKey: true,
        aiApiBaseUrl: true,
        aiModel: true,
      },
    })

    return Boolean(
      settings.aiEnabled &&
        typeof settings.aiApiKey === 'string' &&
        settings.aiApiKey.trim() &&
        typeof settings.aiApiBaseUrl === 'string' &&
        settings.aiApiBaseUrl.trim() &&
        typeof settings.aiModel === 'string' &&
        settings.aiModel.trim(),
    )
  } catch {
    return false
  }
}
