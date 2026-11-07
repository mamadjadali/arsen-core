import type { Access, CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { L } from '@/i18n/label'
import { revalidateLiveBundle, revalidateLiveBundleDelete } from './hooks/revalidateLiveBundle'
import { syncLiveBundleLines } from './hooks/syncLines'

const readLiveOrAuthenticated: Access = ({ req: { user } }) => {
  if (user && (user as { collection?: string }).collection === 'users') return true
  return {
    status: {
      equals: 'live',
    },
  }
}

export const LiveBundles: CollectionConfig = {
  slug: 'live-bundles',
  labels: {
    singular: L('Live bundle', 'سبد زنده'),
    plural: L('Live bundles', 'سبدهای زنده'),
  },
  admin: {
    group: L('Catalog', 'کاتالوگ'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'slug', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: readLiveOrAuthenticated,
    update: authenticated,
  },
  indexes: [{ fields: ['status', 'slug'] }, { fields: ['lines.lineId'] }],
  fields: [
    {
      name: 'name',
      type: 'text',
      label: L('Name', 'نام'),
      required: true,
      admin: {
        description: L('Internal title for editors.', 'عنوان داخلی برای ویرایشگران.'),
      },
    },
    {
      name: 'status',
      type: 'select',
      label: L('Status', 'وضعیت'),
      required: true,
      defaultValue: 'draft',
      options: [
        { label: L('Draft', 'پیش‌نویس'), value: 'draft' },
        { label: L('Live', 'زنده'), value: 'live' },
        { label: L('Archived', 'بایگانی'), value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: L('Published at', 'تاریخ انتشار'),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: L(
          'Set automatically when status becomes Live if empty.',
          'اگر خالی باشد هنگام زنده شدن به‌صورت خودکار تنظیم می‌شود.',
        ),
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: L('Notes', 'یادداشت'),
      admin: {
        description: L('Optional buyer-facing note on the public page.', 'یادداشت اختیاری خریدار در صفحه عمومی.'),
      },
    },
    {
      name: 'brandLogos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: L('Brand logos', 'لوگوهای برند'),
      validate: (value) => {
        if (Array.isArray(value) && value.length > 4) {
          return 'Maximum 4 brand logos'
        }
        return true
      },
      admin: {
        description: L(
          'Up to 4 logos shown on the public bundle page.',
          'حداکثر ۴ لوگو در صفحه عمومی سبد.',
        ),
      },
    },
    {
      name: 'lines',
      type: 'array',
      label: L('Lines', 'اقلام'),
      labels: {
        singular: L('Line', 'قلم'),
        plural: L('Lines', 'اقلام'),
      },
      admin: {
        initCollapsed: false,
        description: L(
          'Buyer-facing lines. Match products via productId (API-first) or product picker.',
          'اقلام خریدار. تطبیق محصول با productId (اولویت API) یا انتخابگر محصول.',
        ),
      },
      fields: [
        {
          name: 'lineId',
          type: 'text',
          label: L('Line ID', 'شناسه قلم'),
          admin: {
            readOnly: true,
            description: L(
              'Stable row id for API patches. Auto-generated on save if empty.',
              'شناسه پایدار برای پچ API. در صورت خالی بودن هنگام ذخیره ساخته می‌شود.',
            ),
          },
        },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: L('Product', 'محصول'),
          admin: {
            description: L(
              'Admin picker. Synced with productId on save.',
              'انتخابگر ادمین. هنگام ذخیره با productId همگام می‌شود.',
            ),
          },
        },
        {
          name: 'productId',
          type: 'text',
          label: L('Product ID', 'شناسه محصول'),
          index: true,
          validate: (value: unknown, { siblingData }: { siblingData: { product?: unknown } }) => {
            const hasProduct = Boolean(siblingData?.product)
            const hasId = typeof value === 'string' && value.trim().length > 0
            if (!hasId && !hasProduct) {
              return 'Set productId or select a product'
            }
            return true
          },
          admin: {
            description: L(
              'Match key into products.productId (API-first). Filled from product on save if empty.',
              'کلید تطبیق با products.productId (اولویت API). اگر خالی باشد از محصول پر می‌شود.',
            ),
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'colorName',
              type: 'text',
              label: L('Color', 'رنگ'),
              admin: {
                width: '50%',
                description: L(
                  'Must match a product colors[].name, or Mix.',
                  'باید با colors[].name محصول یکی باشد، یا Mix.',
                ),
              },
            },
            {
              name: 'quantity',
              type: 'number',
              label: L('Quantity', 'تعداد'),
              required: true,
              min: 1,
              defaultValue: 1,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'mixColorNames',
          type: 'json',
          label: L('Mix color names', 'رنگ‌های Mix'),
          admin: {
            condition: (_, siblingData) =>
              typeof siblingData?.colorName === 'string' &&
              siblingData.colorName.trim().toLowerCase() === 'mix',
            description: L(
              'When color is Mix, list of selected variant color names.',
              'وقتی رنگ Mix است، فهرست نام رنگ‌های انتخاب‌شده.',
            ),
          },
        },
        {
          name: 'quantityAsOptional',
          type: 'checkbox',
          label: L('Quantity as optional', 'تعداد انتخابی'),
          defaultValue: false,
          admin: {
            description: L(
              'When enabled, show «انتخابی» instead of a quantity.',
              'در صورت فعال بودن، به‌جای تعداد «انتخابی» نمایش داده می‌شود.',
            ),
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'unitPriceToman',
              type: 'number',
              label: L('Unit price (Toman)', 'قیمت واحد (تومان)'),
              min: 0,
              defaultValue: 0,
              admin: { width: '50%' },
            },
            {
              name: 'priceAsCall',
              type: 'checkbox',
              label: L('Price as Call', 'قیمت Call'),
              defaultValue: false,
              admin: {
                width: '50%',
                description: L(
                  'When enabled, show Call instead of a unit price.',
                  'در صورت فعال بودن، به‌جای قیمت واحد Call نمایش داده می‌شود.',
                ),
              },
            },
          ],
        },
      ],
    },
    slugField({
      fieldToUse: 'name',
      overrides: (field) => {
        const [checkbox, slug] = field.fields
        if (checkbox?.type === 'checkbox' && checkbox.admin) {
          checkbox.admin.description = L(
            'When enabled, the slug will auto-generate from the name field on save and autosave.',
            'در صورت فعال بودن، نامک هنگام ذخیره و ذخیرهٔ خودکار از نام ساخته می‌شود.',
          )
        }
        if (slug?.type === 'text') {
          slug.label = L('Slug', 'نامک')
        }
        return field
      },
    }),
  ],
  hooks: {
    beforeChange: [syncLiveBundleLines],
    afterChange: [revalidateLiveBundle],
    afterDelete: [revalidateLiveBundleDelete],
  },
}
