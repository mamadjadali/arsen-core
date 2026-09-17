import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { GridLabel } from '@/components/Grid/Label'
import { cn } from '@/utilities/ui'

type Props = {
  active?: boolean
  className?: string
  isInteractive?: boolean
  label?: {
    amount?: string | null
    position?: 'bottom' | 'center'
    title: string
  }
  media?: (string | null) | MediaType
}

export function GridTileImage({
  active,
  className,
  isInteractive = true,
  label,
  media,
}: Props) {
  return (
    <div
      className={cn(
        'group relative flex aspect-square h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-[var(--color-canvas-soft)]',
        active ? 'border-black' : 'border-black/10',
        className,
      )}
    >
      {media && typeof media === 'object' ? (
        <Media
          resource={media}
          fill
          imgClassName={cn('object-cover', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive,
          })}
          size="(min-width: 768px) 33vw, 50vw"
        />
      ) : (
        <div className="text-sm text-black/40">بدون تصویر</div>
      )}
      {label ? (
        <GridLabel amount={label.amount} position={label.position} title={label.title} />
      ) : null}
    </div>
  )
}
