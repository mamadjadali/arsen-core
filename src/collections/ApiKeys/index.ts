import type { Access, CollectionConfig } from 'payload'

import { L } from '@/i18n/label'

/** Admin Users only — API-key identities cannot manage keys. */
const usersOnly: Access = ({ req: { user } }) =>
  Boolean(user && (user as { collection?: string }).collection === 'users')

export const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  labels: {
    singular: L('API key', 'کلید API'),
    plural: L('API keys', 'کلیدهای API'),
  },
  admin: {
    group: L('System', 'تنظیمات'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'scopes', 'enabled', 'updatedAt'],
    description: L(
      'Machine keys for /api/v1 catalog endpoints. Copy the generated key once after create.',
      'کلیدهای ماشین برای اندپوینت‌های کاتالوگ /api/v1. پس از ایجاد، کلید تولیدشده را یک‌بار کپی کنید.',
    ),
  },
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true,
  },
  access: {
    admin: () => false,
    create: usersOnly,
    delete: usersOnly,
    read: usersOnly,
    update: usersOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: L('Name', 'نام'),
      required: true,
      admin: {
        description: L('Label shown in Admin (e.g. partner name).', 'برچسب در ادمین (مثلاً نام شریک).'),
      },
    },
    {
      name: 'scopes',
      type: 'select',
      label: L('Scopes', 'محدوده‌ها'),
      hasMany: true,
      defaultValue: ['products', 'bundles'],
      options: [
        { label: L('Products', 'محصولات'), value: 'products' },
        { label: L('Bundles', 'سبدها'), value: 'bundles' },
      ],
      admin: {
        description: L(
          'Which /api/v1 surfaces this key may call. Empty = none.',
          'کدام سطح‌های /api/v1 را این کلید می‌تواند صدا بزند. خالی = هیچ.',
        ),
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: L('Enabled', 'فعال'),
      defaultValue: true,
      admin: {
        description: L('When off, all requests with this key are rejected.', 'در صورت خاموش بودن، همه درخواست‌ها رد می‌شوند.'),
      },
    },
  ],
  timestamps: true,
}
