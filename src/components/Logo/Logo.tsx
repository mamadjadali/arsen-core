'use client'

import { useTheme } from '@payloadcms/ui'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

import { getMediaUrl } from '@/utilities/getMediaUrl'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

type MediaDoc = {
  url?: string | null
  updatedAt?: string | null
  alt?: string | null
}

const FALLBACK_LOGO =
  'https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-logo-light.svg'

function mediaSrc(media: MediaDoc | number | null | undefined): string | null {
  if (media && typeof media === 'object' && media.url) {
    return getMediaUrl(media.url, media.updatedAt)
  }
  return null
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props
  const { theme } = useTheme()
  const [logoLight, setLogoLight] = useState<string | null>(null)
  const [logoDark, setLogoDark] = useState<string | null>(null)

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  useEffect(() => {
    let cancelled = false

    fetch('/api/globals/settings?depth=1')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return
        setLogoLight(mediaSrc(data.adminLogoLight))
        setLogoDark(mediaSrc(data.adminLogoDark))
      })
      .catch(() => {
        // keep fallback
      })

    return () => {
      cancelled = true
    }
  }, [])

  const src =
    theme === 'dark'
      ? logoDark || logoLight || FALLBACK_LOGO
      : logoLight || logoDark || FALLBACK_LOGO

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px] object-contain object-left', className)}
      src={src}
    />
  )
}
