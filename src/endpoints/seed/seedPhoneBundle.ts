/**
 * Seed phone match-surface products + live bundles (partner Mix baskets).
 * Run: npx tsx src/endpoints/seed/run-seed-phone-bundle.ts
 */
import type { Payload, PayloadRequest } from 'payload'

type PhoneSeed = {
  productId: string
  slug: string
  title: string
  printName: string
  brandKey: string
  storageLabel: string
  colors: string[]
  unitPriceToman: number
  quantity: number
  /** Mix list as shown on basket (may repeat colors) */
  mixColorNames: string[]
}

type BundleSeed = {
  name: string
  slug: string
  notes: string
  /** productId keys into PHONES */
  lineProductIds: string[]
}

const COLOR_POOL = ['مشکی', 'آبی', 'سبز', 'بنفش', 'طلایی', 'سفید', 'نقره‌ای', 'نارنجی', 'قرمز']

const PHONES: PhoneSeed[] = [
  {
    productId: 'NOTE-14S-256-8',
    slug: 'note-14s-256-8',
    title: 'Note 14S 256-8',
    printName: 'Note 14S',
    brandKey: 'xiaomi',
    storageLabel: '256-8',
    colors: ['مشکی', 'بنفش', 'آبی'],
    mixColorNames: ['مشکی', 'بنفش', 'آبی'],
    unitPriceToman: 79_999_000,
    quantity: 1,
  },
  {
    productId: 'POCO-C71-128-4',
    slug: 'poco-c71-128-4',
    title: 'Poco C71 128-4',
    printName: 'Poco C71',
    brandKey: 'poco',
    storageLabel: '128-4',
    colors: ['مشکی', 'آبی', 'طلایی'],
    mixColorNames: ['مشکی', 'آبی', 'مشکی', 'طلایی'],
    unitPriceToman: 39_999_000,
    quantity: 2,
  },
  {
    productId: 'POCO-C85-256-8',
    slug: 'poco-c85-256-8',
    title: 'Poco C85 256-8',
    printName: 'Poco C85',
    brandKey: 'poco',
    storageLabel: '256-8',
    colors: ['مشکی', 'بنفش', 'سبز'],
    mixColorNames: ['مشکی', 'بنفش', 'سبز'],
    unitPriceToman: 59_999_000,
    quantity: 2,
  },
  {
    productId: 'REDMI-15C-256-8',
    slug: 'redmi-15c-256-8',
    title: 'Redmi 15C 256-8',
    printName: 'Redmi 15C',
    brandKey: 'redmi',
    storageLabel: '256-8',
    colors: ['مشکی', 'آبی', 'سبز', 'نارنجی'],
    mixColorNames: ['مشکی', 'آبی', 'سبز', 'نارنجی'],
    unitPriceToman: 59_999_000,
    quantity: 1,
  },
  {
    productId: 'REDMI-A5-128-4',
    slug: 'redmi-a5-128-4',
    title: 'Redmi A5 128-4',
    printName: 'Redmi A5 128-4',
    brandKey: 'redmi',
    storageLabel: '128-4',
    colors: ['مشکی', 'سبز', 'طلایی', 'آبی'],
    mixColorNames: ['مشکی', 'سبز', 'طلایی', 'آبی'],
    unitPriceToman: 39_999_000,
    quantity: 2,
  },
  // Extra similar phones for more bundles
  {
    productId: 'NOTE-13-128-6',
    slug: 'note-13-128-6',
    title: 'Note 13 128-6',
    printName: 'Note 13',
    brandKey: 'xiaomi',
    storageLabel: '128-6',
    colors: ['مشکی', 'آبی', 'سبز'],
    mixColorNames: ['مشکی', 'آبی', 'سبز'],
    unitPriceToman: 54_999_000,
    quantity: 2,
  },
  {
    productId: 'NOTE-14-PRO-256-8',
    slug: 'note-14-pro-256-8',
    title: 'Note 14 Pro 256-8',
    printName: 'Note 14 Pro',
    brandKey: 'xiaomi',
    storageLabel: '256-8',
    colors: ['مشکی', 'بنفش', 'سفید', 'طلایی'],
    mixColorNames: ['مشکی', 'بنفش', 'سفید', 'طلایی'],
    unitPriceToman: 94_999_000,
    quantity: 1,
  },
  {
    productId: 'POCO-X7-256-8',
    slug: 'poco-x7-256-8',
    title: 'Poco X7 256-8',
    printName: 'Poco X7',
    brandKey: 'poco',
    storageLabel: '256-8',
    colors: ['مشکی', 'آبی', 'نقره‌ای'],
    mixColorNames: ['مشکی', 'آبی', 'نقره‌ای'],
    unitPriceToman: 72_999_000,
    quantity: 2,
  },
  {
    productId: 'POCO-M6-128-6',
    slug: 'poco-m6-128-6',
    title: 'Poco M6 128-6',
    printName: 'Poco M6',
    brandKey: 'poco',
    storageLabel: '128-6',
    colors: ['مشکی', 'سبز', 'بنفش'],
    mixColorNames: ['مشکی', 'سبز', 'بنفش', 'مشکی'],
    unitPriceToman: 44_999_000,
    quantity: 3,
  },
  {
    productId: 'REDMI-NOTE-13-256-8',
    slug: 'redmi-note-13-256-8',
    title: 'Redmi Note 13 256-8',
    printName: 'Redmi Note 13',
    brandKey: 'redmi',
    storageLabel: '256-8',
    colors: ['مشکی', 'آبی', 'طلایی', 'سبز'],
    mixColorNames: ['مشکی', 'آبی', 'طلایی', 'سبز'],
    unitPriceToman: 64_999_000,
    quantity: 2,
  },
  {
    productId: 'REDMI-14C-128-4',
    slug: 'redmi-14c-128-4',
    title: 'Redmi 14C 128-4',
    printName: 'Redmi 14C',
    brandKey: 'redmi',
    storageLabel: '128-4',
    colors: ['مشکی', 'آبی', 'سبز'],
    mixColorNames: ['مشکی', 'آبی', 'سبز'],
    unitPriceToman: 34_999_000,
    quantity: 4,
  },
  {
    productId: 'GALAXY-A16-128-6',
    slug: 'galaxy-a16-128-6',
    title: 'Galaxy A16 128-6',
    printName: 'Galaxy A16',
    brandKey: 'samsung',
    storageLabel: '128-6',
    colors: ['مشکی', 'آبی', 'نقره‌ای'],
    mixColorNames: ['مشکی', 'آبی', 'نقره‌ای'],
    unitPriceToman: 49_999_000,
    quantity: 2,
  },
  {
    productId: 'GALAXY-A26-256-8',
    slug: 'galaxy-a26-256-8',
    title: 'Galaxy A26 256-8',
    printName: 'Galaxy A26',
    brandKey: 'samsung',
    storageLabel: '256-8',
    colors: ['مشکی', 'سفید', 'بنفش', 'آبی'],
    mixColorNames: ['مشکی', 'سفید', 'بنفش', 'آبی'],
    unitPriceToman: 69_999_000,
    quantity: 1,
  },
  {
    productId: 'REALME-C75-128-6',
    slug: 'realme-c75-128-6',
    title: 'Realme C75 128-6',
    printName: 'Realme C75',
    brandKey: 'realme',
    storageLabel: '128-6',
    colors: ['مشکی', 'سبز', 'طلایی'],
    mixColorNames: ['مشکی', 'سبز', 'طلایی'],
    unitPriceToman: 42_999_000,
    quantity: 2,
  },
  {
    productId: 'REALME-NOTE-60-256-8',
    slug: 'realme-note-60-256-8',
    title: 'Realme Note 60 256-8',
    printName: 'Realme Note 60',
    brandKey: 'realme',
    storageLabel: '256-8',
    colors: ['مشکی', 'آبی', 'نارنجی', 'سفید'],
    mixColorNames: ['مشکی', 'آبی', 'نارنجی', 'سفید'],
    unitPriceToman: 57_999_000,
    quantity: 2,
  },
  {
    productId: 'HONOR-X8C-256-8',
    slug: 'honor-x8c-256-8',
    title: 'Honor X8c 256-8',
    printName: 'Honor X8c',
    brandKey: 'honor',
    storageLabel: '256-8',
    colors: ['مشکی', 'نقره‌ای', 'سبز'],
    mixColorNames: ['مشکی', 'نقره‌ای', 'سبز'],
    unitPriceToman: 61_999_000,
    quantity: 1,
  },
  {
    productId: 'HONOR-X7C-128-6',
    slug: 'honor-x7c-128-6',
    title: 'Honor X7c 128-6',
    printName: 'Honor X7c',
    brandKey: 'honor',
    storageLabel: '128-6',
    colors: ['مشکی', 'آبی', 'طلایی'],
    mixColorNames: ['مشکی', 'آبی', 'مشکی', 'طلایی'],
    unitPriceToman: 46_999_000,
    quantity: 3,
  },
]

const BUNDLES: BundleSeed[] = [
  {
    name: 'سبد موبایل همکار — Mix',
    slug: 'partner-phone-mix',
    notes: 'سبد نمونه از لیست Mix موبایل (Note / Poco / Redmi).',
    lineProductIds: [
      'NOTE-14S-256-8',
      'POCO-C71-128-4',
      'POCO-C85-256-8',
      'REDMI-15C-256-8',
      'REDMI-A5-128-4',
    ],
  },
  {
    name: 'سبد اقتصادی — ورودی بازار',
    slug: 'bundle-economy-entry',
    notes: 'مدل‌های اقتصادی برای فروش تکی و Mix رنگ.',
    lineProductIds: ['REDMI-A5-128-4', 'REDMI-14C-128-4', 'POCO-C71-128-4', 'REALME-C75-128-6'],
  },
  {
    name: 'سبد Poco — میان‌رده',
    slug: 'bundle-poco-mid',
    notes: 'ترکیب Poco برای شرکای میان‌رده.',
    lineProductIds: ['POCO-C71-128-4', 'POCO-C85-256-8', 'POCO-M6-128-6', 'POCO-X7-256-8'],
  },
  {
    name: 'سبد Redmi / Note',
    slug: 'bundle-redmi-note',
    notes: 'خانواده Redmi و Note با ظرفیت‌های مختلف.',
    lineProductIds: [
      'REDMI-15C-256-8',
      'REDMI-NOTE-13-256-8',
      'NOTE-13-128-6',
      'NOTE-14S-256-8',
      'NOTE-14-PRO-256-8',
    ],
  },
  {
    name: 'سبد سامسونگ A',
    slug: 'bundle-samsung-a',
    notes: 'سری Galaxy A برای موجودی سریع.',
    lineProductIds: ['GALAXY-A16-128-6', 'GALAXY-A26-256-8', 'REDMI-14C-128-4'],
  },
  {
    name: 'سبد Realme + Honor',
    slug: 'bundle-realme-honor',
    notes: 'ترکیب Realme و Honor برای تنوع برند.',
    lineProductIds: [
      'REALME-C75-128-6',
      'REALME-NOTE-60-256-8',
      'HONOR-X7C-128-6',
      'HONOR-X8C-256-8',
    ],
  },
  {
    name: 'سبد پرمیوم همکار',
    slug: 'bundle-partner-premium',
    notes: 'مدل‌های بالاتر برای مشتریان ویژه.',
    lineProductIds: [
      'NOTE-14-PRO-256-8',
      'POCO-X7-256-8',
      'GALAXY-A26-256-8',
      'HONOR-X8C-256-8',
      'REALME-NOTE-60-256-8',
    ],
  },
  {
    name: 'سبد میکس هفتگی',
    slug: 'bundle-weekly-mix',
    notes: 'میکس تصادفی هفتگی از برندهای مختلف.',
    lineProductIds: [
      'NOTE-14S-256-8',
      'POCO-M6-128-6',
      'REDMI-NOTE-13-256-8',
      'GALAXY-A16-128-6',
      'REALME-C75-128-6',
      'HONOR-X7C-128-6',
    ],
  },
]

function phoneById(productId: string): PhoneSeed | undefined {
  return PHONES.find((p) => p.productId === productId)
}

function pickMixColors(colors: string[], count = 3): string[] {
  const base = colors.length ? colors : COLOR_POOL
  const out: string[] = []
  for (let i = 0; i < Math.max(count, 2); i++) {
    out.push(base[i % base.length]!)
  }
  return out
}

async function upsertPhoneProduct({
  payload,
  req,
  phone,
  categoryId,
  shared,
}: {
  payload: Payload
  req: PayloadRequest
  phone: PhoneSeed
  categoryId: string | number | null
  shared: {
    req: PayloadRequest
    overrideAccess: true
    context: { disableRevalidate: true }
  }
}): Promise<string> {
  const byProductId = await payload.find({
    collection: 'products',
    where: { productId: { equals: phone.productId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const bySlug = byProductId.docs[0]
    ? null
    : await payload.find({
        collection: 'products',
        where: { slug: { equals: phone.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

  const existing = byProductId.docs[0] || bySlug?.docs[0]

  const data = {
    title: phone.title,
    printName: phone.printName,
    productId: phone.productId,
    brandKey: phone.brandKey,
    categoryKey: 'mobiles',
    active: true,
    generateSlug: false,
    slug: phone.slug,
    summary: `${phone.printName} — ${phone.storageLabel}`,
    categories: categoryId ? [categoryId] : [],
    currencyLabel: 'تومان',
    price: phone.unitPriceToman,
    availability: 'available' as const,
    colors: phone.colors.map((name) => ({
      name,
      b2bPrice: phone.unitPriceToman,
    })),
    colorSwatches: phone.colors.map((label) => ({
      label,
      hex: '#2C241E',
    })),
    specs: [
      { label: 'مدل', value: phone.printName },
      { label: 'حافظه', value: phone.storageLabel },
    ],
    meta: {
      title: phone.title,
      description: `${phone.printName} ${phone.storageLabel}`,
    },
    _status: 'published' as const,
    publishedAt: new Date().toISOString(),
  }

  if (existing) {
    const updated = await payload.update({
      collection: 'products',
      id: existing.id,
      data: data as never,
      ...shared,
    })
    return String(updated.id)
  }

  const created = await payload.create({
    collection: 'products',
    data: data as never,
    ...shared,
  })
  return String(created.id)
}

async function upsertBundle({
  payload,
  shared,
  bundle,
  productIds,
}: {
  payload: Payload
  shared: {
    req: PayloadRequest
    overrideAccess: true
    context: { disableRevalidate: true }
  }
  bundle: BundleSeed
  productIds: Record<string, string>
}) {
  const lines = bundle.lineProductIds
    .map((productId) => {
      const phone = phoneById(productId)
      if (!phone || !productIds[productId]) return null
      return {
        product: productIds[productId],
        productId,
        colorName: 'Mix',
        mixColorNames: phone.mixColorNames.length
          ? phone.mixColorNames
          : pickMixColors(phone.colors),
        quantity: phone.quantity,
        quantityAsOptional: false,
        unitPriceToman: phone.unitPriceToman,
        priceAsCall: false,
      }
    })
    .filter(Boolean)

  const bundleData = {
    name: bundle.name,
    generateSlug: false,
    slug: bundle.slug,
    status: 'live' as const,
    publishedAt: new Date().toISOString(),
    notes: bundle.notes,
    lines,
  }

  const existingBundles = await payload.find({
    collection: 'live-bundles',
    where: { slug: { equals: bundle.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existingBundles.docs[0]) {
    await payload.update({
      collection: 'live-bundles',
      id: existingBundles.docs[0].id,
      data: bundleData as never,
      ...shared,
    })
  } else {
    await payload.create({
      collection: 'live-bundles',
      data: bundleData as never,
      ...shared,
    })
  }
}

export async function seedPhoneBundle({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  payload.logger.info('Seeding phone products + live bundles…')

  const shared: {
    req: PayloadRequest
    overrideAccess: true
    context: { disableRevalidate: true }
  } = {
    req,
    overrideAccess: true,
    context: { disableRevalidate: true },
  }

  let categoryId: string | number | null = null
  const existingCat = await payload.find({
    collection: 'product-categories',
    where: { slug: { equals: 'mobiles' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existingCat.docs[0]) {
    categoryId = existingCat.docs[0].id
  } else {
    const created = await payload.create({
      collection: 'product-categories',
      data: {
        title: 'موبایل',
        slug: 'mobiles',
        generateSlug: false,
      },
      ...shared,
    })
    categoryId = created.id
  }

  const productIds: Record<string, string> = {}

  for (const phone of PHONES) {
    productIds[phone.productId] = await upsertPhoneProduct({
      payload,
      req,
      phone,
      categoryId,
      shared,
    })
    payload.logger.info(`Upserted product ${phone.productId}`)
  }

  for (const bundle of BUNDLES) {
    await upsertBundle({ payload, shared, bundle, productIds })
    payload.logger.info(`Upserted bundle /bundles/${bundle.slug}`)
  }

  payload.logger.info(
    `Seeded ${PHONES.length} phone products + ${BUNDLES.length} live bundles (incl. partner-phone-mix).`,
  )
}
