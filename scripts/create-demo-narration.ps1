$outputPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'AIJudge_Demo_Narration.wav'
$voice = New-Object -ComObject SAPI.SpVoice
$englishVoice = $voice.GetVoices() | Where-Object { $_.GetDescription() -match 'Zira|English' } | Select-Object -First 1
if (-not $englishVoice) { throw 'An English Windows voice is not installed.' }
$voice.Voice = $englishVoice
$voice.Rate = -1
$voice.Volume = 100

$stream = New-Object -ComObject SAPI.SpFileStream
$stream.Open($outputPath, 3, $false)
$voice.AudioOutputStream = $stream

$ssml = @'
<speak version="1.0" xml:lang="en-US">
Reading a document is not the same as explaining it under pressure. AI Judge transforms documents into realistic speaking practice.
<break time="4s"/>
I can upload a P D F, PowerPoint, or Word document. AI Judge analyzes the material and generates focused questions based on its context.
<break time="6s"/>
I can practice an interview, presentation, or oral exam. Each evaluator has a distinct personality, from a supportive coach to a pressure interviewer, teacher, or business judge.
<break time="6s"/>
I can answer by voice or text. During a spoken answer, AI Judge measures my response time, speaking duration, pauses, rhythm, and filler words.
<break time="12s"/>
After the practice, G P T five point six evaluates understanding, evidence, logic, delivery, and persuasion. It explains strengths and weaknesses, creates natural model answers, predicts realistic follow-up questions, and recommends only three concrete goals for the next session.
<break time="8s"/>
AI Judge also shows what speech recognition heard for every question. Users can compare the original transcript with suggested corrections, review changed words and speaking habits, and confirm whether each answer was too short, appropriate, or too long.
<break time="7s"/>
Growth history shows changes in total and category scores over time, helping users focus on improvement rather than a single result.
<break time="5s"/>
Codex helped us build and debug the complete experience, including document parsing, multilingual support, secure server-side A P I integration, voice analysis, responsive design, and iterative improvements from real user tests.
<break time="4s"/>
AI Judge does not only show what you got wrong. It shows how you can grow.
</speak>
'@

$null = $voice.Speak($ssml, 8)
$stream.Close()
Write-Output $outputPath
