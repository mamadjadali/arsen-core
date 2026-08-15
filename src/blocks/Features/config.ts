import type { Block } from 'payload'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      defaultValue: 'Everything You Need To\nMake Music Your Way',
      admin: {
        description: 'Use a new line for a line break',
      },
    },
    {
      name: 'cards',
      type: 'array',
      maxRows: 3,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          required: true,
          defaultValue: 'waveform',
          options: [
            { label: 'Waveform', value: 'waveform' },
            { label: 'Generator', value: 'generator' },
            { label: 'Social', value: 'social' },
          ],
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          label: 'Highlight card (primary border)',
        },
        {
          name: 'promptText',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.variant === 'generator',
          },
        },
        {
          name: 'statusText',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.variant === 'generator',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Features',
    singular: 'Features',
  },
}
