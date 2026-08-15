import type { GlobalConfig, TextFieldValidation, TextareaFieldValidation } from 'payload'

import { revalidateScripts } from './hooks/revalidateScripts'

const isSafeScriptSrcValidate = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    return 'Enter an external script URL'
  }

  const trimmed = value.trim()
  const lower = trimmed.toLowerCase()

  if (lower.startsWith('javascript:') || lower.startsWith('data:')) {
    return 'Unsafe script URL'
  }

  if (
    !(
      lower.startsWith('https://') ||
      lower.startsWith('http://') ||
      lower.startsWith('//') ||
      trimmed.startsWith('/')
    )
  ) {
    return 'URL must start with https://, http://, //, or /'
  }

  return true
}

const validateExternalSrc: TextFieldValidation = (value, { siblingData } = {} as never) => {
  const kind = (siblingData as { kind?: string } | undefined)?.kind
  if (kind !== 'external') return true
  return isSafeScriptSrcValidate(value)
}

const validateInlineCode: TextareaFieldValidation = (value, { siblingData } = {} as never) => {
  const kind = (siblingData as { kind?: string } | undefined)?.kind
  if (kind !== 'inline') return true
  if (typeof value !== 'string' || !value.trim()) {
    return 'Paste a script snippet'
  }
  return true
}

export const Scripts: GlobalConfig = {
  slug: 'scripts',
  label: 'Scripts',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Site-wide custom scripts (analytics, pixels). Only add trusted sources — injected on every frontend page.',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      labels: {
        singular: 'Script',
        plural: 'Scripts',
      },
      admin: {
        initCollapsed: true,
        description: 'Enabled scripts are injected into the public site via next/script.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          admin: {
            description: 'Admin label only (e.g. Google Analytics)',
          },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enabled',
          defaultValue: true,
        },
        {
          name: 'kind',
          type: 'select',
          label: 'Type',
          required: true,
          defaultValue: 'inline',
          options: [
            {
              label: 'Paste snippet (Google Analytics / GTM)',
              value: 'inline',
            },
            { label: 'External file URL only', value: 'external' },
          ],
          admin: {
            description:
              'Paste the full vendor snippet (including <script> tags). Tags are stripped so they are not double-wrapped.',
          },
        },
        {
          name: 'src',
          type: 'text',
          label: 'External file URL',
          admin: {
            condition: (_data, siblingData) =>
              Boolean(
                siblingData &&
                  typeof siblingData === 'object' &&
                  'kind' in siblingData &&
                  siblingData.kind === 'external',
              ),
            description:
              'Only the .js file URL (e.g. https://www.googletagmanager.com/gtag/js?id=G-XXXX). Prefer “Paste snippet” for full GA HTML.',
          },
          validate: validateExternalSrc,
        },
        {
          name: 'code',
          type: 'textarea',
          label: 'Snippet',
          admin: {
            condition: (_data, siblingData) =>
              Boolean(
                siblingData &&
                  typeof siblingData === 'object' &&
                  'kind' in siblingData &&
                  siblingData.kind === 'inline',
              ),
            rows: 12,
            description:
              'Paste Google Analytics / Tag Manager HTML as-is. Opening/closing <script> tags are removed automatically; src= scripts become external loads.',
          },
          validate: validateInlineCode,
        },
        {
          name: 'placement',
          type: 'select',
          label: 'Placement',
          required: true,
          defaultValue: 'body',
          options: [
            { label: 'Head', value: 'head' },
            { label: 'Body (end)', value: 'body' },
          ],
        },
        {
          name: 'strategy',
          type: 'select',
          label: 'Load strategy',
          defaultValue: 'afterInteractive',
          options: [
            { label: 'After interactive', value: 'afterInteractive' },
            { label: 'Lazy on load', value: 'lazyOnload' },
            { label: 'Before interactive', value: 'beforeInteractive' },
          ],
          admin: {
            condition: (_data, siblingData) =>
              Boolean(
                siblingData &&
                  typeof siblingData === 'object' &&
                  'kind' in siblingData &&
                  siblingData.kind === 'external',
              ),
            description: 'Next.js Script strategy (external scripts only).',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateScripts],
  },
}
