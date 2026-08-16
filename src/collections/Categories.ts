import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { L } from '@/i18n/label'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: L('Category', 'دسته‌بندی'),
    plural: L('Categories', 'دسته‌بندی‌ها'),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: L('Content', 'محتوا'),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: L('Title', 'عنوان'),
      required: true,
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
