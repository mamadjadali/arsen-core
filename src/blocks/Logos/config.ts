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
      defaultValue: "Trusted By The World's Best Companies",
      required: true,
    },
  ],
  labels: {
    plural: L('Logo Sections', 'بخش‌های لوگو'),
    singular: L('Logos', 'لوگوها'),
  },
}
