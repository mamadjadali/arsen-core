import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { L } from '@/i18n/label'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: {
    singular: L('Product Category', 'دسته‌بندی محصول'),
    plural: L('Product Categories', 'دسته‌بندی‌های محصول'),
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
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: L('Title', 'عنوان'),
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: L('Image', 'تصویر'),
      admin: {
        description: L(
          'Cover image for catalog cards (Categories Catalog block).',
          'تصویر کاور کارت‌های کاتالوگ (بلوک کاتالوگ دسته‌بندی‌ها).',
        ),
      },
    },
    slugField({
      position: undefined,
      overrides: (field) => {
        const [checkbox, slug] = field.fields
        if (checkbox?.type === 'checkbox' && checkbox.admin) {
          checkbox.admin.description = L(
            'When enabled, the slug will auto-generate from the title field on save and autosave.',
            'در صورت فعال بودن، نامک هنگام ذخیره و ذخیرهٔ خودکار از عنوان ساخته می‌شود.',
          )
        }
        if (slug?.type === 'text') {
          slug.label = L('Slug', 'نامک')
        }
        return field
      },
    }),
  ],
}
