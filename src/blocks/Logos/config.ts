import type { Block } from 'payload'

export const Logos: Block = {
  slug: 'logos',
  interfaceName: 'LogosBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: "Trusted By The World's Best Companies",
      required: true,
    },
  ],
  labels: {
    plural: 'Logo Sections',
    singular: 'Logos',
  },
}
