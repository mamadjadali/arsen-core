import configPromise from '@payload-config'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type {
  CategoriesCatalogBlock as CategoriesCatalogBlockProps,
  Media,
  ProductCategory,
} from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import { toFaDigits } from '@/i18n/adminUi'

function padIndex(n: number): string {
  return toFaDigits(String(n).padStart(2, '0'))
}

async function loadCategories(
  selected: CategoriesCatalogBlockProps['categories'],
): Promise<ProductCategory[]> {
  const payload = await getPayload({ config: configPromise })

  if (!selected?.length) {
    const result = await payload.find({
      collection: 'product-categories',
      depth: 1,
      limit: 100,
      sort: 'title',
      overrideAccess: false,
      pagination: false,
    })
    return result.docs
  }

  const allPopulated = selected.every((item) => typeof item === 'object' && item !== null)
  if (allPopulated) {
    return selected.filter(
      (item): item is ProductCategory =>
        typeof item === 'object' && Boolean(item?.slug && item?.title),
    )
  }

  const result = await payload.find({
    collection: 'product-categories',
    depth: 1,
    limit: 100,
    sort: 'title',
    overrideAccess: false,
    pagination: false,
  })
  const byId = new Map(result.docs.map((doc) => [String(doc.id), doc]))

  return selected
    .map((item) => {
      if (typeof item === 'object' && item) return item
      if (typeof item === 'string' || typeof item === 'number') return byId.get(String(item))
      return undefined
    })
    .filter((item): item is ProductCategory => Boolean(item?.slug && item?.title))
}

export const CategoriesCatalogBlock: React.FC<CategoriesCatalogBlockProps> = async (props) => {
  const {
    eyebrow = 'کاتالوگ محصولات',
    heading = 'هر متریال،',
    headingAccent = 'یک انتخاب دقیق',
    description,
    showIndex = true,
    indexLabel = 'دسته',
    toolbarLabel = 'همه دسته‌بندی‌ها',
    categories: selectedCategories,
    cardCtaLabel = 'مشاهده محصولات',
  } = props

  const categories = await loadCategories(selectedCategories)

  if (!categories.length && !heading?.trim() && !headingAccent?.trim()) return null

  const count = categories.length
  const countLabel = toFaDigits(count)

  return (
    <section className="categories-catalog" dir="rtl">
      <div className="categories-catalog-hero">
        <div className="categories-catalog-hero-copy">
          {eyebrow?.trim() ? (
            <p className="categories-catalog-eyebrow">
              <span aria-hidden />
              {eyebrow}
            </p>
          ) : null}
          {(heading?.trim() || headingAccent?.trim()) && (
            <h2 className="categories-catalog-heading">
              {heading?.trim() ? (
                <>
                  {heading}
                  {headingAccent?.trim() ? <br /> : null}
                </>
              ) : null}
              {headingAccent?.trim() ? <em>{headingAccent}</em> : null}
            </h2>
          )}
        </div>
        {description?.trim() ? (
          <p className="categories-catalog-lead">{description}</p>
        ) : null}
        {showIndex && count > 0 ? (
          <span className="categories-catalog-index" dir="ltr">
            {countLabel} / {indexLabel}
          </span>
        ) : null}
      </div>

      {categories.length ? (
        <div className="categories-catalog-section">
          <div className="categories-catalog-toolbar">
            <span>{toolbarLabel}</span>
            <small>{countLabel} گروه محصول</small>
          </div>
          <div className="categories-catalog-grid">
            {categories.map((category, index) => {
              const image =
                typeof category.image === 'object' && category.image
                  ? (category.image as Media)
                  : null
              const href = `/products?category=${encodeURIComponent(category.slug)}`

              return (
                <Link key={category.id} href={href} className="categories-catalog-card">
                  {image ? (
                    <MediaComponent
                      resource={image}
                      fill
                      imgClassName="categories-catalog-card-img"
                      pictureClassName="categories-catalog-card-media"
                      htmlElement={null}
                    />
                  ) : (
                    <span className="categories-catalog-card-placeholder" aria-hidden />
                  )}
                  <span className="categories-catalog-card-number">{padIndex(index + 1)}</span>
                  <span className="categories-catalog-card-copy">
                    <strong>{category.title}</strong>
                    <small>
                      {cardCtaLabel}
                      <ArrowLeft className="categories-catalog-card-icon" aria-hidden />
                    </small>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}
