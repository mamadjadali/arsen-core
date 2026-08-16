import type { Block } from 'payload'

import { L } from '@/i18n/label'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      label: L('Heading', 'عنوان'),
      defaultValue: 'Everything You Need To\nMake Music Your Way',
      admin: {
        description: L('Use a new line for a line break', 'برای شکستن خط، خط جدید بزنید'),
      },
    },
    {
      name: 'cards',
      type: 'array',
      maxRows: 3,
      minRows: 1,
      label: L('Cards', 'کارت‌ها'),
      labels: {
        singular: L('Card', 'کارت'),
        plural: L('Cards', 'کارت‌ها'),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: L('Title', 'عنوان'),
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: L('Description', 'توضیحات'),
        },
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'waveform',
          label: L('Variant', 'گونه'),
          options: [
            { label: L('Waveform', 'موج‌صدا'), value: 'waveform' },
            { label: L('Generator', 'مولد'), value: 'generator' },
            { label: L('Social', 'اجتماعی'), value: 'social' },
          ],
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          label: L('Highlight card (primary border)', 'برجسته‌سازی کارت (حاشیه اصلی)'),
        },
        {
          name: 'promptText',
          type: 'text',
          label: L('Prompt Text', 'متن درخواست'),
          admin: {
            condition: (_, siblingData) => siblingData?.variant === 'generator',
          },
        },
        {
          name: 'statusText',
          type: 'text',
          label: L('Status Text', 'متن وضعیت'),
          admin: {
            condition: (_, siblingData) => siblingData?.variant === 'generator',
          },
        },
      ],
    },
  ],
  labels: {
    plural: L('Features', 'ویژگی‌ها'),
    singular: L('Features', 'ویژگی‌ها'),
  },
}
