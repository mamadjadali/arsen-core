'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { cn } from '@/utilities/ui'

type Item = {
  id: string
  slug?: string | null
  title: string
}

function hrefWithParam(searchParams: URLSearchParams, key: string, value?: string | null) {
  const params = new URLSearchParams(searchParams.toString())
  params.delete('page')
  if (!value) params.delete(key)
  else params.set(key, value)
  const qs = params.toString()
  return qs ? `/products?${qs}` : '/products'
}

export function ProductFilterList({
  items,
  paramKey,
  title,
}: {
  items: Item[]
  paramKey: 'category' | 'brand' | 'sort'
  title: string
}) {
  const searchParams = useSearchParams()
  const active = searchParams.get(paramKey)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-black">{title}</h3>
      <ul className="flex flex-col gap-1.5 text-sm">
        <li>
          <Link
            href={hrefWithParam(searchParams, paramKey, null)}
            className={cn(!active ? 'font-semibold text-black' : 'text-black/55 hover:text-black')}
          >
            همه
          </Link>
        </li>
        {items.map((item) => {
          const value = paramKey === 'sort' ? item.id : item.slug || item.id
          const isActive = active === value
          return (
            <li key={item.id}>
              <Link
                href={hrefWithParam(searchParams, paramKey, value)}
                className={cn(
                  isActive ? 'font-semibold text-black' : 'text-black/55 hover:text-black',
                )}
              >
                {item.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
