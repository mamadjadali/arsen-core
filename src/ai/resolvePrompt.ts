import type { Payload } from 'payload'

import {
  AI_PRESET_META,
  buildMessages,
  DEFAULT_BASE_SYSTEM_PROMPT,
  getPreset,
  type AiPresetMeta,
} from './presets'
import type { AiChatMessage, AiTarget } from './types'

type PromptSettingsDoc = {
  aiBaseSystemPrompt?: string | null
  aiPromptInstructions?: Record<string, string | null | undefined> | null
  aiPresetEnabled?: Record<string, boolean | null | undefined> | null
}

function readInstruction(
  map: PromptSettingsDoc['aiPromptInstructions'],
  presetId: string,
): string {
  const value = map?.[presetId]
  return typeof value === 'string' ? value.trim() : ''
}

export function resolveBaseSystemPrompt(settings: PromptSettingsDoc): string {
  const raw = settings.aiBaseSystemPrompt
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  return DEFAULT_BASE_SYSTEM_PROMPT
}

export function resolveInstruction(settings: PromptSettingsDoc, presetId: string): string {
  const preset = getPreset(presetId)
  if (!preset) return ''
  const fromCms = readInstruction(settings.aiPromptInstructions, presetId)
  return fromCms || preset.defaultInstruction
}

export function isPresetEnabled(settings: PromptSettingsDoc, presetId: string): boolean {
  const map = settings.aiPresetEnabled
  if (!map || !(presetId in map) || map[presetId] == null) return true
  return Boolean(map[presetId])
}

export async function loadAiPromptSettings(payload: Payload): Promise<PromptSettingsDoc> {
  return payload.findGlobal({
    slug: 'settings',
    depth: 0,
    overrideAccess: true,
  }) as Promise<PromptSettingsDoc>
}

export function listEnabledPresetMeta(
  settings: PromptSettingsDoc,
  target?: AiTarget,
): AiPresetMeta[] {
  return AI_PRESET_META.filter((preset) => {
    if (target && !preset.targets.includes(target)) return false
    return isPresetEnabled(settings, preset.id)
  })
}

export function resolvePresetMessages(
  settings: PromptSettingsDoc,
  presetId: string,
  args: { text: string; title?: string },
): AiChatMessage[] | null {
  const preset = getPreset(presetId)
  if (!preset) return null
  if (!isPresetEnabled(settings, presetId)) return null

  return buildMessages(preset, {
    text: args.text,
    title: args.title,
    baseSystem: resolveBaseSystemPrompt(settings),
    instruction: resolveInstruction(settings, presetId),
  })
}
