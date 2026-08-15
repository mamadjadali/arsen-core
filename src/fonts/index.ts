import localFont from 'next/font/local'

const yekanBakh = localFont({
  src: './yekan-bakh/YekanBakhFaNum-VF.woff2',
  variable: '--font-app',
  display: 'swap',
  preload: false,
})

const parnian = localFont({
  src: './parnian/Parnian.ttf',
  variable: '--font-app',
  display: 'swap',
  preload: false,
})

const iranSharp = localFont({
  src: [
    { path: './iran-sharp/iransharp_light_web.woff2', weight: '300', style: 'normal' },
    { path: './iran-sharp/iransharp_regular_web.woff2', weight: '400', style: 'normal' },
    { path: './iran-sharp/iransharp_bold_web.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-app',
  display: 'swap',
  preload: false,
})

const ahang = localFont({
  src: [
    { path: './ahang/Ahang-Thin.woff2', weight: '100', style: 'normal' },
    { path: './ahang/Ahang-Regular.woff2', weight: '400', style: 'normal' },
    { path: './ahang/Ahang-Bold.woff2', weight: '700', style: 'normal' },
    { path: './ahang/Ahang-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-app',
  display: 'swap',
  preload: false,
})

const anjoman = localFont({
  src: [
    { path: './anjoman/AnjomanMax-Light.woff2', weight: '300', style: 'normal' },
    { path: './anjoman/AnjomanMax-Regular.woff2', weight: '400', style: 'normal' },
    { path: './anjoman/AnjomanMax-Medium.woff2', weight: '500', style: 'normal' },
    { path: './anjoman/AnjomanMax-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-app',
  display: 'swap',
  preload: false,
})

const dana = localFont({
  src: [
    { path: './dana/Dana-Light.woff2', weight: '300', style: 'normal' },
    { path: './dana/Dana-Regular.woff2', weight: '400', style: 'normal' },
    { path: './dana/Dana-Medium.woff2', weight: '500', style: 'normal' },
    { path: './dana/Dana-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-app',
  display: 'swap',
  preload: false,
})

const farhang = localFont({
  src: [
    { path: './farhang/Farhang2-Light.woff2', weight: '300', style: 'normal' },
    { path: './farhang/Farhang2-Regular.woff2', weight: '400', style: 'normal' },
    { path: './farhang/Farhang2-Medium.woff2', weight: '500', style: 'normal' },
    { path: './farhang/Farhang2-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-app',
  display: 'swap',
  preload: false,
})

export const fontOptions = {
  yekanBakh,
  parnian,
  iranSharp,
  ahang,
  anjoman,
  dana,
  farhang,
} as const

export type AppFont = keyof typeof fontOptions

export const defaultAppFont: AppFont = 'yekanBakh'

export const isAppFont = (value: unknown): value is AppFont =>
  typeof value === 'string' && value in fontOptions
