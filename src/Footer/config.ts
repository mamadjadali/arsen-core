import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      label: 'Footer design',
      defaultValue: 'newsletter',
      required: true,
      options: [
        {
          label: 'Newsletter (Solace)',
          value: 'newsletter',
        },
        {
          label: 'Columns (brand + link grid)',
          value: 'columns',
        },
      ],
      admin: {
        description:
          'Newsletter: Solace-style signup + large links. Columns: logo, tagline, multi-column links, legal row.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Footer logo (independent from Header)',
      },
    },
    {
      name: 'brandName',
      type: 'text',
      admin: {
        description: 'Brand name next to the logo',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Short slogan under the brand (Columns layout)',
      },
    },
    {
      name: 'newsletterHeading',
      type: 'text',
      defaultValue: 'Newsletter',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'newsletter',
      },
    },
    {
      name: 'newsletterPlaceholder',
      type: 'text',
      defaultValue: 'Enter Your Email',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'newsletter',
      },
    },
    {
      name: 'newsletterForm',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        description: 'Optional form used for newsletter submissions',
        condition: (_, siblingData) => siblingData?.layout === 'newsletter',
      },
    },
    {
      name: 'linkGroups',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'X', value: 'x' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Threads', value: 'threads' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© 2026 Suno AI, All rights reserved',
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        description: 'Terms, privacy, etc. (shown in the bottom bar)',
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        description: 'Legacy simple nav links (optional)',
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
