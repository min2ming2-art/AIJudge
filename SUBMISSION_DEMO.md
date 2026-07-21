# AIJudge 제출 데모 준비

## 한 줄 소개

AIJudge transforms your documents into realistic speaking practice with personalized questions, spoken-answer analysis, and actionable feedback.

## 90초 데모 영상 구성

1. **0–10초 — 문제**
   - 자막: “Reading your material is not the same as answering under pressure.”
   - 면접·발표·구술시험을 혼자 연습하기 어렵다는 문제를 보여줍니다.
2. **10–25초 — 자료 업로드**
   - 사업계획서 PDF 또는 PPT를 업로드합니다.
   - AIJudge가 문서의 핵심 주제와 근거를 이해해 질문을 준비하는 장면을 보여줍니다.
3. **25–40초 — 평가자 선택**
   - 루미 코치, 실전 평가자, 압박 면접관, 코디 선생님, 심사위원의 서로 다른 진행 방식을 빠르게 보여줍니다.
4. **40–60초 — 음성 실전 연습**
   - 실제 음성으로 답하고 실시간 답변 시간, 습관어, 인식 보정, 심사위원 개입을 보여줍니다.
5. **60–80초 — 맞춤 평가**
   - 총점과 5개 세부 점수, 자신감·리듬, 청중 관점, 모범답안, 재연습 TOP 3를 보여줍니다.
6. **80–90초 — 성장과 비전**
   - 이전 기록과 오늘 점수의 변화, 배지, 한국어·영어 지원을 보여줍니다.
   - 마무리 자막: “AIJudge does not only show what was wrong. It shows how you grew.”

## 영상 촬영 체크리스트

- 알림과 개인 정보가 보이지 않는 브라우저 창을 사용합니다.
- 16:9, 1080p로 녹화하고 마우스 이동은 느리고 분명하게 합니다.
- 업로드용 문서는 공개 가능한 데모 자료를 사용합니다.
- 음성 인식과 GPT 응답은 촬영 전에 한 번 예열합니다.
- 결과 화면에서 점수보다 개선 TOP 3와 성장 기록을 반드시 보여줍니다.
- API 키, 환경 변수, 개발자 도구의 인증 헤더는 영상에 노출하지 않습니다.

## 제출 설명 초안

### What it does

AIJudge is an AI presentation and interview coach that understands a user's documents, generates focused questions, analyzes spoken answers, and provides actionable feedback. Users can choose distinct evaluator personalities, practice in Korean or English, review model answers, and track measurable growth over time.

### Why it matters

Most preparation tools help people read or memorize. AIJudge helps them perform under pressure. It turns passive documents into an interactive practice session and explains exactly what to improve next.

### How it uses OpenAI

The server sends document context, questions, and user answers to the OpenAI Responses API for semantic evaluation. Rule-based speech metrics complement the model with observable signals such as answer length, relevance, fillers, pauses, and delivery rhythm. The API key remains server-side.

### What's next

Planned extensions include Japanese and Chinese, richer voice analysis, webcam-based presentation coaching with explicit consent, downloadable PDF reports, and specialized practice modes for education and career development.

## 공개 전 최종 확인

- Vercel 환경 변수에 `OPENAI_API_KEY`를 등록합니다.
- 배포 URL에서 DOCX, PDF, PPT 업로드를 각각 확인합니다.
- 한국어 1회와 영어 1회를 결과 화면까지 완료합니다.
- 모바일 화면에서 업로드, 답변, 결과, 재연습 버튼을 확인합니다.
- 오류 응답과 네트워크 응답에 API 키가 포함되지 않는지 다시 확인합니다.
