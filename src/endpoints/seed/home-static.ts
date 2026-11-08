import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'carousel',
    loop: true,
    autoplay: true,
    autoplayDelay: 5000,
    fade: false,
    showArrows: true,
    showPagination: true,
    slides: [],
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'مشاهده سبدهای زنده',
          url: '/bundles',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'کاتالوگ محصولات',
          url: '/products',
        },
      },
    ],
  },
  meta: {
    description:
      'پنل همکار و سبد زنده برای فروش B2B نیمه‌آفلاین — قیمت همکاری و تحویل حضوری یا ارسال سریع.',
    title: 'همکار | سبد زنده و خرید عمده',
  },
  title: 'خانه',
  layout: [
    {
      blockType: 'logos',
      heading: 'برندهایی که همکاران هر روز با آن‌ها کار می‌کنند',
      items: [
        { label: 'Samsung' },
        { label: 'Xiaomi' },
        { label: 'Apple' },
        { label: 'Realme' },
        { label: 'Honor' },
        { label: 'Huawei' },
      ],
    },
    // iconGrid needs Media uploads — omitted here; full seed (home.ts) attaches images.
    {
      blockType: 'features',
      heading: 'هر قابلیت، برای یک نتیجه واقعی\nدر کسب‌وکار شما',
      cards: [
        {
          title: 'سبد زنده همکار',
          description: 'میکس مدل، رنگ، تعداد و قیمت واحد — شفاف و به‌روز.',
          variant: 'waveform',
          highlight: false,
        },
        {
          title: 'فروش نیمه‌آفلاین',
          description: 'آنلاین انتخاب کنید؛ حضوری یا با ارسال همکار تحویل بگیرید.',
          variant: 'generator',
          highlight: true,
          promptText: 'سبد امروز را برای فروشگاه من آماده کن',
          statusText: 'در حال هم‌ترازی موجودی و قیمت همکاری…',
        },
        {
          title: 'حاشیه سود و سرعت',
          description: 'قیمت همکاری، باندل سودآور و دسترسی زودتر به موجودی.',
          variant: 'social',
          highlight: false,
        },
      ],
    },
    {
      blockType: 'categoriesCatalog',
      eyebrow: 'کاتالوگ همکار',
      heading: 'هر دسته،',
      headingAccent: 'یک مسیر تأمین',
      description:
        'گروه‌های کالایی را یک‌جا ببینید. برای موجودی و قیمت همکاری با فروش تماس بگیرید.',
      showIndex: true,
      indexLabel: 'دسته',
      toolbarLabel: 'همه دسته‌بندی‌ها',
      cardCtaLabel: 'مشاهده محصولات',
    },
    {
      blockType: 'pricing',
      heading: 'سطح همکاری',
      yearlyDiscountLabel: 'پیگیری',
      plans: [
        {
          name: 'مشاهده سبد',
          description: 'سبدهای زنده و کاتالوگ برای تصمیم سریع.',
          priceMonthly: 0,
          priceYearly: 0,
          buttonText: 'باز کردن سبدها',
          buttonVariant: 'outline',
          buttonLink: { type: 'custom', label: 'باز کردن سبدها', url: '/bundles' },
          features: [{ name: 'فهرست سبدهای زنده', included: true }],
        },
        {
          name: 'همکار فعال',
          description: 'قیمت همکاری و تحویل نیمه‌آفلاین.',
          priceMonthly: 0,
          priceYearly: 0,
          buttonText: 'تماس با فروش',
          buttonVariant: 'primary',
          isPopular: true,
          hasShadow: true,
          shadowStyle: 'primary',
          buttonLink: { type: 'custom', label: 'تماس با فروش', url: '/contact' },
          features: [{ name: 'قیمت و باندل همکاری', included: true }],
        },
        {
          name: 'همکار ممتاز',
          description: 'موجودی زودتر و شرایط اعتباری منعطف‌تر.',
          priceMonthly: 0,
          priceYearly: 0,
          buttonText: 'درخواست همکاری',
          buttonVariant: 'dark',
          hasShadow: true,
          shadowStyle: 'dark',
          buttonLink: { type: 'custom', label: 'درخواست همکاری', url: '/contact' },
          features: [{ name: 'دسترسی زودتر به موجودی خاص', included: true }],
        },
      ],
    },
    {
      blockType: 'solaceCta',
      heading: 'سبد زنده؛ خرید عمده بدون پیچیدگی',
      appleUrl: '/bundles',
      googleUrl: '/contact',
    },
  ],
}
