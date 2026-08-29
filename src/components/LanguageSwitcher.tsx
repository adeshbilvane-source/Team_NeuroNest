import { Check, ChevronDown, Languages } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { changeLanguage, getSupportedLanguage, languageNames, SUPPORTED_LANGUAGES } from '../i18n'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const location = useLocation()
  const [screen, setScreen] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const language = getSupportedLanguage(i18n.resolvedLanguage || i18n.language)

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(
      '.login-root-container .phone-screen, .doctor-mobile-screen, .phone-screen',
    )
    setScreen(target)
  }, [location.pathname])

  useEffect(() => {
    // Also search for screen container on component mount in case initial render needs it
    const target = document.querySelector<HTMLElement>(
      '.login-root-container .phone-screen, .doctor-mobile-screen, .phone-screen',
    )
    if (target) setScreen(target)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const selectLanguage = (nextLanguage: typeof language) => {
    void changeLanguage(nextLanguage)
    setOpen(false)
  }

  const control = (
    <div className="global-language-control">
      <button
        type="button"
        className="global-language-switcher"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label={t('language.change')}
        aria-expanded={open}
        aria-haspopup="menu"
        title={t('language.change')}
      >
        <Languages size={17} strokeWidth={2.2} />
        <span>{language.toUpperCase()}</span>
        <ChevronDown size={14} strokeWidth={2.4} />
      </button>
      {open && (
        <div className="global-language-menu" role="menu" aria-label={t('language.select')}>
          {SUPPORTED_LANGUAGES.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={language === option}
              className="global-language-option"
              onClick={() => selectLanguage(option)}
            >
              <span>{languageNames[option]}</span>
              {language === option && <Check size={15} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return screen ? createPortal(control, screen) : null
}
