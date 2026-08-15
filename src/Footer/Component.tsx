import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { FooterColumns } from './layouts/FooterColumns'
import { FooterNewsletter } from './layouts/FooterNewsletter'

export async function Footer() {
  const [footerData, settings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('settings', 1)(),
  ])

  if (footerData?.layout === 'columns') {
    return <FooterColumns data={footerData} logoLight={settings?.logoLight} />
  }

  return <FooterNewsletter data={footerData} logoLight={settings?.logoLight} />
}
