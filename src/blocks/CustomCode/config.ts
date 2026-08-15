import type { Block } from 'payload'

export const CustomCode: Block = {
  slug: 'customCode',
  interfaceName: 'CustomCodeBlock',
  labels: {
    singular: 'Custom Code',
    plural: 'Custom Code',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Admin label',
      admin: {
        description:
          'Optional note for editors (not shown on the site). Trusted editors only — CSS is page-wide; use Globals → Scripts for JavaScript.',
      },
    },
    {
      name: 'html',
      type: 'textarea',
      label: 'HTML',
      admin: {
        rows: 12,
        description:
          'Optional markup. Leave empty for CSS-only (zero layout space). Do not include <script> — use Globals → Scripts.',
      },
    },
    {
      name: 'css',
      type: 'textarea',
      label: 'CSS',
      admin: {
        rows: 12,
        description:
          'Page-wide CSS. May target other block IDs/classes (e.g. #cta .btn). Prefer specific selectors. CSS-only takes no vertical space.',
      },
    },
  ],
}
