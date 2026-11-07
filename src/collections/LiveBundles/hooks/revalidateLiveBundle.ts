import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { LiveBundle } from '../../../payload-types'

export const revalidateLiveBundle: CollectionAfterChangeHook<LiveBundle> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  revalidatePath('/bundles')

  if (doc.status === 'live' && doc.slug) {
    const path = `/bundles/${doc.slug}`
    payload.logger.info(`Revalidating live bundle at path: ${path}`)
    revalidatePath(path)
    revalidateTag('live-bundles', 'max')
  }

  if (
    previousDoc?.status === 'live' &&
    previousDoc.slug &&
    (doc.status !== 'live' || doc.slug !== previousDoc.slug)
  ) {
    const oldPath = `/bundles/${previousDoc.slug}`
    payload.logger.info(`Revalidating old live bundle at path: ${oldPath}`)
    revalidatePath(oldPath)
    revalidateTag('live-bundles', 'max')
  }

  return doc
}

export const revalidateLiveBundleDelete: CollectionAfterDeleteHook<LiveBundle> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/bundles')
    if (doc?.slug) {
      revalidatePath(`/bundles/${doc.slug}`)
    }
    revalidateTag('live-bundles', 'max')
  }
  return doc
}
