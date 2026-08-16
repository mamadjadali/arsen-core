import type { Block } from 'payload'

import { L } from '@/i18n/label'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: L('Media', 'رسانه'),
    },
  ],
  labels: {
    plural: L('Media Blocks', 'بلوک‌های رسانه'),
    singular: L('Media Block', 'بلوک رسانه'),
  },
}
