import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { L } from '@/i18n/label'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: L('User', 'کاربر'),
    plural: L('Users', 'کاربران'),
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: L('Name', 'نام'),
    },
  ],
  timestamps: true,
}
