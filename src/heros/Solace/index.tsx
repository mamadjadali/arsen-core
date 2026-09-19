'use client'

import Image from 'next/image'
import React from 'react'
import type { Variants } from 'motion/react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { AnimatedGroup } from '@/components/marketing/animated-group'
import TriplePhoneHero from '@/components/marketing/triple-phone'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const transitionVariants: { item: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const heroContainerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
}

type SolaceHeroProps = Page['hero']

function mediaSrc(
  media: SolaceHeroProps['phoneLeft'] | SolaceHeroProps['heroImage'],
): string | undefined {
  if (!media || typeof media !== 'object' || !media.url) return undefined
  return getMediaUrl(media.url, media.updatedAt)
}

export const SolaceHero: React.FC<SolaceHeroProps> = ({
  announcementBadge,
  announcementText,
  heading,
  subheading,
  links,
  mediaLayout,
  heroImage,
  heroImageWidthDesktop,
  heroImageWidthMobile,
  phoneLeft,
  phoneCenter,
  phoneRight,
}) => {
  const leftSrc = mediaSrc(phoneLeft)
  const centerSrc = mediaSrc(phoneCenter)
  const rightSrc = mediaSrc(phoneRight)
  const imageSrc = mediaSrc(heroImage)
  const headingLines = (heading || '').split('\n').filter(Boolean)
  const showImage = mediaLayout === 'image' && imageSrc
  const showPhones = mediaLayout !== 'image' && leftSrc && centerSrc && rightSrc
  const desktopWidth = Math.min(100, Math.max(10, heroImageWidthDesktop ?? 100))
  const mobileWidth = Math.min(100, Math.max(10, heroImageWidthMobile ?? 100))

  return (
    <section className="relative -mt-[89px] flex w-full flex-col items-center overflow-hidden pt-[89px] md:pt-[97px]">
      <div
        className="pointer-events-none absolute top-0 left-1/2 z-[-1] h-full w-[100vw] -translate-x-1/2"
        style={{
          background:
            'linear-gradient(180deg, var(--color-canvas) 0%, var(--brand-orange) 50%, var(--color-canvas) 100%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-50 border-x border-primary-foreground/30" />

      <AnimatedGroup
        className="flex w-full flex-col items-center pt-8 md:pt-12"
        variants={{
          container: heroContainerVariants,
          item: transitionVariants.item,
        }}
      >
        {(announcementBadge || announcementText) && (
          <div className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-black/10 p-1 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-[var(--color-canvas)]/20 md:text-sm">
            {announcementBadge && (
              <span className="rounded-md bg-black px-3 py-1 text-[10px] text-[var(--color-canvas)] md:text-xs">
                {announcementBadge}
              </span>
            )}
            {announcementText && (
              <span className="pr-2 text-black/70">{announcementText}</span>
            )}
          </div>
        )}

        {heading && (
          <h1 className="mt-6 max-w-4xl px-4 text-center text-4xl font-bold leading-[1.1] tracking-tight text-primary-foreground [text-shadow:0px_4px_4px_rgba(0,0,0,0.09)] md:text-7xl">
            {headingLines.map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </h1>
        )}

        {subheading && (
          <p className="mt-4 max-w-xl px-4 text-center text-base text-primary-foreground/90 md:text-lg">
            {subheading}
          </p>
        )}

        {Array.isArray(links) && links.length > 0 && (
          <div className="mt-8 flex w-full flex-col items-center gap-4 px-4 sm:w-auto sm:flex-row">
            {links.map(({ link }, i) => {
              const isPrimary = i === 0
              return (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="inline"
                  className={
                    isPrimary
                      ? 'w-full rounded-md bg-black px-6 py-2.5 text-base font-medium text-[var(--color-canvas)] transition-colors hover:bg-black/90 sm:w-auto'
                      : 'w-full rounded-md border border-primary-foreground px-6 py-2.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10 sm:w-auto'
                  }
                />
              )
            })}
          </div>
        )}
      </AnimatedGroup>

      <div className="my-5 h-10 w-full border-y border-primary-foreground opacity-30 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] text-primary-foreground" />

      {showImage && (
        <div className="relative z-10 -mt-4 -mb-4 flex w-full justify-center px-4">
          <div
            className="w-[var(--hero-img-w-mobile)] md:w-[var(--hero-img-w-desktop)]"
            style={
              {
                '--hero-img-w-mobile': `${mobileWidth}%`,
                '--hero-img-w-desktop': `${desktopWidth}%`,
              } as React.CSSProperties
            }
          >
            <Image
              src={imageSrc}
              alt={
                typeof heroImage === 'object'
                  ? heroImage?.alt || heading || 'Hero image'
                  : 'Hero image'
              }
              width={
                typeof heroImage === 'object' && heroImage?.width ? heroImage.width : 1200
              }
              height={
                typeof heroImage === 'object' && heroImage?.height ? heroImage.height : 1200
              }
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        </div>
      )}

      {showPhones && (
        <div className="relative z-10 -mt-4 -mb-4 flex w-full justify-center">
          <TriplePhoneHero
            imageLeftSrc={leftSrc}
            imageCenterSrc={centerSrc}
            imageRightSrc={rightSrc}
            imageLeftAlt={typeof phoneLeft === 'object' ? phoneLeft?.alt || undefined : undefined}
            imageCenterAlt={
              typeof phoneCenter === 'object' ? phoneCenter?.alt || undefined : undefined
            }
            imageRightAlt={
              typeof phoneRight === 'object' ? phoneRight?.alt || undefined : undefined
            }
          />
        </div>
      )}

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-48 bg-linear-to-t from-[var(--color-canvas)] to-transparent" />
    </section>
  )
}
