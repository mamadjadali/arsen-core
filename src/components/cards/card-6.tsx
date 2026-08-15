import * as React from 'react'

import { CornerMarks } from '@/components/marketing/corner-marks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

type Card6Props = {
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function Card6({ title, children, className }: Card6Props) {
  return (
    <Card
      className={cn(
        'relative flex h-full flex-col overflow-visible rounded-md border-black/10 bg-[var(--color-canvas-soft)] text-black shadow-none',
        className,
      )}
    >
      <CornerMarks />
      {title ? (
        <CardHeader>
          <CardTitle className="text-black">{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className={cn('flex-1', !title && 'pt-6')}>{children}</CardContent>
    </Card>
  )
}

/** @deprecated Prefer `Card6` */
export const Card_6 = Card6
