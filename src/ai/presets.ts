import type { AiChatMessage, AiTarget } from './types'

export type AiPresetDef = {
  id: string
  label: string
  description: string
  targets: AiTarget[]
  defaultInstruction: string
  buildUserMessage: (args: { text: string; title?: string }) => string
}

/** Shared system preface when Settings `aiBaseSystemPrompt` is empty. */
export const DEFAULT_BASE_SYSTEM_PROMPT = [
  'You are an editorial assistant for a Persian (Farsi) medical/clinic blog.',
  'Preserve meaning, medical caution, and RTL-friendly prose.',
  'Return only the transformed text — no preamble, no quotes around the whole answer.',
].join(' ')

const draftUser = ({ text, title }: { text: string; title?: string }) =>
  `${title ? `Title: ${title}\n\n` : ''}Draft:\n${text}`

const contentPresets: AiPresetDef[] = [
  {
    id: 'makeLonger',
    label: 'Make longer',
    description: 'Expand with useful detail while staying on-topic.',
    targets: ['content'],
    defaultInstruction: 'Expand the article draft. Keep structure; add depth, not fluff.',
    buildUserMessage: draftUser,
  },
  {
    id: 'makeShorter',
    label: 'Make shorter',
    description: 'Tighten wording; remove repetition.',
    targets: ['content'],
    defaultInstruction: 'Shorten the draft. Keep key facts and a clear flow.',
    buildUserMessage: draftUser,
  },
  {
    id: 'improveClarity',
    label: 'Improve clarity',
    description: 'Clearer sentences and smoother reading.',
    targets: ['content'],
    defaultInstruction: 'Rewrite for clarity and readability without changing meaning.',
    buildUserMessage: draftUser,
  },
  {
    id: 'fixGrammar',
    label: 'Fix grammar',
    description: 'Correct grammar, spelling, and punctuation.',
    targets: ['content'],
    defaultInstruction:
      'Fix grammar, spelling, and punctuation. Keep voice and structure; do not invent content.',
    buildUserMessage: ({ text }) => text,
  },
  {
    id: 'moreProfessional',
    label: 'More professional',
    description: 'Clinical, trustworthy tone.',
    targets: ['content'],
    defaultInstruction:
      'Rewrite in a professional clinical tone suitable for a dermatology clinic.',
    buildUserMessage: draftUser,
  },
  {
    id: 'moreCasual',
    label: 'More casual',
    description: 'Friendlier, approachable tone.',
    targets: ['content'],
    defaultInstruction: 'Rewrite in a warm, approachable tone without slang or jokes.',
    buildUserMessage: draftUser,
  },
  {
    id: 'reshapeStructure',
    label: 'Reshape structure',
    description: 'Improve headings and section flow (markdown ok).',
    targets: ['content'],
    defaultInstruction:
      'Restructure with clear sections. Use markdown headings (# ## ###) and short paragraphs.',
    buildUserMessage: draftUser,
  },
]

const seoTitlePresets: AiPresetDef[] = [
  {
    id: 'seoTitleOptimize',
    label: 'Optimize SEO title',
    description: 'Stronger meta title (≈50–60 chars).',
    targets: ['seoTitle'],
    defaultInstruction:
      'Write one SEO meta title. Prefer ~50–60 characters. Return only the title line.',
    buildUserMessage: ({ text, title }) =>
      `Current meta title: ${text || '(empty)'}\nPost title: ${title || '(none)'}`,
  },
  {
    id: 'seoTitleFromContent',
    label: 'Title from content',
    description: 'Generate meta title from post body / title.',
    targets: ['seoTitle'],
    defaultInstruction:
      'Write one SEO meta title from the content. Prefer ~50–60 characters. Return only the title line.',
    buildUserMessage: ({ text, title }) =>
      `Post title: ${title || '(none)'}\n\nContent excerpt:\n${text}`,
  },
]

const seoDescPresets: AiPresetDef[] = [
  {
    id: 'seoDescOptimize',
    label: 'Optimize SEO description',
    description: 'Stronger meta description (≈140–160 chars).',
    targets: ['seoDescription'],
    defaultInstruction:
      'Write one SEO meta description (~140–160 characters). Return only the description.',
    buildUserMessage: ({ text, title }) =>
      `Post title: ${title || '(none)'}\nCurrent description: ${text || '(empty)'}`,
  },
  {
    id: 'seoDescFromContent',
    label: 'Description from content',
    description: 'Generate meta description from the post body.',
    targets: ['seoDescription'],
    defaultInstruction:
      'Write one SEO meta description (~140–160 characters) from the content. Return only the description.',
    buildUserMessage: ({ text, title }) =>
      `Post title: ${title || '(none)'}\n\nContent excerpt:\n${text}`,
  },
  {
    id: 'seoDescShorter',
    label: 'Shorten SEO description',
    description: 'Trim to a crisp meta description.',
    targets: ['seoDescription'],
    defaultInstruction:
      'Shorten this SEO description to ~140–160 characters max. Return only the description.',
    buildUserMessage: ({ text }) => text,
  },
]

export const AI_PRESETS: AiPresetDef[] = [...contentPresets, ...seoTitlePresets, ...seoDescPresets]

export const AI_CONTENT_PRESET_IDS = contentPresets.map((p) => p.id)
export const AI_SEO_TITLE_PRESET_IDS = seoTitlePresets.map((p) => p.id)
export const AI_SEO_DESC_PRESET_IDS = seoDescPresets.map((p) => p.id)

/** Client-safe preset list (no prompt builders). */
export const AI_PRESET_META = AI_PRESETS.map(({ id, label, description, targets }) => ({
  id,
  label,
  description,
  targets,
}))

export type AiPresetMeta = (typeof AI_PRESET_META)[number]

export const getPreset = (id: string): AiPresetDef | undefined =>
  AI_PRESETS.find((p) => p.id === id)

export const presetsForTarget = (target: AiTarget): AiPresetDef[] =>
  AI_PRESETS.filter((p) => p.targets.includes(target))

export function buildMessages(
  preset: AiPresetDef,
  args: {
    text: string
    title?: string
    baseSystem: string
    instruction: string
  },
): AiChatMessage[] {
  const base = args.baseSystem.trim() || DEFAULT_BASE_SYSTEM_PROMPT
  const instruction = args.instruction.trim() || preset.defaultInstruction
  return [
    {
      role: 'system',
      content: `${base}\n${instruction}`,
    },
    {
      role: 'user',
      content: preset.buildUserMessage({ text: args.text, title: args.title }),
    },
  ]
}
