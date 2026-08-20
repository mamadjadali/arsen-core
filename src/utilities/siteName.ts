import { getCachedGlobal } from '@/utilities/getGlobals'

export async function getSiteName(): Promise<string | undefined> {
  const settings = await getCachedGlobal('settings')()
  const name = settings?.siteName?.trim()
  return name || undefined
}

export function formatDocumentTitle(
  pageTitle?: string | null,
  siteName?: string | null,
): string | undefined {
  const title = pageTitle?.trim()
  const site = siteName?.trim()

  if (title && site) return `${title} | ${site}`
  if (title) return title
  if (site) return site

  return undefined
}
