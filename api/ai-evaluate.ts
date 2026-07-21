import { evaluateWithOpenAI } from '../server/aiEvaluation.js'

interface ApiRequest {
  method?: string
  body?: unknown
}

interface ApiResponse {
  status(code: number): ApiResponse
  json(body: unknown): void
  setHeader(name: string, value: string): void
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store')
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'POST 요청만 사용할 수 있습니다.' })
    return
  }

  try {
    const evaluation = await evaluateWithOpenAI(
      request.body,
      process.env.OPENAI_API_KEY ?? '',
      process.env.OPENAI_MODEL ?? 'gpt-5.6-terra',
    )
    response.status(200).json({ evaluation })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'GPT 평가 중 문제가 발생했습니다.'
    response.status(message.includes('OPENAI_API_KEY') ? 503 : 500).json({ error: message })
  }
}
