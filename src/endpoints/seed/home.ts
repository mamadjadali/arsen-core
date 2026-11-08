import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  phoneLeft: Media
  phoneCenter: Media
  phoneRight: Media
  metaImage: Media
  heroImage: Media
}

const text = (value: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text: value,
  version: 1 as const,
})

const heading = (value: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading' as const,
  children: [text(value)],
  direction: 'rtl' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1 as const,
})

const paragraph = (value: string) => ({
  type: 'paragraph' as const,
  children: [text(value)],
  direction: 'rtl' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1 as const,
})

const richRoot = (...children: ReturnType<typeof heading | typeof paragraph>[]) => ({
  root: {
    type: 'root' as const,
    children,
    direction: 'rtl' as const,
    format: '' as const,
    indent: 0,
    version: 1 as const,
  },
})

/**
 * Homepage narrative: B2B partner sell, semi-offline.
 * Inspired by mobile140.com + /partner-landing — wholesale margin, live baskets,
 * early inventory, and hybrid online→pickup/dispatch fulfillment.
 */
export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  phoneLeft,
  phoneCenter,
  phoneRight,
  metaImage,
  heroImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    title: 'خانه',
    hero: {
      type: 'carousel',
      loop: true,
      autoplay: true,
      autoplayDelay: 5000,
      fade: false,
      showArrows: true,
      showPagination: true,
      slides: [
        {
          image: heroImage.id,
          imageMobile: phoneCenter.id,
          alt: 'سبد زنده همکار — قیمت همکاری و موجودی روز',
          href: '/bundles',
        },
        {
          image: metaImage.id,
          imageMobile: phoneLeft.id,
          alt: 'کاتالوگ محصولات برای فروش نیمه‌آفلاین',
          href: '/products',
        },
        {
          image: phoneRight.id,
          imageMobile: phoneRight.id,
          alt: 'شروع همکاری B2B — تماس با فروش',
          href: '/contact',
        },
      ],
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
    layout: [
      {
        blockName: 'Logos',
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
      {
        blockName: 'Icon Grid',
        blockType: 'iconGrid',
        heading: '',
        items: [
          { image: phoneLeft.id, label: 'کنسول بازی', href: '/products' },
          { image: phoneCenter.id, label: 'فلش و حافظه', href: '/products' },
          { image: phoneRight.id, label: 'لوازم شخصی', href: '/products' },
          { image: metaImage.id, label: 'هدفون و هندزفری', href: '/products' },
          { image: heroImage.id, label: 'کیف و کوله', href: '/products' },
          { image: phoneCenter.id, label: 'گوشی موبایل', href: '/products' },
        ],
      },
      {
        blockName: 'Features',
        blockType: 'features',
        heading: 'هر قابلیت، برای یک نتیجه واقعی\nدر کسب‌وکار شما',
        cards: [
          {
            title: 'سبد زنده همکار',
            description:
              'میکس مدل، رنگ، تعداد و قیمت واحد را یک‌جا ببینید. مثل پیشنهادهای ویژه پنل همکار — شفاف، به‌روز و آماده تصمیم سریع.',
            variant: 'waveform',
            highlight: false,
          },
          {
            title: 'فروش نیمه‌آفلاین',
            description:
              'آنلاین انتخاب و رزرو کنید؛ تحویل را حضوری از انبار/فروشگاه بگیرید یا با اولویت ارسال همکار نهایی کنید. سرعت بازار حضوری + نظم دیجیتال.',
            variant: 'generator',
            highlight: true,
            promptText: 'سبد امروز را برای فروشگاه من آماده کن',
            statusText: 'در حال هم‌ترازی موجودی و قیمت همکاری…',
          },
          {
            title: 'حاشیه سود و سرعت',
            description:
              'قیمت همکاری، باندل‌های سودآور و دسترسی زودتر به موجودی‌های خاص — برای فروش رقابتی‌تر بدون فشار کامل روی نقدینگی.',
            variant: 'social',
            highlight: false,
          },
        ],
      },
      {
        blockName: 'Featured Services',
        blockType: 'featuredServices',
        heading: richRoot(heading('مسیر همکاری B2B', 'h2')),
        description: richRoot(
          paragraph(
            'از مشاهده سبد زنده تا کاتالوگ و تماس فروش — همان منطق پنل همکار، برای فروش نیمه‌آفلاین.',
          ),
        ),
        cta: {
          type: 'custom',
          label: 'شروع از سبدها',
          url: '/bundles',
        },
        services: [
          {
            title: 'سبدهای زنده',
            image: heroImage.id,
            link: { type: 'custom', label: 'سبدهای زنده', url: '/bundles' },
          },
          {
            title: 'کاتالوگ محصولات',
            image: metaImage.id,
            link: { type: 'custom', label: 'کاتالوگ محصولات', url: '/products' },
          },
          {
            title: 'قیمت همکاری',
            image: phoneCenter.id,
            link: { type: 'custom', label: 'قیمت همکاری', url: '/contact' },
          },
          {
            title: 'تحویل نیمه‌آفلاین',
            image: phoneLeft.id,
            link: { type: 'custom', label: 'تحویل نیمه‌آفلاین', url: '/contact' },
          },
          {
            title: 'پشتیبانی فروش',
            image: phoneRight.id,
            link: { type: 'custom', label: 'پشتیبانی فروش', url: '/contact' },
          },
        ],
      },
      {
        blockName: 'Partner Journey',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richRoot(heading('شروع همکاری در سه مرحله', 'h2')),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: richRoot(
              heading('۱. مشاهده سبد', 'h3'),
              paragraph(
                'سبدهای زنده روز را ببینید: مدل، رنگ، تعداد و قیمت واحد. بدون فرآیند پیچیده — تصمیم در چند دقیقه.',
              ),
            ),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: richRoot(
              heading('۲. هماهنگی همکار', 'h3'),
              paragraph(
                'با فروش تماس بگیرید یا از مسیر همکار ادامه دهید تا موجودی، اعتبار و شرایط تحویل تأیید شود.',
              ),
            ),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: richRoot(
              heading('۳. تحویل نیمه‌آفلاین', 'h3'),
              paragraph(
                'سفارش را حضوری از انبار/فروشگاه بردارید یا با اولویت ارسال همکار دریافت کنید — آنلاین انتخاب، آفلاین اجرا.',
              ),
            ),
          },
        ],
      },
      {
        blockName: 'Categories',
        blockType: 'categoriesCatalog',
        eyebrow: 'کاتالوگ همکار',
        heading: 'هر دسته،',
        headingAccent: 'یک مسیر تأمین',
        description:
          'گروه‌های کالایی را یک‌جا ببینید. برای موجودی لحظه‌ای، رنگ‌بندی و قیمت همکاری هر مدل با فروش در تماس باشید یا سبد زنده همان روز را باز کنید.',
        showIndex: true,
        indexLabel: 'دسته',
        toolbarLabel: 'همه دسته‌بندی‌ها',
        cardCtaLabel: 'مشاهده محصولات',
      },
      {
        blockName: 'Product Carousel',
        blockType: 'productCarousel',
        populateBy: 'collection',
        limit: 10,
      },
      {
        blockName: 'Clinic Media',
        blockType: 'mediaBlock',
        media: metaImage.id,
      },
      {
        blockName: 'Pricing',
        blockType: 'pricing',
        heading: 'سطح همکاری',
        yearlyDiscountLabel: 'پیگیری',
        plans: [
          {
            name: 'مشاهده سبد',
            description: 'دسترسی به سبدهای زنده و کاتالوگ برای تصمیم سریع.',
            priceMonthly: 0,
            priceYearly: 0,
            buttonText: 'باز کردن سبدها',
            buttonVariant: 'outline',
            isPopular: false,
            hasShadow: false,
            buttonLink: {
              type: 'custom',
              label: 'باز کردن سبدها',
              url: '/bundles',
            },
            features: [
              { name: 'فهرست سبدهای زنده', included: true },
              { name: 'جزئیات رنگ و تعداد', included: true },
              { name: 'کاتالوگ محصولات', included: true },
              { name: 'قیمت اختصاصی مستمر', included: false },
            ],
          },
          {
            name: 'همکار فعال',
            description: 'قیمت همکاری، اولویت پردازش و تحویل نیمه‌آفلاین.',
            priceMonthly: 0,
            priceYearly: 0,
            buttonText: 'تماس با فروش',
            buttonVariant: 'primary',
            isPopular: true,
            hasShadow: true,
            shadowStyle: 'primary',
            buttonLink: {
              type: 'custom',
              label: 'تماس با فروش',
              url: '/contact',
            },
            features: [
              { name: 'قیمت و باندل همکاری', included: true },
              { name: 'اولویت در پردازش سفارش', included: true },
              { name: 'تحویل حضوری یا ارسال سریع', included: true },
              { name: 'پشتیبان فروش اختصاصی', included: true },
            ],
          },
          {
            name: 'همکار ممتاز',
            description: 'موجودی زودتر، پیشنهاد ویژه و شرایط اعتباری منعطف‌تر.',
            priceMonthly: 0,
            priceYearly: 0,
            buttonText: 'درخواست همکاری',
            buttonVariant: 'dark',
            isPopular: false,
            hasShadow: true,
            shadowStyle: 'dark',
            buttonLink: {
              type: 'custom',
              label: 'درخواست همکاری',
              url: '/contact',
            },
            features: [
              { name: 'دسترسی زودتر به موجودی خاص', included: true },
              { name: 'پیشنهادهای محدود و جشنواره همکار', included: true },
              { name: 'فاکتور رسمی / مسیر حقوقی', included: true },
              { name: 'شرایط اعتباری بر اساس سطح همکاری', included: true },
            ],
          },
        ],
      },
      {
        blockName: 'Archive',
        blockType: 'archive',
        categories: [],
        introContent: richRoot(
          heading('از بازار همکار بخوانید', 'h3'),
          paragraph(
            'راهنمای خرید عمده، نکات حاشیه سود و خبرهای تأمین — برای تصمیم بهتر در فروش نیمه‌آفلاین.',
          ),
        ),
        populateBy: 'collection',
        relationTo: 'posts',
      },
      {
        blockName: 'CTA',
        blockType: 'cta',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'سبدهای زنده',
              url: '/bundles',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'تماس با فروش',
              url: '/contact',
            },
          },
        ],
        richText: richRoot(
          heading('آماده شروع همکاری هستید؟', 'h3'),
          paragraph(
            'سبد امروز را ببینید یا با فروش هماهنگ کنید تا قیمت همکاری و مسیر تحویل نیمه‌آفلاین فعال شود.',
          ),
        ),
      },
      {
        blockName: 'Solace CTA',
        blockType: 'solaceCta',
        heading: 'سبد زنده؛ خرید عمده بدون پیچیدگی',
        appleUrl: '/bundles',
        googleUrl: '/contact',
      },
    ],
    meta: {
      description:
        'پنل همکار و سبد زنده برای فروش B2B نیمه‌آفلاین — قیمت همکاری، موجودی روز و تحویل حضوری یا ارسال سریع.',
      image: metaImage.id,
      title: 'همکار | سبد زنده و خرید عمده',
    },
  }
}
