import React from 'react'

import type { BundleTableRowDto, BundleTableTotalsDto } from '@/utilities/liveBundleDisplay'
import { toBundleTableTotals } from '@/utilities/liveBundleDisplay'
import { cn } from '@/utilities/ui'

type LiveBundleLinesTableProps = {
  rows: BundleTableRowDto[]
  totals?: BundleTableTotalsDto
  className?: string
  /** Light panel styling for drawers / light surfaces */
  variant?: 'page' | 'panel'
}

export function LiveBundleLinesTable({
  rows,
  totals: totalsProp,
  className,
  variant = 'page',
}: LiveBundleLinesTableProps) {
  const totals = totalsProp ?? toBundleTableTotals(rows)
  const showTotals = rows.length > 0

  return (
    <div
      className={cn(
        'live-bundle-table-wrap',
        variant === 'panel' && 'live-bundle-table-wrap--panel',
        className,
      )}
    >
      <table className={cn('live-bundle-table', variant === 'panel' && 'live-bundle-table--panel')}>
        <thead>
          <tr>
            <th scope="col">محصول</th>
            <th scope="col">تعداد</th>
            <th scope="col" className="live-bundle-col-color">
              رنگ
            </th>
            <th scope="col">قیمت واحد</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="live-bundle-table-empty">
                آیتمی در این سبد نیست.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.key}>
                <td>
                  <span className="live-bundle-product-name">{row.name}</span>
                </td>
                <td>{row.quantityLabel}</td>
                <td className="live-bundle-col-color">{row.colorLabel}</td>
                <td>{row.priceLabel}</td>
              </tr>
            ))
          )}
        </tbody>
        {showTotals ? (
          <tfoot>
            <tr className="live-bundle-table-totals">
              <th scope="row">جمع</th>
              <td>{totals.quantityLabel}</td>
              <td className="live-bundle-col-color" aria-hidden />
              <td>{totals.priceLabel}</td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  )
}
