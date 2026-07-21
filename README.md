# AIJudge

AIJudge transforms documents into realistic speaking practice. It reads uploaded PDF, PPTX, and DOCX files, asks focused questions, accepts spoken or typed answers, and delivers actionable feedback for interviews, presentations, and oral exams.

**Live demo:** https://aijudge-sigma.vercel.app  
**Demo video:** https://youtu.be/MFceeor0xjY

## Why AIJudge

Reading or memorizing a document does not prepare someone to answer under pressure. AIJudge turns passive study material into an interactive evaluator that checks whether the user understood the question, led with the conclusion, supported claims with evidence, and communicated clearly.

## Key features

- Document-aware questions for interviews, presentations, and exams
- Five distinct evaluator personalities: Lumi Coach, Jihoon Park, Pressure Interviewer, Cody Teacher, and Judge
- Korean, English, and automatic language detection
- Voice input through the Web Speech API and optional text answers
- GPT-5.6 semantic evaluation combined with rule-based speaking measurements
- Per-question STT review, suggested corrections, filler-word analysis, and speaking duration
- Scores for understanding, evidence, logic, delivery, and persuasion
- Confidence delivery, pause, rhythm, and audience-perspective analysis
- Model answers, predicted follow-up questions, and three actionable practice goals
- Local growth history and achievement badges

## How OpenAI is used

The backend sends document context, generated questions, and the user's answers to the OpenAI Responses API. GPT-5.6 evaluates semantic relevance, factual support, reasoning, and persuasiveness, then returns structured feedback and document-grounded model answers. Observable speaking signals—duration, pauses, fillers, response latency, and rhythm—are measured separately and combined with the semantic evaluation.

OpenAI requests run only from the server. The API key is never included in the browser bundle.

## How Codex helped build AIJudge

AIJudge was built collaboratively with Codex throughout OpenAI Build Week. Codex accelerated the React and TypeScript implementation, document parsing, multilingual UI, secure server-side API route, voice-activity tracking, rule-based evaluation, responsive design, debugging, and deployment validation. Product decisions—such as evaluator personalities, one-purpose-per-question generation, transparent STT corrections, growth-focused feedback, and question-echo score protection—were developed through iterative user testing and refined with Codex.

## Architecture

- React 19 + TypeScript + Vite frontend
- Browser-based PDF, PPTX, and DOCX extraction
- Web Speech API for speech recognition
- Voice activity tracking for timing and pause measurements
- Vercel serverless API route for GPT-5.6 evaluation
- Browser local storage for session restoration and growth history

## Run locally

Requirements: Node.js 20 or later.

```bash
npm install
```

Copy `.env.example` to `.env.local` and add a server-side API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.6-terra
```

Then start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite. Upload a non-sensitive PDF, PPTX, or DOCX file, choose a practice type and evaluator, and complete the questions by voice or text.

## Production verification

```bash
npm run lint
npm run build
```

For Vercel, configure `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in Project Settings → Environment Variables. Never prefix the key with `VITE_`, because Vite-prefixed variables may be exposed to the browser.

## Privacy and limitations

- Uploaded documents are parsed in the browser.
- Evaluation data is sent to the server API only when an evaluation is requested.
- Speech recognition quality depends on browser and device support.
- Confidence and rhythm scores describe observable delivery signals; they do not diagnose personality or psychological state.
- AI feedback may contain errors and should not replace professional, academic, legal, or medical judgment.

## License

MIT
