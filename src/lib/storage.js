import { useEffect, useState } from 'react'

const HABITS_KEY = 'daily-wins:habits'

export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Defensive normalisation so a corrupt entry can't crash the app.
    return parsed
      .filter((h) => h && typeof h.id === 'string')
      .map((h) => ({
        id: h.id,
        name: typeof h.name === 'string' ? h.name : '',
        category: typeof h.category === 'string' ? h.category : 'productivity',
        createdAt: h.createdAt || new Date().toISOString(),
        completions: h.completions && typeof h.completions === 'object' ? h.completions : {},
      }))
  } catch {
    return []
  }
}

function saveHabits(habits) {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
  } catch {
    /* storage full / unavailable — ignore */
  }
}

// React state that automatically persists to localStorage.
export function useHabits() {
  const [habits, setHabits] = useState(loadHabits)

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  return [habits, setHabits]
}
