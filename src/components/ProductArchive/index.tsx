import React from 'react'

import type { ProductCardData } from '@/components/ProductCard'
import { ProductCard } from '@/components/ProductCard'
import { cn } from '@/utilities/ui'

export function ProductArchive({
  className,
  products,
}: {
  className?: string
  products: ProductCardData[]
}) {
  return (
    <div
      className={cn(
        'grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {products.map((doc, index) => (
        <ProductCard key={doc.slug || index} doc={doc} />
      ))}
    </div>
  )
}
