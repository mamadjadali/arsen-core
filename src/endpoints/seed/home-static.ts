import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'solace',
    announcementBadge: 'نوبت‌دهی',
    announcementText: 'همین امروز پوستتان را به متخصص بسپارید ←',
    heading: 'زیبایی پوست شما\nاز دقت آغاز می‌شود',
    subheading:
      'در کلینیک دکتر مریم رنجبر، تشخیص علمی با نگاه زیبایی‌شناسانه همراه است. از ادمین برای seed محتوا استفاده کنید.',
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'رزرو نوبت',
          url: '/admin',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'مشاهده خدمات',
          url: '#services',
        },
      },
    ],
    mediaLayout: 'phones',
  },
  meta: {
    description:
      'کلینیک تخصصی پوست دکتر مریم رنجبر — تشخیص دقیق، درمان علمی و مراقبت زیبایی.',
    title: 'دکتر مریم رنجبر | متخصص پوست و زیبایی',
  },
  title: 'خانه',
  layout: [
    {
      blockType: 'logos',
      heading: 'همگام با برندهای پیشروی جهانِ پوست',
    },
    {
      blockType: 'features',
      heading: 'هر آنچه پوست شما\nبرای درخشیدن نیاز دارد',
      cards: [
        {
          title: 'تشخیص و درمان بیماری‌های پوست',
          description: 'معاینهٔ دقیق و مسیر درمانی شفاف.',
          variant: 'waveform',
          highlight: false,
        },
        {
          title: 'زیبایی با دقت پزشکی',
          description: 'پروتکل‌های زیبایی برای طراوت طبیعی.',
          variant: 'generator',
          highlight: true,
          promptText: 'طراحی مسیر جوانسازی متناسب با چهرهٔ من',
          statusText: 'در حال تنظیم برنامهٔ مراقبت شخصی…',
        },
        {
          title: 'لیزر و بازسازی پوست',
          description: 'پروتکل‌های روز در محیطی امن و آرام.',
          variant: 'social',
          highlight: false,
        },
      ],
    },
    {
      blockType: 'pricing',
      heading: 'مسیر مراقبت',
      yearlyDiscountLabel: 'پیگیری',
      plans: [
        {
          name: 'مشاورهٔ اولیه',
          description: 'بررسی پوست و نقشهٔ مسیر.',
          priceMonthly: 0,
          priceYearly: 0,
          buttonText: 'رزرو مشاوره',
          buttonVariant: 'outline',
          buttonLink: { type: 'custom', label: 'رزرو مشاوره', url: '/contact' },
          features: [{ name: 'معاینهٔ تخصصی', included: true }],
        },
        {
          name: 'مسیر درمان',
          description: 'برنامهٔ چندجلسه‌ای تخصصی.',
          priceMonthly: 0,
          priceYearly: 0,
          buttonText: 'شروع درمان',
          buttonVariant: 'primary',
          isPopular: true,
          hasShadow: true,
          shadowStyle: 'primary',
          buttonLink: { type: 'custom', label: 'شروع درمان', url: '/contact' },
          features: [{ name: 'پروتکل شخصی', included: true }],
        },
        {
          name: 'مراقبت ممتاز',
          description: 'نگهداری نتیجه در بلندمدت.',
          priceMonthly: 0,
          priceYearly: 0,
          buttonText: 'گفتگو با کلینیک',
          buttonVariant: 'dark',
          hasShadow: true,
          shadowStyle: 'dark',
          buttonLink: { type: 'custom', label: 'گفتگو با کلینیک', url: '/contact' },
          features: [{ name: 'چکاپ دوره‌ای', included: true }],
        },
      ],
    },
    {
      blockType: 'solaceCta',
      heading: 'پوست شما شایستهٔ بهترین مراقبت است',
      appleUrl: '/contact',
      googleUrl: '/contact',
    },
  ],
}
