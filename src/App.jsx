import { useMemo, useState } from 'react'
import { useI18n } from './i18n.jsx'
import { useToast } from './components/Toast.jsx'
import { useHabits } from './lib/storage.js'
import { computeStats, currentStreak } from './lib/streaks.js'
import { fetchMotivation, fallbackMessage } from './lib/motivation.js'
import { todayKey } from './lib/date.js'
import { CATEGORIES } from './lib/categories.js'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import HabitCard from './components/HabitCard.jsx'
import HabitForm from './components/HabitForm.jsx'
import EmptyState from './components/EmptyState.jsx'
import { PlusIcon } from './components/icons.jsx'

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export default function App() {
  const { t, lang } = useI18n()
  const { addToast, updateToast } = useToast()
  const [habits, setHabits] = useHabits()
  const [editing, setEditing] = useState(null) // habit being edited, or null
  const [formOpen, setFormOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  const stats = useMemo(() => computeStats(habits), [habits])

  const visibleHabits = useMemo(
    () => (filter === 'all' ? habits : habits.filter((h) => h.category === filter)),
    [habits, filter],
  )

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(habit) {
    setEditing(habit)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  function handleSave({ name, category }) {
    if (editing) {
      setHabits((prev) =>
        prev.map((h) => (h.id === editing.id ? { ...h, name, category } : h)),
      )
    } else {
      setHabits((prev) => [
        ...prev,
        { id: createId(), name, category, createdAt: new Date().toISOString(), completions: {} },
      ])
    }
    closeForm()
  }

  // Toggle today's completion for a habit. Marking complete fires an AI
  // motivational toast (with a graceful local fallback); un-marking is silent.
  function handleToggle(id) {
    const key = todayKey()
    const habit = habits.find((h) => h.id === id)
    if (!habit) return
    const wasDone = Boolean(habit.completions[key])

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const completions = { ...h.completions }
        if (completions[key]) delete completions[key]
        else completions[key] = true
        return { ...h, completions }
      }),
    )

    if (!wasDone) {
      const newStreak = currentStreak({ ...habit.completions, [key]: true })
      celebrate(habit, newStreak)
    }
  }

  // Show a loading toast, then fill it with an AI message (or a local fallback).
  async function celebrate(habit, streak) {
    const toastId = addToast({ loading: true })
    try {
      const message = await fetchMotivation({
        habitName: habit.name,
        currentStreak: streak,
        category: habit.category,
        lang,
      })
      updateToast(toastId, { message })
    } catch {
      updateToast(toastId, { message: fallbackMessage(lang, streak) })
    }
  }

  function handleDelete(habit) {
    if (window.confirm(t('deleteConfirm'))) {
      setHabits((prev) => prev.filter((h) => h.id !== habit.id))
    }
  }

  const hasHabits = habits.length > 0

  return (
    <div className="app">
      <Header />

      <main className="container">
        {hasHabits ? (
          <>
            <Dashboard stats={stats} />

            <div className="list-head">
              <div className="filters" role="tablist" aria-label={t('category')}>
                <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
                  {t('all')}
                </FilterChip>
                {CATEGORIES.map((c) => (
                  <FilterChip
                    key={c.key}
                    active={filter === c.key}
                    onClick={() => setFilter(c.key)}
                  >
                    <span aria-hidden="true">{c.emoji}</span> {t(`categories.${c.key}`)}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="habit-list">
              {visibleHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState onAdd={openCreate} />
        )}
      </main>

      {hasHabits && (
        <button
          type="button"
          className="fab"
          onClick={openCreate}
          aria-label={t('addHabit')}
          title={t('addHabit')}
        >
          <PlusIcon size={24} />
        </button>
      )}

      {formOpen && <HabitForm habit={editing} onSave={handleSave} onClose={closeForm} />}
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={'filter-chip' + (active ? ' is-active' : '')}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
