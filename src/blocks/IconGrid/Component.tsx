import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { IconGridBlock as IconGridBlockProps, Media } from '@/payload-types'

import { sanitizeCmsHref } from '@/utilities/cmsHref'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

function asMedia(value: unknown): Media | null {
  if (value && typeof value === 'object' && 'url' in value && (value as Media).url) {
    return value as Media
  }
  return null
}

type Item = NonNullable<IconGridBlockProps['items']>[number]

function Tile({ item }: { item: Item }) {
  const media = asMedia(item.image)
  if (!media) return null

  const src = getMediaUrl(media.url, media.updatedAt)
  if (!src) return null

  const label = item.label?.trim() || media.alt || ''
  const href = sanitizeCmsHref(item.href)

  const inner = (
    <>
      <div className="relative mx-auto aspect-square w-full max-w-[5.5rem] sm:max-w-[6.5rem] md:max-w-[7.5rem]">
        <Image
          src={src}
          alt={label || media.alt || ''}
          fill
          className="object-contain object-center p-1"
          sizes="(max-width: 768px) 30vw, 12vw"
        />
      </div>
      {label ? (
        <p className="mt-2 line-clamp-2 min-h-[2.5em] text-center text-xs font-medium leading-snug text-black/55 md:mt-3 md:text-sm">
          {label}
        </p>
      ) : null}
    </>
  )

  const className = cn(
    'flex flex-col items-center justify-start px-1 py-1 sm:px-2',
    href && 'transition-opacity hover:opacity-80',
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}

export const IconGridBlock: React.FC<IconGridBlockProps> = ({ heading, items }) => {
  const tiles = (items || []).filter((item) => asMedia(item?.image))
  if (!tiles.length) return null

  return (
    <section className="w-full bg-[var(--color-canvas)] px-4 py-2 md:px-8 md:py-3">
      {heading?.trim() ? (
        <h2 className="mb-3 text-center text-sm font-medium text-black/50 md:mb-4 md:text-base">
          {heading.trim()}
        </h2>
      ) : null}

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-3 gap-x-4 gap-y-4 md:gap-x-8 lg:grid-cols-6">
        {tiles.slice(0, 6).map((item, index) => (
          <Tile key={item.id || `${item.label}-${index}`} item={item} />
        ))}
      </div>
    </section>
  )
}
