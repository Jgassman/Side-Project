// Local-date helpers. Habit completions are keyed by local calendar day
// ("YYYY-MM-DD") so a check-in stays tied to the day it was made,
// regardless of timezone shifts.

export function dayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date, n) {
  const next = new Date(date)
  next.setDate(next.getDate() + n)
  return next
}

export const todayKey = () => dayKey(new Date())
