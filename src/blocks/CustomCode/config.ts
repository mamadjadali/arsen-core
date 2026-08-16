import type { Block } from 'payload'

import { L } from '@/i18n/label'

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
          'Optional note for editors (not shown on the site). Trusted editors only — CSS is page-wide; use Globals → Scripts for JavaScript.',
          'یادداشت اختیاری برای ویرایشگران (در سایت نمایش داده نمی‌شود). فقط برای ویرایشگران مورد اعتماد — CSS در کل صفحه اعمال می‌شود؛ برای JavaScript از Globals → Scripts استفاده کنید.',
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
          'Optional markup. Leave empty for CSS-only (zero layout space). Do not include <script> — use Globals → Scripts.',
          'مارک‌آپ اختیاری. برای فقط-CSS خالی بگذارید (بدون فضای چیدمان). تگ <script> قرار ندهید — از Globals → Scripts استفاده کنید.',
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
  ],
}
