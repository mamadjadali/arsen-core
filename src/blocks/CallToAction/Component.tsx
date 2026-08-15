import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { CornerMarks } from '@/components/marketing/corner-marks'
import { cn } from '@/utilities/ui'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container py-3">
      <div className="relative flex flex-col gap-8 overflow-visible rounded-md border border-black/10 bg-[var(--color-canvas-soft)] p-8 text-black md:flex-row md:items-center md:justify-between">
        <CornerMarks />
        <div className="flex max-w-[48rem] items-center">
          {richText && (
            <RichText
              className="mb-0 font-sans text-black prose-headings:text-black prose-p:text-black/80 prose-strong:text-black prose-a:text-primary [&_*]:font-sans"
              data={richText}
              enableGutter={false}
            />
          )}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return (
              <CMSLink
                key={i}
                size="lg"
                {...link}
                className={cn(
                  'rounded-md font-sans',
                  link.appearance === 'outline' &&
                    'border border-black/20 bg-transparent text-black shadow-none hover:bg-black/5 hover:text-black',
                  (link.appearance === 'default' || !link.appearance) &&
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
