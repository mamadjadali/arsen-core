import type { GlobalConfig } from 'payload'

import { L } from '@/i18n/label'
import { revalidateTheme } from './hooks/revalidateTheme'

const hexColorValidate = (value: unknown) => {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'string' || !/^#([0-9A-Fa-f]{6})$/.test(value)) {
    return 'Enter a 6-digit hex color like #F97C00'
  }
  return true
}

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: L('Theme', 'پوسته'),
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'preset',
      type: 'select',
      label: L('Design preset', 'پیش‌تنظیم طراحی'),
      defaultValue: 'solace',
      required: true,
      options: [
        { label: L('Solace (square / white)', 'سولس (مربعی / سفید)'), value: 'solace' },
        { label: L('Zapier (12px / cream)', 'زاپیر (۱۲ پیکسل / کرم)'), value: 'zapier' },
      ],
      admin: {
        description: L(
          'Base brand system. Color / radius / font fields below override the preset when set.',
          'سیستم پایه برند. فیلدهای رنگ / شعاع / فونت زیر در صورت تنظیم، پیش‌تنظیم را نادیده می‌گیرند.',
        ),
      },
    },
    {
      name: 'colorScheme',
      type: 'select',
      label: L('Light / dark', 'روشن / تیره'),
      options: [
        { label: L('Light', 'روشن'), value: 'light' },
        { label: L('Dark', 'تیره'), value: 'dark' },
      ],
      admin: {
        description: L(
          'Leave empty to use the preset. Controls site light/dark (not the operating system).',
          'برای استفاده از پیش‌تنظیم خالی بگذارید. حالت روشن/تیره سایت را کنترل می‌کند (نه سیستم‌عامل).',
        ),
      },
    },
    {
      name: 'orange',
      type: 'text',
      label: L('Primary', 'اصلی'),
      admin: {
        description: L(
          'Optional primary override (hex). Leave empty to use the preset primary.',
          'جایگزینی اختیاری رنگ اصلی (هگز). برای استفاده از پیش‌تنظیم خالی بگذارید.',
        ),
      },
      validate: hexColorValidate,
    },
    {
      name: 'black',
      type: 'text',
      label: L('Ink', 'جوهر'),
      admin: {
        description: L(
          'Optional text color (hex). Drives headings and muted/body text site-wide. Leave empty to use the preset (or auto light text on a dark site background).',
          'رنگ متن اختیاری (هگز). روی عنوان‌ها و متن کم‌رنگ/بدنه در کل سایت اعمال می‌شود. برای پیش‌تنظیم خالی بگذارید (یا متن روشن خودکار روی پس‌زمینه تیره).',
        ),
      },
      validate: hexColorValidate,
    },
    {
      name: 'canvas',
      type: 'text',
      label: L('Site background', 'پس‌زمینه سایت'),
      admin: {
        description: L(
          'Optional page background (hex). Dark values auto-switch text to light when Ink is empty. Leave empty to use the preset.',
          'پس‌زمینه اختیاری صفحه (هگز). مقادیر تیره در صورت خالی بودن جوهر، متن را خودکار روشن می‌کنند. برای پیش‌تنظیم خالی بگذارید.',
        ),
      },
      validate: hexColorValidate,
    },
    {
      name: 'radiusMd',
      type: 'number',
      label: L('Corner radius (px)', 'شعاع گوشه (پیکسل)'),
      min: 0,
      max: 24,
      admin: {
        description: L(
          'Button/card corner radius in px (0 = Solace square, 12 = Zapier). Leave empty for preset.',
          'شعاع گوشه دکمه/کارت به پیکسل (۰ = سولس مربعی، ۱۲ = زاپیر). برای پیش‌تنظیم خالی بگذارید.',
        ),
        step: 1,
      },
    },
    {
      name: 'font',
      type: 'select',
      label: L('Font', 'فونت'),
      defaultValue: 'yekanBakh',
      required: true,
      options: [
        { label: L('Yekan Bakh', 'یکان بخ'), value: 'yekanBakh' },
        { label: L('Parnian', 'پرنیان'), value: 'parnian' },
        { label: L('IRANSharp', 'ایران‌شارپ'), value: 'iranSharp' },
        { label: L('Ahang', 'آهنگ'), value: 'ahang' },
        { label: L('Anjoman Max', 'انجمن مکس'), value: 'anjoman' },
        { label: L('Dana', 'دانا'), value: 'dana' },
        { label: L('Farhang 2', 'فرهنگ ۲'), value: 'farhang' },
      ],
      admin: {
        description: L(
          'Primary site typeface (Persian). Overrides preset font when set.',
          'فونت اصلی سایت (فارسی). در صورت تنظیم، فونت پیش‌تنظیم را نادیده می‌گیرد.',
        ),
      },
    },
  ],
  hooks: {
    afterChange: [revalidateTheme],
  },
}
