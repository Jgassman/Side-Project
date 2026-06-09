// Local fallback messages, used when the AI endpoint is unavailable (no API key,
// network error, etc.) so the toast feature still works offline. {streak} is
// interpolated when the streak is notable.
const FALLBACKS = {
  en: [
    'Nice work — that’s another win in the books! 🎉',
    '{streak} days strong. Keep the momentum going!',
    'Done and dusted. Future you says thanks!',
    'One more step toward the habit sticking. Great job!',
  ],
  es: [
    '¡Bien hecho, otro logro más! 🎉',
    '¡{streak} días seguidos! Sigue así.',
    'Hecho. ¡Tu yo del futuro te lo agradece!',
    'Un paso más para afianzar el hábito. ¡Genial!',
  ],
  fr: [
    'Bien joué — encore une victoire ! 🎉',
    '{streak} jours d’affilée ! Continue comme ça.',
    'C’est fait. Ton futur toi te remercie !',
    'Encore un pas vers l’habitude ancrée. Bravo !',
  ],
  ja: [
    'お見事、今日もひとつ達成です！🎉',
    '{streak}日連続！この調子で続けましょう。',
    '完了。未来の自分が感謝しています！',
    '習慣化へまた一歩。すばらしい！',
  ],
}

export function fallbackMessage(lang, streak) {
  const list = FALLBACKS[lang] || FALLBACKS.en
  const pick = list[Math.floor(Math.random() * list.length)]
  return pick.replace('{streak}', String(streak))
}

// Request an AI-generated message from our backend. Resolves to the generated
// string, or throws so the caller can fall back.
export async function fetchMotivation({ habitName, currentStreak, category, lang }) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)
  try {
    const res = await fetch('/api/motivation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitName, currentStreak, category, lang }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data?.message) throw new Error('Empty message')
    return data.message
  } finally {
    clearTimeout(timeout)
  }
}
