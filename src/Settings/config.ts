import type { FieldAccess, GlobalConfig } from 'payload'

import { L } from '@/i18n/label'
import { buildAiPromptSettingsFields } from './aiPromptFields'
import { revalidateSettings } from './hooks/revalidateSettings'

const authenticatedFieldAccess: FieldAccess = ({ req: { user } }) => Boolean(user)

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: L('Settings', 'تنظیمات'),
  access: {
    read: () => true,
  },
  admin: {
    description: L(
      'Site-wide branding and AI provider configuration.',
      'پیکربندی برندینگ سراسری سایت و ارائه‌دهنده هوش مصنوعی.',
    ),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: L('Branding', 'برندینگ'),
          fields: [
            {
              type: 'group',
              label: L('Site', 'سایت'),
              fields: [
                {
                  name: 'logoLight',
                  type: 'upload',
                  relationTo: 'media',
                  label: L('Logo (light)', 'لوگو (روشن)'),
                  admin: {
                    description: L(
                      'Site wordmark for light backgrounds. Used when Header/Footer logo is empty.',
                      'نشان‌واژه سایت برای پس‌زمینه‌های روشن. وقتی لوگوی هدر/فوتر خالی باشد استفاده می‌شود.',
                    ),
                  },
                },
                {
                  name: 'faviconIco',
                  type: 'upload',
                  relationTo: 'media',
                  label: L('Favicon (.ico)', 'فاویکون (.ico)'),
                  admin: {
                    description: L(
                      'Classic favicon (.ico or 32×32).',
                      'فاویکون کلاسیک (.ico یا ۳۲×۳۲).',
                    ),
                  },
                },
                {
                  name: 'faviconSvg',
                  type: 'upload',
                  relationTo: 'media',
                  label: L('Favicon (SVG)', 'فاویکون (SVG)'),
                  admin: {
                    description: L(
                      'Scalable SVG favicon (preferred in modern browsers).',
                      'فاویکون SVG مقیاس‌پذیر (ترجیح در مرورگرهای مدرن).',
                    ),
                  },
                },
                {
                  name: 'favicon32',
                  type: 'upload',
                  relationTo: 'media',
                  label: L('Favicon 32×32', 'فاویکون ۳۲×۳۲'),
                  admin: {
                    description: L('PNG 32×32 favicon.', 'فاویکون PNG ۳۲×۳۲.'),
                  },
                },
                {
                  name: 'appleTouchIcon',
                  type: 'upload',
                  relationTo: 'media',
                  label: L('Apple touch icon', 'آیکون لمسی اپل'),
                  admin: {
                    description: L(
                      'PNG ~180×180 for iOS home screen.',
                      'PNG حدود ۱۸۰×۱۸۰ برای صفحه اصلی iOS.',
                    ),
                  },
                },
              ],
            },
            {
              type: 'group',
              label: L('Admin panel', 'پنل ادمین'),
              fields: [
                {
                  name: 'adminLogoLight',
                  type: 'upload',
                  relationTo: 'media',
                  label: L('Logo (light)', 'لوگو (روشن)'),
                  admin: {
                    description: L(
                      'Login / expanded nav logo for light admin UI.',
                      'لوگوی ورود / ناوبری باز برای رابط روشن ادمین.',
                    ),
                  },
                },
                {
                  name: 'adminLogoDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: L('Logo (dark)', 'لوگو (تیره)'),
                  admin: {
                    description: L(
                      'Login / expanded nav logo for dark admin UI.',
                      'لوگوی ورود / ناوبری باز برای رابط تیره ادمین.',
                    ),
                  },
                },
                {
                  name: 'adminIcon',
                  type: 'upload',
                  relationTo: 'media',
                  label: L('Icon', 'آیکون'),
                  admin: {
                    description: L(
                      'Collapsed nav / small mark (square).',
                      'ناوبری جمع‌شده / نشان کوچک (مربعی).',
                    ),
                  },
                },
              ],
            },
          ],
        },
        {
          label: L('AI', 'هوش مصنوعی'),
          description: L(
            'OpenAI-compatible provider for admin AI assist (Posts content & SEO).',
            'ارائه‌دهنده سازگار با OpenAI برای کمک هوش مصنوعی ادمین (محتوا و سئوی پست‌ها).',
          ),
          fields: [
            {
              name: 'aiEnabled',
              type: 'checkbox',
              label: L('Enable AI features', 'فعال‌سازی قابلیت‌های هوش مصنوعی'),
              defaultValue: false,
              admin: {
                description: L(
                  'When off, AI buttons are hidden and the transform API rejects requests.',
                  'وقتی خاموش باشد، دکمه‌های هوش مصنوعی پنهان می‌شوند و API تبدیل درخواست‌ها را رد می‌کند.',
                ),
              },
            },
            {
              name: 'aiApiBaseUrl',
              type: 'text',
              label: L('API base URL', 'آدرس پایه API'),
              defaultValue: 'https://api.gapapi.com/v1',
              admin: {
                description: L(
                  'OpenAI-compatible API root (no trailing slash). Example: https://api.gapapi.com/v1',
                  'ریشه API سازگار با OpenAI (بدون اسلش پایانی). مثال: https://api.gapapi.com/v1',
                ),
              },
            },
            {
              name: 'aiApiKey',
              type: 'text',
              label: L('API key', 'کلید API'),
              access: {
                read: authenticatedFieldAccess,
                update: authenticatedFieldAccess,
              },
              admin: {
                description: L(
                  'Stored server-side only. Never exposed to the public site or unauthenticated API.',
                  'فقط سمت سرور ذخیره می‌شود. هرگز در سایت عمومی یا API بدون احراز هویت افشا نمی‌شود.',
                ),
              },
            },
            {
              name: 'aiModel',
              type: 'text',
              label: L('Model', 'مدل'),
              defaultValue: 'gpt-4o-mini',
              admin: {
                description: L(
                  'Chat model id, e.g. gpt-4o-mini',
                  'شناسه مدل چت، مثلاً gpt-4o-mini',
                ),
              },
            },
            ...buildAiPromptSettingsFields(authenticatedFieldAccess),
          ],
        },
        {
          label: L('Analytics', 'تحلیل'),
          description: L(
            'First-party mini analytics (pageviews and form events).',
            'تحلیل داخلی کوچک (بازدید صفحات و رویدادهای فرم).',
          ),
          fields: [
            {
              name: 'analyticsEnabled',
              type: 'checkbox',
              label: L('Enable analytics', 'فعال‌سازی تحلیل'),
              defaultValue: true,
              admin: {
                description: L(
                  'When off, the tracker and collect endpoint ignore events. Existing data is kept.',
                  'وقتی خاموش باشد، ردیاب و اندپوینت جمع‌آوری رویدادها را نادیده می‌گیرند. داده موجود حفظ می‌شود.',
                ),
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSettings],
  },
}
