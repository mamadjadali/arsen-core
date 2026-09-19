'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import React from 'react'

import type { Brand, Media, Product, ProductCategory } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import {
  formatPrice,
  resolveColorSwatches,
  resolveDisplayPrice,
  type ColorSwatch,
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
  | 'badge'
  | 'hidePrice'
  | 'colorSwatches'
> & {
  colorSwatchesResolved?: ColorSwatch[]
}

export function ProductCard({
  className,
  doc,
}: {
  className?: string
  doc: ProductCardData
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
    meta,
    badge,
    hidePrice,
    colorSwatches,
    colorSwatchesResolved,
  } = doc

  const image =
    (typeof featuredImage === 'object' && featuredImage) ||
    (typeof meta?.image === 'object' && meta.image) ||
    null

  const brandDoc = typeof brand === 'object' && brand ? (brand as Brand) : null
  const firstCategory =
    categories
      ?.map((c) => (typeof c === 'object' ? (c as ProductCategory) : null))
      .find(Boolean) || null
  const categoryLabel = firstCategory?.title || brandDoc?.title || null

  const pricing = resolveDisplayPrice({ price, compareAtPrice, currencyLabel })
  const href = `/products/${slug}`
  const showPrice = !hidePrice && typeof pricing.price === 'number'
  const amount = showPrice ? formatPrice(pricing.price!, pricing.currencyLabel) : null
  const badgeText = typeof badge === 'string' ? badge.trim() : ''
  const swatches =
    colorSwatchesResolved ||
    resolveColorSwatches({ colorSwatches })

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-black/10 bg-[var(--color-canvas-soft)]',
        className,
      )}
      ref={card.ref}
    >
      <Link href={href} ref={link.ref} className="relative block aspect-[4/3]" aria-label={title}>
        {badgeText ? (
          <span className="absolute top-3 right-3 z-10 rounded-sm bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
            {badgeText}
          </span>
        ) : null}
        {image && typeof image === 'object' ? (
          <MediaComponent
            resource={image as Media}
            fill
            imgClassName="object-cover"
            size="(min-width: 768px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--color-canvas)] text-sm text-black/40">
            بدون تصویر
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 px-3.5 pt-3.5 pb-3">
        {categoryLabel ? (
          <p className="text-xs text-[color:var(--color-body,var(--color-ink))] opacity-70">
            {categoryLabel}
          </p>
        ) : null}
        <Link
          href={href}
          className="text-base font-medium leading-snug text-[color:var(--color-ink)] transition-colors hover:text-[color:var(--brand-orange,var(--color-primary))]"
        >
          {title}
        </Link>
        {amount ? (
          <p className="text-sm text-[color:var(--color-body,var(--color-ink))] opacity-80">
            {amount}
          </p>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--color-ink)]/10 px-3.5 py-3">
        <div className="flex items-center gap-1.5">
          {swatches.slice(0, 5).map((swatch) => (
            <span
              key={`${swatch.hex}-${swatch.label || ''}`}
              title={swatch.label || swatch.hex}
              className="size-3.5 rounded-full border border-[color:var(--color-ink)]/20"
              style={{ backgroundColor: swatch.hex }}
            />
          ))}
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--color-ink)] transition-opacity hover:opacity-80"
        >
          استعلام قیمت
          <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
