# AIJudge — Devpost Submission Copy

## Category

Education

## Tagline

Turn any document into realistic speaking practice with an AI evaluator.

## Short description

AIJudge is an AI speaking coach that understands uploaded documents, asks personalized questions, analyzes spoken or typed answers, and provides actionable feedback for interviews, presentations, and oral exams.

## Inspiration

People often understand what they have read but struggle to explain it clearly under pressure. Traditional study tools focus on reading, memorization, or static quizzes. We wanted to build a practice partner that listens, challenges weak reasoning, and shows users exactly how to improve their next answer.

## What it does

Users upload a PDF, PPTX, or DOCX file and choose an interview, presentation, or exam scenario. AIJudge identifies the document context and generates focused questions. Users answer by voice or text while the app measures speaking duration, pauses, response latency, rhythm, and filler words. GPT-5.6 evaluates understanding, evidence, logic, delivery, and persuasion, then generates personalized feedback, model answers, likely follow-up questions, and three concrete goals for the next session.

Five evaluator personalities create different practice experiences—from the supportive Lumi Coach to a demanding Pressure Interviewer, a step-by-step Cody Teacher, and a business-focused Judge. AIJudge supports Korean and English and preserves per-question STT evidence so users can verify what the system heard.

## How we built it

We built AIJudge with React, TypeScript, and Vite. PDF, PPTX, and DOCX content is extracted in the browser. Voice recognition uses the Web Speech API, while a separate voice-activity layer measures timing and pauses. A Vercel serverless route calls the OpenAI Responses API so the API key remains server-side. GPT-5.6 semantic analysis is combined with rule-based speaking measurements, including protection against answers that merely repeat the question.

## How we used Codex and GPT-5.6

Codex was our development partner throughout the project. It helped implement and debug the complete product flow, secure the API architecture, improve document-aware question generation, add multilingual support, build voice and STT analysis, validate responsive behavior, and iterate rapidly from real user tests. We made the core product decisions together through repeated testing and refinement.

GPT-5.6 powers the semantic evaluation layer. It compares questions, document context, and answers; produces structured category scores; explains strengths and weaknesses; generates natural model answers; and predicts realistic follow-up questions. Rule-based metrics complement GPT-5.6 with transparent measurements of timing, pauses, filler words, and delivery rhythm.

## Challenges we ran into

The hardest challenges were preventing document metadata from becoming the question subject, separating document types so non-business documents did not receive investment questions, handling imperfect browser speech recognition, and keeping semantic feedback consistent with numerical scores. We addressed these with document classification, evaluator-specific question rules, transparent STT evidence, per-question correction cards, and score post-processing for question repetition.

## Accomplishments that we're proud of

- A complete document-to-practice-to-growth workflow
- Distinct evaluator personalities rather than a single generic chatbot
- Transparent per-question STT evidence and suggested corrections
- Secure server-side GPT-5.6 integration
- Korean and English support
- Actionable feedback that focuses on growth, not only mistakes

## What we learned

The most useful speaking feedback is specific, transparent, and immediately actionable. Users respond better to three concrete goals than to a long list of abstract weaknesses. We also learned that semantic AI evaluation and observable speaking measurements are strongest when presented together but clearly distinguished.

## What's next

We plan to add Japanese and Chinese, downloadable PDF reports, richer opt-in acoustic analysis, webcam-based presentation coaching with explicit consent, and specialized modes for career development and confidence-building.

An idea by Hye-Min Jeong.  
Created by someone with no software development experience, together with ChatGPT (Lumi) and Codex (Cody).  
Proof that ideas can become reality.

## Try it

https://aijudge-sigma.vercel.app

## Demo video

https://youtu.be/MFceeor0xjY

## Repository

https://github.com/min2ming2-art/AIJudge

## Codex Session ID

Add the `/feedback` session ID here.
