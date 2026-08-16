import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { L } from '@/i18n/label'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
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
      label: L('Intro Content', 'محتوای مقدمه'),
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      label: L('Populate By', 'پر کردن بر اساس'),
      options: [
        {
          label: L('Collection', 'مجموعه'),
          value: 'collection',
        },
        {
          label: L('Individual Selection', 'انتخاب تکی'),
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      defaultValue: 'posts',
      label: L('Collections To Show', 'مجموعه‌های نمایشی'),
      options: [
        {
          label: L('Posts', 'پست‌ها'),
          value: 'posts',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      hasMany: true,
      label: L('Categories To Show', 'دسته‌بندی‌های نمایشی'),
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
      label: L('Limit', 'محدودیت'),
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: L('Selection', 'انتخاب'),
      relationTo: ['posts'],
    },
  ],
  labels: {
    plural: L('Archives', 'آرشیوها'),
    singular: L('Archive', 'آرشیو'),
  },
}
