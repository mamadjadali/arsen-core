import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { Card6 } from '@/components/cards/card-6'
import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16 text-black">
      <div className="grid grid-cols-4 gap-x-8 gap-y-8 py-3 lg:grid-cols-12">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                  'h-full': size !== 'full',
                })}
                key={index}
              >
                {size === 'full' ? (
                  richText && <RichText data={richText} enableGutter={false} />
                ) : (
                  <Card6 className="h-full">
                    {richText && <RichText data={richText} enableGutter={false} />}
                    {enableLink && <CMSLink {...link} />}
                  </Card6>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
