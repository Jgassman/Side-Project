import { useI18n } from '../i18n.jsx'
import { getCategory } from '../lib/categories.js'
import { currentStreak, longestStreak, isDoneToday } from '../lib/streaks.js'
import { CheckIcon, EditIcon, FlameIcon, TrashIcon } from './icons.jsx'

export default function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const { t } = useI18n()
  const category = getCategory(habit.category)
  const done = isDoneToday(habit.completions)
  const current = currentStreak(habit.completions)
  const longest = longestStreak(habit.completions)

  return (
    <article className={'habit-card' + (done ? ' is-done' : '')}>
      <div className="habit-main">
        <span
          className="habit-cat"
          style={{ background: category.color + '1a', color: category.color }}
          title={t(`categories.${category.key}`)}
        >
          <span aria-hidden="true">{category.emoji}</span>
        </span>

        <div className="habit-info">
          <h3 className="habit-name">{habit.name}</h3>
          <div className="habit-meta">
            <span
              className="habit-cat-label"
              style={{ color: category.color }}
            >
              {t(`categories.${category.key}`)}
            </span>
            {current > 0 ? (
              <span className="habit-streak">
                <FlameIcon size={15} className="flame" />
                {t('dayStreak', { count: current })}
              </span>
            ) : (
              <span className="habit-streak habit-streak--none">{t('noStreak')}</span>
            )}
            {longest > 0 && (
              <span className="habit-best">
                {t('best')}: {longest}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className={'check' + (done ? ' is-checked' : '')}
          onClick={() => onToggle(habit.id)}
          aria-pressed={done}
          aria-label={done ? t('completedToday') : t('markComplete')}
          title={done ? t('completedToday') : t('markComplete')}
        >
          <CheckIcon size={20} />
        </button>
      </div>

      <div className="habit-actions">
        <button type="button" className="icon-btn" onClick={() => onEdit(habit)} aria-label={t('edit')}>
          <EditIcon size={16} />
          <span>{t('edit')}</span>
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(habit)}
          aria-label={t('delete')}
        >
          <TrashIcon size={16} />
          <span>{t('delete')}</span>
        </button>
      </div>
    </article>
  )
}
