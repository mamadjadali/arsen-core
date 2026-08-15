import type { FieldAccess, GlobalConfig } from 'payload'

import { buildAiPromptSettingsFields } from './aiPromptFields'
import { revalidateSettings } from './hooks/revalidateSettings'

const authenticatedFieldAccess: FieldAccess = ({ req: { user } }) => Boolean(user)

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Settings',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Site-wide branding and AI provider configuration.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branding',
          fields: [
            {
              type: 'group',
              label: 'Site',
              fields: [
                {
                  name: 'logoLight',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo (light)',
                  admin: {
                    description:
                      'Site wordmark for light backgrounds. Used when Header/Footer logo is empty.',
                  },
                },
                {
                  name: 'faviconIco',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Favicon (.ico)',
                  admin: {
                    description: 'Classic favicon (.ico or 32×32).',
                  },
                },
                {
                  name: 'faviconSvg',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Favicon (SVG)',
                  admin: {
                    description: 'Scalable SVG favicon (preferred in modern browsers).',
                  },
                },
                {
                  name: 'favicon32',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Favicon 32×32',
                  admin: {
                    description: 'PNG 32×32 favicon.',
                  },
                },
                {
                  name: 'appleTouchIcon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Apple touch icon',
                  admin: {
                    description: 'PNG ~180×180 for iOS home screen.',
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Admin panel',
              fields: [
                {
                  name: 'adminLogoLight',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo (light)',
                  admin: {
                    description: 'Login / expanded nav logo for light admin UI.',
                  },
                },
                {
                  name: 'adminLogoDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo (dark)',
                  admin: {
                    description: 'Login / expanded nav logo for dark admin UI.',
                  },
                },
                {
                  name: 'adminIcon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Icon',
                  admin: {
                    description: 'Collapsed nav / small mark (square).',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'AI',
          description: 'OpenAI-compatible provider for admin AI assist (Posts content & SEO).',
          fields: [
            {
              name: 'aiEnabled',
              type: 'checkbox',
              label: 'Enable AI features',
              defaultValue: false,
              admin: {
                description: 'When off, AI buttons are hidden and the transform API rejects requests.',
              },
            },
            {
              name: 'aiApiBaseUrl',
              type: 'text',
              label: 'API base URL',
              defaultValue: 'https://api.gapapi.com/v1',
              admin: {
                description:
                  'OpenAI-compatible API root (no trailing slash). Example: https://api.gapapi.com/v1',
              },
            },
            {
              name: 'aiApiKey',
              type: 'text',
              label: 'API key',
              access: {
                read: authenticatedFieldAccess,
                update: authenticatedFieldAccess,
              },
              admin: {
                description:
                  'Stored server-side only. Never exposed to the public site or unauthenticated API.',
              },
            },
            {
              name: 'aiModel',
              type: 'text',
              label: 'Model',
              defaultValue: 'gpt-4o-mini',
              admin: {
                description: 'Chat model id, e.g. gpt-4o-mini',
              },
            },
            ...buildAiPromptSettingsFields(authenticatedFieldAccess),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSettings],
  },
}
