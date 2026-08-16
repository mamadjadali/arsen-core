import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { L } from '@/i18n/label'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    label: L('Size', 'اندازه'),
    options: [
      {
        label: L('One Third', 'یک‌سوم'),
        value: 'oneThird',
      },
      {
        label: L('Half', 'نیمه'),
        value: 'half',
      },
      {
        label: L('Two Thirds', 'دو‌سوم'),
        value: 'twoThirds',
      },
      {
        label: L('Full', 'کامل'),
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
    label: L('Enable Link', 'فعال‌سازی لینک'),
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: L('Columns', 'ستون‌ها'),
      labels: {
        singular: L('Column', 'ستون'),
        plural: L('Columns', 'ستون‌ها'),
      },
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
  labels: {
    plural: L('Content Blocks', 'بلوک‌های محتوا'),
    singular: L('Content', 'محتوا'),
  },
}
