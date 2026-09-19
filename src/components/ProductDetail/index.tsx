'use client'

import React, { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import type { Media, Product, Variant } from '@/payload-types'

import { Gallery } from '@/components/product/Gallery'
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
  inquiryPhone?: string | null
  inquiryButtonLabel?: string | null
}

const DEFAULT_PRICE_HINT = 'برای قیمت روز تماس بگیرید'
const DEFAULT_INQUIRY_LABEL = 'استعلام قیمت و موجودی'

function toTelHref(phone: string): string {
  const trimmed = phone.trim()
  if (!trimmed) return ''
  if (trimmed.toLowerCase().startsWith('tel:')) return trimmed
  return `tel:${trimmed.replace(/[^\d+]/g, '')}`
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

export function ProductDetail({
  product,
  variants,
  inquiryPhone,
  inquiryButtonLabel,
}: ProductDetailProps) {
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
  const showPrice =
    !product.hidePrice && typeof pricing.price === 'number'
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
  const firstCategory =
    product.categories
      ?.map((c) => (typeof c === 'object' ? c : null))
      .find(Boolean) || null
  const categoryTitle = firstCategory?.title || null
  const eyebrowTaxonomy = categoryTitle || brandTitle

  const displaySku = product.sku?.trim() || activeVariant?.sku?.trim() || null
  const eyebrowParts = [
    eyebrowTaxonomy,
    displaySku ? `کد ${displaySku}` : null,
  ].filter(Boolean)

  const phone =
    product.inquiryPhoneOverride?.trim() || inquiryPhone?.trim() || ''
  const telHref = phone ? toTelHref(phone) : ''
  const ctaLabel = inquiryButtonLabel?.trim() || DEFAULT_INQUIRY_LABEL
  const priceHint =
    product.priceHint?.trim() || DEFAULT_PRICE_HINT
  const showPriceHint = !showPrice

  return (
    <>
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <Gallery
        images={gallery}
        preferredImageId={preferredImageId}
        badge={product.badge}
      />

        <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {eyebrowParts.length ? (
            <p className="text-sm text-[var(--color-body,var(--color-ink))] opacity-70">
              {eyebrowParts.join(' / ')}
            </p>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-ink)] md:text-4xl">
            {product.title}
          </h1>
          {product.summary ? (
            <p className="text-base text-[var(--color-body,var(--color-ink))] opacity-80">
              {product.summary}
            </p>
          ) : null}
        </div>

        <div className="border-y border-[color-mix(in_srgb,var(--color-ink)_12%,transparent)] py-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            {availabilityLabel ? (
              <span className="inline-flex items-center gap-2 text-sm text-[var(--color-ink)]">
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-full shadow-[0_0_0_4px_rgba(16,185,129,0.15)]',
                    available ? 'bg-emerald-600' : 'bg-[var(--color-ink)]/30 shadow-none',
                  )}
                  aria-hidden
                />
                <strong className="font-medium">
                  {showPriceHint && available
                    ? 'موجود و آماده سفارش'
                    : availabilityLabel}
                </strong>
              </span>
            ) : null}
            {showPriceHint ? (
              <span className="text-sm text-[var(--color-body,var(--color-ink))] opacity-70">
                {priceHint}
              </span>
            ) : null}
            {showPrice ? (
              <span className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-semibold text-[var(--color-ink)]">
                  {formatPrice(pricing.price!, pricing.currencyLabel)}
                </span>
                {typeof pricing.compareAtPrice === 'number' &&
                pricing.compareAtPrice > pricing.price! ? (
                  <span className="text-lg text-[var(--color-ink)] opacity-45 line-through">
                    {formatPrice(pricing.compareAtPrice, pricing.currencyLabel)}
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>

        {showPriceHint ? (
          <a
            href={telHref || '/contact'}
            className="inquiry-cta inline-flex w-full min-h-[60px] items-center justify-center gap-8 rounded-lg border px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            {ctaLabel}
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
          </a>
        ) : telHref ? (
          <a
            href={telHref}
            className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-md border border-black bg-black px-6 text-sm font-medium text-[var(--color-canvas)] transition-colors hover:bg-black/90"
          >
            {ctaLabel}
          </a>
        ) : null}

        {groups.length > 0 ? (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <div key={group.name} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[var(--color-ink)]">{group.name}</p>
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
                            ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-canvas)]'
                            : 'border-[var(--color-ink)]/20 bg-transparent text-[var(--color-ink)] hover:border-[var(--color-ink)]/50',
                          disabled &&
                            !isActive &&
                            'cursor-not-allowed opacity-35 hover:border-[var(--color-ink)]/20',
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
              <p className="text-sm text-[var(--color-body,var(--color-ink))] opacity-70">
                {activeVariant.title}
                {activeVariant.sku ? ` · ${activeVariant.sku}` : ''}
              </p>
            ) : null}
          </div>
        ) : null}

      </div>
    </div>
    </>
  )
}
