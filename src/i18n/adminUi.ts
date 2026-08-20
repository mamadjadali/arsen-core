import { L } from './label'

/** Resolve a bilingual string for the current admin language. */
export function tLabel(
  lang: string | undefined,
  pair: { en: string; fa: string } | ReturnType<typeof L>,
): string {
  const code = (lang || 'fa').toLowerCase()
  if (code.startsWith('fa')) return pair.fa
  return pair.en
}

export function isFa(lang: string | undefined): boolean {
  return (lang || 'fa').toLowerCase().startsWith('fa')
}

/** Western digits → Persian digits */
export function toFaDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!)
}

export const adminUi = {
  welcomeTitle: L('Welcome to your dashboard!', 'به داشبورد خوش آمدید!'),
  welcomeBody: L(
    'This is where site admins will log in to manage your website.',
    'اینجا مدیران سایت برای مدیریت وب‌سایت وارد می‌شوند.',
  ),
  analytics: L('Analytics', 'تحلیل'),
  today: L('Today', 'امروز'),
  days7: L('7 days', '۷ روز'),
  days30: L('30 days', '۳۰ روز'),
  pageviews: L('Pageviews', 'بازدید صفحات'),
  uniqueVisitors: L('Unique visitors', 'بازدیدکنندگان یکتا'),
  formSubmits: L('Form submits', 'ارسال فرم'),
  avgPerDay: L('Avg / day', 'میانگین روزانه'),
  viewsToday: L('Views today', 'بازدید امروز'),
  views7d: L('Views (7d)', 'بازدید (۷ روز)'),
  uniques7d: L('Uniques (7d)', 'یکتا (۷ روز)'),
  forms7d: L('Form submits (7d)', 'ارسال فرم (۷ روز)'),
  topPages: L('Top pages', 'صفحات پربازدید'),
  topReferrers: L('Top referrers', 'ارجاع‌دهنده‌ها'),
  devices: L('Devices', 'دستگاه‌ها'),
  trafficOverTime: L('Traffic over time', 'ترافیک در گذر زمان'),
  pageviewsLegend: L('Pageviews', 'بازدید'),
  uniquesLegend: L('Uniques', 'یکتا'),
  noDataYet: L('No data yet', 'هنوز داده‌ای نیست'),
  noDeviceData: L('No device data', 'داده دستگاهی نیست'),
  total: L('total', 'مجموع'),
  vsPrior: L('vs prior', 'نسبت به قبل'),
  topPrefix: L('Top:', 'برتر:'),
  mobile: L('mobile', 'موبایل'),
  tablet: L('tablet', 'تبلت'),
  desktop: L('desktop', 'دسکتاپ'),
  last7Days: L('Last 7 days', '۷ روز گذشته'),
  last30Days: L('Last 30 days', '۳۰ روز گذشته'),
  aiAssist: L('AI assist', 'دستیار هوش مصنوعی'),
  generate: L('Generate', 'تولید'),
  apply: L('Apply', 'اعمال'),
  cancel: L('Cancel', 'انصراف'),
  close: L('Close', 'بستن'),
  loading: L('Loading…', 'در حال بارگذاری…'),
  preview: L('Preview', 'پیش‌نمایش'),
  preset: L('Preset', 'پیش‌تنظیم'),
  aiHint: L(
    'Choose an option, preview the result, then apply.',
    'یک پیش‌تنظیم انتخاب کنید، نتیجه را ببینید، سپس اعمال کنید.',
  ),
  aiLoadingPresets: L('Loading options…', 'در حال بارگذاری گزینه‌ها…'),
  aiNoPresets: L('No options are enabled for this field.', 'برای این فیلد گزینه‌ای فعال نیست.'),
  aiRunning: L('Running…', 'در حال اجرا…'),
  aiApplied: L('AI result applied', 'نتیجه هوش مصنوعی اعمال شد'),
  aiFailed: L('AI request failed', 'درخواست هوش مصنوعی ناموفق بود'),
  aiNeedText: L(
    'Add some content or a title first.',
    'ابتدا کمی محتوا یا عنوان وارد کنید.',
  ),
  aiContentTitle: L('AI assist — content', 'دستیار هوش مصنوعی — محتوا'),
  aiSeoTitleModal: L('AI assist — SEO title', 'دستیار هوش مصنوعی — عنوان سئو'),
  aiSeoDescModal: L('AI assist — SEO description', 'دستیار هوش مصنوعی — توضیحات سئو'),
} as const

/** KPI delta pill text, localized (Persian digits + phrasing). */
export function formatDeltaPill(
  delta: number | null | undefined,
  lang?: string,
): string | null {
  if (delta == null || Number.isNaN(delta) || !Number.isFinite(delta)) return null
  const rounded = Math.round(delta)
  const fa = isFa(lang)
  const abs = Math.abs(rounded)
  const pct = fa ? toFaDigits(abs) : String(abs)
  const vs = tLabel(lang, adminUi.vsPrior)

  if (rounded === 0) {
    return fa ? `${toFaDigits(0)}٪ ${vs}` : `0% ${vs}`
  }

  const arrow = rounded > 0 ? '↑' : '↓'
  return fa ? `${arrow} ${pct}٪ ${vs}` : `${arrow} ${pct}% ${vs}`
}
