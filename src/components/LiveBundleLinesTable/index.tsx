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

function ColorCell({ row }: { row: BundleTableRowDto }) {
  const dots = row.colorDots ?? []

  return (
    <div className="live-bundle-color-cell">
      <span className="live-bundle-color-label">{row.colorLabel}</span>
      {dots.length > 0 ? (
        <span className="live-bundle-color-dots" aria-label="رنگ‌های انتخاب‌شده">
          {dots.map((dot, index) => (
            <span
              key={`${dot.hex}-${dot.label}-${index}`}
              title={dot.label}
              className="live-bundle-color-dot"
              style={{ backgroundColor: dot.hex }}
            />
          ))}
        </span>
      ) : null}
    </div>
  )
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
                <td className="live-bundle-col-color">
                  <ColorCell row={row} />
                </td>
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
