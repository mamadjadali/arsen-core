import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const ContactSection: Block = {
  slug: 'contactSection',
  interfaceName: 'ContactSectionBlock',
  labels: {
    singular: 'Contact Section',
    plural: 'Contact Sections',
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
    {
      name: 'methods',
      type: 'array',
      maxRows: 6,
      labels: {
        singular: 'Contact method',
        plural: 'Contact methods',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'mail',
          options: [
            { label: 'Email', value: 'mail' },
            { label: 'Live chat', value: 'chat' },
            { label: 'Phone', value: 'phone' },
            { label: 'Office / map', value: 'map' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Displayed contact detail (email, phone, address, CTA text)',
          },
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            label: 'Optional link',
            admin: {
              description: 'If set, the value becomes a clickable link (mailto, tel, or URL)',
            },
          },
        }),
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'formHeading',
      type: 'text',
      label: 'Form heading',
      defaultValue: 'Send us a message',
    },
    {
      name: 'formDescription',
      type: 'textarea',
      label: 'Form description',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Form',
    },
  ],
}
