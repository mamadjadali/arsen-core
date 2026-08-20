import type { Metadata } from 'next'

import { getServerSideURL } from './getURL'

export const mergeOpenGraph = (
  og?: Metadata['openGraph'],
  siteName?: string | null,
): Metadata['openGraph'] => {
  const site = siteName?.trim()

  const defaultOpenGraph: Metadata['openGraph'] = {
    type: 'website',
    description: 'An open-source website built with Payload and Next.js.',
    images: [
      {
        url: `${getServerSideURL()}/website-template-OG.webp`,
      },
    ],
    ...(site ? { siteName: site, title: site } : {}),
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
