'use client'

import React, { useEffect, useState } from 'react'

import type { Media } from '@/payload-types'

import { GridTileImage } from '@/components/Grid/tile'
import { Media as MediaComponent } from '@/components/Media'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

type Props = {
  images: Media[]
  /** When set, jump main image to this media id if present in the gallery */
  preferredImageId?: string | null
}

export function Gallery({ images, preferredImageId }: Props) {
  const [current, setCurrent] = useState(0)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!preferredImageId || !images.length) return
    const index = images.findIndex((image) => image.id === preferredImageId)
    if (index === -1) return
    setCurrent(index)
    api?.scrollTo(index, true)
  }, [preferredImageId, images, api])

  if (!images.length) {
    return (
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-[var(--color-canvas-soft)] text-black/40">
        بدون تصویر
      </div>
    )
  }

  const active = images[current] || images[0]

  return (
    <div>
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg border border-black/10 bg-[var(--color-canvas-soft)]">
        <MediaComponent
          resource={active}
          fill
          imgClassName="object-contain p-4 md:p-8"
          size="50vw"
          priority
        />
      </div>

      {images.length > 1 ? (
        <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: false }}>
          <CarouselContent>
            {images.map((image, i) => (
              <CarouselItem
                key={`${image.id}-${i}`}
                className="basis-1/4 cursor-pointer sm:basis-1/5"
                onClick={() => setCurrent(i)}
              >
                <GridTileImage active={i === current} media={image} isInteractive={false} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : null}
    </div>
  )
}
