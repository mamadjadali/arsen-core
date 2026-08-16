import type { Block } from 'payload'

import { link } from '@/fields/link'
import { L } from '@/i18n/label'

export const Pricing: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: L('Heading', 'عنوان'),
      defaultValue: 'Pricing',
    },
    {
      name: 'yearlyDiscountLabel',
      type: 'text',
      label: L('Yearly Discount Label', 'برچسب تخفیف سالانه'),
      defaultValue: 'Yearly ( 20% Off )',
    },
    {
      name: 'plans',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      label: L('Plans', 'طرح‌ها'),
      labels: {
        singular: L('Plan', 'طرح'),
        plural: L('Plans', 'طرح‌ها'),
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: L('Name', 'نام'),
        },
        {
          name: 'description',
          type: 'textarea',
          label: L('Description', 'توضیحات'),
        },
        {
          name: 'priceMonthly',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: L('Monthly Price', 'قیمت ماهانه'),
        },
        {
          name: 'priceYearly',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: L('Yearly Price', 'قیمت سالانه'),
          admin: {
            description: L(
              'Per-month price when billed yearly',
              'قیمت ماهانه هنگام صورتحساب سالانه',
            ),
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          required: true,
          defaultValue: 'Subscribe',
          label: L('Button Text', 'متن دکمه'),
        },
        link({
          appearances: false,
          overrides: {
            name: 'buttonLink',
            label: L('Button Link', 'لینک دکمه'),
          },
        }),
        {
          name: 'buttonVariant',
          type: 'select',
          defaultValue: 'outline',
          label: L('Button Variant', 'گونه دکمه'),
          options: [
            { label: L('Outline', 'حاشیه‌دار'), value: 'outline' },
            { label: L('Primary', 'اصلی'), value: 'primary' },
            { label: L('Dark', 'تیره'), value: 'dark' },
          ],
        },
        {
          name: 'isPopular',
          type: 'checkbox',
          defaultValue: false,
          label: L('Most Popular', 'محبوب‌ترین'),
        },
        {
          name: 'hasShadow',
          type: 'checkbox',
          defaultValue: false,
          label: L('Has Shadow', 'دارای سایه'),
        },
        {
          name: 'shadowStyle',
          type: 'select',
          defaultValue: 'primary',
          label: L('Shadow Style', 'سبک سایه'),
          options: [
            { label: L('Primary', 'اصلی'), value: 'primary' },
            { label: L('Dark', 'تیره'), value: 'dark' },
          ],
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.hasShadow),
          },
        },
        {
          name: 'features',
          type: 'array',
          label: L('Features', 'ویژگی‌ها'),
          labels: {
            singular: L('Feature', 'ویژگی'),
            plural: L('Features', 'ویژگی‌ها'),
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: L('Name', 'نام'),
            },
            {
              name: 'included',
              type: 'checkbox',
              defaultValue: true,
              label: L('Included', 'شامل'),
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: L('Pricing Sections', 'بخش‌های قیمت‌گذاری'),
    singular: L('Pricing', 'قیمت‌گذاری'),
  },
}
