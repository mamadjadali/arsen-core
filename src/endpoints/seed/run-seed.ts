/**
 * Run: npx tsx src/endpoints/seed/run-seed.ts
 * Overwrites demo content with Dr. Ranjbar landing seed.
 */
import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, createLocalReq } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
loadEnv({ path: path.resolve(dirname, '../../../.env') })

async function main() {
  const { default: config } = await import('@payload-config')
  const { seed } = await import('./index')

  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    limit: 1,
    depth: 0,
  })

  let user = users.docs[0]

  if (!user) {
    payload.logger.info('No user found — creating seed admin…')
    user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@ranjbar.local',
        password: 'password',
        name: 'Admin',
      },
    })
  }

  const req = await createLocalReq({ user }, payload)
  await seed({ payload, req })
  payload.logger.info('Seed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
