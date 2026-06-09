import { useEffect, useRef, useState } from 'react'
import { LANGUAGES, useI18n } from '../i18n.jsx'

export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const active = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang-button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('language')}
      >
        <span className="lang-globe" aria-hidden="true">🌐</span>
        <span className="lang-current">{active.short}</span>
      </button>
      {open && (
        <ul className="lang-menu" role="listbox" aria-label={t('language')}>
          {LANGUAGES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                type="button"
                className={'lang-option' + (l.code === lang ? ' is-active' : '')}
                onClick={() => {
                  setLang(l.code)
                  setOpen(false)
                }}
              >
                <span>{l.label}</span>
                {l.code === lang && <span className="lang-check" aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
