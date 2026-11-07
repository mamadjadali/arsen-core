'use client'

import React from 'react'

type BundlesErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BundlesError({ error, reset }: BundlesErrorProps) {
  return (
    <div className="container py-10 md:py-14" dir="rtl">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        خطا در بارگذاری سبدها
      </h1>
      <p className="mt-3 text-[var(--color-body)]">
        {error.message?.trim() || 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.'}
      </p>
      <button
        type="button"
        className="mt-5 rounded-md border border-black/10 bg-[var(--color-canvas-soft)] px-4 py-2 text-sm text-[var(--color-ink)] transition-colors hover:bg-black/[0.03]"
        onClick={reset}
      >
        تلاش مجدد
      </button>
    </div>
  )
}
