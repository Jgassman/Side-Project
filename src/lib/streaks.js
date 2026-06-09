import { dayKey, parseKey, addDays, todayKey } from './date.js'

// Returns the sorted list of day-keys a habit was completed on.
function completedKeys(completions) {
  return Object.keys(completions || {})
    .filter((k) => completions[k])
    .sort()
}

// Current streak = consecutive completed days ending today (or yesterday, so a
// streak isn't "broken" until you fully miss a day). If today isn't done yet
// but yesterday was, the streak is still considered active.
export function currentStreak(completions) {
  let count = 0
  let cursor = new Date()
  if (!completions[dayKey(cursor)]) {
    cursor = addDays(cursor, -1)
  }
  while (completions[dayKey(cursor)]) {
    count += 1
    cursor = addDays(cursor, -1)
  }
  return count
}

// Longest run of consecutive completed days, ever.
export function longestStreak(completions) {
  const keys = completedKeys(completions)
  let longest = 0
  let run = 0
  let prev = null
  for (const key of keys) {
    const date = parseKey(key)
    if (prev && dayKey(addDays(prev, 1)) === key) {
      run += 1
    } else {
      run = 1
    }
    if (run > longest) longest = run
    prev = date
  }
  return longest
}

export function totalCheckins(completions) {
  return completedKeys(completions).length
}

export function isDoneToday(completions) {
  return Boolean(completions[todayKey()])
}

// Aggregate dashboard stats across all habits.
export function computeStats(habits) {
  const total = habits.length
  const doneToday = habits.filter((h) => isDoneToday(h.completions)).length
  let best = 0
  let checkins = 0
  for (const h of habits) {
    best = Math.max(best, longestStreak(h.completions))
    checkins += totalCheckins(h.completions)
  }
  const percent = total === 0 ? 0 : Math.round((doneToday / total) * 100)
  return { total, doneToday, best, checkins, percent }
}
