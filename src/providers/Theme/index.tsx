'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

const readDocumentTheme = (): Theme | undefined => {
  if (!canUseDOM) return undefined
  const value = document.documentElement.getAttribute('data-theme')
  return themeIsValid(value) ? value : undefined
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(readDocumentTheme)

  /** Brand Theme owns data-theme; keep React state in sync only. */
  const setTheme = useCallback((themeToSet: Theme | null) => {
    const next = themeToSet ?? readDocumentTheme()
    if (next) setThemeState(next)
  }, [])

  useEffect(() => {
    setThemeState(readDocumentTheme())
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
