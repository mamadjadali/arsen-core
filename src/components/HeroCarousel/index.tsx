'use client'

import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'

import type { Media } from '@/payload-types'

import { HeroSlideImage } from '@/components/HeroCarousel/HeroSlideImage'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { sanitizeCmsHref } from '@/utilities/cmsHref'
import { cn } from '@/utilities/ui'

export type HeroCarouselSlide = {
  id?: string | null
  image: Media
  imageMobile?: Media | null
  alt?: string | null
  href?: string | null
}

type HeroCarouselProps = {
  slides: HeroCarouselSlide[]
  loop?: boolean | null
  autoplay?: boolean | null
  autoplayDelay?: number | null
  fade?: boolean | null
  showArrows?: boolean | null
  showPagination?: boolean | null
  className?: string
}

/**
 * null until mounted: do not enable autoplay until preference is known
 * (avoids a motion flash for prefers-reduced-motion users).
 */
function usePrefersReducedMotion(): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(null)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function HeroCarousel({
  slides,
  loop = true,
  autoplay = true,
  autoplayDelay = 5000,
  fade = false,
  showArrows = true,
  showPagination = true,
  className,
}: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const useFade = Boolean(fade)
  // embla-carousel-fade expects loop: false
  const useLoop = useFade ? false : Boolean(loop)

  const plugins = useMemo(() => {
    const list = []
    if (useFade) list.push(Fade())
    // Wait until reduced-motion preference is known before starting autoplay.
    if (autoplay && reducedMotion === false) {
      list.push(
        Autoplay({
          delay: typeof autoplayDelay === 'number' && autoplayDelay > 0 ? autoplayDelay : 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      )
    }
    return list
  }, [autoplay, autoplayDelay, useFade, reducedMotion])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  if (!slides.length) return null

  return (
    <div className={cn('w-full pb-8', className)}>
      <Carousel
        className="w-full"
        opts={{
          loop: useLoop,
          align: 'start',
          direction: 'rtl',
          duration: useFade ? 30 : undefined,
        }}
        plugins={plugins}
        setApi={setApi}
      >
        <CarouselContent className="-ms-0">
          {slides.map((slide, index) => {
            const alt =
              slide.alt?.trim() ||
              (typeof slide.image === 'object' ? slide.image.alt || '' : '') ||
              `Slide ${index + 1}`
            const href = sanitizeCmsHref(slide.href)
            const media = (
              <div className="relative w-full overflow-hidden">
                <HeroSlideImage
                  image={slide.image}
                  imageMobile={slide.imageMobile}
                  alt={alt}
                  priority={index === 0}
                />
              </div>
            )

            return (
              <CarouselItem key={slide.id || index} className="basis-full ps-0">
                {href ? (
                  <Link
                    href={href}
                    className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {media}
                  </Link>
                ) : (
                  media
                )}
              </CarouselItem>
            )
          })}
        </CarouselContent>

        {showArrows ? (
          <>
            <CarouselPrevious className="start-3 z-10 size-10 border-black/10 bg-[var(--color-canvas)]/90 shadow-sm backdrop-blur-sm hover:bg-[var(--color-canvas)]" />
            <CarouselNext className="end-3 z-10 size-10 border-black/10 bg-[var(--color-canvas)]/90 shadow-sm backdrop-blur-sm hover:bg-[var(--color-canvas)]" />
          </>
        ) : null}

        {showPagination && slides.length > 1 ? (
          <div
            className="absolute inset-x-0 top-full mt-5 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="اسلایدها"
          >
            {slides.map((slide, index) => {
              const isActive = selected === index
              return (
                <button
                  key={slide.id || index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`اسلاید ${index + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-[width,background-color] duration-300 ease-out',
                    isActive
                      ? 'w-6 bg-[var(--brand-orange,var(--color-primary,#f97c00))]'
                      : 'w-2 bg-black/30 hover:bg-black/45',
                  )}
                  onClick={() => api?.scrollTo(index)}
                />
              )
            })}
          </div>
        ) : null}
      </Carousel>
    </div>
  )
}
