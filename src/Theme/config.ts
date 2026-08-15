import type { GlobalConfig } from 'payload'

import { revalidateTheme } from './hooks/revalidateTheme'

const hexColorValidate = (value: unknown) => {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'string' || !/^#([0-9A-Fa-f]{6})$/.test(value)) {
    return 'Enter a 6-digit hex color like #F97C00'
  }
  return true
}

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Theme',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'preset',
      type: 'select',
      label: 'Design preset',
      defaultValue: 'solace',
      required: true,
      options: [
        { label: 'Solace (square / white)', value: 'solace' },
        { label: 'Zapier (12px / cream)', value: 'zapier' },
      ],
      admin: {
        description: 'Base brand system. Color / radius / font fields below override the preset when set.',
      },
    },
    {
      name: 'colorScheme',
      type: 'select',
      label: 'Light / dark',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      admin: {
        description:
          'Leave empty to use the preset. Controls site light/dark (not the operating system).',
      },
    },
    {
      name: 'orange',
      type: 'text',
      label: 'Primary',
      admin: {
        description: 'Optional primary override (hex). Leave empty to use the preset primary.',
      },
      validate: hexColorValidate,
    },
    {
      name: 'black',
      type: 'text',
      label: 'Ink',
      admin: {
        description: 'Optional ink / dark-text override (hex). Leave empty to use the preset ink.',
      },
      validate: hexColorValidate,
    },
    {
      name: 'canvas',
      type: 'text',
      label: 'Canvas',
      admin: {
        description: 'Optional page background override (hex). Leave empty to use the preset canvas.',
      },
      validate: hexColorValidate,
    },
    {
      name: 'radiusMd',
      type: 'number',
      label: 'Corner radius (px)',
      min: 0,
      max: 24,
      admin: {
        description: 'Button/card corner radius in px (0 = Solace square, 12 = Zapier). Leave empty for preset.',
        step: 1,
      },
    },
    {
      name: 'font',
      type: 'select',
      label: 'Font',
      defaultValue: 'yekanBakh',
      required: true,
      options: [
        { label: 'Yekan Bakh', value: 'yekanBakh' },
        { label: 'Parnian', value: 'parnian' },
        { label: 'IRANSharp', value: 'iranSharp' },
        { label: 'Ahang', value: 'ahang' },
        { label: 'Anjoman Max', value: 'anjoman' },
        { label: 'Dana', value: 'dana' },
        { label: 'Farhang 2', value: 'farhang' },
      ],
      admin: {
        description: 'Primary site typeface (Persian). Overrides preset font when set.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateTheme],
  },
}
