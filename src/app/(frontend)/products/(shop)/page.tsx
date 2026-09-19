import type { Metadata } from 'next/types'
import type { Where } from 'payload'

import { ProductArchive } from '@/components/ProductArchive'
import type { ProductCardData } from '@/components/ProductCard'
import { ProductPagination } from '@/components/products/ProductPagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import { resolveColorSwatches } from '@/utilities/productDisplay'
import { formatDocumentTitle, getSiteName } from '@/utilities/siteName'
import PageClient from './page.client'

export const revalidate = 600

type Args = {
  searchParams: Promise<{
    brand?: string
    category?: string
    page?: string
    q?: string
    sort?: string
  }>
}

const allowedSorts = new Set(['title', '-publishedAt', 'price', '-price'])

async function resolveTaxonomyId(
  collection: 'brands' | 'product-categories',
  slugOrId?: string,
): Promise<string | null> {
  if (!slugOrId) return null
  const payload = await getPayload({ config: configPromise })

  const bySlug = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slugOrId } },
  })
  if (bySlug.docs[0]?.id) return String(bySlug.docs[0].id)

  return slugOrId
}

export default async function ProductsPage({ searchParams: searchParamsPromise }: Args) {
  const { brand, category, page: pageParam, q, sort: sortParam } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })
  const page = Math.max(1, Number(pageParam) || 1)
  const sort = sortParam && allowedSorts.has(sortParam) ? sortParam : '-publishedAt'

  const [brandId, categoryId] = await Promise.all([
    resolveTaxonomyId('brands', brand),
    resolveTaxonomyId('product-categories', category),
  ])

  const and: Where[] = []
  if (brandId) and.push({ brand: { equals: brandId } })
  if (categoryId) and.push({ categories: { in: [categoryId] } })
  if (q?.trim()) {
    and.push({
      or: [
        { title: { like: q.trim() } },
        { summary: { like: q.trim() } },
        { 'meta.description': { like: q.trim() } },
      ],
    })
  }

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    page,
    overrideAccess: false,
    sort,
    where: and.length ? { and } : undefined,
    select: {
      title: true,
      slug: true,
      summary: true,
      featuredImage: true,
      brand: true,
      categories: true,
      price: true,
      compareAtPrice: true,
      currencyLabel: true,
      availability: true,
      meta: true,
      badge: true,
      hidePrice: true,
      colorSwatches: true,
    },
  })

  const productIds = products.docs.map((doc) => doc.id)
  const variantsByProduct = new Map<string, { options?: { name?: string | null; value?: string | null; hex?: string | null }[] | null }[]>()

  if (productIds.length) {
    const variants = await payload.find({
      collection: 'variants',
      depth: 0,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      where: {
        product: {
          in: productIds,
        },
      },
      select: {
        product: true,
        options: true,
      },
    })

    for (const variant of variants.docs) {
      const productRef = variant.product
      const id =
        typeof productRef === 'object' && productRef
          ? String(productRef.id)
          : String(productRef)
      const list = variantsByProduct.get(id) || []
      list.push({ options: variant.options })
      variantsByProduct.set(id, list)
    }
  }

  const cards: ProductCardData[] = products.docs.map((doc) => ({
    ...doc,
    colorSwatchesResolved: resolveColorSwatches(
      doc,
      variantsByProduct.get(String(doc.id)),
    ),
  }))

  const resultsLabel =
    products.totalDocs === 0
      ? q
        ? `نتیجه‌ای برای «${q}» پیدا نشد.`
        : 'محصولی یافت نشد.'
      : q
        ? `${products.totalDocs} نتیجه برای «${q}»`
        : `${products.totalDocs} محصول`

  return (
    <div>
      <PageClient />
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black">محصولات</h1>
        <p className="mt-2 text-sm text-black/60">{resultsLabel}</p>
      </div>

      {cards.length ? (
        <>
          <ProductArchive products={cards} />
          <Suspense fallback={null}>
            <ProductPagination page={products.page || 1} totalPages={products.totalPages || 1} />
          </Suspense>
        </>
      ) : (
        <p className="text-black/60">فیلترها را تغییر دهید یا بعداً دوباره تلاش کنید.</p>
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName()
  const title = formatDocumentTitle('محصولات', siteName)

  return { title }
}
