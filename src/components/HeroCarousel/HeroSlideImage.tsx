'use client'

import Image from 'next/image'
import React from 'react'

import type { Media } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

type HeroSlideImageProps = {
  image: Media
  imageMobile?: Media | null
  alt: string
  priority?: boolean
  className?: string
}

function mediaUrl(media: Media): string {
  return getMediaUrl(media.url, media.updatedAt)
}

/**
 * Renders at the media's intrinsic aspect ratio.
 * Optional mobile asset swaps below md (art direction).
 */
export function HeroSlideImage({
  image,
  imageMobile,
  alt,
  priority = false,
  className,
}: HeroSlideImageProps) {
  const desktopSrc = mediaUrl(image)
  const mobile = imageMobile && imageMobile.url ? imageMobile : null
  const mobileSrc = mobile ? mediaUrl(mobile) : null

  if (!desktopSrc) return null

  const desktopW = image.width || 1600
  const desktopH = image.height || 900

  if (mobileSrc && mobile) {
    const mobileW = mobile.width || desktopW
    const mobileH = mobile.height || desktopH

    return (
      <span className={cn('block w-full', className)}>
        <Image
          src={mobileSrc}
          alt={alt}
          width={mobileW}
          height={mobileH}
          className="h-auto w-full md:hidden"
          sizes="100vw"
          priority={priority}
        />
        <Image
          src={desktopSrc}
          alt={alt}
          width={desktopW}
          height={desktopH}
          className="hidden h-auto w-full md:block"
          sizes="100vw"
          priority={priority}
        />
      </span>
    )
  }

  return (
    <Image
      src={desktopSrc}
      alt={alt}
      width={desktopW}
      height={desktopH}
      className={cn('h-auto w-full', className)}
      sizes="100vw"
      priority={priority}
    />
  )
}
