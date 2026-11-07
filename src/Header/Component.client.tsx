'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Header, Media } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { logoIntrinsicSize, logoSizeClassName, logoSizeStyle } from '@/utilities/logoSize'
import { resolveFirstMedia, resolveMediaUrl } from '@/utilities/resolveMedia'

interface HeaderClientProps {
  data: Header
  logoLight?: Media | string | number | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, logoLight }) => {
  const navItems = data?.navItems || []
  const logo = resolveFirstMedia(data?.logo, logoLight)
  const logoUrl = resolveMediaUrl(logo)
  const brandName = data?.brandName?.trim() || ''
  const secondaryCta = data?.secondaryCta?.label?.trim() ? data.secondaryCta : null
  const primaryCta = data?.primaryCta?.label?.trim() ? data.primaryCta : null
  const breakout = Boolean(data?.breakoutLayout)

  return (
    <header className="relative z-30 w-full border-b border-black/10 bg-[var(--color-canvas)]">
      <div
        className={cn(
          'flex w-full items-center gap-4 px-4 py-6 md:px-8',
          breakout && 'mx-auto max-w-[1400px]',
        )}
      >
        <div className="flex min-w-0 flex-1 items-center justify-start">
          {logoUrl || brandName ? (
            <Link href="/" className="flex items-center gap-2" aria-label="صفحه اصلی">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logo?.alt || brandName || 'Logo'}
                  {...logoIntrinsicSize(data?.logoHeightDesktop)}
                  className={logoSizeClassName}
                  style={logoSizeStyle(data?.logoHeightMobile, data?.logoHeightDesktop)}
                  unoptimized={logoUrl.startsWith('/suno-logo')}
                />
              ) : null}
              {brandName ? (
                <span className="text-xl font-bold tracking-tight text-black">{brandName}</span>
              ) : null}
            </Link>
          ) : null}
        </div>

        <nav className="hidden shrink-0 items-center gap-4 text-sm font-medium text-black md:flex lg:gap-8 lg:text-base">
          {navItems.map(({ link }, i) => (
            <CMSLink
              key={i}
              {...link}
              appearance="inline"
              className="transition-opacity hover:opacity-70"
            />
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          {secondaryCta ? (
            <CMSLink
              {...secondaryCta}
              appearance="inline"
              className="hidden rounded-md border border-black px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 md:block"
            />
          ) : null}
          {primaryCta ? (
            <CMSLink
              {...primaryCta}
              appearance="inline"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-[var(--color-canvas)] transition-colors hover:bg-black/90"
            />
          ) : null}
        </div>
      </div>
    </header>
  )
}
