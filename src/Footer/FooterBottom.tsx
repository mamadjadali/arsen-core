import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type FooterBottomProps = {
  copyright?: Footer['copyright']
  legalLinks?: Footer['legalLinks']
  className?: string
  showDivider?: boolean
  copyrightClassName?: string
  legalClassName?: string
}

export function FooterBottom({
  copyright,
  legalLinks,
  className,
  showDivider = true,
  copyrightClassName,
  legalClassName,
}: FooterBottomProps) {
  const links = legalLinks || []
  const hasCopyright = Boolean(copyright?.trim())
  const hasLegal = links.length > 0

  if (!hasCopyright && !hasLegal) return null

  return (
    <div className={cn(className)}>
      {showDivider && <div className="mb-8 border-t border-border" />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {hasCopyright ? (
          <p className={cn('text-sm text-muted-foreground', copyrightClassName)}>{copyright}</p>
        ) : (
          <span />
        )}
        {hasLegal ? (
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {links.map(({ link }, i) => (
              <li key={i}>
                <CMSLink
                  {...link}
                  appearance="inline"
                  className={cn(
                    'text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline',
                    legalClassName,
                  )}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
