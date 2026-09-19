import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'
import { L } from '@/i18n/label'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<
  LinkAppearances,
  { label: { en: string; fa: string }; value: string }
> = {
  default: {
    label: L('Default', 'پیش‌فرض'),
    value: 'default',
  },
  outline: {
    label: L('Outline', 'حاشیه‌دار'),
    value: 'outline',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  /** When true, label/url/reference are not required (empty link is omitted in UI). */
  optional?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({
  appearances,
  disableLabel = false,
  optional = false,
  overrides = {},
} = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    label: L('Link', 'لینک'),
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            label: L('Type', 'نوع'),
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: L('Internal link', 'لینک داخلی'),
                value: 'reference',
              },
              {
                label: L('Custom URL', 'آدرس سفارشی'),
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: L('Open in new tab', 'باز شدن در تب جدید'),
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: L('Document to link to', 'سند مقصد'),
      relationTo: ['pages', 'posts'],
      required: !optional,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: L('Custom URL', 'آدرس سفارشی'),
      required: !optional,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: L('Label', 'برچسب'),
          required: !optional,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      label: L('Appearance', 'ظاهر'),
      admin: {
        description: L(
          'Choose how the link should be rendered.',
          'نحوه نمایش لینک را انتخاب کنید.',
        ),
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
