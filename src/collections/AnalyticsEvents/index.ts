import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { L } from '@/i18n/label'

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  labels: {
    singular: L('Analytics Event', 'رویداد تحلیل'),
    plural: L('Analytics', 'تحلیل'),
  },
  admin: {
    group: L('Analytics', 'تحلیل'),
    defaultColumns: ['type', 'path', 'device', 'createdAt'],
    useAsTitle: 'path',
    description: L(
      'First-party pageviews and events. Ingested automatically — do not create manually.',
      'بازدیدها و رویدادهای داخلی. به‌صورت خودکار ثبت می‌شوند — دستی ایجاد نکنید.',
    ),
    components: {
      views: {
        list: {
          Component: '@/components/Analytics/AnalyticsDashboard#AnalyticsDashboard',
        },
      },
    },
  },
  access: {
    // Creates go through the collect endpoint with overrideAccess
    create: () => false,
    delete: authenticated,
    read: authenticated,
    update: () => false,
  },
  indexes: [
    { fields: ['createdAt'] },
    { fields: ['type', 'createdAt'] },
    { fields: ['path', 'createdAt'] },
  ],
  fields: [
    {
      name: 'type',
      type: 'select',
      label: L('Type', 'نوع'),
      required: true,
      options: [
        { label: L('Pageview', 'بازدید صفحه'), value: 'pageview' },
        { label: L('Event', 'رویداد'), value: 'event' },
      ],
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      label: L('Name', 'نام'),
      admin: {
        description: L(
          'Event name when type is event (e.g. form_submit)',
          'نام رویداد وقتی نوع event است (مثلاً form_submit)',
        ),
        condition: (_, siblingData) => siblingData?.type === 'event',
      },
    },
    {
      name: 'path',
      type: 'text',
      label: L('Path', 'مسیر'),
      required: true,
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      label: L('Title', 'عنوان'),
      admin: {
        description: L(
          'Document title at time of pageview (optional)',
          'عنوان سند در زمان بازدید صفحه (اختیاری)',
        ),
      },
    },
    {
      name: 'referrer',
      type: 'text',
      label: L('Referrer', 'ارجاع‌دهنده'),
    },
    {
      name: 'utmSource',
      type: 'text',
      label: L('UTM Source', 'منبع UTM'),
    },
    {
      name: 'utmMedium',
      type: 'text',
      label: L('UTM Medium', 'رسانه UTM'),
    },
    {
      name: 'utmCampaign',
      type: 'text',
      label: L('UTM Campaign', 'کمپین UTM'),
    },
    {
      name: 'device',
      type: 'select',
      label: L('Device', 'دستگاه'),
      options: [
        { label: L('Mobile', 'موبایل'), value: 'mobile' },
        { label: L('Tablet', 'تبلت'), value: 'tablet' },
        { label: L('Desktop', 'دسکتاپ'), value: 'desktop' },
      ],
    },
    {
      name: 'visitorId',
      type: 'text',
      label: L('Visitor ID', 'شناسه بازدیدکننده'),
      index: true,
    },
    {
      name: 'sessionId',
      type: 'text',
      label: L('Session ID', 'شناسه نشست'),
    },
    {
      name: 'meta',
      type: 'json',
      label: L('Meta', 'متا'),
      admin: {
        description: L('Small JSON payload (e.g. formId)', 'داده JSON کوچک (مثلاً formId)'),
      },
    },
  ],
  timestamps: true,
}
