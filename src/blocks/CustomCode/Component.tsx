import Script from 'next/script'
import React from 'react'

import type { CustomCodeBlock as CustomCodeBlockProps } from '@/payload-types'
import {
  getCustomCodeScripts,
  hasHtmlContent,
  sanitizeCustomCss,
  sanitizeCustomHtml,
} from '@/utilities/customCode'

export const CustomCodeBlock: React.FC<
  CustomCodeBlockProps & {
    id?: string | null
  }
> = ({ breakoutLayout, css, html, id, js, scripts }) => {
  const cssTrimmed = typeof css === 'string' ? css.trim() : ''
  const showHtml = hasHtmlContent(html)
  const normalizedScripts = getCustomCodeScripts({
    blockId: id,
    js,
    scripts,
  })

  if (!cssTrimmed && !showHtml && !normalizedScripts.length) return null

  return (
    <>
      {cssTrimmed ? (
        <style dangerouslySetInnerHTML={{ __html: sanitizeCustomCss(cssTrimmed) }} />
      ) : null}
      {showHtml ? (
        <div
          className={
            breakoutLayout ? 'custom-code-block custom-code-breakout' : 'custom-code-block'
          }
          dangerouslySetInnerHTML={{ __html: sanitizeCustomHtml(html || '') }}
        />
      ) : null}
      {normalizedScripts.map((script) => {
        const scriptId = `cms-block-script-${script.id}`

        if (script.kind === 'external') {
          return (
            <Script key={scriptId} id={scriptId} src={script.src} strategy={script.strategy} />
          )
        }

        return (
          <Script
            key={scriptId}
            id={scriptId}
            strategy={script.strategy}
            dangerouslySetInnerHTML={{ __html: script.code }}
          />
        )
      })}
    </>
  )
}
