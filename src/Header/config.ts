import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'brandName',
      type: 'text',
      defaultValue: 'SunoAI',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    link({
      appearances: false,
      overrides: {
        name: 'secondaryCta',
        label: 'Secondary CTA',
      },
    }),
    link({
      appearances: false,
      overrides: {
        name: 'primaryCta',
        label: 'Primary CTA',
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
