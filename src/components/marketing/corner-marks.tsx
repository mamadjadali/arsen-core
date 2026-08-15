import * as React from 'react'

import { cn } from '@/utilities/ui'

const CornerMark = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      strokeWidth="1"
      stroke="currentColor"
      className={cn('pointer-events-none absolute z-10 size-6 text-primary', className)}
    >
      <title>Icon</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  )
}

export function CornerMarks({ className }: { className?: string }) {
  return (
    <>
      <CornerMark className={cn('-top-3 -left-3', className)} />
      <CornerMark className={cn('-top-3 -right-3', className)} />
      <CornerMark className={cn('-bottom-3 -left-3', className)} />
      <CornerMark className={cn('-bottom-3 -right-3', className)} />
    </>
  )
}
