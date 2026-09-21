import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { L } from '@/i18n/label'

export const ContactMethods: CollectionConfig = {
  slug: 'contact-methods',
  labels: {
    singular: L('Contact method', 'روش تماس'),
    plural: L('Contact methods', 'روش‌های تماس'),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: L('Catalog', 'کاتالوگ'),
    useAsTitle: 'label',
    defaultColumns: ['label', 'type', 'enabled', 'sort', 'updatedAt'],
    description: L(
      'Channels shown in the product inquiry dialog (phone, WhatsApp, etc.).',
      'کانال‌های نمایش‌داده‌شده در دیالوگ استعلام محصول (تلفن، واتساپ و غیره).',
    ),
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: L('Label', 'برچسب'),
      admin: {
        description: L('e.g. Phone, WhatsApp', 'مثلاً تماس تلفنی، واتساپ'),
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'phone',
      label: L('Type', 'نوع'),
      options: [
        { label: L('Phone', 'تلفن'), value: 'phone' },
        { label: L('WhatsApp', 'واتساپ'), value: 'whatsapp' },
        { label: L('Telegram', 'تلگرام'), value: 'telegram' },
        { label: L('Instagram', 'اینستاگرام'), value: 'instagram' },
        { label: L('Email', 'ایمیل'), value: 'email' },
        { label: L('Custom URL', 'آدرس سفارشی'), value: 'url' },
      ],
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      label: L('Value', 'مقدار'),
      admin: {
        description: L(
          'Phone number, @username, email, or full https:// URL.',
          'شماره تلفن، @نام‌کاربری، ایمیل، یا آدرس کامل https://.',
        ),
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: L('Enabled', 'فعال'),
      defaultValue: true,
    },
    {
      name: 'sort',
      type: 'number',
      label: L('Sort', 'ترتیب'),
      defaultValue: 0,
      admin: {
        description: L('Lower numbers appear first.', 'عدد کمتر زودتر نمایش داده می‌شود.'),
      },
    },
  ],
}
