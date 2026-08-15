import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type LinkGroups = NonNullable<Footer['linkGroups']>

type FooterLinkColumnsProps = {
  linkGroups: LinkGroups
  className?: string
  groupClassName?: string
  titleClassName?: string
  linkClassName?: string
  listClassName?: string
}

export function FooterLinkColumns({
  linkGroups,
  className,
  groupClassName,
  titleClassName,
  linkClassName,
  listClassName,
}: FooterLinkColumnsProps) {
  if (!linkGroups.length) return null

  return (
    <nav className={cn(className)} aria-label="Footer">
      {linkGroups.map((group, i) => (
        <div key={`${group.title}-${i}`} className={groupClassName}>
          <h3 className={titleClassName}>{group.title}</h3>
          <ul className={listClassName}>
            {(group.links || []).map(({ link }, j) => (
              <li key={j}>
                <CMSLink {...link} appearance="inline" className={linkClassName} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
