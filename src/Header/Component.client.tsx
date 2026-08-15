'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Header, Media } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { resolveFirstMedia, resolveMediaUrl } from '@/utilities/resolveMedia'

interface HeaderClientProps {
  data: Header
  logoLight?: Media | string | number | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, logoLight }) => {
  const navItems = data?.navItems || []
  const logo = resolveFirstMedia(data?.logo, logoLight)
  const logoUrl = resolveMediaUrl(logo) || '/suno-logo.svg'
  const brandName = data?.brandName || 'SunoAI'

  return (
    <header className="relative z-30 flex w-full items-center justify-between border-b border-black/10 px-4 py-6 md:px-8">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={logoUrl}
          alt={logo?.alt || brandName}
          width={28}
          height={28}
          className="h-7 w-7"
          unoptimized={logoUrl.startsWith('/suno-logo')}
        />
        <span className="text-xl font-bold tracking-tight text-black">{brandName}</span>
      </Link>

      <nav className="hidden items-center gap-4 text-sm font-medium text-black md:flex lg:gap-8 lg:text-base">
        {navItems.map(({ link }, i) => (
          <CMSLink
            key={i}
            {...link}
            appearance="inline"
            className="transition-opacity hover:opacity-70"
          />
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {data?.secondaryCta?.label && (
          <CMSLink
            {...data.secondaryCta}
            appearance="inline"
            className="hidden rounded-md border border-black px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 md:block"
          />
        )}
        {data?.primaryCta?.label && (
          <CMSLink
            {...data.primaryCta}
            appearance="inline"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-black/90"
          />
        )}
      </div>
    </header>
  )
}
