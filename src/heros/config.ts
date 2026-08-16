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
      },
    }),
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
