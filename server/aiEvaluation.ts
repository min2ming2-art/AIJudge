export interface AiEvaluationPayload {
  questions: string[]
  answers: string[]
  documentText: string
  evaluatorId: string
  mode: string
  language?: 'ko' | 'en'
  documentType?: string
  ruleEvaluation: {
    voiceNotice?: string
    metrics: Record<string, number>
  }
}

const extractOutputText = (response: Record<string, unknown>) => {
  if (typeof response.output_text === 'string') return response.output_text
  const output = Array.isArray(response.output) ? response.output : []
  for (const item of output) {
    if (!item || typeof item !== 'object' || !Array.isArray((item as { content?: unknown[] }).content)) continue
    for (const content of (item as { content: Array<{ type?: string; text?: string }> }).content) {
      if (content.type === 'output_text' && content.text) return content.text
    }
  }
  return ''
}

const validPayload = (payload: unknown): payload is AiEvaluationPayload => {
  if (!payload || typeof payload !== 'object') return false
  const value = payload as Partial<AiEvaluationPayload>
  return Array.isArray(value.questions)
    && Array.isArray(value.answers)
    && typeof value.documentText === 'string'
    && typeof value.evaluatorId === 'string'
    && typeof value.mode === 'string'
    && Boolean(value.ruleEvaluation?.metrics)
}

export async function evaluateWithOpenAI(payload: unknown, apiKey: string, model: string) {
  if (!apiKey) throw new Error('OPENAI_API_KEY가 설정되지 않아 규칙 기반 평가를 사용합니다.')
  if (!validPayload(payload)) throw new Error('올바르지 않은 평가 요청입니다.')
  if (payload.questions.length > 10 || payload.answers.length > 10) throw new Error('평가 가능한 답변 수를 초과했습니다.')

  const documentExcerpt = payload.documentText.slice(0, 12000)
  const outputLanguage = payload.language === 'en' ? 'English' : 'Korean'
  const prompt = `당신은 AIJudge의 전문 말하기 평가자입니다.
업로드 문서와 질문의 의미를 이해하고 사용자의 답변을 공정하게 평가하세요.
표현이 달라도 의미가 맞으면 인정하고, 문서 밖의 타당한 배경지식도 관련성이 있으면 가점하세요.
답변의 숫자와 고유 사실을 문서와 대조하세요. 전체 인원보다 응답 인원이 큰 수치처럼 자체 모순이 있거나 문서의 수치와 다르면 명확히 지적하고 근거 제시·논리·설득력 점수를 감점하세요.
질문 및 문서 주제와 무관한 대상이나 분야가 등장하면 단순히 핵심어가 부족하다고만 말하지 말고, 어떤 표현이 주제에서 벗어났는지 구체적으로 알려 주세요.
길이가 충분하다는 이유만으로 잘한 점을 만들지 마세요. 내용이 틀렸거나 무관하면 정확성·관련성을 우선 평가하세요.
headline과 title은 “답변의 뼈대부터 다시 잡아보세요” 같은 포괄적인 문구만 쓰지 말고, 이번 답변에서 가장 부족했던 항목과 이유를 한 문장으로 구체화하세요. 예: “핵심은 이해했지만 문서 근거가 부족했습니다.”
답변이 매우 짧으면 말하기 속도가 자연스럽더라도 전달력을 높게 평가하지 마세요. 규칙 기반 평균 답변 길이가 15자 미만이면 delivery는 최대 5점, 30자 미만이면 최대 8점, 50자 미만이면 최대 12점입니다.
모든 서술형 결과(headline, title, summary, strengths, improvements, estimatedImprovement, modelAnswers, retryPriorities, predictedQuestions, audienceSummary)는 반드시 ${outputLanguage}로 작성하세요. 입력에 다른 언어가 섞여 있어도 지정 언어를 유지하세요.
modelAnswers는 각 질문과 같은 순서로 하나씩 작성하세요. 문서 문장을 길게 복사하거나 목록을 그대로 붙이지 말고, 발표자가 자기 말로 설명하는 자연스러운 2~4문장으로 바꾸세요. 첫 문장에는 결론, 다음 문장에는 문서의 짧은 근거나 수치, 마지막에는 의미·적용·판단을 담으세요. 업로드 문서에 없는 사실은 지어내지 마세요.
retryPriorities는 개선할 점을 제목만 바꿔 반복하지 마세요. 사용자가 다음 연습에서 바로 실행할 수 있는 서로 다른 행동 3개를 작성하세요. 예: “첫 문장에 결론부터 말하기”, “실제 사례 1개 넣기”, “숫자 또는 문서 근거 1개 추가하기”.
predictedQuestions는 실제 심사에서 이어질 가능성이 높은 후속 질문 4개입니다. 기존 질문과 중복하지 말고, 사용자가 충분히 설명하지 못한 부분과 낮은 평가 항목을 우선 다루세요. 질문 하나에는 차별성, 시장성, 원가, 검증, 실현 가능성 중 한 가지 평가 목적만 담으세요. 각 modelAnswer는 문서에 있는 사실만 사용하여 2~4문장으로 작성하세요. 평가자의 성격과 말투를 질문에 반영하세요.
연습 유형이 시험이면 제품, 고객, 경쟁사, 시제품, 투자, 시장성, 원가 또는 마진을 묻지 마세요. 시험에서는 문서의 핵심 개념, 원인과 결과, 정확한 수치·사례, 한계, 실천 또는 적용 방법을 평가하고 modelAnswers와 predictedQuestions도 같은 학습 목적을 유지하세요.
문서 유형이 businessPlan이 아닌 경우에도 문서에 실제 제품·사업 내용이 없다면 제품, 시제품, 경쟁사, 투자, 시장성, 원가 또는 마진을 억지로 묻지 마세요. 보도자료·논문·교육자료·설명서 등은 핵심 메시지, 사실 근거, 한계, 적용 또는 실천 방법에 맞춰 평가하세요.
문서의 담당 부서, TF, 담당자, 기관명, 연락처, 배포일과 페이지 머리말은 핵심 주제나 모범답안의 근거로 선택하지 마세요. 보도자료에서는 제목, 핵심 현상, 정확한 수치, 권고 행동을 우선 사용하세요.
규칙 기반 측정값의 voiceSampleSufficient가 0이면 음성 분량이 부족한 것입니다. 이 경우 자신감이나 발표 리듬을 높게 단정하지 말고 측정 데이터가 부족하다고 설명하세요.
audienceScores는 이 내용을 처음 듣는 청중의 관점에서 clarity, trust, confidence, empathy, memorability를 각각 1~5 정수로 평가하세요. confidence는 규칙 기반 confidenceScore와 관찰 가능한 말하기 신호만 참고하고 사용자의 실제 감정이나 심리 상태를 진단하지 마세요. audienceSummary는 청중에게 어떻게 들렸는지 2문장 이내로 설명하세요.
평가자: ${payload.evaluatorId}, 연습 유형: ${payload.mode}, 문서 유형: ${payload.documentType ?? 'other'}

문서:
${documentExcerpt}

질문과 답변:
${payload.questions.map((question, index) => `${index + 1}. 질문: ${String(question).slice(0, 2000)}\n답변: ${String(payload.answers[index] ?? '').slice(0, 4000)}`).join('\n\n')}

규칙 기반 참고 측정값:
${JSON.stringify(payload.ruleEvaluation.metrics)}

반드시 아래 JSON 구조만 반환하세요. categoryScores의 각 항목은 0~20 정수이며 score는 다섯 항목의 합계입니다. verdict는 high, potential, difficult 중 하나이며 점수가 75 이상이면 high, 55 이상이면 potential, 그 미만이면 difficult를 사용하세요.
{"score":0,"headline":"","title":"","summary":"","strengths":[""],"improvements":[""],"estimatedImprovement":"","verdict":"potential","modelAnswers":[""],"retryPriorities":["","",""],"predictedQuestions":[{"question":"","modelAnswer":""}],"audienceScores":{"clarity":1,"trust":1,"confidence":1,"empathy":1,"memorability":1},"audienceSummary":"","categoryScores":{"understanding":0,"evidenceScore":0,"logic":0,"delivery":0,"persuasion":0}}`

  const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, reasoning: { effort: 'low' }, input: prompt, max_output_tokens: 3000 }),
  })
  const result = await openAiResponse.json() as Record<string, unknown>
  if (!openAiResponse.ok) throw new Error((result.error as { message?: string } | undefined)?.message ?? 'OpenAI API 요청 실패')
  const rawText = extractOutputText(result).replace(/^```json\s*|\s*```$/g, '').trim()
  if (!rawText) throw new Error('OpenAI API가 평가 결과를 반환하지 않았습니다.')
  const ai = JSON.parse(rawText)
  const clampScore = (value: unknown) => Math.max(0, Math.min(20, Math.round(Number(value) || 0)))
  const averageLength = Number(payload.ruleEvaluation.metrics.averageLength) || 0
  const deliveryLimit = averageLength < 15 ? 5 : averageLength < 30 ? 8 : averageLength < 50 ? 12 : 20
  const categoryScores = {
    understanding: clampScore(ai.categoryScores?.understanding),
    evidenceScore: clampScore(ai.categoryScores?.evidenceScore),
    logic: clampScore(ai.categoryScores?.logic),
    delivery: Math.min(deliveryLimit, clampScore(ai.categoryScores?.delivery)),
    persuasion: clampScore(ai.categoryScores?.persuasion),
  }
  const score = Object.values(categoryScores).reduce((sum, value) => sum + value, 0)
  const verdict = score >= 75 ? 'high' : score >= 55 ? 'potential' : 'difficult'
  const modelAnswers = Array.isArray(ai.modelAnswers)
    ? ai.modelAnswers.map(String).slice(0, payload.questions.length)
    : []
  const retryPriorities = Array.isArray(ai.retryPriorities)
    ? [...new Set(ai.retryPriorities.map(String).filter(Boolean))].slice(0, 3)
    : []
  const predictedQuestions = Array.isArray(ai.predictedQuestions)
    ? ai.predictedQuestions
      .filter((item: unknown) => item && typeof item === 'object')
      .map((item: { question?: unknown; modelAnswer?: unknown }) => ({
        question: String(item.question ?? '').trim(),
        modelAnswer: String(item.modelAnswer ?? '').trim(),
      }))
      .filter((item: { question: string }) => item.question)
      .filter((item: { question: string }, index: number, items: Array<{ question: string }>) => items.findIndex((candidate) => candidate.question === item.question) === index)
      .slice(0, 4)
    : []
  const clampAudienceScore = (value: unknown) => Math.max(1, Math.min(5, Math.round(Number(value) || 1)))
  const audienceScores = ai.audienceScores && typeof ai.audienceScores === 'object'
    ? {
        clarity: clampAudienceScore(ai.audienceScores.clarity),
        trust: clampAudienceScore(ai.audienceScores.trust),
        confidence: clampAudienceScore(ai.audienceScores.confidence),
        empathy: clampAudienceScore(ai.audienceScores.empathy),
        memorability: clampAudienceScore(ai.audienceScores.memorability),
      }
    : undefined
  return {
    score,
    headline: String(ai.headline ?? ''),
    title: String(ai.title ?? ''),
    summary: String(ai.summary ?? ''),
    strengths: Array.isArray(ai.strengths) ? ai.strengths.map(String).slice(0, 3) : [],
    improvements: Array.isArray(ai.improvements) ? ai.improvements.map(String).slice(0, 3) : [],
    estimatedImprovement: String(ai.estimatedImprovement ?? ''),
    verdict,
    modelAnswers,
    retryPriorities,
    predictedQuestions,
    confidenceSummary: String(ai.audienceSummary ?? payload.ruleEvaluation.metrics.confidenceSummary ?? ''),
    audienceScores,
    voiceNotice: payload.ruleEvaluation.voiceNotice,
    metrics: { ...payload.ruleEvaluation.metrics, ...categoryScores },
  }
}
