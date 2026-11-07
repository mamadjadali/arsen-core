/**
 * Seed footer link columns from Mobile140-style reference.
 * Run: npx tsx src/endpoints/seed/run-seed-footer-links.ts
 */
import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, createLocalReq } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
loadEnv({ path: path.resolve(dirname, '../../../.env') })

const footerLink = (label: string, url = '#') => ({
  link: { type: 'custom' as const, label, url },
})

async function main() {
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  const users = await payload.find({ collection: 'users', limit: 1, depth: 0 })
  let user = users.docs[0]
  if (!user) {
    user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@ranjbar.local',
        password: 'password',
        name: 'Admin',
      },
    })
  }

  const req = await createLocalReq({ user }, payload)

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      layout: 'columns',
      brandName: '',
      tagline: '',
      copyright: '© ۱۴۰۵ کلینیک پوست دکتر مریم رنجبر — همهٔ حقوق محفوظ است',
      phones: [],
      addresses: [],
      linkGroups: [
        {
          title: 'دسترسی سریع',
          links: [
            footerLink('فروشگاه موبایل ۱۴۰', '/'),
            footerLink('بلاگ', '/posts'),
            footerLink('فرصت‌های شغلی'),
            footerLink('خرید گوشی', '/products'),
            footerLink('گوشی سامسونگ', '/products?brand=samsung'),
            footerLink('گوشی آیفون', '/products'),
            footerLink('گوشی شیائومی', '/products?brand=xiaomi'),
          ],
        },
        {
          title: 'پرفروش‌ترین محصولات',
          links: [
            footerLink('گوشی سامسونگ A54 5G', '/products'),
            footerLink('گوشی سامسونگ A14', '/products'),
            footerLink('آیفون ۱۳', '/products'),
            footerLink('گوشی شیائومی Poco C40', '/products'),
            footerLink('گوشی شیائومی Poco C31', '/products'),
            footerLink('کنسول پلی استیشن ۵'),
            footerLink('هندزفری انکر'),
          ],
        },
        {
          title: 'خدمات مشتریان',
          links: [
            footerLink('پنل همکار', '/bundles'),
            footerLink('بیمه موبایل دیگارد'),
            footerLink('سوالات متداول'),
            footerLink('درباره ما'),
            footerLink('تماس با ما', '/contact'),
            footerLink('قوانین و مقررات'),
            footerLink('آموزش ریجستری'),
          ],
        },
        {
          title: 'راهنمای قبل از خرید',
          links: [
            footerLink('خرید اقساطی'),
            footerLink('رویه‌های ارسال سفارش'),
            footerLink('روش‌های پرداخت سفارش'),
            footerLink('قوانین همکاران'),
          ],
        },
      ],
      navItems: [
        {
          link: {
            type: 'custom',
            label: 'ادمین',
            url: '/admin',
          },
        },
      ],
    },
    req,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  payload.logger.info('Footer link columns seeded (layout: columns).')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
