import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n.jsx'
import { CATEGORIES, DEFAULT_CATEGORY } from '../lib/categories.js'
import { CloseIcon } from './icons.jsx'

// Modal for creating or editing a habit. `habit` is null when creating.
export default function HabitForm({ habit, onSave, onClose }) {
  const { t } = useI18n()
  const [name, setName] = useState(habit?.name || '')
  const [category, setCategory] = useState(habit?.category || DEFAULT_CATEGORY)
  const [error, setError] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError(true)
      inputRef.current?.focus()
      return
    }
    onSave({ name: trimmed, category })
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={habit ? t('editHabit') : t('newHabit')}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 className="modal-title">{habit ? t('editHabit') : t('newHabit')}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label={t('cancel')}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span className="field-label">{t('habitName')}</span>
            <input
              ref={inputRef}
              type="text"
              className={'field-input' + (error ? ' has-error' : '')}
              value={name}
              maxLength={60}
              placeholder={t('habitNamePlaceholder')}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError(false)
              }}
            />
          </label>

          <div className="field">
            <span className="field-label">{t('category')}</span>
            <div className="cat-options">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  className={'cat-chip' + (category === c.key ? ' is-selected' : '')}
                  style={
                    category === c.key
                      ? { borderColor: c.color, background: c.color + '1a', color: c.color }
                      : undefined
                  }
                  onClick={() => setCategory(c.key)}
                  aria-pressed={category === c.key}
                >
                  <span aria-hidden="true">{c.emoji}</span>
                  <span>{t(`categories.${c.key}`)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn--primary">
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
