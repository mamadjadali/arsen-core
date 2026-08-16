import type { Block } from 'payload'

import { L } from '@/i18n/label'

export const SolaceCta: Block = {
  slug: 'solaceCta',
  interfaceName: 'SolaceCtaBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: L('Heading', 'عنوان'),
      defaultValue: 'The #1 AI Music App',
    },
    {
      name: 'appleUrl',
      type: 'text',
      label: L('Apple App Store URL', 'آدرس اپ‌استور اپل'),
      defaultValue: '#',
    },
    {
      name: 'googleUrl',
      type: 'text',
      label: L('Google Play Store URL', 'آدرس گوگل‌پلی'),
      defaultValue: '#',
    },
  ],
  labels: {
    plural: L('Solace CTAs', 'فراخوان‌های اقدام سولس'),
    singular: L('Solace CTA', 'فراخوان اقدام سولس'),
  },
}
