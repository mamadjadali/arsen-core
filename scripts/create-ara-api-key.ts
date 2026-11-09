/**
 * Dev-only helper. Run: npx tsx scripts/create-ara-api-key.ts
 * Prints plaintext API key once (create-only).
 *
 * Blocked in production unless RANJBAR_ALLOW_DEV_KEY_SCRIPT=1.
 */
import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
loadEnv({ path: path.resolve(dirname, '../.env') })

async function main() {
  const allow =
    process.env.NODE_ENV !== 'production' || process.env.RANJBAR_ALLOW_DEV_KEY_SCRIPT === '1'
  if (!allow) {
    console.error(
      'Refusing to run in production. Set RANJBAR_ALLOW_DEV_KEY_SCRIPT=1 to override.',
    )
    process.exit(1)
  }

  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })

  const name = 'ara-dev'
  const existing = await payload.find({
    collection: 'api-keys',
    where: { name: { equals: name } },
    limit: 10,
    overrideAccess: true,
  })

  for (const doc of existing.docs) {
    console.log(`deleting api-key name=${name} id=${doc.id}`)
    await payload.delete({
      collection: 'api-keys',
      id: doc.id,
      overrideAccess: true,
    })
  }

  // Also clean ara-dev-2 leftovers
  const leftover = await payload.find({
    collection: 'api-keys',
    where: { name: { equals: 'ara-dev-2' } },
    limit: 10,
    overrideAccess: true,
  })
  for (const doc of leftover.docs) {
    console.log(`deleting api-key name=ara-dev-2 id=${doc.id}`)
    await payload.delete({
      collection: 'api-keys',
      id: doc.id,
      overrideAccess: true,
    })
  }

  const apiKey = randomBytes(32).toString('hex')

  const doc = await payload.create({
    collection: 'api-keys',
    data: {
      name,
      enabled: true,
      scopes: ['products', 'bundles'],
      enableAPIKey: true,
      apiKey,
    },
    overrideAccess: true,
  })

  console.log('id=' + doc.id)
  console.log('apiKey=' + apiKey)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
