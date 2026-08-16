import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { L } from '@/i18n/label'

export const FeaturedServices: Block = {
  slug: 'featuredServices',
  interfaceName: 'FeaturedServicesBlock',
  labels: {
    singular: L('Featured Services', 'خدمات ویژه'),
    plural: L('Featured Services', 'خدمات ویژه'),
  },
  fields: [
    {
      name: 'heading',
      type: 'richText',
      required: true,
      label: L('Heading', 'عنوان'),
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
    },
    {
      name: 'description',
      type: 'richText',
      label: L('Description', 'توضیحات'),
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    link({
      appearances: false,
      overrides: {
        name: 'cta',
        label: L('CTA button', 'دکمه فراخوان اقدام'),
      },
    }),
    {
      name: 'services',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      label: L('Services', 'خدمات'),
      labels: {
        singular: L('Service', 'خدمت'),
        plural: L('Services', 'خدمات'),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: L('Title', 'عنوان'),
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: L('Image', 'تصویر'),
        },
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
