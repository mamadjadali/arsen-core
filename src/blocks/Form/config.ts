import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { L } from '@/i18n/label'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: L('Form', 'فرم'),
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: L('Enable Intro Content', 'فعال‌سازی محتوای مقدمه'),
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
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
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: L('Form Blocks', 'بلوک‌های فرم'),
    singular: L('Form Block', 'بلوک فرم'),
  },
}
