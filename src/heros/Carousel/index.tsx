'use client'

import React from 'react'

import type { Media, Page } from '@/payload-types'

import { HeroCarousel, type HeroCarouselSlide } from '@/components/HeroCarousel'
import { CMSLink } from '@/components/Link'

type CarouselHeroProps = Page['hero']

function asMedia(value: unknown): Media | null {
  if (value && typeof value === 'object' && 'url' in value && (value as Media).url) {
    return value as Media
  }
  return null
}

export const CarouselHero: React.FC<CarouselHeroProps> = (props) => {
  const {
    slides,
    loop,
    autoplay,
    autoplayDelay,
    fade,
    showArrows,
    showPagination,
    links,
  } = props

  const resolvedSlides: HeroCarouselSlide[] = []
  for (const slide of slides || []) {
    const image = asMedia(slide?.image)
    if (!image) continue
    resolvedSlides.push({
      id: slide.id,
      image,
      imageMobile: asMedia(slide.imageMobile),
      alt: slide.alt,
      href: slide.href,
    })
  }

  const hasLinks = Array.isArray(links) && links.length > 0
  if (!resolvedSlides.length && !hasLinks) return null

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-[var(--color-canvas)]">
      {resolvedSlides.length ? (
        <div className="w-full">
          <HeroCarousel
            slides={resolvedSlides}
            loop={loop}
            autoplay={autoplay}
            autoplayDelay={autoplayDelay}
            fade={fade}
            showArrows={showArrows}
            showPagination={showPagination}
          />
        </div>
      ) : null}

      {hasLinks ? (
        <div
          className={
            resolvedSlides.length
              ? 'mt-2 mb-10 flex w-full flex-col items-center gap-3 px-4 sm:w-auto sm:flex-row md:mb-14'
              : 'mt-10 mb-10 flex w-full flex-col items-center gap-3 px-4 sm:w-auto sm:flex-row md:mb-14'
          }
        >
          {links!.map(({ link }, i) => {
            const isPrimary = i === 0
            return (
              <CMSLink
                key={i}
                {...link}
                appearance="inline"
                className={
                  isPrimary
                    ? 'w-full rounded-md bg-black px-6 py-2.5 text-base font-medium text-[var(--color-canvas)] transition-colors hover:bg-black/90 sm:w-auto'
                    : 'w-full rounded-md border border-black/20 px-6 py-2.5 text-base font-medium text-[var(--color-ink)] transition-colors hover:bg-black/[0.03] sm:w-auto'
                }
              />
            )
          })}
        </div>
      ) : (
        <div className="mb-8 md:mb-12" />
      )}
    </section>
  )
}
