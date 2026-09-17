'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import Link from 'next/link'
import React from 'react'

import type { Media, Product } from '@/payload-types'

import { GridTileImage } from '@/components/Grid/tile'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { formatPrice, resolveDisplayPrice } from '@/utilities/productDisplay'

export function ProductCarouselClient({ products }: { products: Product[] }) {
  if (!products?.length) return null

  const carouselProducts = [...products, ...products, ...products]

  return (
    <div className="w-full overflow-hidden py-2">
      <Carousel
        className="w-full"
        opts={{ align: 'start', loop: true, direction: 'rtl' }}
        plugins={[
          AutoScroll({
            playOnInit: true,
            speed: 0.8,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent className="-ms-4">
          {carouselProducts.map((product, i) => {
            const image =
              (typeof product.featuredImage === 'object' && product.featuredImage) ||
              (typeof product.meta?.image === 'object' && product.meta.image) ||
              null
            const pricing = resolveDisplayPrice(product)
            const amount =
              typeof pricing.price === 'number'
                ? formatPrice(pricing.price, pricing.currencyLabel)
                : null

            return (
              <CarouselItem
                key={`${product.id}-${i}`}
                className="basis-1/2 ps-4 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
                  <GridTileImage
                    media={image as Media | null}
                    label={{
                      title: product.title,
                      amount,
                      position: 'bottom',
                    }}
                  />
                </Link>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
