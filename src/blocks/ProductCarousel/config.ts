import type { Block } from 'payload'

import { L } from '@/i18n/label'

export const ProductCarousel: Block = {
  slug: 'productCarousel',
  interfaceName: 'ProductCarouselBlock',
  labels: {
    singular: L('Product Carousel', 'کاروسل محصول'),
    plural: L('Product Carousels', 'کاروسل‌های محصول'),
  },
  fields: [
    {
      name: 'populateBy',
      type: 'select',
      label: L('Populate by', 'پر کردن از'),
      defaultValue: 'collection',
      options: [
        { label: L('Collection', 'مجموعه'), value: 'collection' },
        { label: L('Individual selection', 'انتخاب دستی'), value: 'selection' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      label: L('Categories', 'دسته‌بندی‌ها'),
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
    },
    {
      name: 'brands',
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
      label: L('Brands', 'برندها'),
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: L('Limit', 'تعداد'),
      defaultValue: 10,
      min: 1,
      max: 24,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: L('Selection', 'انتخاب'),
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
    },
  ],
}
