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
      type: 'solace',
      announcementBadge: 'نوبت‌دهی',
      announcementText: 'همین امروز پوستتان را به متخصص بسپارید ←',
      heading: 'زیبایی پوست شما\nاز دقت آغاز می‌شود',
      subheading:
        'در کلینیک دکتر مریم رنجبر، تشخیص علمی با نگاه زیبایی‌شناسانه همراه است. از درمان بیماری‌های پوست تا بازسازی لطافت و شادابی — همه چیز با دقت، صداقت و احترام به پوست شما.',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'رزرو نوبت',
            url: '/contact',
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
      mediaLayout: 'image',
      heroImage: heroImage.id,
      heroImageWidthDesktop: 70,
      heroImageWidthMobile: 90,
      phoneLeft: phoneLeft.id,
      phoneCenter: phoneCenter.id,
      phoneRight: phoneRight.id,
    },
    layout: [
      {
        blockName: 'Logos',
        blockType: 'logos',
        heading: 'همگام با برندهای پیشروی جهانِ پوست',
      },
      {
        blockName: 'Features',
        blockType: 'features',
        heading: 'هر آنچه پوست شما\nبرای درخشیدن نیاز دارد',
        cards: [
          {
            title: 'تشخیص و درمان بیماری‌های پوست',
            description:
              'آکنه، لک، اگزما، پسوریازیس، ریزش مو و حساسیت‌ها — با معاینهٔ دقیق و مسیر درمانی شفاف. اینجا حدس جای علم را نمی‌گیرد؛ پوست شما شنیده و دیده می‌شود.',
            variant: 'waveform',
            highlight: false,
          },
          {
            title: 'زیبایی با دقت پزشکی',
            description:
              'بوتاکس، فیلر، جوانسازی و پروتکل‌های زیبایی — نه برای تغییر چهره، برای بازگرداندن طراوت طبیعی. هر طرح درمان، مخصوص شماست.',
            variant: 'generator',
            highlight: true,
            promptText: 'طراحی مسیر جوانسازی متناسب با چهرهٔ من',
            statusText: 'در حال تنظیم برنامهٔ مراقبت شخصی…',
          },
          {
            title: 'لیزر و بازسازی پوست',
            description:
              'از کنترل رنگدانه و جای زخم تا یکدست‌سازی بافت پوست — با دستگاه‌ها و پروتکل‌های روز، در محیطی امن و آرام. نتیجه را قدم‌به‌قدم و واقع‌بینانه می‌بینید.',
            variant: 'social',
            highlight: false,
          },
        ],
      },
      {
        blockName: 'Featured Services',
        blockType: 'featuredServices',
        heading: richRoot(heading('خدمات ویژهٔ کلینیک', 'h2')),
        description: richRoot(
          paragraph(
            'از تشخیص تخصصی تا زیبایی دقیق و بازسازی پوست — مسیرهایی که با نیاز پوست شما طراحی می‌شوند.',
          ),
        ),
        cta: {
          type: 'custom',
          label: 'مشاهده همه خدمات',
          url: '#services',
        },
        services: [
          {
            title: 'تشخیص و درمان پوست',
            image: heroImage.id,
            link: { type: 'custom', label: 'تشخیص و درمان پوست', url: '#services' },
          },
          {
            title: 'زیبایی با دقت پزشکی',
            image: metaImage.id,
            link: { type: 'custom', label: 'زیبایی با دقت پزشکی', url: '#services' },
          },
          {
            title: 'لیزر و بازسازی',
            image: phoneCenter.id,
            link: { type: 'custom', label: 'لیزر و بازسازی', url: '#services' },
          },
          {
            title: 'مراقبت بعد از درمان',
            image: phoneLeft.id,
            link: { type: 'custom', label: 'مراقبت بعد از درمان', url: '#services' },
          },
          {
            title: 'مشاورهٔ تخصصی',
            image: phoneRight.id,
            link: { type: 'custom', label: 'مشاورهٔ تخصصی', url: '/contact' },
          },
        ],
      },
      {
        blockName: 'Journey Content',
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: richRoot(heading('مسیر مراقبت در کلینیک دکتر مریم رنجبر', 'h2')),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: richRoot(
              heading('۱. شنیدن', 'h3'),
              paragraph(
                'داستان پوست شما — نگرانی‌ها، سابقه، انتظارات — با حوصله شنیده می‌شود. اینجا عجله جای تشخیص را نمی‌گیرد.',
              ),
            ),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: richRoot(
              heading('۲. دیدن', 'h3'),
              paragraph(
                'معاینهٔ دقیق و در صورت نیاز تصویربرداری یا آزمایش؛ واقعیت پوست، نه فقط آنچه در آینه دیده می‌شود.',
              ),
            ),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: richRoot(
              heading('۳. طراحی و همراهی', 'h3'),
              paragraph(
                'برنامهٔ درمان شفاف توضیح داده می‌شود و پیگیری بعد از درمان ادامه دارد. زیبایی و سلامت پوست یک رابطه است.',
              ),
            ),
          },
        ],
      },
      {
        blockName: 'Clinic Media',
        blockType: 'mediaBlock',
        media: metaImage.id,
      },
      {
        blockName: 'Pricing',
        blockType: 'pricing',
        heading: 'مسیر مراقبت',
        yearlyDiscountLabel: 'پیگیری',
        plans: [
          {
            name: 'مشاورهٔ اولیه',
            description: 'بررسی پوست و نقشهٔ مسیر درمان یا زیبایی.',
            priceMonthly: 0,
            priceYearly: 0,
            buttonText: 'رزرو مشاوره',
            buttonVariant: 'outline',
            isPopular: false,
            hasShadow: false,
            buttonLink: {
              type: 'custom',
              label: 'رزرو مشاوره',
              url: '/contact',
            },
            features: [
              { name: 'معاینهٔ تخصصی پوست', included: true },
              { name: 'تشخیص و اولویت‌بندی نگرانی‌ها', included: true },
              { name: 'پیشنهاد مسیر اولیه', included: true },
              { name: 'برنامهٔ چندجلسه‌ای کامل', included: false },
            ],
          },
          {
            name: 'مسیر درمان',
            description: 'برنامهٔ چندجلسه‌ای تخصصی بر اساس تشخیص دقیق.',
            priceMonthly: 0,
            priceYearly: 0,
            buttonText: 'شروع درمان',
            buttonVariant: 'primary',
            isPopular: true,
            hasShadow: true,
            shadowStyle: 'primary',
            buttonLink: {
              type: 'custom',
              label: 'شروع درمان',
              url: '/contact',
            },
            features: [
              { name: 'طراحی پروتکل درمان شخصی', included: true },
              { name: 'جلسات پیگیری منظم', included: true },
              { name: 'توضیح شفاف انتظارات واقع‌بینانه', included: true },
              { name: 'راهنمای مراقبت خانگی', included: true },
            ],
          },
          {
            name: 'مراقبت ممتاز',
            description: 'پیگیری زیبایی و نگهداری نتیجه در بلندمدت.',
            priceMonthly: 0,
            priceYearly: 0,
            buttonText: 'گفتگو با کلینیک',
            buttonVariant: 'dark',
            isPopular: false,
            hasShadow: true,
            shadowStyle: 'dark',
            buttonLink: {
              type: 'custom',
              label: 'گفتگو با کلینیک',
              url: '/contact',
            },
            features: [
              { name: 'چکاپ دوره‌ای پوست', included: true },
              { name: 'نگهداری نتایج زیبایی', included: true },
              { name: 'اولویت در نوبت‌دهی', included: true },
              { name: 'همراهی پس از درمان و لیزر', included: true },
            ],
          },
        ],
      },
      {
        blockName: 'Archive',
        blockType: 'archive',
        categories: [],
        introContent: richRoot(
          heading('از کلینیک بخوانید', 'h3'),
          paragraph(
            'نکته‌های پوست‌آگاهی، مراقبت فصلی و راهنماهای پیش و پس از درمان — نوشته‌هایی برای اعتماد بیشتر به مسیر مراقبت شما.',
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
              label: 'رزرو نوبت',
              url: '/contact',
            },
          },
          {
            link: {
              type: 'custom',
              appearance: 'outline',
              label: 'مقالات',
              url: '/posts',
            },
          },
        ],
        richText: richRoot(
          heading('ما زیبایی را با اغراق نمی‌فروشیم؛ با دقت می‌سازیم.', 'h3'),
          paragraph('برای شروع، یک مشاورهٔ آرام کافی است.'),
        ),
      },
      {
        blockName: 'Solace CTA',
        blockType: 'solaceCta',
        heading: 'پوست شما شایستهٔ بهترین مراقبت است',
        appleUrl: '/contact',
        googleUrl: '/contact',
      },
    ],
    meta: {
      description:
        'کلینیک تخصصی پوست دکتر مریم رنجبر — تشخیص دقیق، درمان علمی و مراقبت زیبایی با استاندارد لوکس. رزرو نوبت آنلاین.',
      image: metaImage.id,
      title: 'دکتر مریم رنجبر | متخصص پوست و زیبایی',
    },
  }
}
