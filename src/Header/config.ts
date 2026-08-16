import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { L } from '@/i18n/label'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: L('Header', 'هدر'),
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: L('Logo', 'لوگو'),
    },
    {
      name: 'brandName',
      type: 'text',
      label: L('Brand name', 'نام برند'),
      defaultValue: 'SunoAI',
    },
    {
      name: 'navItems',
      type: 'array',
      label: L('Navigation items', 'آیتم‌های ناوبری'),
      labels: {
        singular: L('Nav item', 'آیتم ناوبری'),
        plural: L('Nav items', 'آیتم‌های ناوبری'),
      },
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
        label: L('Secondary CTA', 'فراخوان ثانویه'),
      },
    }),
    link({
      appearances: false,
      overrides: {
        name: 'primaryCta',
        label: L('Primary CTA', 'فراخوان اصلی'),
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
