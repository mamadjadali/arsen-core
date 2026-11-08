'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { LiveBundleLinesTable } from '@/components/LiveBundleLinesTable'
import { buttonVariants } from '@/components/ui/button'
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import {
  formatBundleThumbBadge,
  getBundlePreviewLimits,
} from '@/utilities/bundlePreview'
import type { BundleListItemDto } from '@/utilities/liveBundleDisplay'
import { shouldUnoptimizeImageSrc } from '@/utilities/nextImageSrc'
import { cn } from '@/utilities/ui'

type BundlesListProps = {
  bundles: BundleListItemDto[]
}

const THUMB_PX = 38

function BrandThumb({
  src,
  alt,
  letter,
  size = 40,
}: {
  src: string | null
  alt: string
  letter?: string
  size?: number
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        style={{ width: size, height: size }}
        unoptimized={shouldUnoptimizeImageSrc(src)}
      />
    )
  }

  return (
    <span
      className="flex items-center justify-center bg-[var(--color-canvas)] text-sm font-semibold text-[var(--color-body)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {(letter || alt || '?').trim().charAt(0) || '?'}
    </span>
  )
}

function ProductMini({
  src,
  name,
  quantityLabel,
}: {
  src: string | null
  name: string
  quantityLabel?: string | null
}) {
  const badge = formatBundleThumbBadge(quantityLabel)

  return (
    <span className="relative block size-[38px] shrink-0" title={name}>
      <span className="block size-[38px] overflow-hidden rounded-md border border-black/10 bg-[var(--color-canvas)]">
        {src ? (
          <Image
            src={src}
            alt=""
            width={THUMB_PX}
            height={THUMB_PX}
            className="size-[38px] object-cover"
            unoptimized={shouldUnoptimizeImageSrc(src)}
          />
        ) : (
          <span className="flex size-[38px] items-center justify-center text-[10px] font-semibold text-[var(--color-body)]">
            {(name || '?').trim().charAt(0) || '?'}
          </span>
        )}
      </span>
      {badge ? (
        <span className="pointer-events-none absolute -right-1.5 -top-1.5 z-10 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--color-ink)] px-1 text-[9px] font-bold leading-none text-white shadow-sm">
          {badge}
        </span>
      ) : null}
    </span>
  )
}

function BundlePreviewGrid({
  rows,
}: {
  rows: BundleListItemDto['rows']
}) {
  const limits = getBundlePreviewLimits(rows.length)
  const moreLabelMobile = `+${new Intl.NumberFormat('fa-IR').format(limits.moreCountMobile)} بیشتر`
  const moreLabelDesktop = `+${new Intl.NumberFormat('fa-IR').format(limits.moreCountDesktop)} بیشتر`

  if (limits.total === 0) {
    return (
      <p className="flex min-h-[90px] items-center text-xs text-[var(--color-body)]">
        آیتمی در این سبد نیست.
      </p>
    )
  }

  const thumbs = rows.slice(0, limits.thumbSliceCount)

  return (
    <div className="grid min-h-[90px] grid-cols-4 content-start gap-2.5 pt-1 lg:grid-cols-6">
      {thumbs.map((row, index) => (
        <span
          key={row.key}
          className={cn(
            'overflow-visible',
            index >= limits.mobileThumbLimit && 'hidden lg:block',
          )}
        >
          <ProductMini
            src={row.imageUrl}
            name={row.name}
            quantityLabel={row.quantityLabel}
          />
        </span>
      ))}
      {limits.moreCountMobile > 0 ? (
        <span className="flex size-[38px] items-center justify-center rounded-md border border-dashed border-black/15 bg-[var(--color-canvas)] px-0.5 text-center text-[9px] font-semibold leading-tight text-[var(--color-ink)] lg:hidden">
          {moreLabelMobile}
        </span>
      ) : null}
      {limits.moreCountDesktop > 0 ? (
        <span className="hidden size-[38px] items-center justify-center rounded-md border border-dashed border-black/15 bg-[var(--color-canvas)] px-0.5 text-center text-[9px] font-semibold leading-tight text-[var(--color-ink)] lg:flex">
          {moreLabelDesktop}
        </span>
      ) : null}
    </div>
  )
}

export function BundlesList({ bundles }: BundlesListProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const openBundle = bundles.find((b) => b.id === openId) || null

  return (
    <>
      <ul className="grid auto-rows-fr grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bundles.map((bundle) => (
          <li key={bundle.id} className="h-full">
            <button
              type="button"
              className="flex h-full min-h-full w-full flex-col gap-3 rounded-lg border border-black/10 bg-white p-3 text-right text-[var(--color-ink)] transition-colors hover:bg-black/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-ink)]"
              aria-haspopup="dialog"
              onClick={() => setOpenId(bundle.id)}
            >
              <div className="flex w-full shrink-0 items-center gap-2">
                <span className="shrink-0 overflow-hidden rounded-sm border border-black/10">
                  <BrandThumb src={bundle.logoUrl} alt="" letter={bundle.name} size={32} />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{bundle.name}</span>
              </div>

              <div className="min-h-[90px] flex-1">
                <BundlePreviewGrid rows={bundle.rows} />
              </div>

              <div className="mt-auto flex shrink-0 items-center justify-between gap-2 border-t border-black/5 pt-2 text-[11px] text-[var(--color-body)]">
                <span>جمع تعداد: {bundle.totals?.quantityLabel ?? '—'}</span>
                <span className="truncate font-medium text-[var(--color-ink)]">
                  {bundle.totals?.priceLabel ?? '—'}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={Boolean(openBundle)} onOpenChange={(open) => !open && setOpenId(null)}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40 backdrop-blur-md supports-[backdrop-filter]:bg-black/30" />
          <DialogPrimitive.Content
            dir="rtl"
            className="fixed bottom-0 left-1/2 z-50 flex max-h-[min(88dvh,900px)] w-full max-w-[1400px] -translate-x-1/2 flex-col overflow-hidden rounded-t-2xl border border-black/10 bg-white text-[var(--color-ink)] shadow-2xl outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
          >
            {openBundle ? (
              <>
                <div className="relative shrink-0 border-b border-black/10 px-5 pb-4 pt-5 md:px-8">
                  <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/15" aria-hidden />
                  <div className="flex items-center gap-3 pl-10">
                    <span className="shrink-0 overflow-hidden rounded-md border border-black/10">
                      <BrandThumb
                        src={openBundle.logoUrl}
                        alt=""
                        letter={openBundle.name}
                        size={48}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <DialogPrimitive.Title className="text-lg font-semibold tracking-tight md:text-xl">
                        {openBundle.name}
                      </DialogPrimitive.Title>
                      {openBundle.jalaliPublishedAt ? (
                        <p className="mt-1 text-xs text-[var(--color-body)]" dir="rtl">
                          {openBundle.jalaliPublishedAt}
                        </p>
                      ) : null}
                      <DialogPrimitive.Description className="sr-only">
                        جزئیات سبد
                      </DialogPrimitive.Description>
                    </div>
                  </div>
                  <DialogPrimitive.Close className="absolute top-4 left-4 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-[var(--color-ink)]/20 focus:outline-none">
                    <X className="size-4" />
                    <span className="sr-only">بستن</span>
                  </DialogPrimitive.Close>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6">
                  <LiveBundleLinesTable rows={openBundle.rows} variant="panel" />
                </div>

                <div className="shrink-0 px-5 py-3 md:px-8 md:py-4">
                  <div className="flex justify-stretch md:justify-end">
                    <Link
                      href={`/bundles/${openBundle.slug}`}
                      className={cn(
                        buttonVariants({ variant: 'default', size: 'default' }),
                        'w-full md:w-auto',
                      )}
                    >
                      خرید
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  )
}
