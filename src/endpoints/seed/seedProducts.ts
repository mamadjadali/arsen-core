/**
 * Seed sample catalog data for PLP/PDP testing.
 * Does not wipe pages/posts — only upserts brands, product-categories, products, variants.
 *
 * Run: npx tsx src/endpoints/seed/run-seed-products.ts
 */
import type { Payload, PayloadRequest } from 'payload'

function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
          direction: 'rtl' as const,
          format: '' as const,
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'rtl' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

type CatalogCollection = 'brands' | 'product-categories' | 'products'

async function upsertBySlug({
  payload,
  req,
  collection,
  slug,
  data,
}: {
  payload: Payload
  req: PayloadRequest
  collection: CatalogCollection
  slug: string
  data: Record<string, unknown>
}) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const shared = {
    req,
    overrideAccess: true as const,
    context: { disableRevalidate: true },
  }

  if (existing.docs[0]) {
    const id = existing.docs[0].id
    // Narrow collection so Payload create/update typing does not require `draft` on the union
    if (collection === 'products') {
      return payload.update({
        collection: 'products',
        id,
        data: data as never,
        ...shared,
      })
    }
    if (collection === 'brands') {
      return payload.update({
        collection: 'brands',
        id,
        data: data as never,
        ...shared,
      })
    }
    return payload.update({
      collection: 'product-categories',
      id,
      data: data as never,
      ...shared,
    })
  }

  if (collection === 'products') {
    return payload.create({
      collection: 'products',
      data: { ...data, slug, _status: 'published' } as never,
      ...shared,
    })
  }
  if (collection === 'brands') {
    return payload.create({
      collection: 'brands',
      data: { ...data, slug } as never,
      ...shared,
    })
  }
  return payload.create({
    collection: 'product-categories',
    data: { ...data, slug } as never,
    ...shared,
  })
}

export async function seedProducts({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> {
  payload.logger.info('Seeding catalog products…')

  // Prefer existing media; otherwise download a few demo images
  let media = await payload.find({
    collection: 'media',
    limit: 6,
    depth: 0,
    overrideAccess: true,
  })

  if (!media.docs.length) {
    payload.logger.info('No media found — downloading demo images…')
    const urls = [
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post1.webp',
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post2.webp',
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post3.webp',
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    ]

    for (const [index, url] of urls.entries()) {
      const res = await fetch(url)
      if (!res.ok) continue
      const buffer = Buffer.from(await res.arrayBuffer())
      await payload.create({
        collection: 'media',
        data: { alt: `Catalog seed image ${index + 1}` },
        file: {
          name: url.split('/').pop() || `seed-${index}.webp`,
          data: buffer,
          mimetype: 'image/webp',
          size: buffer.byteLength,
        },
        req,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    }

    media = await payload.find({
      collection: 'media',
      limit: 6,
      depth: 0,
      overrideAccess: true,
    })
  }

  const images = media.docs
  const img = (i: number) => images[i % Math.max(images.length, 1)]?.id

  if (!images.length) {
    payload.logger.warn('Still no media — products will seed without images.')
  }

  const brandLrp = await upsertBySlug({
    payload,
    req,
    collection: 'brands',
    slug: 'la-roche-posay',
    data: {
      title: 'La Roche-Posay',
      description: 'برند تخصصی مراقبت از پوست حساس',
      logo: img(0) || null,
      generateSlug: false,
    },
  })

  const brandCerave = await upsertBySlug({
    payload,
    req,
    collection: 'brands',
    slug: 'cerave',
    data: {
      title: 'CeraVe',
      description: 'مراقبت روزانه با سرامیدها',
      logo: img(1) || null,
      generateSlug: false,
    },
  })

  const brandSkin = await upsertBySlug({
    payload,
    req,
    collection: 'brands',
    slug: 'skinceuticals',
    data: {
      title: 'SkinCeuticals',
      description: 'علم پیشرفته ضدپیری و ترمیم',
      logo: img(2) || null,
      generateSlug: false,
    },
  })

  const catSkincare = await upsertBySlug({
    payload,
    req,
    collection: 'product-categories',
    slug: 'skincare',
    data: {
      title: 'مراقبت پوست',
      generateSlug: false,
    },
  })

  const catSunscreen = await upsertBySlug({
    payload,
    req,
    collection: 'product-categories',
    slug: 'sunscreen',
    data: {
      title: 'ضدآفتاب',
      generateSlug: false,
      parent: catSkincare.id,
    },
  })

  const catSerum = await upsertBySlug({
    payload,
    req,
    collection: 'product-categories',
    slug: 'serum',
    data: {
      title: 'سرم',
      generateSlug: false,
      parent: catSkincare.id,
    },
  })

  const catCleanser = await upsertBySlug({
    payload,
    req,
    collection: 'product-categories',
    slug: 'cleanser',
    data: {
      title: 'پاک‌کننده',
      generateSlug: false,
      parent: catSkincare.id,
    },
  })

  const catLeather = await upsertBySlug({
    payload,
    req,
    collection: 'product-categories',
    slug: 'synthetic-leather',
    data: {
      title: 'چرم مصنوعی',
      generateSlug: false,
    },
  })

  // Site-wide inquiry label + contact methods (from local defaults)
  try {
    await payload.updateGlobal({
      slug: 'settings',
      data: {
        inquiryPhone: '09122779372',
        inquiryButtonLabel: 'استعلام قیمت و موجودی',
      },
      req,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  } catch (error) {
    payload.logger.warn(
      `Skipped settings inquiry phone: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  const contactMethodSeeds = [
    { label: 'خط۱', type: 'phone' as const, value: '۰۹۱۲۲۷۷۹۳۷۲', sort: 0 },
    { label: 'خط2', type: 'phone' as const, value: '۰۹۱۲۵۲۷۱۴۳۲', sort: 1 },
    { label: 'واتساپ', type: 'whatsapp' as const, value: '@Kasra_gh0', sort: 2 },
    { label: 'تلگرام', type: 'telegram' as const, value: '@Kasra_gh0', sort: 3 },
    {
      label: 'اینستاگرام',
      type: 'instagram' as const,
      value: 'https://www.instagram.com/mohammad_ghanaatjoo',
      sort: 4,
    },
  ]

  try {
    const existingMethods = await payload.find({
      collection: 'contact-methods',
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of existingMethods.docs) {
      await payload.delete({
        collection: 'contact-methods',
        id: doc.id,
        req,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    }
    for (const method of contactMethodSeeds) {
      await payload.create({
        collection: 'contact-methods',
        data: {
          ...method,
          enabled: true,
        },
        req,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    }
  } catch (error) {
    payload.logger.warn(
      `Skipped contact methods seed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  // Clear previous seed variants for these product slugs
  const seedSlugs = [
    'effaclar-duo',
    'anthelios-uvmura',
    'cerave-hydrating-cleanser',
    'ce-ferulic',
    'toleriane-sensitive',
    'dakota-honey-leather',
  ]

  const existingProducts = await payload.find({
    collection: 'products',
    where: { slug: { in: seedSlugs } },
    limit: 20,
    depth: 0,
    overrideAccess: true,
  })

  for (const product of existingProducts.docs) {
    const variants = await payload.find({
      collection: 'variants',
      where: { product: { equals: product.id } },
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })
    for (const variant of variants.docs) {
      await payload.delete({
        collection: 'variants',
        id: variant.id,
        req,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    }
  }

  const productEffaclar = await upsertBySlug({
    payload,
    req,
    collection: 'products',
    slug: 'effaclar-duo',
    data: {
      title: 'افاکلار دوئو+',
      generateSlug: false,
      productId: 'M140-EFFACLAR-DUO',
      printName: 'افاکلار دوئو پلاس',
      brandKey: 'la-roche-posay',
      categoryKey: 'serum',
      active: true,
      colors: [
        { name: 'بی‌رنگ', sku: 'LRP-ED-CLR', b2bPrice: 1650000, remains: 24 },
        { name: 'شفاف', sku: 'LRP-ED-CLR2', b2bPrice: 1650000, remains: 12 },
      ],
      summary: 'مراقبت ضدجوش روزانه برای پوست مستعد آکنه',
      description: richText(
        'فرمول دوتایی برای کاهش جوش‌های التهابی و جلوگیری از بازگشت لک. مناسب استفاده صبح و شب تحت نظر پزشک.',
      ),
      featuredImage: img(0) || null,
      gallery: [img(0), img(1), img(2)].filter(Boolean),
      brand: brandLrp.id,
      categories: [catSkincare.id, catSerum.id],
      price: 1850000,
      compareAtPrice: 2100000,
      currencyLabel: 'تومان',
      availability: 'available',
      sku: 'LRP-ED-001',
      meta: {
        title: 'افاکلار دوئو+ | La Roche-Posay',
        description: 'مراقبت ضدجوش برای پوست حساس مستعد آکنه',
        image: img(0) || null,
      },
      _status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  const productAnthelios = await upsertBySlug({
    payload,
    req,
    collection: 'products',
    slug: 'anthelios-uvmura',
    data: {
      title: 'آنتلیوس UVMune 400',
      generateSlug: false,
      summary: 'ضدآفتاب گسترده با محافظت در برابر UVA بسیار طولانی',
      description: richText(
        'محافظت روزانه پوست در برابر پرتوهای UV و نور آبی. بافت سبک و مناسب پوست چرب تا مختلط.',
      ),
      featuredImage: img(1) || null,
      gallery: [img(1), img(2)].filter(Boolean),
      brand: brandLrp.id,
      categories: [catSkincare.id, catSunscreen.id],
      price: 2450000,
      currencyLabel: 'تومان',
      availability: 'limited',
      sku: 'LRP-AL-400',
      meta: {
        title: 'آنتلیوس UVMune 400',
        description: 'ضدآفتاب تخصصی La Roche-Posay',
        image: img(1) || null,
      },
      _status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  const productCerave = await upsertBySlug({
    payload,
    req,
    collection: 'products',
    slug: 'cerave-hydrating-cleanser',
    data: {
      title: 'پاک‌کننده آبرسان سراوی',
      generateSlug: false,
      summary: 'شستشوی ملایم بدون به‌هم‌زدن سد پوستی',
      description: richText(
        'حاوی سه سرامید ضروری و هیالورونیک اسید. مناسب پوست خشک و نرمال. بدون عطر.',
      ),
      featuredImage: img(2) || null,
      gallery: [img(2), img(0)].filter(Boolean),
      brand: brandCerave.id,
      categories: [catSkincare.id, catCleanser.id],
      price: 980000,
      compareAtPrice: 1150000,
      currencyLabel: 'تومان',
      availability: 'available',
      sku: 'CV-HC-473',
      meta: {
        title: 'پاک‌کننده آبرسان سراوی',
        description: 'شستشوی ملایم روزانه CeraVe',
        image: img(2) || null,
      },
      _status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  const productCeFerulic = await upsertBySlug({
    payload,
    req,
    collection: 'products',
    slug: 'ce-ferulic',
    data: {
      title: 'C E Ferulic',
      generateSlug: false,
      summary: 'آنتی‌اکسیدان قوی ویتامین C برای درخشندگی و استحکام',
      description: richText(
        'ترکیب ۱۵٪ ویتامین C خالص، ویتامین E و فرولیک اسید. استفاده صبحگاهی زیر ضدآفتاب توصیه می‌شود.',
      ),
      featuredImage: img(3) || null,
      gallery: [img(3), img(4)].filter(Boolean),
      brand: brandSkin.id,
      categories: [catSkincare.id, catSerum.id],
      price: 8900000,
      currencyLabel: 'تومان',
      availability: 'available',
      sku: 'SC-CEF-30',
      meta: {
        title: 'C E Ferulic | SkinCeuticals',
        description: 'سرم آنتی‌اکسیدان حرفه‌ای',
        image: img(3) || null,
      },
      _status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  const productToleriane = await upsertBySlug({
    payload,
    req,
    collection: 'products',
    slug: 'toleriane-sensitive',
    data: {
      title: 'تولریان سنستیو',
      generateSlug: false,
      summary: 'مرطوب‌کننده تسکین‌دهنده برای پوست خیلی حساس',
      description: richText(
        'فرمول مینیمال با پرهبیوتیک. بدون عطر، الکل و مواد تحریک‌کننده. مناسب مراقبت پایه روزانه.',
      ),
      featuredImage: img(4) || null,
      gallery: [img(4), img(5)].filter(Boolean),
      brand: brandLrp.id,
      categories: [catSkincare.id],
      // no price — tests empty-price UI
      currencyLabel: 'تومان',
      availability: 'coming_soon',
      sku: 'LRP-TS-40',
      meta: {
        title: 'تولریان سنستیو',
        description: 'مراقبت تسکینی برای پوست حساس',
        image: img(4) || null,
      },
      _status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  const productDakota = await upsertBySlug({
    payload,
    req,
    collection: 'products',
    slug: 'dakota-honey-leather',
    data: {
      title: 'چرم طرح داکوتا — عسلی',
      generateSlug: false,
      productId: 'M140-DAKOTA-214',
      printName: 'داکوتا عسلی',
      brandKey: 'dakota',
      categoryKey: 'synthetic-leather',
      active: true,
      colors: [
        { name: 'عسلی', sku: 'DK-214-HN', variantId: 'v-honey', b2bPrice: 420000, remains: 80 },
        { name: 'زغالی', sku: 'DK-214-CH', variantId: 'v-charcoal', b2bPrice: 420000, remains: 45 },
        { name: 'کرم', sku: 'DK-214-CR', variantId: 'v-cream', b2bPrice: 410000, remains: 30 },
      ],
      summary:
        'چرم مصنوعی با بافت دانه‌دار، انعطاف مناسب و سطح مقاوم؛ انتخابی کاربردی برای روکش صندلی و بخش‌های داخلی خودرو.',
      description: richText(
        'چرم مصنوعی داکوتا با بافت دانه‌دار و رنگ عسلی گرم، انتخابی کاربردی برای بازسازی و تودوزی فضای داخلی خودرو است. انعطاف مناسب این محصول باعث می‌شود هنگام برش و فرم‌دهی به‌خوبی روی سطوح مختلف بنشیند. سطح مقاوم و نظافت آسان آن نیز کمک می‌کند ظاهر صندلی و تریم خودرو در استفاده روزمره مرتب و یکدست باقی بماند.',
      ),
      featuredImage: img(0) || null,
      gallery: [img(0), img(1), img(2)].filter(Boolean),
      categories: [catLeather.id],
      sku: 'DK-214',
      badge: 'پرفروش',
      hidePrice: true,
      priceHint: 'برای قیمت روز تماس بگیرید',
      availability: 'available',
      specs: [
        { label: 'جنس', value: 'چرم مصنوعی PVC' },
        { label: 'رنگ', value: 'عسلی' },
        { label: 'عرض رول', value: '۱۴۰ سانتی‌متر' },
        { label: 'ضخامت', value: '۱٫۱ میلی‌متر' },
        { label: 'نوع بافت', value: 'دانه‌دار داکوتا' },
        { label: 'کاربرد', value: 'صندلی و تریم داخلی خودرو' },
        { label: 'نحوه فروش', value: 'متری / طاقه کامل' },
      ],
      colorSwatches: [
        { label: 'عسلی', hex: '#C4A574' },
        { label: 'زغالی', hex: '#2C241E' },
        { label: 'کرم', hex: '#E8DCC8' },
      ],
      meta: {
        title: 'چرم طرح داکوتا — عسلی',
        description:
          'چرم مصنوعی با بافت دانه‌دار برای روکش صندلی و تریم داخلی خودرو',
        image: img(0) || null,
      },
      _status: 'published',
      publishedAt: new Date().toISOString(),
    },
  })

  // Variants
  const variantSpecs: Array<{
    productId: string
    title: string
    sku: string
    options: { name: string; value: string; hex?: string }[]
    price?: number
    availability?: 'available' | 'unavailable' | 'limited'
    sortOrder: number
    imageIndex?: number
  }> = [
    {
      productId: productEffaclar.id,
      title: '۴۰ میلی‌لیتر',
      sku: 'LRP-ED-40',
      options: [{ name: 'حجم', value: '۴۰ml' }],
      price: 1850000,
      availability: 'available',
      sortOrder: 0,
      imageIndex: 0,
    },
    {
      productId: productEffaclar.id,
      title: '۷۵ میلی‌لیتر',
      sku: 'LRP-ED-75',
      options: [{ name: 'حجم', value: '۷۵ml' }],
      price: 2450000,
      availability: 'available',
      sortOrder: 1,
      imageIndex: 1,
    },
    {
      productId: productAnthelios.id,
      title: '۵۰ میلی‌لیتر — بی‌رنگ',
      sku: 'LRP-AL-50-C',
      options: [
        { name: 'حجم', value: '۵۰ml' },
        { name: 'رنگ', value: 'بی‌رنگ', hex: '#F5F0E6' },
      ],
      price: 2450000,
      availability: 'available',
      sortOrder: 0,
      imageIndex: 1,
    },
    {
      productId: productAnthelios.id,
      title: '۵۰ میلی‌لیتر — رنگی',
      sku: 'LRP-AL-50-T',
      options: [
        { name: 'حجم', value: '۵۰ml' },
        { name: 'رنگ', value: 'رنگی', hex: '#C4A574' },
      ],
      price: 2650000,
      availability: 'limited',
      sortOrder: 1,
      imageIndex: 2,
    },
    {
      productId: productAnthelios.id,
      title: '۵۰ میلی‌لیتر — ناموجود',
      sku: 'LRP-AL-50-X',
      options: [
        { name: 'حجم', value: '۵۰ml' },
        { name: 'رنگ', value: 'نمونه‌کار', hex: '#2C241E' },
      ],
      price: 2500000,
      availability: 'unavailable',
      sortOrder: 2,
    },
    {
      productId: productDakota.id,
      title: 'عسلی',
      sku: 'DK-214-HN',
      options: [{ name: 'رنگ', value: 'عسلی', hex: '#C4A574' }],
      availability: 'available',
      sortOrder: 0,
      imageIndex: 0,
    },
    {
      productId: productDakota.id,
      title: 'زغالی',
      sku: 'DK-214-CH',
      options: [{ name: 'رنگ', value: 'زغالی', hex: '#2C241E' }],
      availability: 'available',
      sortOrder: 1,
      imageIndex: 1,
    },
    {
      productId: productDakota.id,
      title: 'کرم',
      sku: 'DK-214-CR',
      options: [{ name: 'رنگ', value: 'کرم', hex: '#E8DCC8' }],
      availability: 'available',
      sortOrder: 2,
      imageIndex: 2,
    },
    {
      productId: productCerave.id,
      title: '۲۳۶ میلی‌لیتر',
      sku: 'CV-HC-236',
      options: [{ name: 'حجم', value: '۲۳۶ml' }],
      price: 980000,
      availability: 'available',
      sortOrder: 0,
    },
    {
      productId: productCerave.id,
      title: '۴۷۳ میلی‌لیتر',
      sku: 'CV-HC-473',
      options: [{ name: 'حجم', value: '۴۷۳ml' }],
      price: 1450000,
      availability: 'available',
      sortOrder: 1,
    },
    {
      productId: productCeFerulic.id,
      title: '۳۰ میلی‌لیتر',
      sku: 'SC-CEF-30',
      options: [{ name: 'حجم', value: '۳۰ml' }],
      price: 8900000,
      availability: 'available',
      sortOrder: 0,
      imageIndex: 3,
    },
  ]

  for (const spec of variantSpecs) {
    await payload.create({
      collection: 'variants',
      data: {
        product: spec.productId,
        title: spec.title,
        sku: spec.sku,
        options: spec.options,
        price: spec.price ?? null,
        availability: spec.availability || 'available',
        sortOrder: spec.sortOrder,
        image: typeof spec.imageIndex === 'number' ? img(spec.imageIndex) || null : null,
      },
      req,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  // Wire related products
  await payload.update({
    collection: 'products',
    id: productEffaclar.id,
    data: {
      relatedProducts: [productAnthelios.id, productToleriane.id, productCerave.id],
    },
    req,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  await payload.update({
    collection: 'products',
    id: productCeFerulic.id,
    data: {
      relatedProducts: [productEffaclar.id, productAnthelios.id],
      layout: [
        {
          blockType: 'productCarousel',
          populateBy: 'collection',
          categories: [catSerum.id],
          limit: 6,
        },
      ],
    },
    req,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  await payload.update({
    collection: 'products',
    id: productDakota.id,
    data: {
      relatedProducts: [productEffaclar.id, productAnthelios.id, productCerave.id],
      summary:
        'چرم مصنوعی با بافت دانه‌دار، انعطاف مناسب و سطح مقاوم؛ انتخابی کاربردی برای روکش صندلی و بخش‌های داخلی خودرو.',
      description: richText(
        'چرم مصنوعی داکوتا با بافت دانه‌دار و رنگ عسلی گرم، انتخابی کاربردی برای بازسازی و تودوزی فضای داخلی خودرو است. انعطاف مناسب این محصول باعث می‌شود هنگام برش و فرم‌دهی به‌خوبی روی سطوح مختلف بنشیند. سطح مقاوم و نظافت آسان آن نیز کمک می‌کند ظاهر صندلی و تریم خودرو در استفاده روزمره مرتب و یکدست باقی بماند.',
      ),
      specs: [
        { label: 'جنس', value: 'چرم مصنوعی PVC' },
        { label: 'رنگ', value: 'عسلی' },
        { label: 'عرض رول', value: '۱۴۰ سانتی‌متر' },
        { label: 'ضخامت', value: '۱٫۱ میلی‌متر' },
        { label: 'نوع بافت', value: 'دانه‌دار داکوتا' },
        { label: 'کاربرد', value: 'صندلی و تریم داخلی خودرو' },
        { label: 'نحوه فروش', value: 'متری / طاقه کامل' },
      ],
      hidePrice: true,
      priceHint: 'برای قیمت روز تماس بگیرید',
      availability: 'available',
      badge: 'پرفروش',
      sku: 'DK-214',
      _status: 'published',
    },
    req,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  // Header / footer / theme — match local defaults
  try {
    await payload.updateGlobal({
      slug: 'header',
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
      req,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  } catch (error) {
    payload.logger.warn(
      `Skipped header update: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  try {
    const footerLink = (label: string, url = '#') => ({
      link: { type: 'custom' as const, label, url },
    })

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
  } catch (error) {
    payload.logger.warn(
      `Skipped footer update: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  try {
    await payload.updateGlobal({
      slug: 'theme',
      data: {
        preset: 'zapier',
        colorScheme: 'light',
        orange: '#203a84',
        black: '#203a84',
        canvas: '',
        font: 'dana',
      },
      req,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  } catch (error) {
    payload.logger.warn(
      `Skipped theme update: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  // Phone match-surface products + partner-phone-mix live bundle (local default)
  const { seedPhoneBundle } = await import('./seedPhoneBundle')
  await seedPhoneBundle({ payload, req })

  payload.logger.info(
    `Catalog seed done: brands/categories + ${seedSlugs.length} products, ${variantSpecs.length} variants + phone bundle.`,
  )
  payload.logger.info('Try /products, /bundles, /bundles/partner-phone-mix')
}
