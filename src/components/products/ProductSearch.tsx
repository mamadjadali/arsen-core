'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useTransition } from 'react'

import { Input } from '@/components/ui/input'

export function ProductSearch({ placeholder = 'جستجو…' }: { placeholder?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get('q') || '')

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    const next = value.trim()
    if (next) params.set('q', next)
    else params.delete('q')
    params.delete('page')
    startTransition(() => {
      router.push(`/products?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={pending}
        className="h-10 bg-[var(--color-canvas)]"
      />
    </form>
  )
}
