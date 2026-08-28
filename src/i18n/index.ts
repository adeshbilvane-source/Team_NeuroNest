import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import as from './locales/as.json'
import es from './locales/es.json'
import hi from './locales/hi.json'

export const LANGUAGE_STORAGE_KEY = 'sahayak_language'
export const SUPPORTED_LANGUAGES = ['en', 'es', 'as', 'hi'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  as: 'অসমীয়া',
  hi: 'हिन्दी',
}

export function getSupportedLanguage(value: string | null | undefined): SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
    ? (value as SupportedLanguage)
    : 'en'
}

export function changeLanguage(language: SupportedLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  return i18n.changeLanguage(language)
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    as: { translation: as },
    hi: { translation: hi },
  },
  lng: getSupportedLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY)),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
