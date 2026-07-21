export type SupportedLanguage = 'ko' | 'en'

/** Detect the dominant supported language. Korean wins ties to preserve the existing UX. */
export function detectLanguage(text: string, fallback: SupportedLanguage = 'ko'): SupportedLanguage {
  const korean = (text.match(/[가-힣]/g) ?? []).length
  const english = (text.match(/[A-Za-z]/g) ?? []).length
  if (korean === 0 && english === 0) return fallback
  const total = korean + english
  // 제품명·약어·영문 제목이 많은 한국어 문서가 영어로 오인되지 않도록
  // 한국어 문장이 일정량 존재하면 글자 수의 단순 비교보다 우선합니다.
  if (korean >= 8 && korean / total >= 0.12) return 'ko'
  if (english >= 8 && english / total >= 0.7) return 'en'
  return korean >= english ? 'ko' : fallback
}

export function languageName(language: SupportedLanguage) {
  return language === 'en' ? 'English' : 'Korean'
}
