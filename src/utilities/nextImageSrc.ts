/**
 * Partner / API `imageUrl` hosts are unpredictable. Match catalog (ProductCard):
 * skip the Next optimizer for absolute http(s) URLs so missing remotePatterns
 * cannot break thumbnails. Same-origin relative paths can still be optimized.
 */
export function shouldUnoptimizeImageSrc(src: string): boolean {
  return /^https?:\/\//i.test(src.trim())
}
