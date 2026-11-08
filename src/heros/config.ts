import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { L } from '@/i18n/label'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  label: L('Hero', 'هیرو'),
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'solace',
      label: L('Type', 'نوع'),
      options: [
        {
          label: L('None', 'بدون هیرو'),
          value: 'none',
        },
        {
          label: L('Solace', 'سولس'),
          value: 'solace',
        },
        {
          label: L('High Impact', 'تأثیر بالا'),
          value: 'highImpact',
        },
        {
          label: L('Medium Impact', 'تأثیر متوسط'),
          value: 'mediumImpact',
        },
        {
          label: L('Low Impact', 'تأثیر کم'),
          value: 'lowImpact',
        },
        {
          label: L('Carousel', 'کاروسل'),
          value: 'carousel',
        },
      ],
      required: true,
    },
    {
      name: 'announcementBadge',
      type: 'text',
      label: L('Announcement badge', 'برچسب اعلان'),
      admin: {
        condition: (_, { type } = {}) => type === 'solace',
      },
    },
    {
      name: 'announcementText',
      type: 'text',
      label: L('Announcement text', 'متن اعلان'),
      admin: {
        condition: (_, { type } = {}) => type === 'solace',
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      label: L('Heading', 'عنوان'),
      admin: {
        condition: (_, { type } = {}) => type === 'solace',
        description: L('Use a new line for a line break', 'برای شکستن خط، خط جدید بزنید'),
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: L('Subheading', 'زیرعنوان'),
      admin: {
        condition: (_, { type } = {}) => type === 'solace',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'lowImpact'].includes(type),
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) =>
            type !== 'none' && Boolean(type),
        },
      },
    }),
    {
      name: 'slides',
      type: 'array',
      label: L('Slides', 'اسلایدها'),
      labels: {
        singular: L('Slide', 'اسلاید'),
        plural: L('Slides', 'اسلایدها'),
      },
      minRows: 1,
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
        initCollapsed: false,
        description: L(
          'Desktop image required. Optional mobile image for art direction under md.',
          'تصویر دسکتاپ الزامی است. تصویر موبایل اختیاری برای ترکیب متفاوت زیر md.',
        ),
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: L('Image (desktop)', 'تصویر (دسکتاپ)'),
        },
        {
          name: 'imageMobile',
          type: 'upload',
          relationTo: 'media',
          label: L('Image (mobile)', 'تصویر (موبایل)'),
          admin: {
            description: L(
              'Shown below the md breakpoint. Falls back to desktop image if empty.',
              'زیر نقطهٔ شکست md نمایش داده می‌شود. در صورت خالی بودن از تصویر دسکتاپ استفاده می‌شود.',
            ),
          },
        },
        {
          name: 'alt',
          type: 'text',
          label: L('Alt text', 'متن جایگزین'),
          admin: {
            description: L('Optional. Defaults to media alt.', 'اختیاری. در صورت خالی بودن از alt رسانه استفاده می‌شود.'),
          },
        },
        {
          name: 'href',
          type: 'text',
          label: L('Link URL', 'آدرس لینک'),
          admin: {
            description: L('Optional. Makes the whole slide clickable.', 'اختیاری. کل اسلاید را قابل کلیک می‌کند.'),
          },
        },
      ],
    },
    {
      type: 'row',
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
      fields: [
        {
          name: 'loop',
          type: 'checkbox',
          label: L('Loop', 'حلقه'),
          defaultValue: true,
          admin: {
            width: '25%',
            description: L(
              'Ignored when fade is on (fade requires loop off).',
              'با گذار محو نادیده گرفته می‌شود (محو به حلقه خاموش نیاز دارد).',
            ),
            condition: (_, { type, fade } = {}) => type === 'carousel' && fade !== true,
          },
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          label: L('Autoplay', 'پخش خودکار'),
          defaultValue: true,
          admin: { width: '25%' },
        },
        {
          name: 'fade',
          type: 'checkbox',
          label: L('Fade transition', 'گذار محو'),
          defaultValue: false,
          admin: {
            width: '25%',
            description: L(
              'Cross-fade instead of slide. Disables loop (Embla fade constraint).',
              'به‌جای اسلاید، محو متقابل. حلقه را غیرفعال می‌کند (محدودیت Embla).',
            ),
          },
        },
        {
          name: 'autoplayDelay',
          type: 'number',
          label: L('Autoplay delay (ms)', 'تأخیر پخش خودکار (ms)'),
          defaultValue: 5000,
          min: 1500,
          max: 30000,
          admin: {
            width: '25%',
            condition: (_, { type, autoplay } = {}) => type === 'carousel' && autoplay !== false,
          },
        },
      ],
    },
    {
      type: 'row',
      admin: {
        condition: (_, { type } = {}) => type === 'carousel',
      },
      fields: [
        {
          name: 'showArrows',
          type: 'checkbox',
          label: L('Show arrows', 'نمایش فلش‌ها'),
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'showPagination',
          type: 'checkbox',
          label: L('Show pagination', 'نمایش صفحه‌بندی'),
          defaultValue: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      label: L('Media', 'رسانه'),
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: { type?: string } },
      ) => {
        if (['highImpact', 'mediumImpact'].includes(siblingData?.type || '') && !value) {
          return 'This field is required.'
        }
        return true
      },
    },
    {
      name: 'mediaLayout',
      type: 'select',
      defaultValue: 'phones',
      label: L('Media Layout', 'چیدمان رسانه'),
      options: [
        {
          label: L('Triple Phones', 'سه گوشی'),
          value: 'phones',
        },
        {
          label: L('Single Image', 'تصویر تکی'),
          value: 'image',
        },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'solace',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: L('Hero Image', 'تصویر هیرو'),
      admin: {
        condition: (_, { type, mediaLayout } = {}) =>
          type === 'solace' && mediaLayout === 'image',
      },
    },
    {
      type: 'row',
      admin: {
        condition: (_, { type, mediaLayout } = {}) =>
          type === 'solace' && mediaLayout === 'image',
      },
      fields: [
        {
          name: 'heroImageWidthDesktop',
          type: 'number',
          label: L('Desktop Width (%)', 'عرض دسکتاپ (٪)'),
          defaultValue: 100,
          min: 10,
          max: 100,
          admin: {
            width: '50%',
            description: L(
              'Image width on desktop (md and up)',
              'عرض تصویر در دسکتاپ (از md به بالا)',
            ),
            condition: (_, { type, mediaLayout } = {}) =>
              type === 'solace' && mediaLayout === 'image',
          },
        },
        {
          name: 'heroImageWidthMobile',
          type: 'number',
          label: L('Mobile Width (%)', 'عرض موبایل (٪)'),
          defaultValue: 100,
          min: 10,
          max: 100,
          admin: {
            width: '50%',
            description: L('Image width on mobile', 'عرض تصویر در موبایل'),
            condition: (_, { type, mediaLayout } = {}) =>
              type === 'solace' && mediaLayout === 'image',
          },
        },
      ],
    },
    {
      name: 'phoneLeft',
      type: 'upload',
      relationTo: 'media',
      label: L('Phone left', 'گوشی چپ'),
      admin: {
        condition: (_, { type, mediaLayout } = {}) =>
          type === 'solace' && mediaLayout !== 'image',
      },
    },
    {
      name: 'phoneCenter',
      type: 'upload',
      relationTo: 'media',
      label: L('Phone center', 'گوشی وسط'),
      admin: {
        condition: (_, { type, mediaLayout } = {}) =>
          type === 'solace' && mediaLayout !== 'image',
      },
    },
    {
      name: 'phoneRight',
      type: 'upload',
      relationTo: 'media',
      label: L('Phone right', 'گوشی راست'),
      admin: {
        condition: (_, { type, mediaLayout } = {}) =>
          type === 'solace' && mediaLayout !== 'image',
      },
    },
  ],
}
