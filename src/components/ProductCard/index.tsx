'use client'

import Link from 'next/link'
import React from 'react'

import type { Brand, Media, Product, ProductCategory } from '@/payload-types'

import { GridTileImage } from '@/components/Grid/tile'
import {
  formatPrice,
  getAvailabilityLabel,
  resolveDisplayPrice,
} from '@/utilities/productDisplay'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'

export type ProductCardData = Pick<
  Product,
  | 'slug'
  | 'title'
  | 'summary'
  | 'featuredImage'
  | 'brand'
  | 'categories'
  | 'price'
  | 'compareAtPrice'
  | 'currencyLabel'
  | 'availability'
  | 'meta'
>

export function ProductCard({
  className,
  doc,
  priority = false,
}: {
  className?: string
  doc: ProductCardData
  priority?: boolean
}) {
  const { card, link } = useClickableCard({})
  const {
    slug,
    title,
    featuredImage,
    brand,
    categories,
    price,
    compareAtPrice,
    currencyLabel,
    availability,
    meta,
  } = doc

  const image =
    (typeof featuredImage === 'object' && featuredImage) ||
    (typeof meta?.image === 'object' && meta.image) ||
    null

  const brandDoc = typeof brand === 'object' && brand ? (brand as Brand) : null
  const categoryTitles =
    categories
      ?.map((c) => (typeof c === 'object' ? (c as ProductCategory).title : null))
      .filter(Boolean)
      .join('، ') || null

  const pricing = resolveDisplayPrice({ price, compareAtPrice, currencyLabel })
  const availabilityLabel = getAvailabilityLabel(availability)
  const href = `/products/${slug}`
  const amount =
    typeof pricing.price === 'number'
      ? formatPrice(pricing.price, pricing.currencyLabel)
      : null

  return (
    <article className={cn('flex flex-col gap-2', className)} ref={card.ref}>
      <Link href={href} ref={link.ref} className="relative block" aria-label={title}>
        <GridTileImage
          media={image as Media | null}
          label={{
            title,
            amount,
            position: 'bottom',
          }}
        />
        {priority ? null : null}
      </Link>
      <div className="flex flex-wrap items-center gap-2 px-0.5 text-xs text-black/55">
        {[brandDoc?.title, categoryTitles].filter(Boolean).join(' · ') || null}
        {availabilityLabel ? (
          <span className="rounded-sm bg-black/5 px-1.5 py-0.5 text-black/70">
            {availabilityLabel}
          </span>
        ) : null}
      </div>
    </article>
  )
}
