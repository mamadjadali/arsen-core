'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { cn } from '@/utilities/ui'

export function ProductPagination({
  page,
  totalPages,
}: {
  page: number
  totalPages: number
}) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (nextPage <= 1) params.delete('page')
    else params.set('page', String(nextPage))
    const qs = params.toString()
    return qs ? `/products?${qs}` : '/products'
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn(
          'rounded-md border border-black/15 px-3 py-1.5 text-sm',
          page <= 1 && 'pointer-events-none opacity-40',
        )}
      >
        قبلی
      </Link>
      <span className="text-sm text-black/60">
        {page} / {totalPages}
      </span>
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={cn(
          'rounded-md border border-black/15 px-3 py-1.5 text-sm',
          page >= totalPages && 'pointer-events-none opacity-40',
        )}
      >
        بعدی
      </Link>
    </div>
  )
}
