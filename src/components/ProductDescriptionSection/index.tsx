import React from 'react'

import type { Product } from '@/payload-types'

import RichText from '@/components/RichText'

type SpecRow = NonNullable<Product['specs']>[number]

export function ProductDescriptionSection({
  description,
  specs,
}: {
  description: Product['description']
  specs?: Product['specs'] | null
}) {
  const rows =
    specs?.filter(
      (row): row is SpecRow & { label: string; value: string } =>
        Boolean(row?.label?.trim() && row?.value?.trim()),
    ) || []

  if (!description && !rows.length) return null

  return (
    <section className="product-desc-section">
      <div className="container grid gap-10 py-12 md:gap-14 md:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {description ? (
          <div>
            <p className="product-desc-eyebrow">
              <span className="product-desc-eyebrow-rule" aria-hidden />
              معرفی محصول
            </p>
            <h2 className="product-desc-title">توضیحات</h2>
            <div className="product-desc-body">
              <RichText data={description} enableGutter={false} enableProse={false} />
            </div>
          </div>
        ) : null}

        {rows.length ? (
          <dl className="product-desc-table">
            {rows.map((row, index) => (
              <div key={row.id || `${row.label}-${index}`} className="product-desc-row">
                <dt className="product-desc-label">{row.label}</dt>
                <dd className="product-desc-value">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  )
}
