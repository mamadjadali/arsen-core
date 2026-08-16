import { Field } from 'payload'

import { L } from '@/i18n/label'

export const searchFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    label: L('Slug', 'نامک'),
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'meta',
    label: L('Meta', 'متا'),
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: L('Title', 'عنوان'),
      },
      {
        type: 'text',
        name: 'description',
        label: L('Description', 'توضیحات'),
      },
      {
        name: 'image',
        label: L('Image', 'تصویر'),
        type: 'upload',
        relationTo: 'media',
      },
    ],
  },
  {
    label: L('Categories', 'دسته‌بندی‌ها'),
    name: 'categories',
    type: 'array',
    labels: {
      singular: L('Category', 'دسته‌بندی'),
      plural: L('Categories', 'دسته‌بندی‌ها'),
    },
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'relationTo',
        type: 'text',
        label: L('Relation to', 'مرتبط با'),
      },
      {
        name: 'categoryID',
        type: 'text',
        label: L('Category ID', 'شناسه دسته'),
      },
      {
        name: 'title',
        type: 'text',
        label: L('Title', 'عنوان'),
      },
    ],
  },
]
