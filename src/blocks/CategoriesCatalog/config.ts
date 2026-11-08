import type { Block } from 'payload'

import { L } from '@/i18n/label'

export const CategoriesCatalog: Block = {
  slug: 'categoriesCatalog',
  interfaceName: 'CategoriesCatalogBlock',
  labels: {
    singular: L('Categories Catalog', 'کاتالوگ دسته‌بندی‌ها'),
    plural: L('Categories Catalog', 'کاتالوگ دسته‌بندی‌ها'),
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: L('Eyebrow', 'سرتیتر کوچک'),
      defaultValue: 'کاتالوگ همکار',
    },
    {
      name: 'heading',
      type: 'text',
      label: L('Heading', 'عنوان'),
      defaultValue: 'هر دسته،',
    },
    {
      name: 'headingAccent',
      type: 'text',
      label: L('Heading accent', 'عنوان تأکیدی'),
      defaultValue: 'یک مسیر تأمین',
      admin: {
        description: L(
          'Shown as the highlighted second line under the heading.',
          'به‌عنوان خط دوم برجسته زیر عنوان نمایش داده می‌شود.',
        ),
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: L('Description', 'توضیحات'),
      defaultValue:
        'گروه‌های کالایی را یک‌جا ببینید. برای موجودی لحظه‌ای، رنگ‌بندی و قیمت همکاری با فروش تماس بگیرید یا سبد زنده همان روز را باز کنید.',
    },
    {
      name: 'showIndex',
      type: 'checkbox',
      label: L('Show category count index', 'نمایش شمارنده دسته‌ها'),
      defaultValue: true,
    },
    {
      name: 'indexLabel',
      type: 'text',
      label: L('Index label', 'برچسب شمارنده'),
      defaultValue: 'دسته',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showIndex),
      },
    },
    {
      name: 'toolbarLabel',
      type: 'text',
      label: L('Toolbar label', 'برچسب نوار ابزار'),
      defaultValue: 'همه دسته‌بندی‌ها',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      label: L('Categories', 'دسته‌بندی‌ها'),
      admin: {
        description: L(
          'Optional. Leave empty to show all product categories. Order is display order. Card image and title come from each category.',
          'اختیاری. خالی بگذارید تا همه دسته‌ها نمایش داده شوند. ترتیب همان ترتیب نمایش است. تصویر و عنوان از خود دسته می‌آید.',
        ),
      },
    },
    {
      name: 'cardCtaLabel',
      type: 'text',
      label: L('Card CTA label', 'برچسب فراخوان کارت'),
      defaultValue: 'مشاهده محصولات',
    },
  ],
}
