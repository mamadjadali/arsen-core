import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { FooterColumns } from './layouts/FooterColumns'
import { FooterContact } from './layouts/FooterContact'
import { FooterNewsletter } from './layouts/FooterNewsletter'

export async function Footer() {
  const [footerData, settings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('settings', 1)(),
  ])

  if (footerData?.layout === 'contact') {
    return <FooterContact data={footerData} logoLight={settings?.logoLight} />
  }

  if (footerData?.layout === 'columns') {
    return <FooterColumns data={footerData} logoLight={settings?.logoLight} />
  }

  return <FooterNewsletter data={footerData} logoLight={settings?.logoLight} />
}
