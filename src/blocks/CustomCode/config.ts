import type { Block, TextFieldValidation, TextareaFieldValidation } from 'payload'

import { L } from '@/i18n/label'

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

export const CustomCode: Block = {
  slug: 'customCode',
  interfaceName: 'CustomCodeBlock',
  labels: {
    singular: L('Custom Code', 'کد سفارشی'),
    plural: L('Custom Code', 'کد سفارشی'),
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: L('Admin label', 'برچسب ادمین'),
      admin: {
        description: L(
          'Optional note for editors (not shown on the site). Trusted editors only — CSS is page-wide; JS below is scoped to this page/product. Use Globals → Scripts for site-wide scripts.',
          'یادداشت اختیاری برای ویرایشگران (در سایت نمایش داده نمی‌شود). فقط برای ویرایشگران مورد اعتماد — CSS در کل صفحه اعمال می‌شود؛ JS زیر برای همین صفحه/محصول است. برای اسکریپت‌های سراسری از Globals → Scripts استفاده کنید.',
        ),
      },
    },
    {
      name: 'breakoutLayout',
      type: 'checkbox',
      label: L('Break out of site layout', 'خروج از چارچوب سایت'),
      defaultValue: false,
      admin: {
        description: L(
          'When on, HTML spans the full viewport and paints over the site frame (1400px max-width and side borders). Leave off for normal framed content.',
          'در صورت فعال بودن، HTML تمام عرض ویوپورت را می‌گیرد و روی چارچوب سایت (حداکثر عرض ۱۴۰۰ پیکسل و حاشیهٔ کناری) قرار می‌گیرد. برای محتوای معمولی داخل قاب خاموش بگذارید.',
        ),
      },
    },
    {
      name: 'html',
      type: 'textarea',
      label: L('HTML', 'HTML'),
      admin: {
        rows: 12,
        description: L(
          'Optional markup. Leave empty for CSS/JS-only (zero layout space if no HTML). Do not put <script> here — use JS or Scripts below.',
          'مارک‌آپ اختیاری. برای فقط-CSS/JS خالی بگذارید (بدون فضای چیدمان اگر HTML نباشد). تگ <script> اینجا نگذارید — از JS یا Scripts زیر استفاده کنید.',
        ),
      },
    },
    {
      name: 'css',
      type: 'textarea',
      label: L('CSS', 'CSS'),
      admin: {
        rows: 12,
        description: L(
          'Page-wide CSS. May target other block IDs/classes (e.g. #cta .btn). Prefer specific selectors. CSS-only takes no vertical space.',
          'CSS در سطح صفحه. می‌تواند ID/کلاس بلوک‌های دیگر را هدف بگیرد (مثلاً #cta .btn). انتخابگرهای خاص‌تر ترجیح داده شود. فقط-CSS فضای عمودی نمی‌گیرد.',
        ),
      },
    },
    {
      name: 'js',
      type: 'textarea',
      label: L('JS', 'JS'),
      admin: {
        rows: 10,
        description: L(
          'Optional inline snippet for this block. Paste raw JS or a full <script> tag — wrappers are stripped. For multiple or external files, use Scripts below.',
          'اسنیپت اینلاین اختیاری برای این بلوک. JS خام یا تگ کامل <script> بچسبانید — پوشش‌ها حذف می‌شوند. برای چند اسکریپت یا فایل خارجی از Scripts زیر استفاده کنید.',
        ),
      },
    },
    {
      name: 'scripts',
      type: 'array',
      label: L('Scripts', 'اسکریپت‌ها'),
      labels: {
        singular: L('Script', 'اسکریپت'),
        plural: L('Scripts', 'اسکریپت‌ها'),
      },
      admin: {
        initCollapsed: true,
        description: L(
          'Optional page/product-scoped scripts (inline or external). Injected where this block renders via next/script. Globals → Scripts remains for site-wide tags.',
          'اسکریپت‌های اختیاری در سطح صفحه/محصول (اینلاین یا خارجی). در محل رندر این بلوک از طریق next/script تزریق می‌شوند. Globals → Scripts برای تگ‌های سراسری است.',
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
              'Admin label only (e.g. Product widget)',
              'فقط برچسب ادمین (مثلاً ویجت محصول)',
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
              label: L('Paste snippet', 'چسباندن اسنیپت'),
              value: 'inline',
            },
            {
              label: L('External file URL only', 'فقط آدرس فایل خارجی'),
              value: 'external',
            },
          ],
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
              'Only the .js file URL (e.g. https://cdn.example.com/widget.js).',
              'فقط آدرس فایل .js (مثلاً https://cdn.example.com/widget.js).',
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
            rows: 10,
            description: L(
              'Paste JS or HTML with <script> tags. Tags are stripped; src= scripts become external loads.',
              'JS یا HTML با تگ <script> بچسبانید. تگ‌ها حذف می‌شوند؛ اسکریپت‌های src= به بارگذاری خارجی تبدیل می‌شوند.',
            ),
          },
          validate: validateInlineCode,
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
}
