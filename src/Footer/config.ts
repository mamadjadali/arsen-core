import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { L } from '@/i18n/label'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: L('Footer', 'فوتر'),
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      label: L('Footer design', 'طراحی فوتر'),
      defaultValue: 'newsletter',
      required: true,
      options: [
        {
          label: L('Newsletter (Solace)', 'خبرنامه (سولس)'),
          value: 'newsletter',
        },
        {
          label: L('Columns (brand + link grid)', 'ستون‌ها (برند + شبکه لینک)'),
          value: 'columns',
        },
      ],
      admin: {
        description: L(
          'Newsletter: Solace-style signup + large links. Columns: logo, tagline, multi-column links, legal row.',
          'خبرنامه: ثبت‌نام به سبک سولس + لینک‌های بزرگ. ستون‌ها: لوگو، شعار، لینک‌های چندستونه، ردیف حقوقی.',
        ),
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: L('Logo', 'لوگو'),
      admin: {
        description: L('Footer logo (independent from Header)', 'لوگوی فوتر (مستقل از هدر)'),
      },
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
      admin: {
        description: L('Brand name next to the logo', 'نام برند کنار لوگو'),
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: L('Tagline', 'شعار'),
      admin: {
        description: L(
          'Short slogan under the brand (Columns layout)',
          'شعار کوتاه زیر برند (چیدمان ستون‌ها)',
        ),
      },
    },
    {
      name: 'newsletterHeading',
      type: 'text',
      label: L('Newsletter heading', 'عنوان خبرنامه'),
      defaultValue: 'Newsletter',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'newsletter',
      },
    },
    {
      name: 'newsletterPlaceholder',
      type: 'text',
      label: L('Newsletter placeholder', 'متن راهنمای خبرنامه'),
      defaultValue: 'Enter Your Email',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'newsletter',
      },
    },
    {
      name: 'newsletterForm',
      type: 'relationship',
      relationTo: 'forms',
      label: L('Newsletter form', 'فرم خبرنامه'),
      admin: {
        description: L(
          'Optional form used for newsletter submissions',
          'فرم اختیاری برای ارسال‌های خبرنامه',
        ),
        condition: (_, siblingData) => siblingData?.layout === 'newsletter',
      },
    },
    {
      name: 'linkGroups',
      type: 'array',
      label: L('Link groups', 'گروه‌های لینک'),
      labels: {
        singular: L('Link group', 'گروه لینک'),
        plural: L('Link groups', 'گروه‌های لینک'),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: L('Title', 'عنوان'),
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          label: L('Links', 'لینک‌ها'),
          labels: {
            singular: L('Link', 'لینک'),
            plural: L('Links', 'لینک‌ها'),
          },
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
      label: L('Social links', 'لینک‌های شبکه‌های اجتماعی'),
      labels: {
        singular: L('Social link', 'لینک اجتماعی'),
        plural: L('Social links', 'لینک‌های شبکه‌های اجتماعی'),
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: L('Platform', 'پلتفرم'),
          required: true,
          options: [
            { label: L('X', 'ایکس'), value: 'x' },
            { label: L('LinkedIn', 'لینکدین'), value: 'linkedin' },
            { label: L('Facebook', 'فیسبوک'), value: 'facebook' },
            { label: L('Threads', 'تردز'), value: 'threads' },
            { label: L('Instagram', 'اینستاگرام'), value: 'instagram' },
            { label: L('TikTok', 'تیک‌تاک'), value: 'tiktok' },
            { label: L('YouTube', 'یوتیوب'), value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: L('URL', 'آدرس'),
          required: true,
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: L('Copyright', 'کپی‌رایت'),
      defaultValue: '© 2026 Suno AI, All rights reserved',
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: L('Legal links', 'لینک‌های حقوقی'),
      labels: {
        singular: L('Legal link', 'لینک حقوقی'),
        plural: L('Legal links', 'لینک‌های حقوقی'),
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        description: L(
          'Terms, privacy, etc. (shown in the bottom bar)',
          'شرایط، حریم خصوصی و غیره (نمایش در نوار پایین)',
        ),
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
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
      maxRows: 6,
      admin: {
        description: L(
          'Legacy simple nav links (optional)',
          'لینک‌های ناوبری ساده قدیمی (اختیاری)',
        ),
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
