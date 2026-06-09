// Habit categories. `key` is the stable id stored on each habit; the label is
// translated at render time via t(`categories.${key}`).
export const CATEGORIES = [
  { key: 'fitness', emoji: '💪', color: '#ef4444' },
  { key: 'mindfulness', emoji: '🧘', color: '#10b981' },
  { key: 'learning', emoji: '📚', color: '#3b82f6' },
  { key: 'productivity', emoji: '⚡', color: '#f59e0b' },
]

export const DEFAULT_CATEGORY = 'productivity'

export function getCategory(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[CATEGORIES.length - 1]
}
