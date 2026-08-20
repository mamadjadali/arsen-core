import type { CheckboxField, Field, TextareaField } from 'payload'

import {
  AI_CONTENT_PRESET_IDS,
  AI_PRESETS,
  AI_SEO_DESC_PRESET_IDS,
  AI_SEO_TITLE_PRESET_IDS,
  getPreset,
} from '@/ai/presets'
import { L } from '@/i18n/label'
import { PRESET_FA } from '@/ai/presetI18n'

type FieldAccessFn = NonNullable<TextareaField['access']>['read']

function instructionFields(ids: string[], access: FieldAccessFn): Field[] {
  return ids.map((id) => {
    const preset = getPreset(id)!
    const fa = PRESET_FA[id]
    const field: TextareaField = {
      name: id,
      type: 'textarea',
      label: L(preset.label, fa?.label ?? preset.label),
      access: {
        read: access,
        update: access,
      },
      admin: {
        rows: 4,
        description: L(
          `${preset.description} Leave empty to use the built-in default instruction.`,
          `${fa?.description ?? preset.description} برای استفاده از دستور پیش‌فرض داخلی خالی بگذارید.`,
        ),
      },
    }
    return field
  })
}

function enabledFields(ids: string[], access: FieldAccessFn): Field[] {
  return ids.map((id) => {
    const preset = getPreset(id)!
    const fa = PRESET_FA[id]
    const field: CheckboxField = {
      name: id,
      type: 'checkbox',
      label: L(preset.label, fa?.label ?? preset.label),
      defaultValue: true,
      access: {
        read: access,
        update: access,
      },
      admin: {
        description: L(
          'Show this option in the AI assist dialog.',
          'نمایش این گزینه در دیالوگ کمک هوش مصنوعی.',
        ),
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
      label: L('Base system prompt', 'پرامپت پایه سیستم'),
      access: {
        read: access,
        update: access,
      },
      admin: {
        rows: 5,
        description: L(
          'Shared preface for every AI option. Leave empty to use the built-in Persian clinic assistant default.',
          'پیش‌گفتار مشترک برای هر گزینه هوش مصنوعی. برای استفاده از پیش‌فرض دستیار کلینیک فارسی داخلی خالی بگذارید.',
        ),
      },
    },
    {
      name: 'aiPromptInstructions',
      type: 'group',
      label: L('Option instructions', 'دستورات گزینه‌ها'),
      admin: {
        description: L(
          'Per-option task instructions appended to the base system prompt. Empty = code default.',
          'دستورات وظیفه هر گزینه که به پرامپت پایه سیستم اضافه می‌شوند. خالی = پیش‌فرض کد.',
        ),
      },
      fields: [
        {
          type: 'group',
          label: L('Content', 'محتوا'),
          fields: instructionFields(AI_CONTENT_PRESET_IDS, access),
        },
        {
          type: 'group',
          label: L('SEO title', 'عنوان سئو'),
          fields: instructionFields(AI_SEO_TITLE_PRESET_IDS, access),
        },
        {
          type: 'group',
          label: L('SEO description', 'توضیحات سئو'),
          fields: instructionFields(AI_SEO_DESC_PRESET_IDS, access),
        },
      ],
    },
    {
      name: 'aiPresetEnabled',
      type: 'group',
      label: L('Enabled options', 'گزینه‌های فعال'),
      admin: {
        description: L(
          'Turn off an option to hide it from the AI assist dialog.',
          'خاموش کردن یک گزینه آن را از دیالوگ کمک هوش مصنوعی پنهان می‌کند.',
        ),
      },
      fields: [
        {
          type: 'group',
          label: L('Content', 'محتوا'),
          fields: enabledFields(AI_CONTENT_PRESET_IDS, access),
        },
        {
          type: 'group',
          label: L('SEO title', 'عنوان سئو'),
          fields: enabledFields(AI_SEO_TITLE_PRESET_IDS, access),
        },
        {
          type: 'group',
          label: L('SEO description', 'توضیحات سئو'),
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
