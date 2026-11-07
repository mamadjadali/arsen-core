'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { LiveBundleLinesTable } from '@/components/LiveBundleLinesTable'
import { buttonVariants } from '@/components/ui/button'
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import type { BundleListItemDto } from '@/utilities/liveBundleDisplay'
import { cn } from '@/utilities/ui'

type BundlesListProps = {
  bundles: BundleListItemDto[]
}

function Thumb({
  src,
  alt,
  letter,
  size = 48,
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
        unoptimized={src.startsWith('/')}
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

export function BundlesList({ bundles }: BundlesListProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const openBundle = bundles.find((b) => b.id === openId) || null

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bundles.map((bundle) => (
          <li
            key={bundle.id}
            className="flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white"
          >
            <button
              type="button"
              className="flex w-full items-center gap-3 px-3 py-3 text-right text-[var(--color-ink)] transition-colors hover:bg-black/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-ink)]"
              aria-haspopup="dialog"
              onClick={() => setOpenId(bundle.id)}
            >
              <span className="shrink-0 overflow-hidden rounded-sm border border-black/10">
                <Thumb src={bundle.logoUrl} alt="" letter={bundle.name} />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{bundle.name}</span>
              <span className="shrink-0 text-xs text-[var(--color-body)]" aria-hidden>
                ▾
              </span>
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
                      <Thumb
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
