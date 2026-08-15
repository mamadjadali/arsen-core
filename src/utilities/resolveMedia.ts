import type { Media } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export type MediaLike = Media | string | number | null | undefined

/** Resolve an upload field to a cache-busted media URL, or null. */
export const resolveMediaUrl = (media: MediaLike): string | null => {
  if (media && typeof media === 'object' && 'url' in media && media.url) {
    return getMediaUrl(media.url, media.updatedAt)
  }
  return null
}

/** Prefer the first non-empty upload among candidates. */
export const resolveFirstMedia = (...candidates: MediaLike[]): Media | null => {
  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object' && 'url' in candidate && candidate.url) {
      return candidate
    }
  }
  return null
}
