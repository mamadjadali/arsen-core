import Script from 'next/script'
import React from 'react'

import type { Script as ScriptsGlobal } from '@/payload-types'
import { getEnabledScripts, type ScriptPlacement } from '@/utilities/customScripts'

type Props = {
  data: ScriptsGlobal | null | undefined
  placement: ScriptPlacement
}

export const CustomScripts: React.FC<Props> = ({ data, placement }) => {
  const scripts = getEnabledScripts(data).filter((script) => script.placement === placement)

  if (!scripts.length) return null

  return (
    <>
      {scripts.map((script) => {
        const scriptId = `cms-script-${placement}-${script.id}`

        if (script.kind === 'external') {
          return (
            <Script
              key={scriptId}
              id={scriptId}
              src={script.src}
              strategy={script.strategy}
            />
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
