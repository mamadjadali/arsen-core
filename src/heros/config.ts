import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'solace',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Solace',
          value: 'solace',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'announcementBadge',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'solace',
      },
    },
    {
      name: 'announcementText',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'solace',
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      admin: {
        condition: (_, { type } = {}) => type === 'solace',
        description: 'Use a new line for a line break',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
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
      label: 'Media Layout',
      options: [
        {
          label: 'Triple Phones',
          value: 'phones',
        },
        {
          label: 'Single Image',
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
      label: 'Hero Image',
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
          label: 'Desktop Width (%)',
          defaultValue: 100,
          min: 10,
          max: 100,
          admin: {
            width: '50%',
            description: 'Image width on desktop (md and up)',
            condition: (_, { type, mediaLayout } = {}) =>
              type === 'solace' && mediaLayout === 'image',
          },
        },
        {
          name: 'heroImageWidthMobile',
          type: 'number',
          label: 'Mobile Width (%)',
          defaultValue: 100,
          min: 10,
          max: 100,
          admin: {
            width: '50%',
            description: 'Image width on mobile',
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
      admin: {
        condition: (_, { type, mediaLayout } = {}) =>
          type === 'solace' && mediaLayout !== 'image',
      },
    },
    {
      name: 'phoneCenter',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type, mediaLayout } = {}) =>
          type === 'solace' && mediaLayout !== 'image',
      },
    },
    {
      name: 'phoneRight',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type, mediaLayout } = {}) =>
          type === 'solace' && mediaLayout !== 'image',
      },
    },
  ],
  label: false,
}
