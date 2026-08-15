import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function Header() {
  const [headerData, settings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('settings', 1)(),
  ])

  return <HeaderClient data={headerData} logoLight={settings?.logoLight} />
}
