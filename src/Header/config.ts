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
      type: 'row',
      fields: [
        {
          name: 'logoHeightMobile',
          type: 'number',
          min: 16,
          max: 160,
          defaultValue: 40,
          label: L('Logo height (mobile)', 'ارتفاع لوگو (موبایل)'),
          admin: {
            description: L(
              'Height in pixels. Width follows the image aspect ratio.',
              'ارتفاع به پیکسل. عرض متناسب با نسبت تصویر تنظیم می‌شود.',
            ),
            width: '50%',
          },
        },
        {
          name: 'logoHeightDesktop',
          type: 'number',
          min: 16,
          max: 160,
          defaultValue: 56,
          label: L('Logo height (desktop)', 'ارتفاع لوگو (دسکتاپ)'),
          admin: {
            description: L(
              'From the md breakpoint. Height in pixels; width follows aspect ratio.',
              'از نقطه شکست md. ارتفاع به پیکسل؛ عرض متناسب با نسبت تصویر.',
            ),
            width: '50%',
          },
        },
      ],
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
