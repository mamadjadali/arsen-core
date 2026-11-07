import React from 'react'

export default function BundlesLoading() {
  return (
    <div
      className="container py-10 md:py-14"
      dir="rtl"
      aria-busy="true"
      aria-label="در حال بارگذاری سبدها"
    >
      <header className="mb-8 md:mb-10">
        <div className="mb-2 h-3 w-24 animate-pulse rounded bg-black/10" />
        <div className="h-8 w-48 max-w-full animate-pulse rounded bg-black/10" />
      </header>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-lg border border-black/10 bg-white px-3 py-3"
          >
            <span className="size-12 shrink-0 animate-pulse rounded-sm bg-black/10" />
            <span className="h-3.5 flex-1 animate-pulse rounded bg-black/10" />
          </li>
        ))}
      </ul>
    </div>
  )
}
