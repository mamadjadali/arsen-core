import Image from 'next/image'
import React from 'react'

import type { Footer, Media } from '@/payload-types'

import { resolveFirstMedia, resolveMediaUrl } from '@/utilities/resolveMedia'
import { cn } from '@/utilities/ui'

type FooterBrandProps = {
  logo?: Footer['logo']
  logoLight?: Media | string | number | null
  brandName?: Footer['brandName']
  tagline?: Footer['tagline']
  className?: string
  titleClassName?: string
  taglineClassName?: string
  showTagline?: boolean
}

export function FooterBrand({
  logo: logoProp,
  logoLight,
  brandName,
  tagline,
  className,
  titleClassName,
  taglineClassName,
  showTagline = true,
}: FooterBrandProps) {
  const logo = resolveFirstMedia(logoProp, logoLight)
  const logoUrl = resolveMediaUrl(logo)
  const name = brandName?.trim()

  if (!logoUrl && !name && !(showTagline && tagline)) return null

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {(logoUrl || name) && (
        <div className="flex items-center gap-2">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={logo?.alt || name || 'Logo'}
              width={28}
              height={28}
              className="h-7 w-7"
              unoptimized={logoUrl.startsWith('/suno-logo')}
            />
          )}
          {name && (
            <span
              className={cn(
                'text-base font-semibold tracking-tight text-foreground',
                titleClassName,
              )}
            >
              {name}
            </span>
          )}
        </div>
      )}
      {showTagline && tagline ? (
        <p className={cn('max-w-xs text-sm text-muted-foreground', taglineClassName)}>{tagline}</p>
      ) : null}
    </div>
  )
}
