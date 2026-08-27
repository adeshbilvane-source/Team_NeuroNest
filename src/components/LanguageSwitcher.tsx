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

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(
      '.doctor-mobile-screen .doctor-page-header .icon-row, .phone-screen .header .icon-row, .phone-screen .page-header, .phone-screen .chat-header, .phone-screen .header, .phone-screen .header-top, .doctor-mobile-screen .doctor-page-header, .doctor-mobile-screen .page-header, .doctor-mobile-screen .chat-header, .doctor-mobile-screen .header, .doctor-mobile-screen .header-top, .login-root-container .auth-header-card, .login-root-container .brand, .phone-screen, .doctor-mobile-screen',
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
      type="button"
      className="global-language-switcher"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${language === 'en' ? 'Hindi' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
    >
      <Languages size={18} strokeWidth={2.3} />
      <span>{language.toUpperCase()}</span>
    </button>
  )

  return screen ? createPortal(button, screen) : null
}
