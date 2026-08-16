import type { Block } from 'payload'

import { L } from '@/i18n/label'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      label: L('Language', 'زبان'),
      options: [
        {
          label: L('Typescript', 'تایپ‌اسکریپت'),
          value: 'typescript',
        },
        {
          label: L('Javascript', 'جاوااسکریپت'),
          value: 'javascript',
        },
        {
          label: L('CSS', 'سی‌اس‌اس'),
          value: 'css',
        },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
  ],
  labels: {
    plural: L('Code Blocks', 'بلوک‌های کد'),
    singular: L('Code', 'کد'),
  },
}
