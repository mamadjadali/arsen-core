import type { CheckboxField, Field, TextareaField } from 'payload'

import {
  AI_CONTENT_PRESET_IDS,
  AI_PRESETS,
  AI_SEO_DESC_PRESET_IDS,
  AI_SEO_TITLE_PRESET_IDS,
  getPreset,
} from '@/ai/presets'

type FieldAccessFn = NonNullable<TextareaField['access']>['read']

function instructionFields(ids: string[], access: FieldAccessFn): Field[] {
  return ids.map((id) => {
    const preset = getPreset(id)!
    const field: TextareaField = {
      name: id,
      type: 'textarea',
      label: preset.label,
      access: {
        read: access,
        update: access,
      },
      admin: {
        rows: 4,
        description: `${preset.description} Leave empty to use the built-in default instruction.`,
      },
    }
    return field
  })
}

function enabledFields(ids: string[], access: FieldAccessFn): Field[] {
  return ids.map((id) => {
    const preset = getPreset(id)!
    const field: CheckboxField = {
      name: id,
      type: 'checkbox',
      label: preset.label,
      defaultValue: true,
      access: {
        read: access,
        update: access,
      },
      admin: {
        description: 'Show this option in the AI assist dialog.',
      },
    }
    return field
  })
}

/** Settings fields for CMS-editable AI prompts (instructions + enabled flags). */
export function buildAiPromptSettingsFields(access: FieldAccessFn): Field[] {
  return [
    {
      name: 'aiBaseSystemPrompt',
      type: 'textarea',
      label: 'Base system prompt',
      access: {
        read: access,
        update: access,
      },
      admin: {
        rows: 5,
        description:
          'Shared preface for every AI option. Leave empty to use the built-in Persian clinic assistant default.',
      },
    },
    {
      name: 'aiPromptInstructions',
      type: 'group',
      label: 'Option instructions',
      admin: {
        description:
          'Per-option task instructions appended to the base system prompt. Empty = code default.',
      },
      fields: [
        {
          type: 'group',
          label: 'Content',
          fields: instructionFields(AI_CONTENT_PRESET_IDS, access),
        },
        {
          type: 'group',
          label: 'SEO title',
          fields: instructionFields(AI_SEO_TITLE_PRESET_IDS, access),
        },
        {
          type: 'group',
          label: 'SEO description',
          fields: instructionFields(AI_SEO_DESC_PRESET_IDS, access),
        },
      ],
    },
    {
      name: 'aiPresetEnabled',
      type: 'group',
      label: 'Enabled options',
      admin: {
        description: 'Turn off an option to hide it from the AI assist dialog.',
      },
      fields: [
        {
          type: 'group',
          label: 'Content',
          fields: enabledFields(AI_CONTENT_PRESET_IDS, access),
        },
        {
          type: 'group',
          label: 'SEO title',
          fields: enabledFields(AI_SEO_TITLE_PRESET_IDS, access),
        },
        {
          type: 'group',
          label: 'SEO description',
          fields: enabledFields(AI_SEO_DESC_PRESET_IDS, access),
        },
      ],
    },
  ]
}

/** Seed / clear shape for prompt-related Settings fields. */
export function emptyAiPromptSeedData(): {
  aiBaseSystemPrompt: null
  aiPromptInstructions: Record<string, null>
  aiPresetEnabled: Record<string, true>
} {
  const aiPromptInstructions: Record<string, null> = {}
  const aiPresetEnabled: Record<string, true> = {}
  for (const preset of AI_PRESETS) {
    aiPromptInstructions[preset.id] = null
    aiPresetEnabled[preset.id] = true
  }
  return {
    aiBaseSystemPrompt: null,
    aiPromptInstructions,
    aiPresetEnabled,
  }
}
