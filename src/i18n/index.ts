import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import hi from './locales/hi.json'

// NOTE: only English and a placeholder Hindi are wired up.
// NER-specific regional languages (Assamese, Khasi, Mizo, etc.) are NOT included —
// this was flagged as a real risk in the feasibility review. Do not claim
// regional-language support in a pitch until real translations + a
// working TTS/STT voice model for that language are both confirmed.
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: localStorage.getItem('sahayak_language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
