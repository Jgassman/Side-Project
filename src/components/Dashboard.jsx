import { useI18n } from '../i18n.jsx'

export default function Dashboard({ stats }) {
  const { t } = useI18n()
  const { total, doneToday, best, checkins, percent } = stats

  let caption
  if (total === 0) caption = null
  else if (doneToday === total) caption = t('allDone')
  else if (doneToday === 0) caption = t('nothingYet')
  else caption = t('completedOf', { done: doneToday, total })

  return (
    <section className="dashboard" aria-label={t('todaysProgress')}>
      <div className="progress-card">
        <div className="progress-head">
          <h2 className="progress-title">{t('todaysProgress')}</h2>
          <span className="progress-percent">{percent}%</span>
        </div>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        {caption && <p className="progress-caption">{caption}</p>}
      </div>

      <div className="stats-grid">
        <Stat value={total} label={t('stats.activeHabits')} />
        <Stat value={`${doneToday}/${total}`} label={t('stats.completedToday')} />
        <Stat value={best} label={t('stats.bestStreak')} accent />
        <Stat value={checkins} label={t('stats.totalCheckins')} />
      </div>
    </section>
  )
}

function Stat({ value, label, accent = false }) {
  return (
    <div className="stat">
      <span className={'stat-value' + (accent ? ' stat-value--accent' : '')}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
