import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { availabilityFieldBase } from '@/fields/availability'
import { L } from '@/i18n/label'

export const Variants: CollectionConfig = {
  slug: 'variants',
  labels: {
    singular: L('Variant', 'گونه'),
    plural: L('Variants', 'گونه‌ها'),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: L('Catalog', 'کاتالوگ'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'sku', 'product', 'availability', 'updatedAt'],
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
      label: L('Product', 'محصول'),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: L('Title', 'عنوان'),
      required: true,
      admin: {
        description: L(
          'Display name, e.g. “50ml / Blue”.',
          'نام نمایشی، مثلاً «۵۰ میلی‌لیتر / آبی».',
        ),
      },
    },
    {
      name: 'sku',
      type: 'text',
      label: L('SKU', 'کد کالا'),
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'options',
      type: 'array',
      label: L('Options', 'گزینه‌ها'),
      labels: {
        singular: L('Option', 'گزینه'),
        plural: L('Options', 'گزینه‌ها'),
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: L('Name', 'نام'),
          required: true,
          admin: {
            description: L('e.g. Size, Color', 'مثلاً سایز، رنگ'),
          },
        },
        {
          name: 'value',
          type: 'text',
          label: L('Value', 'مقدار'),
          required: true,
          admin: {
            description: L('e.g. 50ml, Blue', 'مثلاً ۵۰ میلی‌لیتر، آبی'),
          },
        },
        {
          name: 'hex',
          type: 'text',
          label: L('Swatch hex', 'هگز نمونه'),
          admin: {
            description: L(
              'Optional. For Color options, used as a PLP swatch (e.g. #C4A574).',
              'اختیاری. برای گزینهٔ رنگ، به‌عنوان نمونه‌رنگ در فهرست (مثلاً #C4A574).',
            ),
            condition: (_, siblingData) => {
              const name = typeof siblingData?.name === 'string' ? siblingData.name : ''
              return /رنگ|color|colour/i.test(name)
            },
          },
          validate: (value: unknown) => {
            if (value === null || value === undefined || value === '') return true
            if (typeof value !== 'string' || !/^#([0-9A-Fa-f]{6})$/.test(value.trim())) {
              return 'Enter a 6-digit hex color like #C4A574'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: L('Image', 'تصویر'),
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: L('Price', 'قیمت'),
          min: 0,
          admin: {
            description: L(
              'Optional. Falls back to product price when empty.',
              'اختیاری. در صورت خالی بودن، قیمت محصول استفاده می‌شود.',
            ),
            width: '50%',
          },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          label: L('Compare-at price', 'قیمت مقایسه‌ای'),
          min: 0,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      ...availabilityFieldBase,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: L('Sort order', 'ترتیب نمایش'),
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: L('Lower numbers appear first.', 'اعداد کوچک‌تر زودتر نمایش داده می‌شوند.'),
      },
    },
  ],
}
