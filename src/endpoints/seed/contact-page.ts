import type { Form } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ContactArgs = {
  contactForm: Form
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

export const contact: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
}) => {
  return {
    slug: 'contact',
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockName: 'Contact Section',
        blockType: 'contactSection',
        heading: richRoot(heading('تماس با ما', 'h2')),
        description: richRoot(
          paragraph(
            'برای رزرو نوبت، مشاوره یا پرسش دربارهٔ مسیر درمان، پیام بگذارید. تیم کلینیک در کوتاه‌ترین زمان پاسخ می‌دهد.',
          ),
        ),
        methods: [
          {
            icon: 'mail',
            title: 'ایمیل',
            subtitle: 'پاسخ معمولاً تا ۲۴ ساعت',
            value: 'hello@ranjbar.clinic',
            link: { type: 'custom', url: 'mailto:hello@ranjbar.clinic' },
          },
          {
            icon: 'chat',
            title: 'گفتگوی آنلاین',
            subtitle: 'پشتیبانی سریع در ساعات کاری',
            value: 'شروع گفتگو',
            link: { type: 'custom', url: '#' },
          },
          {
            icon: 'phone',
            title: 'تلفن',
            subtitle: 'شنبه تا چهارشنبه، ۹ تا ۱۸',
            value: '۰۲۱-۱۲۳۴۵۶۷۸',
            link: { type: 'custom', url: 'tel:+982112345678' },
          },
          {
            icon: 'map',
            title: 'مطب',
            subtitle: 'هماهنگی ملاقات حضوری',
            value: 'تهران، خیابان مثال، پلاک ۱۲۳',
            link: { type: 'custom', url: '#' },
          },
        ],
        formHeading: 'پیام بفرستید',
        formDescription: 'فرم را پر کنید؛ ظرف ۲۴ ساعت با شما تماس می‌گیریم.',
        form: contactForm.id,
      },
    ],
    title: 'تماس',
    meta: {
      title: 'تماس | کلینیک دکتر مریم رنجبر',
      description: 'رزرو نوبت و مشاوره با کلینیک پوست دکتر مریم رنجبر',
    },
  }
}
