import React from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  amount?: string | null
  position?: 'bottom' | 'center'
  title: string
}

export function GridLabel({ amount, position = 'bottom', title }: Props) {
  return (
    <div
      className={cn(
        'absolute flex w-full px-3',
        position === 'center'
          ? 'inset-0 items-center justify-center'
          : 'inset-x-0 bottom-0 pb-3 pt-10 bg-gradient-to-t from-black/55 to-transparent',
      )}
    >
      <div
        className={cn(
          'flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-white backdrop-blur-sm',
          position === 'center' && 'flex-col px-4 py-2 text-center',
        )}
      >
        <span className="truncate text-sm font-medium leading-none">{title}</span>
        {amount ? <span className="shrink-0 text-xs opacity-90">{amount}</span> : null}
      </div>
    </div>
  )
}
