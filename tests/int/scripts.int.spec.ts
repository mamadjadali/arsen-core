import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { beforeAll, describe, expect, it } from 'vitest'

import { getEnabledScripts } from '@/utilities/customScripts'

let payload: Payload

describe('Scripts global', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  }, 60000)

  it('stores script items and normalizes enabled entries', async () => {
    await payload.updateGlobal({
      slug: 'scripts',
      data: {
        items: [
          {
            name: 'Test Analytics',
            enabled: true,
            kind: 'external',
            src: 'https://www.googletagmanager.com/gtag/js?id=G-TEST',
            placement: 'head',
            strategy: 'afterInteractive',
          },
          {
            name: 'Inline marker',
            enabled: true,
            kind: 'inline',
            code: `<script>
window.__ranjbarScriptsTest = true
</script>`,
            placement: 'body',
          },
          {
            name: 'Off',
            enabled: false,
            kind: 'external',
            src: 'https://example.com/off.js',
            placement: 'body',
            strategy: 'lazyOnload',
          },
        ],
      },
      context: {
        disableRevalidate: true,
      },
    })

    const scripts = await payload.findGlobal({
      slug: 'scripts',
      depth: 0,
    })

    expect(scripts.items).toHaveLength(3)

    const enabled = getEnabledScripts(scripts)
    expect(enabled).toHaveLength(2)
    expect(enabled[0]).toMatchObject({
      kind: 'external',
      placement: 'head',
      src: 'https://www.googletagmanager.com/gtag/js?id=G-TEST',
    })
    expect(enabled[1]).toMatchObject({
      kind: 'inline',
      placement: 'body',
      code: 'window.__ranjbarScriptsTest = true',
    })

    await payload.updateGlobal({
      slug: 'scripts',
      data: { items: [] },
      context: { disableRevalidate: true },
    })
  })
})
