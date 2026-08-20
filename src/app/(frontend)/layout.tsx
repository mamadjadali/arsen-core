import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { AnalyticsTracker } from '@/components/Analytics/AnalyticsTracker'
import { CustomScripts } from '@/components/CustomScripts'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { defaultAppFont, fontOptions, isAppFont } from '@/fonts'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { resolveMediaUrl } from '@/utilities/resolveMedia'
import { getSiteName } from '@/utilities/siteName'
import { resolveThemeTokens, toCssVars } from '@/themes'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import { draftMode } from 'next/headers'
import { Suspense } from 'react'

import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const [theme, scripts, settings] = await Promise.all([
    getCachedGlobal('theme', 1)(),
    getCachedGlobal('scripts', 1)(),
    getCachedGlobal('settings', 1)(),
  ])
  const tokens = resolveThemeTokens(theme)
  const appFont = fontOptions[isAppFont(tokens.fontBody) ? tokens.fontBody : defaultAppFont]

  const faviconIco = resolveMediaUrl(settings?.faviconIco)
  const faviconSvg = resolveMediaUrl(settings?.faviconSvg)
  const favicon32 = resolveMediaUrl(settings?.favicon32)
  const appleTouchIcon = resolveMediaUrl(settings?.appleTouchIcon)

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, appFont.variable)}
      lang="fa"
      dir="rtl"
      data-theme={tokens.colorScheme}
      suppressHydrationWarning
      style={toCssVars(tokens) as React.CSSProperties}
    >
      <head>
        {faviconIco ? (
          <link href={faviconIco} rel="icon" sizes="any" />
        ) : (
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
        )}
        {faviconSvg ? (
          <link href={faviconSvg} rel="icon" type="image/svg+xml" />
        ) : !faviconIco ? (
          <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        ) : null}
        {favicon32 ? <link href={favicon32} rel="icon" type="image/png" sizes="32x32" /> : null}
        {appleTouchIcon ? <link href={appleTouchIcon} rel="apple-touch-icon" /> : null}
        <CustomScripts data={scripts} placement="head" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)]',
          appFont.className,
        )}
      >
        <Providers>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <div className="flex min-h-screen w-full flex-col bg-[var(--color-canvas)]">
            <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col border-x border-black/10">
              <Header />
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />
            </div>
          </div>
        </Providers>
        <CustomScripts data={scripts} placement="body" />
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName()

  return {
    metadataBase: new URL(getServerSideURL()),
    title: siteName,
    openGraph: mergeOpenGraph(undefined, siteName),
    twitter: {
      card: 'summary_large_image',
      creator: '@payloadcms',
    },
  }
}
