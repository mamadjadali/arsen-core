import type { Block } from 'payload'

import { L } from '@/i18n/label'

export const IconGrid: Block = {
  slug: 'iconGrid',
  interfaceName: 'IconGridBlock',
  labels: {
    singular: L('Icon grid', 'شبکه آیکون'),
    plural: L('Icon grids', 'شبکه‌های آیکون'),
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: L('Heading', 'عنوان'),
      admin: {
        description: L('Optional section title above the grid.', 'عنوان اختیاری بالای شبکه.'),
      },
    },
    {
      name: 'items',
      type: 'array',
      label: L('Items', 'اقلام'),
      labels: {
        singular: L('Item', 'قلم'),
        plural: L('Items', 'اقلام'),
      },
      minRows: 1,
      maxRows: 6,
      admin: {
        description: L(
          'Up to 6 image tiles with a caption. Desktop: 6 columns · Mobile: 3 columns.',
          'حداکثر ۶ کاشی تصویر با زیرنویس. دسکتاپ: ۶ ستون · موبایل: ۳ ستون.',
        ),
        initCollapsed: false,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: L('Image', 'تصویر'),
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: L('Caption', 'زیرنویس'),
        },
        {
          name: 'href',
          type: 'text',
          label: L('Link URL', 'آدرس لینک'),
          admin: {
            description: L('Optional. Makes the tile clickable.', 'اختیاری. کاشی را قابل کلیک می‌کند.'),
          },
        },
      ],
    },
  ],
}
