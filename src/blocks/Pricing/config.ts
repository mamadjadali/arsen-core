import type { Block } from 'payload'

import { link } from '@/fields/link'

export const Pricing: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Pricing',
    },
    {
      name: 'yearlyDiscountLabel',
      type: 'text',
      defaultValue: 'Yearly ( 20% Off )',
    },
    {
      name: 'plans',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'priceMonthly',
          type: 'number',
          required: true,
          defaultValue: 0,
        },
        {
          name: 'priceYearly',
          type: 'number',
          required: true,
          defaultValue: 0,
          admin: {
            description: 'Per-month price when billed yearly',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          required: true,
          defaultValue: 'Subscribe',
        },
        link({
          appearances: false,
          overrides: {
            name: 'buttonLink',
            label: 'Button Link',
          },
        }),
        {
          name: 'buttonVariant',
          type: 'select',
          defaultValue: 'outline',
          options: [
            { label: 'Outline', value: 'outline' },
            { label: 'Primary', value: 'primary' },
            { label: 'Dark', value: 'dark' },
          ],
        },
        {
          name: 'isPopular',
          type: 'checkbox',
          defaultValue: false,
          label: 'Most Popular',
        },
        {
          name: 'hasShadow',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'shadowStyle',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Dark', value: 'dark' },
          ],
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.hasShadow),
          },
        },
        {
          name: 'features',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'included',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Pricing Sections',
    singular: 'Pricing',
  },
}
