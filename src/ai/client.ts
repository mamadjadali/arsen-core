import type { AiChatMessage } from './types'

export class AiProviderError extends Error {
  status: number

  constructor(message: string, status = 502) {
    super(message)
    this.name = 'AiProviderError'
    this.status = status
  }
}

type ChatCompletionArgs = {
  baseUrl: string
  apiKey: string
  model: string
  messages: AiChatMessage[]
  timeoutMs?: number
}

type OpenAIChatResponse = {
  choices?: Array<{ message?: { content?: string | null } }>
  error?: { message?: string }
}

export async function chatCompletion({
  baseUrl,
  apiKey,
  model,
  messages,
  timeoutMs = 45_000,
}: ChatCompletionArgs): Promise<string> {
  const root = baseUrl.replace(/\/+$/, '')
  const url = `${root}/chat/completions`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Provider request failed'
    throw new AiProviderError(message, 504)
  }

  let data: OpenAIChatResponse = {}
  try {
    data = (await response.json()) as OpenAIChatResponse
  } catch {
    // ignore parse errors; handled below
  }

  if (!response.ok) {
    const detail = data.error?.message || `Provider error (${response.status})`
    throw new AiProviderError(detail, response.status >= 500 ? 502 : 400)
  }

  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) {
    throw new AiProviderError('Empty response from provider', 502)
  }

  return text
}
