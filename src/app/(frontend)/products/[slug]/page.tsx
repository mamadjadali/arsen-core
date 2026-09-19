import type { Metadata } from 'next'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Media, Product, ProductCategory, Variant } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { GridTileImage } from '@/components/Grid/tile'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { ProductDetail } from '@/components/ProductDetail'
import { ProductDescriptionSection } from '@/components/ProductDescriptionSection'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { formatPrice, resolveDisplayPrice } from '@/utilities/productDisplay'
import PageClient from '../(shop)/page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return products.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/products/' + decodedSlug
  const [product, settings] = await Promise.all([
    queryProductBySlug({ slug: decodedSlug }),
    getCachedGlobal('settings', 0)(),
  ])

  if (!product) return <PayloadRedirects url={url} />

  const variants = await queryVariantsForProduct(product.id)
  const relatedProducts =
    product.relatedProducts?.filter(
      (related): related is Product => typeof related === 'object' && related !== null,
    ) ?? []

  const pricing = resolveDisplayPrice(product)
  const availability =
    product.availability === 'unavailable'
      ? 'https://schema.org/OutOfStock'
      : product.availability === 'coming_soon'
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock'

  const metaImage =
    (typeof product.meta?.image === 'object' && product.meta.image) ||
    (typeof product.featuredImage === 'object' && product.featuredImage) ||
    null

  const firstCategory =
    product.categories
      ?.map((c) => (typeof c === 'object' && c ? (c as ProductCategory) : null))
      .find(Boolean) || null

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.meta?.description || product.summary || undefined,
    image: metaImage && 'url' in metaImage ? metaImage.url : undefined,
    brand:
      typeof product.brand === 'object' && product.brand
        ? { '@type': 'Brand', name: product.brand.title }
        : undefined,
    sku: product.sku || undefined,
    offers:
      typeof pricing.price === 'number' && !product.hidePrice
        ? {
            '@type': 'Offer',
            availability,
            price: pricing.price,
            priceCurrency: 'IRR',
          }
        : {
            '@type': 'Offer',
            availability,
          },
  }

  return (
    <article className="pb-20">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft ? <LivePreviewListener /> : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="container py-8 md:py-12">
        <nav
          aria-label="breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-black/55"
        >
          <Link href="/" className="transition-colors hover:text-black">
            خانه
          </Link>
          <span aria-hidden>/</span>
          <Link href="/products" className="transition-colors hover:text-black">
            محصولات
          </Link>
          {firstCategory?.slug ? (
            <>
              <span aria-hidden>/</span>
              <Link
                href={`/products?category=${encodeURIComponent(firstCategory.slug)}`}
                className="transition-colors hover:text-black"
              >
                {firstCategory.title}
              </Link>
            </>
          ) : null}
          <span aria-hidden>/</span>
          <span className="text-black">{product.title}</span>
        </nav>

        <ProductDetail
          product={product}
          variants={variants}
          inquiryPhone={settings.inquiryPhone}
          inquiryButtonLabel={settings.inquiryButtonLabel}
        />
      </div>

      <ProductDescriptionSection description={product.description} specs={product.specs} />

      {product.layout?.length ? (
        <div className="mt-8">
          <RenderBlocks blocks={product.layout} />
        </div>
      ) : null}

      {relatedProducts.length ? (
        <div className="container mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-black">محصولات مرتبط</h2>
            {firstCategory?.slug ? (
              <Link
                href={`/products?category=${encodeURIComponent(firstCategory.slug)}`}
                className="text-sm text-black/60 transition-colors hover:text-black"
              >
                مشاهده همه {firstCategory.title}
              </Link>
            ) : null}
          </div>
          <RelatedProducts products={relatedProducts} />
        </div>
      ) : null}
    </article>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {products.map((product) => {
        const image =
          (typeof product.featuredImage === 'object' && product.featuredImage) ||
          (typeof product.meta?.image === 'object' && product.meta.image) ||
          null
        const pricing = resolveDisplayPrice(product)
        const amount =
          typeof pricing.price === 'number' && !product.hidePrice
            ? formatPrice(pricing.price, pricing.currencyLabel)
            : null

        return (
          <li key={product.id}>
            <Link href={`/products/${product.slug}`} className="relative block">
              <GridTileImage
                media={image as Media | null}
                label={{
                  title: product.title,
                  amount,
                  position: 'bottom',
                }}
              />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const product = await queryProductBySlug({ slug: decodedSlug })

  return generateMeta({ doc: product })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryVariantsForProduct = cache(async (productId: string | number) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'variants',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'sortOrder',
    where: {
      product: {
        equals: productId,
      },
    },
  })

  return result.docs as Variant[]
})
