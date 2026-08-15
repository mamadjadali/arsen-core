import type { Block } from 'payload'

export const SolaceCta: Block = {
  slug: 'solaceCta',
  interfaceName: 'SolaceCtaBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'The #1 AI Music App',
    },
    {
      name: 'appleUrl',
      type: 'text',
      label: 'Apple App Store URL',
      defaultValue: '#',
    },
    {
      name: 'googleUrl',
      type: 'text',
      label: 'Google Play Store URL',
      defaultValue: '#',
    },
  ],
  labels: {
    plural: 'Solace CTAs',
    singular: 'Solace CTA',
  },
}
