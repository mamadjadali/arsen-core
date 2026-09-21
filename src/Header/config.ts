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
      name: 'breakoutLayout',
      type: 'checkbox',
      label: L('Break out of site layout', 'خروج از چارچوب سایت'),
      defaultValue: false,
      admin: {
        description: L(
          'When on, the header sits outside the framed content column so side borders do not run through it. Content stays aligned to the 1400px column.',
          'در صورت فعال بودن، هدر خارج از ستون محتوایی قاب‌دار قرار می‌گیرد تا حاشیهٔ کناری از آن عبور نکند. محتوا هم‌تراز ستون ۱۴۰۰ پیکسلی می‌ماند.',
        ),
      },
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
      optional: true,
      overrides: {
        name: 'secondaryCta',
        label: L('Secondary CTA', 'فراخوان ثانویه'),
        admin: {
          description: L(
            'Optional. Leave the label empty to hide this button.',
            'اختیاری. برای مخفی‌کردن دکمه، برچسب را خالی بگذارید.',
          ),
        },
      },
    }),
    link({
      appearances: false,
      optional: true,
      overrides: {
        name: 'primaryCta',
        label: L('Primary CTA', 'فراخوان اصلی'),
        admin: {
          description: L(
            'Optional. Leave the label empty to hide this button.',
            'اختیاری. برای مخفی‌کردن دکمه، برچسب را خالی بگذارید.',
          ),
        },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
