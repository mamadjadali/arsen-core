import type { Endpoint } from 'payload'

import { AiProviderError, chatCompletion } from '../client'
import { AiSettingsError, getAiSettings, isAiEnabled } from '../getAiSettings'
import { plainTextToLexical } from '../lexicalText'
import { getPreset } from '../presets'
import {
  listEnabledPresetMeta,
  loadAiPromptSettings,
  resolvePresetMessages,
} from '../resolvePrompt'
import type { AiTarget, AiTransformRequest, AiTransformResponse } from '../types'
import { AI_MAX_INPUT_CHARS } from '../types'

const VALID_TARGETS: AiTarget[] = ['content', 'seoTitle', 'seoDescription']

function isAiTarget(value: unknown): value is AiTarget {
  return typeof value === 'string' && VALID_TARGETS.includes(value as AiTarget)
}

async function readJsonBody(req: {
  json?: () => Promise<unknown>
  data?: unknown
}): Promise<unknown> {
  if (typeof req.json === 'function') {
    try {
      return await req.json()
    } catch {
      return req.data ?? null
    }
  }
  return req.data ?? null
}

export const aiStatusEndpoint: Endpoint = {
  path: '/ai/status',
  method: 'get',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const enabled = await isAiEnabled(req.payload)
    return Response.json({ enabled })
  },
}

export const aiPresetsEndpoint: Endpoint = {
  path: '/ai/presets',
  method: 'get',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url || '', 'http://localhost')
    const targetParam = url.searchParams.get('target')
    const target =
      typeof targetParam === 'string' && isAiTarget(targetParam) ? targetParam : undefined

    const settings = await loadAiPromptSettings(req.payload)
    const presets = listEnabledPresetMeta(settings, target)
    return Response.json({ presets })
  },
}

export const aiTransformEndpoint: Endpoint = {
  path: '/ai/transform',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const raw = await readJsonBody(req)
    if (!raw || typeof raw !== 'object') {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const body = raw as Partial<AiTransformRequest>
    const presetId = typeof body.presetId === 'string' ? body.presetId : ''
    const target = body.target
    let text = typeof body.text === 'string' ? body.text : ''
    const title = typeof body.title === 'string' ? body.title : undefined

    if (!presetId || !isAiTarget(target)) {
      return Response.json({ error: 'Invalid presetId or target' }, { status: 400 })
    }

    const preset = getPreset(presetId)
    if (!preset || !preset.targets.includes(target)) {
      return Response.json({ error: 'Unknown or mismatched preset' }, { status: 400 })
    }

    if (!text.trim()) {
      const allowsEmpty =
        (presetId === 'seoTitleOptimize' && Boolean(title?.trim())) ||
        (presetId === 'seoDescOptimize' && Boolean(title?.trim()))
      if (!allowsEmpty) {
        return Response.json({ error: 'Text is required for this preset' }, { status: 400 })
      }
    }

    if (text.length > AI_MAX_INPUT_CHARS) {
      text = text.slice(0, AI_MAX_INPUT_CHARS)
    }

    try {
      const [providerSettings, promptSettings] = await Promise.all([
        getAiSettings(req.payload),
        loadAiPromptSettings(req.payload),
      ])

      const messages = resolvePresetMessages(promptSettings, presetId, { text, title })
      if (!messages) {
        return Response.json({ error: 'This AI option is disabled' }, { status: 403 })
      }

      const resultText = await chatCompletion({
        baseUrl: providerSettings.apiBaseUrl,
        apiKey: providerSettings.apiKey,
        model: providerSettings.model,
        messages,
      })

      const response: AiTransformResponse = { text: resultText }
      if (target === 'content') {
        response.lexical = plainTextToLexical(resultText)
      }

      return Response.json(response)
    } catch (err) {
      if (err instanceof AiSettingsError || err instanceof AiProviderError) {
        return Response.json({ error: err.message }, { status: err.status })
      }
      req.payload.logger.error({ err }, 'AI transform failed')
      return Response.json({ error: 'AI transform failed' }, { status: 500 })
    }
  },
}
