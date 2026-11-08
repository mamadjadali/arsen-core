import type { Block } from 'payload'

import { L } from '@/i18n/label'

export const Logos: Block = {
  slug: 'logos',
  interfaceName: 'LogosBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: L('Heading', 'عنوان'),
      defaultValue: 'برندهایی که همکاران هر روز با آن‌ها کار می‌کنند',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      label: L('Logo texts', 'متن لوگوها'),
      labels: {
        singular: L('Logo text', 'متن لوگو'),
        plural: L('Logo texts', 'متن لوگوها'),
      },
      admin: {
        description: L(
          'Brand names shown as text (same site font as the heading).',
          'نام برندها به‌صورت متن (همان فونت سایت مثل عنوان).',
        ),
        initCollapsed: false,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: L('Text', 'متن'),
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: L('Logo Sections', 'بخش‌های لوگو'),
    singular: L('Logos', 'لوگوها'),
  },
}
