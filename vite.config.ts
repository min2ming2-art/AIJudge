import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { evaluateWithOpenAI } from './server/aiEvaluation.js'

const readBody = (request: import('node:http').IncomingMessage) => new Promise<unknown>((resolve, reject) => {
  let body = ''
  request.on('data', (chunk) => {
    body += chunk
    if (body.length > 100_000) reject(new Error('요청 데이터가 너무 큽니다.'))
  })
  request.on('end', () => {
    try { resolve(JSON.parse(body)) } catch { reject(new Error('올바르지 않은 JSON 요청입니다.')) }
  })
  request.on('error', reject)
})

const aiEvaluationPlugin = (apiKey: string, model: string): Plugin => ({
  name: 'aijudge-gpt-evaluation-dev',
  configureServer(server) {
    server.middlewares.use('/api/ai-evaluate', async (request, response) => {
      response.setHeader('Content-Type', 'application/json; charset=utf-8')
      response.setHeader('Cache-Control', 'no-store')
      if (request.method !== 'POST') {
        response.statusCode = 405
        response.end(JSON.stringify({ error: 'POST 요청만 사용할 수 있습니다.' }))
        return
      }
      try {
        const evaluation = await evaluateWithOpenAI(await readBody(request), apiKey, model)
        response.end(JSON.stringify({ evaluation }))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'GPT 평가 중 문제가 발생했습니다.'
        response.statusCode = message.includes('OPENAI_API_KEY') ? 503 : 500
        response.end(JSON.stringify({ error: message }))
      }
    })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), aiEvaluationPlugin(env.OPENAI_API_KEY, env.OPENAI_MODEL || 'gpt-5.6-terra')],
  }
})
