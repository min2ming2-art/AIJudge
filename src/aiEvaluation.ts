import type { EvaluationResult } from './evaluation'
import type { EvaluatorId } from './evaluators'
import type { SupportedLanguage } from './language'
import type { DocumentType } from './documentParser'

interface AiEvaluationPayload {
  questions: string[]
  answers: string[]
  documentText: string
  evaluatorId: EvaluatorId
  mode: '면접' | '발표' | '시험'
  ruleEvaluation: EvaluationResult
  language: SupportedLanguage
  documentType: DocumentType
}

export async function requestAiEvaluation(payload: AiEvaluationPayload): Promise<EvaluationResult> {
  const response = await fetch('/api/ai-evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (!response.ok) {
    const serverMessage = String(data.error ?? '')
    if (response.status === 503 || serverMessage.includes('OPENAI_API_KEY')) throw new Error('API_KEY_MISSING')
    if (/quota|billing|credit|insufficient/i.test(serverMessage)) throw new Error('API_BILLING_REQUIRED')
    if (/model|access|permission/i.test(serverMessage)) throw new Error('API_MODEL_ACCESS')
    throw new Error('API_REQUEST_FAILED')
  }
  return data.evaluation as EvaluationResult
}
