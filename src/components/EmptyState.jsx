import { useI18n } from '../i18n.jsx'
import { PlusIcon } from './icons.jsx'

export default function EmptyState({ onAdd }) {
  const { t } = useI18n()
  return (
    <div className="empty">
      <div className="empty-art" aria-hidden="true">🌱</div>
      <h2 className="empty-title">{t('emptyTitle')}</h2>
      <p className="empty-body">{t('emptyBody')}</p>
      <button type="button" className="btn btn--primary btn--lg" onClick={onAdd}>
        <PlusIcon size={18} />
        {t('emptyCta')}
      </button>
    </div>
  )
}
