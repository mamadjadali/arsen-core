import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/marketing/social-icons'
import { cn } from '@/utilities/ui'

export const platformIcons = {
  x: XIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  threads: ThreadsIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
} as const

type SocialLinks = NonNullable<Footer['socialLinks']>

type FooterSocialProps = {
  socialLinks: SocialLinks
  className?: string
  iconClassName?: string
}

export function FooterSocial({ socialLinks, className, iconClassName }: FooterSocialProps) {
  if (!socialLinks.length) return null

  return (
    <div className={cn('flex items-center gap-4 text-muted-foreground', className)}>
      {socialLinks.map(({ platform, url }, i) => {
        const Icon = platformIcons[platform]
        if (!Icon) return null
        return (
          <Link
            key={`${platform}-${i}`}
            href={url}
            aria-label={platform}
            className="transition-colors hover:text-foreground"
          >
            <Icon className={cn('h-4 w-4', iconClassName)} aria-hidden="true" />
          </Link>
        )
      })}
    </div>
  )
}
