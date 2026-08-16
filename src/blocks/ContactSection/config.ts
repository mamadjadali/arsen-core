import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { L } from '@/i18n/label'

export const ContactSection: Block = {
  slug: 'contactSection',
  interfaceName: 'ContactSectionBlock',
  labels: {
    singular: L('Contact Section', 'بخش تماس'),
    plural: L('Contact Sections', 'بخش‌های تماس'),
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
    {
      name: 'methods',
      type: 'array',
      maxRows: 6,
      label: L('Contact methods', 'روش‌های تماس'),
      labels: {
        singular: L('Contact method', 'روش تماس'),
        plural: L('Contact methods', 'روش‌های تماس'),
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'mail',
          label: L('Icon', 'آیکون'),
          options: [
            { label: L('Email', 'ایمیل'), value: 'mail' },
            { label: L('Live chat', 'گفتگوی زنده'), value: 'chat' },
            { label: L('Phone', 'تلفن'), value: 'phone' },
            { label: L('Office / map', 'دفتر / نقشه'), value: 'map' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: L('Title', 'عنوان'),
        },
        {
          name: 'subtitle',
          type: 'text',
          label: L('Subtitle', 'زیرعنوان'),
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: L('Value', 'مقدار'),
          admin: {
            description: L(
              'Displayed contact detail (email, phone, address, CTA text)',
              'جزئیات تماس نمایش‌داده‌شده (ایمیل، تلفن، آدرس، متن فراخوان اقدام)',
            ),
          },
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            label: L('Optional link', 'لینک اختیاری'),
            admin: {
              description: L(
                'If set, the value becomes a clickable link (mailto, tel, or URL)',
                'در صورت تنظیم، مقدار به لینک قابل کلیک تبدیل می‌شود (mailto، tel یا URL)',
              ),
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
      label: L('Form heading', 'عنوان فرم'),
      defaultValue: 'Send us a message',
    },
    {
      name: 'formDescription',
      type: 'textarea',
      label: L('Form description', 'توضیحات فرم'),
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: L('Form', 'فرم'),
    },
  ],
}
