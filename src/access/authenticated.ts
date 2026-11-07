import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

/** True only for Admin Users — not API-key identities. */
export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user && (user as { collection?: string }).collection === 'users')
}
