import React, { Suspense } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { ProductFilterList } from '@/components/products/ProductFilterList'
import { ProductSearch } from '@/components/products/ProductSearch'

const sortOptions = [
  { id: 'title', title: 'عنوان (الفبا)' },
  { id: '-publishedAt', title: 'جدیدترین' },
  { id: 'price', title: 'قیمت: کم به زیاد' },
  { id: '-price', title: 'قیمت: زیاد به کم' },
]

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: configPromise })

  const [brands, categories] = await Promise.all([
    payload.find({
      collection: 'brands',
      depth: 0,
      limit: 100,
      pagination: false,
      select: { title: true, slug: true },
      sort: 'title',
    }),
    payload.find({
      collection: 'product-categories',
      depth: 0,
      limit: 100,
      pagination: false,
      select: { title: true, slug: true },
      sort: 'title',
    }),
  ])

  return (
    <div className="container py-10 md:py-14">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <aside className="w-full shrink-0 lg:w-56">
          <div className="sticky top-24 flex flex-col gap-8">
            <Suspense fallback={null}>
              <ProductSearch />
            </Suspense>
            <Suspense fallback={null}>
              <ProductFilterList
                title="دسته‌بندی"
                paramKey="category"
                items={categories.docs.map((doc) => ({
                  id: doc.id,
                  slug: doc.slug,
                  title: doc.title,
                }))}
              />
            </Suspense>
            <Suspense fallback={null}>
              <ProductFilterList
                title="برند"
                paramKey="brand"
                items={brands.docs.map((doc) => ({
                  id: doc.id,
                  slug: doc.slug,
                  title: doc.title,
                }))}
              />
            </Suspense>
            <Suspense fallback={null}>
              <ProductFilterList title="مرتب‌سازی" paramKey="sort" items={sortOptions} />
            </Suspense>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
