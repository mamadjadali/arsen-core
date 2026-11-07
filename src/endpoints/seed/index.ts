import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { emptyAiPromptSeedData } from '../../Settings/aiPromptFields'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [],
        brandName: '',
        secondaryCta: { type: 'custom' as const, label: '-', url: '#' },
        primaryCta: { type: 'custom' as const, label: '-', url: '#' },
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        layout: 'newsletter',
        logo: null,
        brandName: '',
        tagline: '',
        navItems: [],
        newsletterHeading: '',
        newsletterPlaceholder: '',
        copyright: '',
        linkGroups: [],
        socialLinks: [],
        legalLinks: [],
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'theme',
      data: {
        preset: 'solace',
        colorScheme: null,
        orange: null,
        black: null,
        canvas: null,
        radiusMd: null,
        font: 'yekanBakh',
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'scripts',
      data: {
        items: [],
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
    payload.updateGlobal({
      slug: 'settings',
      data: {
        logoLight: null,
        faviconIco: null,
        faviconSvg: null,
        favicon32: null,
        appleTouchIcon: null,
        adminLogoLight: null,
        adminLogoDark: null,
        adminIcon: null,
        aiEnabled: false,
        aiApiBaseUrl: 'https://api.gapapi.com/v1',
        aiApiKey: null,
        aiModel: 'gpt-4o-mini',
        analyticsEnabled: true,
        ...emptyAiPromptSeedData(),
      },
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    }),
  ])

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [
    image1Buffer,
    image2Buffer,
    image3Buffer,
    hero1Buffer,
    phoneLeftBuffer,
    phoneCenterBuffer,
    phoneRightBuffer,
  ] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
    readLocalFile('solace/suno-left.png'),
    readLocalFile('solace/suno-center.png'),
    readLocalFile('solace/suno-right.png'),
  ])

  const [
    demoAuthor,
    image1Doc,
    image2Doc,
    image3Doc,
    imageHomeDoc,
    phoneLeftDoc,
    phoneCenterDoc,
    phoneRightDoc,
  ] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: {
        alt: 'Suno AI left phone screen',
      },
      file: phoneLeftBuffer,
    }),
    payload.create({
      collection: 'media',
      data: {
        alt: 'Suno AI center phone screen',
      },
      file: phoneCenterBuffer,
    }),
    payload.create({
      collection: 'media',
      data: {
        alt: 'Suno AI right phone screen',
      },
      file: phoneRightBuffer,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    context: {
      disableRevalidate: true,
    },
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    context: {
      disableRevalidate: true,
    },
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    context: {
      disableRevalidate: true,
    },
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: home({
        phoneLeft: phoneLeftDoc,
        phoneCenter: phoneCenterDoc,
        phoneRight: phoneRightDoc,
        metaImage: image2Doc,
        heroImage: imageHomeDoc,
      }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      context: {
        disableRevalidate: true,
      },
      data: {
        brandName: '',
        breakoutLayout: true,
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'سبد ها',
              url: '/bundles',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'محصولات',
              url: '/products',
            },
          },
        ],
        secondaryCta: {
          type: 'custom',
          label: '',
          url: '/contact',
        },
        primaryCta: {
          type: 'custom',
          label: 'تماس با فروش',
          url: '/contact',
        },
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      context: {
        disableRevalidate: true,
      },
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
              { link: { type: 'custom', label: 'فروشگاه موبایل ۱۴۰', url: '/' } },
              { link: { type: 'custom', label: 'بلاگ', url: '/posts' } },
              { link: { type: 'custom', label: 'فرصت‌های شغلی', url: '#' } },
              { link: { type: 'custom', label: 'خرید گوشی', url: '/products' } },
              { link: { type: 'custom', label: 'گوشی سامسونگ', url: '/products?brand=samsung' } },
              { link: { type: 'custom', label: 'گوشی آیفون', url: '/products' } },
              { link: { type: 'custom', label: 'گوشی شیائومی', url: '/products?brand=xiaomi' } },
            ],
          },
          {
            title: 'پرفروش‌ترین محصولات',
            links: [
              { link: { type: 'custom', label: 'گوشی سامسونگ A54 5G', url: '/products' } },
              { link: { type: 'custom', label: 'گوشی سامسونگ A14', url: '/products' } },
              { link: { type: 'custom', label: 'آیفون ۱۳', url: '/products' } },
              { link: { type: 'custom', label: 'گوشی شیائومی Poco C40', url: '/products' } },
              { link: { type: 'custom', label: 'گوشی شیائومی Poco C31', url: '/products' } },
              { link: { type: 'custom', label: 'کنسول پلی استیشن ۵', url: '#' } },
              { link: { type: 'custom', label: 'هندزفری انکر', url: '#' } },
            ],
          },
          {
            title: 'خدمات مشتریان',
            links: [
              { link: { type: 'custom', label: 'پنل همکار', url: '/bundles' } },
              { link: { type: 'custom', label: 'بیمه موبایل دیگارد', url: '#' } },
              { link: { type: 'custom', label: 'سوالات متداول', url: '#' } },
              { link: { type: 'custom', label: 'درباره ما', url: '#' } },
              { link: { type: 'custom', label: 'تماس با ما', url: '/contact' } },
              { link: { type: 'custom', label: 'قوانین و مقررات', url: '#' } },
              { link: { type: 'custom', label: 'آموزش ریجستری', url: '#' } },
            ],
          },
          {
            title: 'راهنمای قبل از خرید',
            links: [
              { link: { type: 'custom', label: 'خرید اقساطی', url: '#' } },
              { link: { type: 'custom', label: 'رویه‌های ارسال سفارش', url: '#' } },
              { link: { type: 'custom', label: 'روش‌های پرداخت سفارش', url: '#' } },
              { link: { type: 'custom', label: 'قوانین همکاران', url: '#' } },
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
    }),
    payload.updateGlobal({
      slug: 'theme',
      context: {
        disableRevalidate: true,
      },
      data: {
        preset: 'zapier',
        colorScheme: 'light',
        orange: '#203a84',
        black: '#203a84',
        canvas: '',
        font: 'dana',
      },
    }),
    payload.updateGlobal({
      slug: 'scripts',
      context: {
        disableRevalidate: true,
      },
      data: {
        items: [
          {
            name: 'Seed test script',
            enabled: true,
            kind: 'inline',
            code: `<script>
  window.__ranjbarSeedScript = 'ok';
</script>`,
            placement: 'body',
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'settings',
      context: {
        disableRevalidate: true,
      },
      data: {
        logoLight: null,
        faviconIco: null,
        faviconSvg: null,
        favicon32: null,
        appleTouchIcon: null,
        adminLogoLight: null,
        adminLogoDark: null,
        adminIcon: null,
        aiEnabled: false,
        aiApiBaseUrl: 'https://api.gapapi.com/v1',
        aiApiKey: null,
        aiModel: 'gpt-4o-mini',
        analyticsEnabled: true,
        inquiryPhone: '09122779372',
        inquiryButtonLabel: 'استعلام قیمت و موجودی',
        ...emptyAiPromptSeedData(),
      },
    }),
  ])

  payload.logger.info('— Seeding catalog (products + live bundles)…')
  const { seedProducts } = await import('./seedProducts')
  await seedProducts({ payload, req })

  payload.logger.info('Seeded database successfully!')
}

function readLocalFile(relativePath: string): File {
  const filePath = path.resolve(dirname, relativePath)
  const data = fs.readFileSync(filePath)
  const name = path.basename(filePath)

  return {
    name,
    data,
    mimetype: 'image/png',
    size: data.byteLength,
  }
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
