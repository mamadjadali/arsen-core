import type { Metadata } from 'next'
import Image from 'next/image'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { LiveBundle, Media } from '@/payload-types'

import { LiveBundleLinesTable } from '@/components/LiveBundleLinesTable'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { toBundleTableRows } from '@/utilities/liveBundleDisplay'
import { resolveMediaUrl } from '@/utilities/resolveMedia'

import PageClient from './page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const bundles = await payload.find({
    collection: 'live-bundles',
    where: { status: { equals: 'live' } },
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return bundles.docs.map(({ slug }) => ({ slug }))
}

export default async function LiveBundlePage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/bundles/' + decodedSlug
  const bundle = await queryLiveBundleBySlug({ slug: decodedSlug })

  if (!bundle) return <PayloadRedirects url={url} />

  const logos =
    bundle.brandLogos?.filter((logo): logo is Media => typeof logo === 'object' && logo !== null) ??
    []
  const rows = toBundleTableRows(bundle)

  return (
    <article className="live-bundle" dir="rtl">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      <header className="live-bundle-header">
        <p className="live-bundle-eyebrow">سبد زنده</p>
        <h1 className="live-bundle-title">{bundle.name}</h1>
        {bundle.notes?.trim() ? <p className="live-bundle-notes">{bundle.notes}</p> : null}

        {logos.length > 0 ? (
          <div className="live-bundle-logos" aria-label="برندها">
            {logos.map((logo) => {
              const src = resolveMediaUrl(logo)
              if (!src) return null
              return (
                <Image
                  key={logo.id}
                  src={src}
                  alt={logo.alt || ''}
                  width={96}
                  height={48}
                  className="live-bundle-logo"
                  unoptimized={src.startsWith('/')}
                />
              )
            })}
          </div>
        ) : null}
      </header>

      <LiveBundleLinesTable rows={rows} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const bundle = await queryLiveBundleBySlug({ slug: decodeURIComponent(slug) })
  const title = bundle?.name || 'سبد زنده'
  return {
    title,
    description: bundle?.notes || undefined,
  }
}

const queryLiveBundleBySlug = cache(async ({ slug }: { slug: string }): Promise<LiveBundle | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'live-bundles',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'live' } }],
    },
  })

  return result.docs?.[0] || null
})
