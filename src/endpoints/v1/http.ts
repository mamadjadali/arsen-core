export type ApiErrorBody = {
  ok: false
  error: { code: string; message: string }
}

export type ApiOkBody<T> = {
  ok: true
  data: T
}

export function jsonOk<T>(data: T, status = 200): Response {
  return Response.json({ ok: true, data } satisfies ApiOkBody<T>, { status })
}

export function jsonError(status: number, code: string, message: string): Response {
  return Response.json({ ok: false, error: { code, message } } satisfies ApiErrorBody, {
    status,
  })
}

export async function readJsonBody(
  req: { json?: () => Promise<unknown>; data?: unknown },
): Promise<unknown> {
  if (typeof req.json === 'function') {
    try {
      return await req.json()
    } catch {
      return req.data ?? null
    }
  }
  return req.data ?? null
}

export function asTrimmedString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function asOptionalBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value
  return undefined
}

export function asOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const n = Number(value)
    if (Number.isFinite(n)) return n
  }
  return undefined
}
