import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { BundlesList } from './BundlesList'
import { toBundleListItem } from '@/utilities/liveBundleDisplay'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'سبدهای زنده',
  description: 'فهرست سبدهای منتشرشده برای شرکای تجاری',
}

export default async function BundlesPage() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'live-bundles',
    where: { status: { equals: 'live' } },
    sort: '-publishedAt',
    depth: 2,
    limit: 100,
    overrideAccess: false,
    select: {
      name: true,
      slug: true,
      notes: true,
      brandLogos: true,
      lines: true,
      publishedAt: true,
    },
  })

  const bundles = result.docs.map(toBundleListItem)

  return (
    <div className="container py-10 md:py-14" dir="rtl">
      <header className="mb-8 md:mb-10">
        <p className="mb-2 text-sm text-[var(--color-body)]">کاتالوگ همکار</p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] md:text-3xl">
          سبدهای زنده
        </h1>
      </header>

      {bundles.length === 0 ? (
        <p className="text-[var(--color-body)]">سبدی منتشر نشده است.</p>
      ) : (
        <BundlesList bundles={bundles} />
      )}
    </div>
  )
}
