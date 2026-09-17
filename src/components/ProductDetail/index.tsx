'use client'

import React, { useMemo, useState } from 'react'

import type { Media, Product, Variant } from '@/payload-types'

import { Gallery } from '@/components/product/Gallery'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import {
  formatPrice,
  getAvailabilityLabel,
  isEffectivelyAvailable,
  resolveDisplayPrice,
} from '@/utilities/productDisplay'

type ProductDetailProps = {
  product: Product
  variants: Variant[]
}

function optionGroups(variants: Variant[]): { name: string; values: string[] }[] {
  const map = new Map<string, Set<string>>()

  for (const variant of variants) {
    for (const option of variant.options || []) {
      if (!option?.name || !option?.value) continue
      if (!map.has(option.name)) map.set(option.name, new Set())
      map.get(option.name)!.add(option.value)
    }
  }

  return Array.from(map.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values),
  }))
}

function findVariant(
  variants: Variant[],
  selected: Record<string, string>,
): Variant | null {
  if (!variants.length) return null

  const match = variants.find((variant) => {
    const opts = variant.options || []
    if (!opts.length) return false
    return opts.every((opt) => opt?.name && selected[opt.name] === opt.value)
  })

  return match || variants[0] || null
}

function wouldBeUnavailable(
  variants: Variant[],
  selected: Record<string, string>,
  name: string,
  value: string,
  productAvailability: Product['availability'],
): boolean {
  const next = { ...selected, [name]: value }
  const match = variants.find((variant) => {
    const opts = variant.options || []
    if (!opts.length) return false
    return opts.every((opt) => opt?.name && next[opt.name] === opt.value)
  })
  if (!match) return true
  return !isEffectivelyAvailable(productAvailability, match.availability)
}

export function ProductDetail({ product, variants }: ProductDetailProps) {
  const groups = useMemo(() => optionGroups(variants), [variants])

  const initialSelected = useMemo(() => {
    const first = variants[0]
    const selected: Record<string, string> = {}
    for (const opt of first?.options || []) {
      if (opt?.name && opt?.value) selected[opt.name] = opt.value
    }
    return selected
  }, [variants])

  const [selected, setSelected] = useState<Record<string, string>>(initialSelected)
  const activeVariant = findVariant(variants, selected)

  const pricing = resolveDisplayPrice(product, activeVariant)
  const headlineAvailability = product.availability
  const variantAvailability = activeVariant?.availability
  const available = isEffectivelyAvailable(headlineAvailability, variantAvailability)
  const availabilityLabel = getAvailabilityLabel(
    available
      ? variantAvailability && variantAvailability !== 'available'
        ? variantAvailability
        : headlineAvailability
      : 'unavailable',
  )

  const gallery: Media[] = []
  if (typeof product.featuredImage === 'object' && product.featuredImage) {
    gallery.push(product.featuredImage)
  }
  for (const item of product.gallery || []) {
    if (typeof item === 'object' && item && !gallery.some((g) => g.id === item.id)) {
      gallery.push(item)
    }
  }
  if (
    typeof activeVariant?.image === 'object' &&
    activeVariant.image &&
    !gallery.some((g) => g.id === (activeVariant.image as Media).id)
  ) {
    gallery.unshift(activeVariant.image as Media)
  }

  const preferredImageId =
    typeof activeVariant?.image === 'object' && activeVariant.image
      ? (activeVariant.image as Media).id
      : gallery[0]?.id

  const brandTitle =
    typeof product.brand === 'object' && product.brand ? product.brand.title : null
  const categoryTitles =
    product.categories
      ?.map((c) => (typeof c === 'object' ? c.title : null))
      .filter(Boolean)
      .join('، ') || null

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <Gallery images={gallery} preferredImageId={preferredImageId} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {(brandTitle || categoryTitles) && (
            <p className="text-sm text-black/55">
              {[brandTitle, categoryTitles].filter(Boolean).join(' · ')}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-black md:text-4xl">
            {product.title}
          </h1>
          {product.summary ? <p className="text-base text-black/70">{product.summary}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {typeof pricing.price === 'number' ? (
            <p className="text-2xl font-semibold text-black">
              {formatPrice(pricing.price, pricing.currencyLabel)}
            </p>
          ) : null}
          {typeof pricing.compareAtPrice === 'number' &&
          typeof pricing.price === 'number' &&
          pricing.compareAtPrice > pricing.price ? (
            <p className="text-lg text-black/45 line-through">
              {formatPrice(pricing.compareAtPrice, pricing.currencyLabel)}
            </p>
          ) : null}
          {availabilityLabel ? (
            <span
              className={cn(
                'rounded-full px-3 py-1 text-sm',
                available ? 'bg-emerald-500/10 text-emerald-800' : 'bg-black/5 text-black/60',
              )}
            >
              {availabilityLabel}
            </span>
          ) : null}
        </div>

        {groups.length > 0 ? (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <div key={group.name} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-black">{group.name}</p>
                <div className="flex flex-wrap gap-2">
                  {group.values.map((value) => {
                    const isActive = selected[group.name] === value
                    const disabled = wouldBeUnavailable(
                      variants,
                      selected,
                      group.name,
                      value,
                      product.availability,
                    )
                    return (
                      <button
                        key={value}
                        type="button"
                        disabled={disabled && !isActive}
                        className={cn(
                          'min-w-12 rounded-full border px-4 py-2 text-sm transition-colors',
                          isActive
                            ? 'border-black bg-black text-white'
                            : 'border-black/20 bg-transparent text-black hover:border-black/50',
                          disabled && !isActive && 'cursor-not-allowed opacity-35 hover:border-black/20',
                        )}
                        onClick={() =>
                          setSelected((prev) => ({
                            ...prev,
                            [group.name]: value,
                          }))
                        }
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            {activeVariant ? (
              <p className="text-sm text-black/55">
                {activeVariant.title}
                {activeVariant.sku ? ` · ${activeVariant.sku}` : ''}
              </p>
            ) : null}
          </div>
        ) : null}

        {product.description ? (
          <div className="border-t border-black/10 pt-6 prose dark:prose-invert max-w-none">
            <RichText data={product.description} enableGutter={false} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
