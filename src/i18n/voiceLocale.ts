import type { SupportedLanguage } from './index'

export const voiceLocales: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  es: 'es-ES',
  as: 'as-IN',
  hi: 'hi-IN',
}

export function getVoiceLocale(language: SupportedLanguage): string {
  return voiceLocales[language]
}