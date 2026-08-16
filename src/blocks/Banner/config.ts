import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { L } from '@/i18n/label'

export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      label: L('Style', 'سبک'),
      options: [
        { label: L('Info', 'اطلاعات'), value: 'info' },
        { label: L('Warning', 'هشدار'), value: 'warning' },
        { label: L('Error', 'خطا'), value: 'error' },
        { label: L('Success', 'موفقیت'), value: 'success' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: false,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
  labels: {
    plural: L('Banners', 'بنرها'),
    singular: L('Banner', 'بنر'),
  },
}
