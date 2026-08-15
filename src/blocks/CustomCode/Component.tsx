import React from 'react'

import type { CustomCodeBlock as CustomCodeBlockProps } from '@/payload-types'
import { hasHtmlContent, sanitizeCustomCss, sanitizeCustomHtml } from '@/utilities/customCode'

export const CustomCodeBlock: React.FC<CustomCodeBlockProps> = ({ css, html }) => {
  const cssTrimmed = typeof css === 'string' ? css.trim() : ''
  const showHtml = hasHtmlContent(html)

  if (!cssTrimmed && !showHtml) return null

  return (
    <>
      {cssTrimmed ? (
        <style dangerouslySetInnerHTML={{ __html: sanitizeCustomCss(cssTrimmed) }} />
      ) : null}
      {showHtml ? (
        <div
          className="custom-code-block"
          dangerouslySetInnerHTML={{ __html: sanitizeCustomHtml(html || '') }}
        />
      ) : null}
    </>
  )
}
