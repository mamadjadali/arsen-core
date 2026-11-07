import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { CallToAction } from '../../blocks/CallToAction/config'
import { CategoriesCatalog } from '../../blocks/CategoriesCatalog/config'
import { Content } from '../../blocks/Content/config'
import { CustomCode } from '../../blocks/CustomCode/config'
import { Features } from '../../blocks/Features/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { ProductCarousel } from '../../blocks/ProductCarousel/config'
import { SolaceCta } from '../../blocks/SolaceCta/config'
import { availabilityFieldBase } from '@/fields/availability'
import { L } from '@/i18n/label'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { deriveSwatchesFromColors, normalizeProductMatchFields } from './hooks/matchSurface'
import { revalidateDelete, revalidateProduct } from './hooks/revalidateProduct'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  labels: {
    singular: L('Product', 'محصول'),
    plural: L('Products', 'محصولات'),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    summary: true,
    featuredImage: true,
    imageUrl: true,
    brand: true,
    categories: true,
    price: true,
    compareAtPrice: true,
    currencyLabel: true,
    availability: true,
    productId: true,
    printName: true,
    active: true,
    colors: true,
    meta: {
      image: true,
      description: true,
    },
  },
  indexes: [{ fields: ['active', 'productId'] }],
  admin: {
    group: L('Catalog', 'کاتالوگ'),
    defaultColumns: ['title', 'productId', 'brand', 'active', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: L('Title', 'عنوان'),
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: L('Details', 'جزئیات'),
          fields: [
            {
              name: 'summary',
              type: 'textarea',
              label: L('Summary', 'خلاصه'),
              admin: {
                description: L(
                  'Short blurb for listing cards.',
                  'متن کوتاه برای کارت‌های فهرست.',
                ),
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: L('Description', 'توضیحات'),
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
            {
              name: 'specs',
              type: 'array',
              label: L('Specifications', 'مشخصات'),
              labels: {
                singular: L('Spec', 'مشخصه'),
                plural: L('Specifications', 'مشخصات'),
              },
              admin: {
                description: L(
                  'Optional attribute rows shown as a specs table on the product page (e.g. material, width).',
                  'ردیف‌های اختیاری ویژگی‌ها که به‌صورت جدول مشخصات در صفحه محصول نمایش داده می‌شوند (مثلاً جنس، عرض).',
                ),
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: L('Label', 'برچسب'),
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  label: L('Value', 'مقدار'),
                  required: true,
                },
              ],
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: L('Featured image', 'تصویر اصلی'),
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: L('Gallery', 'گالری'),
            },
          ],
        },
        {
          label: L('Taxonomy', 'رده‌بندی'),
          fields: [
            {
              name: 'brand',
              type: 'relationship',
              relationTo: 'brands',
              label: L('Brand', 'برند'),
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'product-categories',
              hasMany: true,
              label: L('Categories', 'دسته‌بندی‌ها'),
            },
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: L('Related products', 'محصولات مرتبط'),
              filterOptions: ({ id }) => ({
                id: {
                  not_in: [id],
                },
              }),
            },
          ],
        },
        {
          label: L('Layout', 'چیدمان'),
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: L('Layout', 'چیدمان'),
              blocks: [
                Content,
                MediaBlock,
                CallToAction,
                CustomCode,
                CategoriesCatalog,
                Features,
                FormBlock,
                SolaceCta,
                ProductCarousel,
              ],
              admin: {
                initCollapsed: true,
                description: L(
                  'Optional blocks below the product hero (gallery and details).',
                  'بلوک‌های اختیاری زیر هیرو محصول (گالری و جزئیات).',
                ),
              },
            },
          ],
        },
        {
          label: L('Commerce display', 'نمایش تجاری'),
          fields: [
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
                      'Optional display price. Leave empty to hide price on the site.',
                      'قیمت نمایشی اختیاری. خالی بگذارید تا قیمت در سایت نشان داده نشود.',
                    ),
                    width: '33%',
                  },
                },
                {
                  name: 'compareAtPrice',
                  type: 'number',
                  label: L('Compare-at price', 'قیمت مقایسه‌ای'),
                  min: 0,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'currencyLabel',
                  type: 'text',
                  label: L('Currency label', 'برچسب ارز'),
                  defaultValue: 'تومان',
                  admin: {
                    width: '33%',
                    description: L(
                      'Shown next to price when a price is set.',
                      'کنار قیمت نمایش داده می‌شود وقتی قیمت تنظیم شده باشد.',
                    ),
                  },
                },
              ],
            },
            availabilityFieldBase,
            {
              name: 'badge',
              type: 'text',
              label: L('Badge', 'نشان'),
              admin: {
                description: L(
                  'Optional tag on the main gallery image (e.g. پرفروش). Leave empty to hide.',
                  'برچسب اختیاری روی تصویر اصلی گالری (مثلاً پرفروش). برای مخفی بودن خالی بگذارید.',
                ),
              },
            },
            {
              name: 'colorSwatches',
              type: 'array',
              label: L('Color swatches', 'نمونه‌رنگ‌ها'),
              labels: {
                singular: L('Swatch', 'رنگ'),
                plural: L('Swatches', 'رنگ‌ها'),
              },
              admin: {
                description: L(
                  'Shown under the product card on the listing page. Use hex colors like #C4A574.',
                  'زیر کارت محصول در فهرست نمایش داده می‌شود. رنگ هگز مانند #C4A574 وارد کنید.',
                ),
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: L('Label', 'برچسب'),
                },
                {
                  name: 'hex',
                  type: 'text',
                  label: L('Hex', 'هگز'),
                  required: true,
                  validate: (value: unknown) => {
                    if (value === null || value === undefined || value === '') {
                      return 'Enter a hex color like #C4A574'
                    }
                    if (typeof value !== 'string' || !/^#([0-9A-Fa-f]{6})$/.test(value.trim())) {
                      return 'Enter a 6-digit hex color like #C4A574'
                    }
                    return true
                  },
                },
              ],
            },
            {
              name: 'hidePrice',
              type: 'checkbox',
              label: L('Hide price', 'مخفی کردن قیمت'),
              defaultValue: false,
              admin: {
                description: L(
                  'When enabled, numeric price is hidden and the call-for-price hint is shown instead.',
                  'در صورت فعال بودن، قیمت عددی مخفی می‌شود و راهنمای تماس برای قیمت نمایش داده می‌شود.',
                ),
              },
            },
            {
              name: 'priceHint',
              type: 'text',
              label: L('Price hint', 'راهنمای قیمت'),
              admin: {
                description: L(
                  'Shown next to availability when price is empty or hidden. Default: برای قیمت روز تماس بگیرید',
                  'کنار موجودی وقتی قیمت خالی یا مخفی است نمایش داده می‌شود. پیش‌فرض: برای قیمت روز تماس بگیرید',
                ),
              },
            },
            {
              name: 'inquiryPhoneOverride',
              type: 'text',
              label: L('Inquiry phone override', 'تلفن استعلام (جایگزین)'),
              admin: {
                description: L(
                  'Optional. Overrides Settings → Product inquiry phone for this product only.',
                  'اختیاری. فقط برای این محصول، تلفن استعلام تنظیمات را جایگزین می‌کند.',
                ),
              },
            },
          ],
        },
        {
          label: L('Match / sync', 'تطبیق / همگام‌سازی'),
          fields: [
            {
              name: 'printName',
              type: 'text',
              label: L('Print name', 'نام چاپ'),
              admin: {
                description: L(
                  'Optional buyer-facing override (live bundles / print). Title stays the canonical name.',
                  'نام جایگزین برای خریدار (سبد زنده / چاپ). عنوان همان نام اصلی می‌ماند.',
                ),
              },
            },
            {
              name: 'imageUrl',
              type: 'text',
              label: L('Image URL', 'آدرس تصویر'),
              admin: {
                description: L(
                  'Preferred for API/storefront. When set, overrides the featured image upload.',
                  'ترجیحی برای API و ویترین. در صورت پر بودن، تصویر آپلودشده را نادیده می‌گیرد.',
                ),
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'brandKey',
                  type: 'text',
                  label: L('Brand key', 'کلید برند'),
                  admin: {
                    width: '50%',
                    description: L(
                      'External brand id or label (e.g. Mobile140). Separate from storefront Brand relation.',
                      'شناسه یا برچسب خارجی برند (مثلاً موبایل۱۴۰). جدا از رابطه برند ویترین.',
                    ),
                  },
                },
                {
                  name: 'categoryKey',
                  type: 'text',
                  label: L('Category key', 'کلید دسته'),
                  admin: {
                    width: '50%',
                    description: L(
                      'External category id or label. Separate from storefront Categories.',
                      'شناسه یا برچسب خارجی دسته. جدا از دسته‌بندی‌های ویترین.',
                    ),
                  },
                },
              ],
            },
            {
              name: 'colors',
              type: 'array',
              label: L('Colors (match)', 'رنگ‌ها (تطبیق)'),
              labels: {
                singular: L('Color', 'رنگ'),
                plural: L('Colors', 'رنگ‌ها'),
              },
              admin: {
                description: L(
                  'Match-surface variants for live bundles. colorName on a bundle line must match name here (or Mix).',
                  'گونه‌های سطح تطبیق برای سبد زنده. colorName در خط سبد باید با name اینجا یکی باشد (یا Mix).',
                ),
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: L('Name', 'نام'),
                  required: true,
                  admin: {
                    description: L('e.g. مشکی — pairs with bundle colorName', 'مثلاً مشکی — متناظر با colorName سبد'),
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'sku',
                      type: 'text',
                      label: L('SKU', 'کد کالا'),
                      index: true,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'gtin',
                      type: 'text',
                      label: L('GTIN', 'GTIN'),
                      admin: { width: '33%' },
                    },
                    {
                      name: 'variantId',
                      type: 'text',
                      label: L('Variant ID', 'شناسه ورینت'),
                      index: true,
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'b2bPrice',
                      type: 'number',
                      label: L('B2B price', 'قیمت B2B'),
                      min: 0,
                      admin: {
                        width: '50%',
                        description: L(
                          'Optional default partner unit price seed.',
                          'قیمت واحد همکار پیش‌فرض (اختیاری).',
                        ),
                      },
                    },
                    {
                      name: 'remains',
                      type: 'number',
                      label: L('Remains', 'موجودی'),
                      admin: {
                        width: '50%',
                        description: L('Stock hint for live site.', 'راهنمای موجودی برای سایت زنده.'),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: L('SEO', 'سئو'),
          fields: [
            {
              name: 'aiAssistSeo',
              type: 'ui',
              label: L('AI SEO Assist', 'دستیار سئو هوش مصنوعی'),
              admin: {
                components: {
                  Field: '@/components/AI/AIAssistSeoField#AIAssistSeoField',
                },
              },
            },
            {
              name: 'meta',
              type: 'group',
              label: false,
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                }),
                MetaImageField({
                  relationTo: 'media',
                }),
                MetaDescriptionField({}),
                PreviewField({
                  hasGenerateFn: true,
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                }),
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'productId',
      type: 'text',
      label: L('Product ID', 'شناسه محصول'),
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: L(
          'Primary match key (Mobile140 / store id). Title is the canonical name for APIs.',
          'کلید اصلی تطبیق (شناسه موبایل۱۴۰ / فروشگاه). عنوان همان نام اصلی برای API است.',
        ),
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: L('Active', 'فعال'),
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: L(
          'When off, hide from live-bundle resolution even if published.',
          'در صورت خاموش بودن، حتی اگر منتشر شده باشد از تطبیق سبد زنده حذف می‌شود.',
        ),
      },
    },
    {
      name: 'variants',
      type: 'join',
      collection: 'variants',
      on: 'product',
      label: L('Variants', 'گونه‌ها'),
      admin: {
        allowCreate: true,
        defaultColumns: ['title', 'sku', 'availability', 'price', 'updatedAt'],
      },
    },
    {
      name: 'sku',
      type: 'text',
      label: L('SKU', 'کد کالا'),
      admin: {
        position: 'sidebar',
        description: L('Optional product-level code.', 'کد اختیاری سطح محصول.'),
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: L('Published At', 'تاریخ انتشار'),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField({
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
  hooks: {
    beforeValidate: [normalizeProductMatchFields],
    beforeChange: [deriveSwatchesFromColors],
    afterChange: [revalidateProduct],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
