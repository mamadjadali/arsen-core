'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import React from 'react'

import type { FeaturedServicesBlock as FeaturedServicesBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

type ServiceItem = NonNullable<FeaturedServicesBlockProps['services']>[number]

function ServiceCard({
  service,
  aspectClass,
  titleClassName,
  iconSizeClass,
  iconPositionClass,
  contentClassName,
}: {
  service: ServiceItem
  aspectClass: string
  titleClassName: string
  iconSizeClass: string
  iconPositionClass: string
  contentClassName: string
}) {
  const image = typeof service.image === 'object' ? service.image : null

  return (
    <CMSLink
      {...service.link}
      appearance="inline"
      className="group block overflow-hidden rounded-md"
    >
      <motion.div whileHover={{ opacity: 0.85 }} className="h-full">
        <Card
          className={cn(
            'relative overflow-hidden border-0 bg-card p-0 shadow-none',
            aspectClass,
          )}
        >
          {image && (
            <Media
              resource={image}
              fill
              imgClassName="object-cover"
              pictureClassName="absolute inset-0"
              htmlElement={null}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-black/15 to-black/25" />
          <CardContent
            className={cn(
              'absolute inset-0 z-10 flex flex-col justify-start p-0',
              contentClassName,
            )}
          >
            <div className={cn('pe-8 font-semibold text-primary-foreground', titleClassName)}>
              {service.title}
            </div>
          </CardContent>
          <ArrowUpRight
            className={cn(
              'absolute z-10 text-primary-foreground transition-transform group-hover:scale-110 rtl:-scale-x-100',
              iconPositionClass,
              iconSizeClass,
            )}
            aria-hidden
          />
        </Card>
      </motion.div>
    </CMSLink>
  )
}

export const FeaturedServicesBlock: React.FC<
  FeaturedServicesBlockProps & { className?: string }
> = ({ heading, description, cta, services, className }) => {
  const items = services || []
  const featured = items.slice(0, 2)
  const secondary = items.slice(2)
  const showCta = Boolean(cta?.label)

  return (
    <section className={cn('bg-background py-16 md:py-24', className)}>
      <div className="container grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col justify-between gap-8 lg:col-span-1">
          <div>
            {heading && (
              <RichText
                data={heading}
                enableGutter={false}
                enableProse
                className="mb-4 max-w-none text-4xl font-medium text-foreground md:text-6xl prose-headings:mb-0 prose-headings:text-4xl prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground md:prose-headings:text-6xl prose-p:text-foreground"
              />
            )}
            {description && (
              <RichText
                data={description}
                enableGutter={false}
                enableProse
                className="mt-4 max-w-xs text-base tracking-tight text-muted-foreground prose-p:text-muted-foreground prose-headings:text-muted-foreground prose-a:text-primary"
              />
            )}
          </div>

          {showCta && (
            <CMSLink
              {...cta}
              appearance="outline"
              className="mt-auto w-fit"
            >
              <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </CMSLink>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
          {featured.map((service, idx) => (
            <ServiceCard
              key={service.id || idx}
              service={service}
              aspectClass="aspect-[3/4]"
              titleClassName="text-base md:text-lg"
              iconSizeClass="size-6"
              iconPositionClass="top-6 end-6"
              contentClassName="p-6"
            />
          ))}

          {secondary.length > 0 && (
            <div className="col-span-full grid grid-cols-1 gap-4 sm:grid-cols-3">
              {secondary.map((service, idx) => (
                <ServiceCard
                  key={service.id || `secondary-${idx}`}
                  service={service}
                  aspectClass="aspect-[4/3]"
                  titleClassName="text-sm"
                  iconSizeClass="size-5"
                  iconPositionClass="top-4 end-4"
                  contentClassName="p-4"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
