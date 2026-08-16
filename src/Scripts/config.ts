import type { GlobalConfig, TextFieldValidation, TextareaFieldValidation } from 'payload'

import { L } from '@/i18n/label'
import { revalidateScripts } from './hooks/revalidateScripts'

const isSafeScriptSrcValidate = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    return 'Enter an external script URL'
  }

  const trimmed = value.trim()
  const lower = trimmed.toLowerCase()

  if (lower.startsWith('javascript:') || lower.startsWith('data:')) {
    return 'Unsafe script URL'
  }

  if (
    !(
      lower.startsWith('https://') ||
      lower.startsWith('http://') ||
      lower.startsWith('//') ||
      trimmed.startsWith('/')
    )
  ) {
    return 'URL must start with https://, http://, //, or /'
  }

  return true
}

const validateExternalSrc: TextFieldValidation = (value, { siblingData } = {} as never) => {
  const kind = (siblingData as { kind?: string } | undefined)?.kind
  if (kind !== 'external') return true
  return isSafeScriptSrcValidate(value)
}

const validateInlineCode: TextareaFieldValidation = (value, { siblingData } = {} as never) => {
  const kind = (siblingData as { kind?: string } | undefined)?.kind
  if (kind !== 'inline') return true
  if (typeof value !== 'string' || !value.trim()) {
    return 'Paste a script snippet'
  }
  return true
}

export const Scripts: GlobalConfig = {
  slug: 'scripts',
  label: L('Scripts', 'اسکریپت‌ها'),
  access: {
    read: () => true,
  },
  admin: {
    description: L(
      'Site-wide custom scripts (analytics, pixels). Only add trusted sources — injected on every frontend page.',
      'اسکریپت‌های سفارشی سراسری (تحلیل، پیکسل). فقط منابع معتبر اضافه کنید — در هر صفحه فرانت‌اند تزریق می‌شوند.',
    ),
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: L('Scripts', 'اسکریپت‌ها'),
      labels: {
        singular: L('Script', 'اسکریپت'),
        plural: L('Scripts', 'اسکریپت‌ها'),
      },
      admin: {
        initCollapsed: true,
        description: L(
          'Enabled scripts are injected into the public site via next/script.',
          'اسکریپت‌های فعال از طریق next/script در سایت عمومی تزریق می‌شوند.',
        ),
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: L('Name', 'نام'),
          required: true,
          admin: {
            description: L(
              'Admin label only (e.g. Google Analytics)',
              'فقط برچسب ادمین (مثلاً Google Analytics)',
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
          name: 'kind',
          type: 'select',
          label: L('Type', 'نوع'),
          required: true,
          defaultValue: 'inline',
          options: [
            {
              label: L(
                'Paste snippet (Google Analytics / GTM)',
                'چسباندن اسنیپت (Google Analytics / GTM)',
              ),
              value: 'inline',
            },
            {
              label: L('External file URL only', 'فقط آدرس فایل خارجی'),
              value: 'external',
            },
          ],
          admin: {
            description: L(
              'Paste the full vendor snippet (including <script> tags). Tags are stripped so they are not double-wrapped.',
              'اسنیپت کامل فروشنده را بچسبانید (شامل تگ‌های <script>). تگ‌ها حذف می‌شوند تا دوبار پیچیده نشوند.',
            ),
          },
        },
        {
          name: 'src',
          type: 'text',
          label: L('External file URL', 'آدرس فایل خارجی'),
          admin: {
            condition: (_data, siblingData) =>
              Boolean(
                siblingData &&
                  typeof siblingData === 'object' &&
                  'kind' in siblingData &&
                  siblingData.kind === 'external',
              ),
            description: L(
              'Only the .js file URL (e.g. https://www.googletagmanager.com/gtag/js?id=G-XXXX). Prefer “Paste snippet” for full GA HTML.',
              'فقط آدرس فایل .js (مثلاً https://www.googletagmanager.com/gtag/js?id=G-XXXX). برای HTML کامل GA گزینه «چسباندن اسنیپت» را ترجیح دهید.',
            ),
          },
          validate: validateExternalSrc,
        },
        {
          name: 'code',
          type: 'textarea',
          label: L('Snippet', 'اسنیپت'),
          admin: {
            condition: (_data, siblingData) =>
              Boolean(
                siblingData &&
                  typeof siblingData === 'object' &&
                  'kind' in siblingData &&
                  siblingData.kind === 'inline',
              ),
            rows: 12,
            description: L(
              'Paste Google Analytics / Tag Manager HTML as-is. Opening/closing <script> tags are removed automatically; src= scripts become external loads.',
              'HTML گوگل آنالیتیکس / تگ منیجر را همان‌طور بچسبانید. تگ‌های باز/بسته <script> خودکار حذف می‌شوند؛ اسکریپت‌های src= به بارگذاری خارجی تبدیل می‌شوند.',
            ),
          },
          validate: validateInlineCode,
        },
        {
          name: 'placement',
          type: 'select',
          label: L('Placement', 'محل قرارگیری'),
          required: true,
          defaultValue: 'body',
          options: [
            { label: L('Head', 'هد'), value: 'head' },
            { label: L('Body (end)', 'بدنه (پایان)'), value: 'body' },
          ],
        },
        {
          name: 'strategy',
          type: 'select',
          label: L('Load strategy', 'استراتژی بارگذاری'),
          defaultValue: 'afterInteractive',
          options: [
            { label: L('After interactive', 'بعد از تعاملی شدن'), value: 'afterInteractive' },
            { label: L('Lazy on load', 'تنبل هنگام بارگذاری'), value: 'lazyOnload' },
            { label: L('Before interactive', 'قبل از تعاملی شدن'), value: 'beforeInteractive' },
          ],
          admin: {
            condition: (_data, siblingData) =>
              Boolean(
                siblingData &&
                  typeof siblingData === 'object' &&
                  'kind' in siblingData &&
                  siblingData.kind === 'external',
              ),
            description: L(
              'Next.js Script strategy (external scripts only).',
              'استراتژی Script در Next.js (فقط اسکریپت‌های خارجی).',
            ),
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateScripts],
  },
}
