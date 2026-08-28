import { Languages } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const location = useLocation()
  const [screen, setScreen] = useState<HTMLElement | null>(null)
  const language = (i18n.language || 'en').startsWith('hi') ? 'hi' : 'en'
  const isDoctorChat = location.pathname.startsWith('/doctor/chat/')

  const hasExistingLanguageControl = Boolean(
    document.querySelector('[aria-label="Change Language"]'),
  )

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(
      '.login-root-container .phone-screen, .doctor-mobile-screen, .phone-screen',
    )
    setScreen(target)
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    const nextLanguage = language === 'en' ? 'hi' : 'en'
    localStorage.setItem('sahayak_language', nextLanguage)
    void i18n.changeLanguage(nextLanguage)
  }

  const button = (
    <button
      key={location.pathname}
      type="button"
      className="global-language-switcher"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${language === 'en' ? 'Hindi' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
    >
      <Languages size={17} strokeWidth={2.2} />
      <span>{language.toUpperCase()}</span>
    </button>
  )

  return screen && !isDoctorChat && !hasExistingLanguageControl ? createPortal(button, screen) : null
}
