import { useI18n } from '../i18n.jsx'
import { FlameIcon } from './icons.jsx'
import LanguageToggle from './LanguageToggle.jsx'

export default function Header() {
  const { t } = useI18n()
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <FlameIcon size={20} />
          </span>
          <div className="brand-text">
            <h1 className="brand-name">Daily Wins</h1>
            <p className="brand-tagline">{t('tagline')}</p>
          </div>
        </div>
        <LanguageToggle />
      </div>
    </header>
  )
}
