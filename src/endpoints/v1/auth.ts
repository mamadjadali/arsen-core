import type { PayloadRequest } from 'payload'

import type { ApiKey } from '@/payload-types'

import { jsonError } from './http'

export type CatalogScope = 'products' | 'bundles'

export type ApiKeyUser = ApiKey & { collection: 'api-keys' }

export function isApiKeyUser(user: unknown): user is ApiKeyUser {
  if (!user || typeof user !== 'object') return false
  const u = user as { collection?: string; id?: unknown }
  return u.collection === 'api-keys' && u.id != null
}

/**
 * Authenticate a partner request via Payload API-Key strategy.
 * Expected header: `Authorization: api-keys API-Key <generated-key>`
 */
export async function requireApiKey(
  req: PayloadRequest,
  scope?: CatalogScope,
): Promise<{ user: ApiKeyUser } | Response> {
  const { user } = await req.payload.auth({ headers: req.headers })

  if (!isApiKeyUser(user)) {
    return jsonError(401, 'unauthorized', 'Valid API key required')
  }

  if (user.enabled === false) {
    return jsonError(403, 'key_disabled', 'API key is disabled')
  }

  if (scope) {
    const scopes = Array.isArray(user.scopes) ? user.scopes : []
    if (!scopes.includes(scope)) {
      return jsonError(403, 'forbidden_scope', `API key missing scope: ${scope}`)
    }
  }

  return { user }
}
