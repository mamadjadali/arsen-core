import configPromise from '@payload-config'
import type { DefaultDocumentIDType, Where } from 'payload'
import { getPayload } from 'payload'
import React from 'react'

import type { Product, ProductCarouselBlock as ProductCarouselBlockProps } from '@/payload-types'

import { ProductCarouselClient } from './Component.client'

export const ProductCarouselBlock: React.FC<
  ProductCarouselBlockProps & {
    id?: DefaultDocumentIDType
  }
> = async (props) => {
  const {
    brands,
    categories,
    limit = 10,
    populateBy = 'collection',
    selectedDocs,
  } = props

  let products: Product[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })
    const and: Where[] = [{ _status: { equals: 'published' } }]

    const categoryIds =
      categories
        ?.map((category) => (typeof category === 'object' ? category.id : category))
        .filter(Boolean) || []

    const brandIds =
      brands?.map((brand) => (typeof brand === 'object' ? brand.id : brand)).filter(Boolean) || []

    if (categoryIds.length) {
      and.push({ categories: { in: categoryIds } })
    }
    if (brandIds.length) {
      and.push({ brand: { in: brandIds } })
    }

    const fetched = await payload.find({
      collection: 'products',
      depth: 1,
      limit: limit || 10,
      overrideAccess: false,
      where: { and },
      select: {
        title: true,
        slug: true,
        featuredImage: true,
        price: true,
        compareAtPrice: true,
        currencyLabel: true,
        availability: true,
        meta: true,
      },
    })

    products = fetched.docs as Product[]
  } else if (selectedDocs?.length) {
    products = selectedDocs.filter(
      (doc): doc is Product => typeof doc === 'object' && doc !== null,
    )
  }

  if (!products.length) return null

  return (
    <div className="container">
      <ProductCarouselClient products={products} />
    </div>
  )
}
