import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const FeaturedServices: Block = {
  slug: 'featuredServices',
  interfaceName: 'FeaturedServicesBlock',
  labels: {
    singular: 'Featured Services',
    plural: 'Featured Services',
  },
  fields: [
    {
      name: 'heading',
      type: 'richText',
      required: true,
      label: 'Heading',
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
      label: 'Description',
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
        label: 'CTA button',
      },
    }),
    {
      name: 'services',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      labels: {
        singular: 'Service',
        plural: 'Services',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
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
