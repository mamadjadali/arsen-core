/** Persian labels for AI presets (Settings fields + assist dialog). */
export const PRESET_FA: Record<string, { label: string; description: string }> = {
  makeLonger: {
    label: 'طولانی‌تر کردن',
    description: 'با جزئیات مفید گسترش دهید و در موضوع بمانید.',
  },
  makeShorter: {
    label: 'کوتاه‌تر کردن',
    description: 'متن را فشرده کنید؛ تکرار را حذف کنید.',
  },
  improveClarity: {
    label: 'بهبود وضوح',
    description: 'جملات واضح‌تر و خواندن روان‌تر.',
  },
  fixGrammar: {
    label: 'اصلاح دستور زبان',
    description: 'اصلاح دستور زبان، املا و نشانه‌گذاری.',
  },
  moreProfessional: {
    label: 'حرفه‌ای‌تر',
    description: 'لحن بالینی و قابل اعتماد.',
  },
  moreCasual: {
    label: 'صمیمی‌تر',
    description: 'لحن دوستانه و نزدیک.',
  },
  reshapeStructure: {
    label: 'بازآرایی ساختار',
    description: 'بهبود عنوان‌ها و جریان بخش‌ها (مارک‌داون مجاز).',
  },
  seoTitleOptimize: {
    label: 'بهینه‌سازی عنوان سئو',
    description: 'عنوان متای قوی‌تر (حدود ۵۰–۶۰ کاراکتر).',
  },
  seoTitleFromContent: {
    label: 'عنوان از محتوا',
    description: 'تولید عنوان متا از بدنه / عنوان پست.',
  },
  seoDescOptimize: {
    label: 'بهینه‌سازی توضیحات سئو',
    description: 'توضیحات متای قوی‌تر (حدود ۱۴۰–۱۶۰ کاراکتر).',
  },
  seoDescFromContent: {
    label: 'توضیحات از محتوا',
    description: 'تولید توضیحات متا از بدنه پست.',
  },
  seoDescShorter: {
    label: 'کوتاه کردن توضیحات سئو',
    description: 'کوتاه کردن به یک توضیحات متای مختصر.',
  },
}

export function localizePreset(
  id: string,
  fallback: { label: string; description: string },
  lang: string | undefined,
): { label: string; description: string } {
  const fa = PRESET_FA[id]
  const isFa = (lang || 'fa').toLowerCase().startsWith('fa')
  if (!isFa || !fa) return fallback
  return { label: fa.label, description: fa.description }
}
